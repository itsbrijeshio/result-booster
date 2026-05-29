import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  Users, 
  Layers, 
  FileSpreadsheet, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Sliders, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  GraduationCap, 
  HelpCircle,
  Database,
  Search,
  BookOpen,
  Mail,
  Compass,
  Award,
  User,
  LayoutDashboard
} from 'lucide-react';

// Page Imports
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerStudents from './pages/owner/OwnerStudents';
import OwnerBatches from './pages/owner/OwnerBatches';
import OwnerQuestions from './pages/owner/OwnerQuestions';
import OwnerTests from './pages/owner/OwnerTests';
import OwnerCreateTest from './pages/owner/OwnerCreateTest';
import OwnerWeakStudents from './pages/owner/OwnerWeakStudents';
import OwnerPerformance from './pages/owner/OwnerPerformance';
import OwnerSettings from './pages/owner/OwnerSettings';

// Student Page Imports
import StudentDashboard from './pages/student/StudentDashboard';
import StudentTests from './pages/student/StudentTests';
import StudentProgress from './pages/student/StudentProgress';
import StudentWeakAreas from './pages/student/StudentWeakAreas';
import StudentProfile from './pages/student/StudentProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  const [role, setRole] = React.useState<'owner' | 'student' | null>(null);
  const [currentPath, setCurrentPath] = React.useState<string>('/landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [navTransition, setNavTransition] = React.useState(false);

  // Synchronize browser URL hash routing for high-fidelity multi-tab feel
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPath(hash);
        // Deduce Role from path
        if (hash.startsWith('/owner')) {
          setRole('owner');
        } else if (hash.startsWith('/student')) {
          setRole('student');
        } else if (hash === '/login' || hash === '/landing') {
          setRole(null);
        }
      } else {
        window.location.hash = '/landing';
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    setNavTransition(true);
    window.location.hash = path;
    setCurrentPath(path);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      setNavTransition(false);
    }, 220);
  };

  const handleLogin = (selectedRole: 'owner' | 'student') => {
    setRole(selectedRole);
    if (selectedRole === 'owner') {
      navigateTo('/owner/dashboard');
    } else {
      navigateTo('/student/dashboard');
    }
  };

  const handleLogout = () => {
    setRole(null);
    navigateTo('/login');
  };

  // Extract ID parameters from dynamic paths like /owner/students/st-1
  const getPathParams = (pattern: string, path: string): Record<string, string> => {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    const params: Record<string, string> = {};

    patternParts.forEach((part, i) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = pathParts[i] || '';
      }
    });

    return params;
  };

  // Owner Sidebar Navigation Links
  const ownerNav = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/owner/students', icon: Users },
    { label: 'Batches', path: '/owner/batches', icon: Layers },
    { label: 'Question Bank', path: '/owner/questions', icon: BookOpen },
    { label: 'Mock Tests', path: '/owner/tests', icon: FileSpreadsheet },
    { label: 'Weak Students', path: '/owner/weak-students', icon: AlertTriangle },
    { label: 'Performance Reports', path: '/owner/performance', icon: Sparkles },
    { label: 'Institute Settings', path: '/owner/settings', icon: Sliders },
  ];

  // Student Navigation Links - Highly simplified, Top or side panel
  const studentNav = [
    { label: 'My Dashboard', path: '/student/dashboard', icon: Sparkles },
    { label: 'Mock Tests', path: '/student/tests', icon: FileSpreadsheet },
    { label: 'My Progress', path: '/student/progress', icon: TrendingUp },
    { label: 'Weak Areas', path: '/student/weak-areas', icon: Compass },
    { label: 'My Profile', path: '/student/profile', icon: User },
  ];

  const activeNav = role === 'owner' ? ownerNav : studentNav;
  const isExamAttemptRoute = role === 'student' && currentPath.endsWith('/attempt');

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-muted antialiased ${isExamAttemptRoute ? 'w-full' : 'md:flex-row'}`}>
        
        {/* Render login or landing page if unauthenticated */}
        {!role || currentPath === '/login' || currentPath === '/landing' ? (
          currentPath === '/landing' ? (
            <LandingPage onNavigate={navigateTo} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        ) : isExamAttemptRoute ? (
          <main className="flex-1 flex flex-col min-w-0 bg-background h-screen overflow-y-auto w-full">
            <div className="flex-1 p-0 w-full mx-auto relative h-full">
              {navTransition && (
                <div className="fixed inset-0 z-50 bg-background/50 backdrop-blur-xs flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                </div>
              )}
              <StudentTests 
                onNavigate={navigateTo} 
                subView="attempt" 
                testIdParam={getPathParams('/student/tests/:id/attempt', currentPath).id} 
              />
            </div>
          </main>
        ) : (
          <>
            {/* Mobile Header Bar */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  R
                </div>
                <span className="font-bold tracking-tight text-foreground text-sm font-sans">Result Booster</span>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 border border-border rounded-xl bg-card hover:bg-accent text-muted-foreground transition-all cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </header>

            {/* Sidebar Columns (Dynamic Role themes) */}
            <aside
              className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card p-5 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="space-y-6">
                {/* Brand Logo Header */}
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold shadow-sm flex-shrink-0">
                    R
                  </div>
                  <div>
                    <span className="font-black tracking-tight text-foreground text-sm block leading-none font-sans">
                      Result Booster
                    </span>
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase mt-1 block">
                      {role === 'owner' ? 'Institute Admin' : 'Student Portal'}
                    </span>
                  </div>
                </div>

                {/* Left Active Links */}
                <nav className="space-y-1 pt-1">
                  {activeNav.map((item, idx) => {
                    const Icon = item.icon;
                    // Match path startsWith for parents or strict equality
                    const isActive = currentPath.startsWith(item.path);
                    return (
                      <button
                        key={idx}
                        onClick={() => navigateTo(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/65'
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Account profile card or Logout triggers */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 font-bold uppercase text-xs">
                      {role === 'owner' ? 'A' : 'R'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] text-muted-foreground font-semibold block uppercase">Logged in as</span>
                      <span className="text-xs font-bold text-foreground block truncate" title="bk6500416@gmail.com">
                        {role === 'owner' ? 'Administrator' : 'Riya Sen (Student)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-muted-foreground/60 text-center font-mono">
                  Result Booster Systems
                </p>
              </div>
            </aside>

            {/* Mobile menu overlay background */}
            {isMobileMenuOpen && (
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-30 bg-foreground/25 backdrop-blur-xs md:hidden"
              />
            )}

            {/* Main Interactive Screen Content Column */}
            <main className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto bg-background">
              {/* Top TopBar Dashboard Info */}
              <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border bg-card sticky top-0 z-10">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  <span>Result Booster Workspace</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/45" />
                  <span className="text-foreground capitalize font-extrabold">
                    {role === 'owner' ? 'Institute Admin Panel' : 'Student Workspace'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 border border-border rounded text-[10px] font-mono font-bold text-muted-foreground bg-muted/20">
                    Access Code: SECURE_LIVE
                  </span>
                </div>
              </div>

              {/* Route Switching & Parameters Extract Core */}
              <div className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative">
                {navTransition && (
                  <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-xs flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                  </div>
                )}

                {/* ~~~ Owner Route Swappers ~~~ */}
                {role === 'owner' && (
                  <>
                    {currentPath === '/owner/dashboard' && (
                      <OwnerDashboard onNavigate={navigateTo} />
                    )}

                    {currentPath.startsWith('/owner/students') && (
                      <OwnerStudents
                        onNavigate={navigateTo}
                        selectedStudentId={getPathParams('/owner/students/:id', currentPath).id || undefined}
                        onSelectStudent={(id) => navigateTo(id ? `/owner/students/${id}` : '/owner/students')}
                      />
                    )}

                    {currentPath === '/owner/batches' && (
                      <OwnerBatches />
                    )}

                    {currentPath === '/owner/questions' && (
                      <OwnerQuestions />
                    )}

                    {currentPath === '/owner/tests/create' && (
                      <OwnerCreateTest onNavigate={navigateTo} />
                    )}

                    {currentPath.startsWith('/owner/tests/') && currentPath !== '/owner/tests/create' && (
                      <OwnerTests
                        onNavigate={navigateTo}
                        subView="detail"
                        testIdParam={getPathParams('/owner/tests/:id', currentPath).id}
                      />
                    )}

                    {currentPath === '/owner/tests' && (
                      <OwnerTests onNavigate={navigateTo} subView="list" />
                    )}

                    {currentPath === '/owner/weak-students' && (
                      <OwnerWeakStudents />
                    )}

                    {currentPath === '/owner/performance' && (
                      <OwnerPerformance />
                    )}

                    {currentPath === '/owner/settings' && (
                      <OwnerSettings />
                    )}
                  </>
                )}

                {/* ~~~ Student Route Swappers ~~~ */}
                {role === 'student' && (
                  <>
                    {currentPath === '/student/dashboard' && (
                      <StudentDashboard onNavigate={navigateTo} />
                    )}

                    {currentPath === '/student/tests' && (
                      <StudentTests onNavigate={navigateTo} subView="list" />
                    )}

                    {currentPath.endsWith('/intro') && (
                      <StudentTests 
                        onNavigate={navigateTo} 
                        subView="intro" 
                        testIdParam={getPathParams('/student/tests/:id/intro', currentPath).id} 
                      />
                    )}

                    {currentPath.endsWith('/attempt') && (
                      <StudentTests 
                        onNavigate={navigateTo} 
                        subView="attempt" 
                        testIdParam={getPathParams('/student/tests/:id/attempt', currentPath).id} 
                      />
                    )}

                    {currentPath.endsWith('/result') && (
                      <StudentTests 
                        onNavigate={navigateTo} 
                        subView="result" 
                        testIdParam={getPathParams('/student/tests/:id/result', currentPath).id} 
                      />
                    )}

                    {currentPath === '/student/progress' && (
                      <StudentProgress />
                    )}

                    {currentPath === '/student/weak-areas' && (
                      <StudentWeakAreas />
                    )}

                    {currentPath === '/student/profile' && (
                      <StudentProfile />
                    )}
                  </>
                )}
              </div>
            </main>
          </>
        )}
      </div>
    </QueryClientProvider>
  );
}
