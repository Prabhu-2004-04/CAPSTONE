import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MyReports from "./pages/MyReports";
import AcademicPerformance from "./pages/AcademicPerformance";
import AcademicCalendar from "./pages/AcademicCalendar";
import DownloadReports from "./pages/DownloadReports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Assignments from "./pages/Assignments";
import AssignmentManagement from "./pages/AssignmentManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/academic-performance" element={<AcademicPerformance />} />
            <Route path="/academic-calendar" element={<AcademicCalendar />} />
            <Route path="/download-reports" element={<DownloadReports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/assignment-management" element={<AssignmentManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
