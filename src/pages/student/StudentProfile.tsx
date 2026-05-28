import * as React from 'react';
import { 
  User, 
  Shield, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Key, 
  CheckCircle2, 
  UserCheck, 
  Smartphone, 
  Hash, 
  Mail, 
  Calendar, 
  AlertTriangle 
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
import { initialStudents } from '../../data';

export default function StudentProfile() {
  const loggedInStudent = initialStudents.find(s => s.id === 'st-6') || initialStudents[0];

  // Profile forms fields state (defaulting to logged-in student)
  const [firstName, setFirstName] = React.useState('Riya');
  const [lastName, setLastName] = React.useState('Sen');
  const [contactPhone, setContactPhone] = React.useState('+91 98765 43210');
  const [careerPath, setCareerPath] = React.useState('CCC Information Technology Certification');
  
  // Password modification state
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  
  const [profileSuccessMsg, setProfileSuccessMsg] = React.useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = React.useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = React.useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('✓ Profile information updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (!currentPassword) {
      setPasswordErrorMsg('Please enter your current secure login code.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg('New secure code must be at least 6 alphanumeric characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New credentials confirmation mismatch detected.');
      return;
    }

    // Success action callback simulated
    setPasswordSuccessMsg('✓ Security password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  return (
    <PageContainer className="max-w-4xl space-y-7">
      
      {/* Visual Title Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-[10px] font-mono tracking-wider font-extrabold text-primary bg-primary/5 uppercase">
            Secure Student Account Space
          </Badge>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-muted-foreground font-semibold">User: {loggedInStudent.email}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Personal Account Workspace
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Maintain your secure institutional coordinates, batch schedules, exam targets, and update login credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SIDE BAR TRACER PROFILE BADGE */}
        <div className="space-y-6">
          <Card className="text-center p-6 border border-border relative overflow-hidden bg-gradient-to-b from-card to-background">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl pointer-events-none" />
            
            <CardContent className="pt-4 space-y-4">
              <div className="mx-auto h-20 w-20 bg-primary/10 text-primary border-2 border-primary/25 rounded-full flex items-center justify-center font-black text-2xl uppercase shadow-xs select-none">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>

              <div className="space-y-1">
                <CardTitle className="text-base font-black leading-tight">
                  {firstName} {lastName}
                </CardTitle>
                <CardDescription className="text-xs font-mono lowercase">
                  {loggedInStudent.email}
                </CardDescription>
              </div>

              <div className="inline-flex gap-1 items-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                <UserCheck className="h-3 w-3" />
                <span>Verified Student Identity</span>
              </div>

              <Separator className="my-2" />

              <div className="space-y-3 pt-1 text-left text-xs font-sans">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    Student ID
                  </span>
                  <span className="font-mono text-foreground font-bold">{loggedInStudent.id.toUpperCase()}</span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Joined Institute
                  </span>
                  <span className="text-foreground font-semibold">{loggedInStudent.joinedDate}</span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                    Account Status
                  </span>
                  <Badge variant="success" className="text-[9px] uppercase font-mono font-black border-none py-0.5">
                    {loggedInStudent.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-muted/40 border border-border/80">
            <CardContent className="p-1 space-y-2.5 text-xs text-muted-foreground font-sans">
              <span className="text-[10px] tracking-wider font-mono font-semibold text-muted-foreground uppercase block">
                Security Advisory Code
              </span>
              <p className="leading-relaxed">
                Keep your login password kept confidential. Result Booster coordinates will never ask for your private passwords via email.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* COMBINED SECTIONS DETAILS PANELS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: PROFILE INFO CARDS FORM */}
          <Card className="border border-border">
            <CardHeader className="pb-4 border-b border-border/25">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" />
                Student Profile Information
              </CardTitle>
              <CardDescription className="text-xs">
                Update your registered demographic variables and system contact points.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstNameInput">First Name</Label>
                    <Input 
                      id="firstNameInput"
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastNameInput">Last Name</Label>
                    <Input 
                      id="lastNameInput"
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="emailInput">Primary Institutional Email</Label>
                    <Input 
                      id="emailInput"
                      type="email" 
                      value={loggedInStudent.email} 
                      readOnly 
                      disabled 
                      className="bg-muted text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phoneInput">Contact Number / WhatsApp</Label>
                    <Input 
                      id="phoneInput"
                      type="tel" 
                      value={contactPhone} 
                      onChange={(e) => setContactPhone(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="aspirationInput">Registered Career Target Objective</Label>
                  <Input 
                    id="aspirationInput"
                    value={careerPath} 
                    onChange={(e) => setCareerPath(e.target.value)} 
                    placeholder="e.g. NIELIT Specialist Officer or Software Operator"
                  />
                </div>

                {profileSuccessMsg && (
                  <div className="p-3 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold text-center">
                    {profileSuccessMsg}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="text-xs font-black bg-primary text-primary-foreground min-w-[120px] cursor-pointer">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* SECTION 2: BATCH DETAILS INFO */}
          <Card className="border border-border">
            <CardHeader className="pb-4 border-b border-border/25">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-primary" />
                Classroom Batch Details
              </CardTitle>
              <CardDescription className="text-xs">
                Review active course timing schedules and primary cohort instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-muted/40 border rounded-xl space-y-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold leading-none block">
                    Registered Course Cohort
                  </span>
                  <strong className="text-sm text-foreground font-black block">
                    {loggedInStudent.batchName}
                  </strong>
                  <p className="text-[11px] text-muted-foreground font-semibold">
                    Class code: BATCH-CCC-1
                  </p>
                </div>

                <div className="p-4 bg-muted/40 border rounded-xl space-y-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold leading-none block">
                    Weekly Schedule
                  </span>
                  <div className="flex items-center gap-1 text-sm text-foreground font-extrabold">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>Mon, Wed, Fri 8:00 AM - 10:00 AM</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold">
                    Required physical attendance threshold: 75%
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-primary/25 bg-primary/[0.01] flex items-start gap-3.5">
                <div className="h-10 w-10 bg-primary/10 text-primary font-black rounded-lg text-xs flex items-center justify-center shrink-0">
                  VS
                </div>
                <div className="space-y-1 font-sans text-xs">
                  <strong className="text-foreground font-black block">Assigned Lead Instructor: Vineet Sir</strong>
                  <p className="text-muted-foreground leading-normal">
                    Primary coordinator for NIELIT &amp; O Level standard digital technologies modules. Reach out to Vineet Sir for any diagnostic test evaluation complaints.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: EXAM DETAILS INFORMATION */}
          <Card className="border border-border">
            <CardHeader className="pb-4 border-b border-border/25">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                Government Examination Details
              </CardTitle>
              <CardDescription className="text-xs">
                Information on target examination schedules and passing limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-3 font-sans text-center">
                <div className="p-3 bg-muted/30 border rounded-xl space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-mono font-bold block">
                    Target Exam
                  </span>
                  <strong className="text-xs text-foreground font-black block leading-tight">
                    CCC Certification
                  </strong>
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Govt-NIELIT Standard
                  </span>
                </div>

                <div className="p-3 bg-muted/30 border rounded-xl space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-mono font-bold block">
                    Exam Date
                  </span>
                  <strong className="text-xs text-foreground font-black block leading-tight text-primary">
                    June 15, 2026
                  </strong>
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    18 Days Remaining
                  </span>
                </div>

                <div className="p-3 bg-muted/30 border rounded-xl space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-mono font-bold block">
                    Passing Threshold
                  </span>
                  <strong className="text-xs font-black block leading-tight text-emerald-500">
                    50% Overall Marks
                  </strong>
                  <span className="text-[10px] font-mono text-emerald-600 block">
                    Min 50 / 100 Marks
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 4: CHANGE PASSWORD SECURE BLOCK */}
          <Card className="border border-border">
            <CardHeader className="pb-4 border-b border-border/25">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Key className="h-4 w-4 text-primary" />
                Modify Security Password
              </CardTitle>
              <CardDescription className="text-xs">
                Update your secure student credentials to restrict unauthorized devices.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="oldPass">Current Secure Password</Label>
                  <Input 
                    id="oldPass"
                    type="password" 
                    placeholder="••••••••••••" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPass1">New Security Code</Label>
                    <Input 
                      id="newPass1"
                      type="password" 
                      placeholder="Minimum 6 characters" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPass2">Confirm New Code</Label>
                    <Input 
                      id="newPass2"
                      type="password" 
                      placeholder="Re-type new security code" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                  </div>
                </div>

                {passwordErrorMsg && (
                  <div className="p-3 bg-rose-500/5 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>{passwordErrorMsg}</span>
                  </div>
                )}

                {passwordSuccessMsg && (
                  <div className="p-3 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{passwordSuccessMsg}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="text-xs font-bold bg-primary text-primary-foreground min-w-[150px] cursor-pointer">
                    Change Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
