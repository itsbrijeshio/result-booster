import * as React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Flame,
  Info
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Input, 
  Button, 
  Label, 
  Checkbox, 
  Separator 
} from '../components/ui/CustomComponents';

interface LoginProps {
  onLogin: (role: 'owner' | 'student') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = React.useState('bk6500416@gmail.com');
  const [password, setPassword] = React.useState('admin_pass_123');
  const [selectedRole, setSelectedRole] = React.useState<'owner' | 'student'>('owner');
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Validation and Error states
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [validationSuccess, setValidationSuccess] = React.useState(false);
  const [showForgotFeedback, setShowForgotFeedback] = React.useState(false);

  // Clear validation styling when inputs adjust
  React.useEffect(() => {
    if (emailError) setEmailError('');
  }, [email]);

  React.useEffect(() => {
    if (passwordError) setPasswordError('');
  }, [password]);

  const handleToggleRole = (role: 'owner' | 'student') => {
    setSelectedRole(role);
    setEmailError('');
    setPasswordError('');
    setValidationSuccess(false);

    if (role === 'owner') {
      setEmail('bk6500416@gmail.com');
      setPassword('admin_pass_123');
    } else {
      setEmail('bk6500416@gmail.com');
      setPassword('student_pass_123');
    }
  };

  const handleQuickFill = (role: 'owner' | 'student') => {
    handleToggleRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email or phone and password
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setValidationSuccess(false);

    // Email / phone validation check
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Please enter your mobile phone number or email address');
      valid = false;
    } else if (trimmedEmail.includes('@')) {
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError('Please enter a valid email address');
        valid = false;
      }
    } else {
      // Basic mobile phone regex: 8 to 15 digits
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(trimmedEmail.replace(/[\s-()]/g, ''))) {
        setEmailError('Please enter a valid 10-digit mobile number or email');
        valid = false;
      }
    }

    // Password validation check (at least 6 characters in template config)
    if (!password) {
      setPasswordError('Please enter your safety password');
      valid = false;
    } else if (password.length < 4) {
      setPasswordError('Password lock expects at least 4 characters');
      valid = false;
    }

    if (!valid) return;

    // Successful validation look: show loader simulator
    setValidationSuccess(true);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole);
    }, 1000);
  };

  const triggerForgotPasswordPlaceholder = () => {
    setShowForgotFeedback(true);
    setTimeout(() => {
      setShowForgotFeedback(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen w-full bg-background grid lg:grid-cols-2 overflow-x-hidden font-sans">
      
      {/* LEFT COLUMN: Premium SaaS Brand Identity Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-muted/30 p-12 border-r border-border relative overflow-hidden">
        {/* Modern decorative visual aura circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 opacity-60" />

        {/* Brand logo bar wrapper */}
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-extrabold shadow-sm shadow-primary/15 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-foreground block leading-none">Result Booster</span>
            <span className="text-[10px] text-muted-foreground font-mono font-semibold uppercase tracking-wider block mt-1">
              Diagnostic Optimization SaaS
            </span>
          </div>
        </div>

        {/* Central visual statement block */}
        <div className="space-y-8 my-auto py-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground leading-[1.15] max-w-md">
              Find Weak Students Early. <br />
              <span className="text-primary decoration-primary/20 bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10 inline-block mt-1">
                Improve Results Faster.
              </span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Empower your institution with standard diagnostic assessment analytics. Detect performance anomalies, map core sub-topics below target thresholds, and initiate rapid booster revisions immediately.
            </p>
          </div>

          <Separator className="max-w-xs opacity-60" />

          {/* Interactive features list */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3 w-3 text-primary" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Granular Diagnostic Pathways</h4>
                <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                  Maps conceptual subject weaknesses automatically for students scoring below standard limits.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3 w-3 text-primary" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Automated Booster Sets</h4>
                <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                  Generates targeted student practice papers extracted from live performance log failures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3 w-3 text-primary" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Continuous Performance Curves</h4>
                <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                  Benchmarks live batch metrics, student ratings, and score tracking with instant alert states.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info lock */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Centralised Multi-Tenant Diagnostics Active</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Highly Polished SaaS Form Wrapper */}
      <div className="flex flex-col justify-between min-h-screen p-6 sm:p-10 relative">
        <div className="absolute inset-0 bg-radial-gradient from-accent/50 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Mobile top navigation header header (rendered only on mobile) */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="h-9 w-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-foreground block">Result Booster</span>
            <span className="text-[9px] text-muted-foreground font-semibold leading-none block uppercase">Diagnostics Panel</span>
          </div>
        </div>

        {/* Primary Workspace Box */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-sm space-y-6">
            
            {/* Header copy with modern feel */}
            <div className="text-center lg:text-left space-y-1.5">
              <h1 className="text-2xl font-black text-foreground tracking-tight">Access Secure Workspace</h1>
              <p className="text-xs text-muted-foreground leading-normal">
                Mock test and diagnostic dashboard for computer coaching institutes
              </p>
            </div>

            {/* Role switch toggle container */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted/60 border border-border/45 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => handleToggleRole('owner')}
                className={`py-2 rounded-md transition-all cursor-pointer font-bold ${
                  selectedRole === 'owner' 
                    ? 'bg-background text-foreground shadow-xs border border-border/30' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                Owner / Executive
              </button>
              <button
                type="button"
                onClick={() => handleToggleRole('student')}
                className={`py-2 rounded-md transition-all cursor-pointer font-bold ${
                  selectedRole === 'student' 
                    ? 'bg-background text-foreground shadow-xs border border-border/30' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                Student Exam Portal
              </button>
            </div>

            {/* Credential input Card container */}
            <Card className="border border-border/80 shadow-md bg-card overflow-hidden">
              <CardHeader className="pb-4 pt-5 border-b border-border/30 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                      Security Checkpoint
                    </CardTitle>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-muted text-muted-foreground font-black uppercase">
                    v2.4
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-5 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Email & Phone Label / Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="auth-identifier">Mobile Number or Email Address</Label>
                      {emailError && (
                        <span className="text-[10px] text-destructive font-semibold flex items-center gap-0.5">
                          ⚠️ Required
                        </span>
                      )}
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="auth-identifier"
                        disabled={isLoading}
                        type="text"
                        placeholder="Enter email e.g. bk6500416@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-9 ${emailError ? 'border-destructive focus-visible:ring-destructive' : ''} ${
                          validationSuccess && !emailError ? 'border-emerald-500/50' : ''
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-[10px] text-destructive font-mono leading-normal mt-0.5">{emailError}</p>
                    )}
                  </div>

                  {/* Password Label / Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="auth-secret">Account Access Token</Label>
                      {passwordError && (
                        <span className="text-[10px] text-destructive font-semibold flex items-center gap-0.5">
                          ⚠️ Required
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="auth-secret"
                        disabled={isLoading}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter entry token code"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-9 pr-9 ${passwordError ? 'border-destructive focus-visible:ring-destructive' : ''} ${
                          validationSuccess && !passwordError ? 'border-emerald-500/50' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                        title={showPassword ? 'Hide entry code' : 'Reveal entry code'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-[10px] text-destructive font-mono leading-normal mt-0.5">{passwordError}</p>
                    )}
                  </div>

                  {/* Remembers & Forgot coordinates */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember-me-flag"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                      />
                      <label 
                        htmlFor="remember-me-flag" 
                        className="text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none"
                      >
                        Remember me on this engine
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={triggerForgotPasswordPlaceholder}
                      className="text-xs hover:underline text-primary/85 hover:text-primary cursor-pointer border-0 bg-transparent font-medium"
                    >
                      Forgot?
                    </button>
                  </div>

                  {/* Toast-like message if they click forgot password */}
                  {showForgotFeedback && (
                    <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-foreground text-[11px] leading-normal flex items-start gap-1.5 animate-fade-in">
                      <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Self-serve password reset logs are disabled in live preview mode. Please consult coaching institute supervisor system coordinates.
                      </span>
                    </div>
                  )}

                  {/* Submission Button with loading state */}
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isLoading}
                    className="w-full text-xs font-bold py-2 bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Validating Credentials...
                      </>
                    ) : (
                      <>
                        Access Secure Workspace
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Separator / Quick Access Profiles */}
                <div className="space-y-3 pt-2">
                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-border/80" />
                    <span className="flex-shrink mx-3 text-[10px] uppercase font-mono font-bold text-muted-foreground">
                      Continuous Demo Logins
                    </span>
                    <div className="flex-grow border-t border-border/80" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('owner')}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        selectedRole === 'owner' 
                          ? 'border-foreground bg-primary/5 ring-1 ring-foreground' 
                          : 'border-border bg-card hover:border-border/100'
                      }`}
                    >
                      <span className="font-extrabold text-foreground block text-[11px]">Owner / Director</span>
                      <span className="text-[9px] text-muted-foreground font-mono block mt-0.5">Admin & Diagnostics</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickFill('student')}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        selectedRole === 'student' 
                          ? 'border-foreground bg-primary/5 ring-1 ring-foreground' 
                          : 'border-border bg-card hover:border-border/100'
                      }`}
                    >
                      <span className="font-extrabold text-foreground block text-[11px]">Student Account</span>
                      <span className="text-[9px] text-muted-foreground font-mono block mt-0.5">Mock Benchmark Exams</span>
                    </button>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>
        </div>

        {/* Outer bottom copyright footer lock */}
        <div className="w-full pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] text-muted-foreground font-mono uppercase">
          <span>
            © {new Date().getFullYear()} Result Booster Inc.
          </span>
          <div className="flex items-center gap-3">
            <span className="hover:text-foreground cursor-pointer">SaaS Terms</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="hover:text-foreground cursor-pointer">Security Protocol v2.4</span>
          </div>
        </div>

      </div>

    </div>
  );
}
