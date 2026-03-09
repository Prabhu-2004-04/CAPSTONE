-- Create app role enum for student and teacher
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    department TEXT,
    enrollment_number TEXT,
    employee_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    UNIQUE (user_id, role)
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation (creates profile and assigns role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role app_role;
  user_full_name TEXT;
BEGIN
  -- Get role from metadata, default to 'student'
  user_role := COALESCE(
    (NEW.user_metadata->>'role')::app_role,
    'student'::app_role
  );
  
  -- Get full name from metadata (supports both 'full_name' and 'name' for different providers)
  user_full_name := COALESCE(
    NEW.user_metadata->>'full_name',
    NEW.user_metadata->>'name',
    ''
  );
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    user_full_name,
    NEW.email
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger on auth.users to auto-create profile and role
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Assignment and Submission Tables
-- ============================================================

-- assignment type enum
CREATE TYPE public.assignment_type AS ENUM ('Theory', 'Practical', 'Project');

-- submission status enum
CREATE TYPE public.assignment_submission_status AS ENUM ('Submitted', 'Not Submitted', 'Late');

-- evaluation status enum
CREATE TYPE public.evaluation_status AS ENUM ('Pending', 'Evaluated');

-- assignments table
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    title TEXT NOT NULL,
    type public.assignment_type NOT NULL DEFAULT 'Theory',
    issue_date DATE NOT NULL DEFAULT now(),
    due_date DATE NOT NULL,
    marks_allotted INTEGER NOT NULL DEFAULT 0,
    visibility TEXT NOT NULL DEFAULT 'Draft',
    faculty_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- submissions table (students submit assignments)
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT NOT NULL,
    note TEXT,
    status public.assignment_submission_status NOT NULL DEFAULT 'Submitted',
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    marks_obtained INTEGER,
    grade TEXT,
    plagiarism_percent NUMERIC,
    evaluation_status public.evaluation_status NOT NULL DEFAULT 'Pending',
    feedback TEXT,
    resubmission_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger for assignments updated_at
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for submissions updated_at
CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable row level security on new tables
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- assignment policies
CREATE POLICY "Teachers can manage their own assignments" 
ON public.assignments FOR ALL
USING (auth.uid() = faculty_id)
WITH CHECK (auth.uid() = faculty_id);

CREATE POLICY "Public can view published assignments" 
ON public.assignments FOR SELECT
USING (visibility = 'Published');

-- submissions policies
CREATE POLICY "Students can insert their own submissions"
ON public.submissions FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own submissions"
ON public.submissions FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view submissions for their assignments"
ON public.submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    WHERE a.id = assignment_id AND a.faculty_id = auth.uid()
  )
);

CREATE POLICY "Teachers can update submissions for their assignments"
ON public.submissions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    WHERE a.id = assignment_id AND a.faculty_id = auth.uid()
  )
);