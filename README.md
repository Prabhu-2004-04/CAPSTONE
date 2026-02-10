# 📚 Report Portal - Academic Management System

A modern, feature-rich React application for managing academic workflows, assignments, evaluations, and student performance tracking.

## 🌟 Features

### 📊 Dashboard
- Real-time overview of academic metrics
- KPI cards showing assignments, submissions, and performance
- Visual analytics and progress tracking

### 📝 Assignment Management
- **Create Assignments**: Faculty can create theory, practical, or project assignments with customizable deadlines and grading scales
- **Publish Workflow**: Draft → Published status management
- **Grading System**: Multi-tier grading scale (O, A+, A, B+, B, C, F)
- **Evaluation Interface**: Grade student submissions with marks, feedback, and plagiarism tracking
- **View Evaluations**: Review previously graded work

### 📋 Student Assignments
- Track all issued assignments
- Submit work online with file uploads (PDF, DOC, DOCX, ZIP)
- View evaluation status and feedback
- Plagiarism percentage indicators
- Resubmission support

### 👥 Role-Based Access
- **Student**: View assignments, submit work, track grades
- **Teacher**: Create assignments, evaluate submissions, manage grading
- **Admin**: System-wide oversight

### 📈 Academic Performance Tracking
- Semester performance analytics
- Grade distribution visualization
- Submission timeliness metrics
- Average marks tracking

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **UI Library** | shadcn/ui |
| **Styling** | Tailwind CSS |
| **Backend/Auth** | Supabase |
| **Animation** | Framer Motion |
| **Notifications** | Sonner Toast |

## 📦 Installation

### Prerequisites
- Node.js 16+ or Bun
- npm/yarn/bun
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Prabhu-2004-04/REPORT_PORTAL.git
   cd REPORT_PORTAL
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env.local` in root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_key
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   App available at `http://localhost:5173`

## 🚀 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
npm run test      # Run tests
npm run lint      # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/           # Dashboard components
│   └── ui/                  # shadcn/ui components
├── pages/
│   ├── AssignmentManagement.tsx    # Create & evaluate
│   ├── Assignments.tsx             # View & submit
│   ├── Dashboard.tsx               # Main dashboard
│   └── ...
├── contexts/                # React contexts
├── hooks/                   # Custom hooks
├── lib/                     # Utilities
├── integrations/            # Supabase client
└── test/                    # Test files
```

## 🎯 Core Features

### Assignment Creation
- Modal-based form with validation
- Support for Theory, Practical, Project types
- Configurable deadlines and max marks
- Publish/Draft visibility

**How to use:**
1. Go to "Assignment Management"
2. Click "Create New Assignment"
3. Fill in details and click "Create"

### Evaluation Module
- Edit mode: Enter marks, grade, feedback
- View mode: Review completed evaluations
- Auto-calculated statistics
- Plagiarism tracking

**How to use:**
1. Go to "Assignment Management" → "Evaluate"
2. Select published assignment
3. Click "Evaluate" on pending submissions
4. Enter marks/grade/feedback and save

## 🔄 Workflow

### Teacher
Create Assignment → Review Submissions → Evaluate & Grade → Publish Feedback → View Statistics

### Student
View Assignment → Download Details → Upload Submission → Receive Feedback → Check Grade

## 🎨 UI/UX Features

- Dark mode support
- Responsive design
- Smooth animations
- WCAG accessible
- Real-time notifications
- Loading states

## 🔐 Security

- Row-level security (RLS)
- Type-safe Supabase client
- Protected routes
- Environment variables

## 🚧 Future Enhancements

- [ ] Batch grading operations
- [ ] AI plagiarism detection
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] CSV/PDF exports
- [ ] Mobile app
- [ ] Real-time collaboration
- [ ] Assignment templates

## 🐛 Troubleshooting

**Port in use:**
```bash
npm run dev -- --port 3000
```

**Dependencies error:**
```bash
npm cache clean --force && npm install
```

**Supabase connection issues:**
- Verify `.env.local` variables
- Check Supabase dashboard
- Verify API keys

## 📝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 👨‍💼 Author

**Prabhu-2004-04**
GitHub: [@Prabhu-2004-04](https://github.com/Prabhu-2004-04)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com)
- [Vite](https://vitejs.dev)

---

**Made with ❤️ for academic excellence**
