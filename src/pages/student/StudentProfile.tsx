import * as React from 'react';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Key, 
  LogOut, 
  Sparkles,
  Smartphone,
  Mail,
  GraduationCap,
  Building2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  PageContainer,
  Input,
  Button,
  Label,
  Separator
} from '../../components/ui/CustomComponents';

export default function StudentProfile() {
  // Personal Info form states
  const [name, setName] = React.useState('Rahul');
  const [phone, setPhone] = React.useState('+91 98123 45601');
  const [email, setEmail] = React.useState('rahul.prep@booster.in');

  // Password modification state
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  // Success / Error Feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("✓ Personal details updated successfully!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current PIN/password.");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("New secure code must be at least 4 digits long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match. Please verify.");
      return;
    }

    triggerToast("✓ Security credentials updated successfully!");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogoutAction = () => {
    triggerToast("🚪 Logging out safely...");
    setTimeout(() => {
      // Safely navigate back to Login route and trigger a state reset
      window.location.hash = '#/login';
      window.location.reload();
    }, 1000);
  };

  return (
    <PageContainer className="max-w-3xl space-y-6 lg:space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 max-w-sm rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-start gap-3 animate-slide-in">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5 animate-pulse">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold block">Account Status</span>
            <p className="text-[11px] text-muted-foreground leading-normal">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Main Page Title Header */}
      <div className="border-b border-border/60 pb-5 pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <User className="h-6 w-6 text-primary shrink-0" />
          <span>My Profile</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 text-slate-500 italic">
          Manage your personal details, registered course details, exam updates, and update active security passwords.
        </p>
      </div>

      <div className="grid gap-6">

        {/* 1. PERSONAL INFORMATION */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary shrink-0" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Verify or update your general contact information for coordinator reference
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="studName">Full Name</Label>
                  <Input 
                    id="studName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="studPhone">Mobile Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
                    <Input 
                      id="studPhone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="pl-9 text-xs h-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="studEmail">Email Address (Optional)</Label>
                <div className="relative w-full sm:max-w-md">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
                  <Input 
                    id="studEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs h-9"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" className="text-xs font-bold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer">
                  Update Details
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 2. COURSE DETAILS */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary shrink-0" />
              Course Details
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              General course track and batch details set by your learning coordinator
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/25 space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-muted-foreground font-mono uppercase font-bold leading-none block">
                  Course Registered
                </span>
                <strong className="text-sm text-foreground font-black block">
                  CCC Certification
                </strong>
                <span className="text-[9px] text-muted-foreground">Course Duration: 90 days</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/25 space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-muted-foreground font-mono uppercase font-bold leading-none block">
                  Class Batch
                </span>
                <strong className="text-sm text-foreground font-black block">
                  Morning Batch
                </strong>
                <span className="text-[9px] text-muted-foreground">Batch Code: MB-01A</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/25 space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-muted-foreground font-mono uppercase font-bold leading-none block">
                  Institute Name
                </span>
                <strong className="text-sm text-foreground font-extrabold block">
                  Result Booster Institute
                </strong>
                <span className="text-[9px] text-emerald-600 font-bold block flex items-center justify-center sm:justify-start gap-1">
                  <Building2 className="h-3 w-3" /> State Board Registered
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. EXAM INFORMATION */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              Exam Information
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Crucial examination benchmarks and official target admission records
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/[0.01] flex items-start gap-3">
                <Calendar className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="text-[10px] text-muted-foreground font-mono uppercase font-bold block leading-none">
                    Exam Date
                  </span>
                  <strong className="text-sm font-black text-rose-600 block">
                    June 15, 2026
                  </strong>
                  <p className="text-[11px] text-muted-foreground">Please prepare all pending mock drills before this mark date.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/25 flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="text-[10px] text-muted-foreground font-mono uppercase font-bold block leading-none">
                    Admission Date
                  </span>
                  <strong className="text-sm font-black text-foreground block">
                    May 10, 2026
                  </strong>
                  <p className="text-[11px] text-muted-foreground">Registered &amp; admitted with unique registration sequence code.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. ACCOUNT SETTINGS */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-destructive flex items-center gap-2">
              <Lock className="h-4 w-4 text-destructive shrink-0" />
              Account Settings &amp; Security
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Update secure login PIN credentials or sign out of your local workspace session
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0 space-y-6">
            
            {/* Change Password Form Block */}
            <form onSubmit={handleChangePassword} className="space-y-4 pt-1">
              <span className="text-xs font-black text-foreground uppercase tracking-widest block flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-primary" /> Modify Password
              </span>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="oldPin">Current Password</Label>
                  <Input 
                    id="oldPin"
                    type={showPass ? "text" : "password"}
                    placeholder="••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPin">New Password</Label>
                  <Input 
                    id="newPin"
                    type={showPass ? "text" : "password"}
                    placeholder="Min 4 digits"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPin">Confirm New</Label>
                  <Input 
                    id="confirmPin"
                    type={showPass ? "text" : "password"}
                    placeholder="Re-type new security"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-700 text-xs font-bold">
                  ⚠️ {passwordError}
                </div>
              )}

              <div className="flex justify-between items-center pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {showPass ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>Hide Passwords</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Show Passwords</span>
                    </>
                  )}
                </button>

                <Button type="submit" className="text-xs font-bold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer">
                  Save New Password
                </Button>
              </div>
            </form>

            <Separator />

            {/* Logout Trigger Block */}
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <strong className="text-sm font-black text-rose-700 block">
                  Log out of session
                </strong>
                <p className="text-[11px] text-rose-600/80 leading-normal max-w-md">
                  Terminate your active login session on this device. You will need to type in your registered credentials/PIN to enter again later.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogoutAction}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer active:scale-95 transition-all w-full sm:w-auto shrink-0 shadow-xs"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>

          </CardContent>
        </Card>

      </div>
    </PageContainer>
  );
}
