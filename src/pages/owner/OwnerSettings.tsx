import * as React from 'react';
import { 
  Building, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  ShieldAlert, 
  LogOut, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Search, 
  HelpCircle, 
  BookOpen, 
  RefreshCw, 
  Laptop, 
  Smartphone,
  Sparkles,
  ChevronRight
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
  Textarea,
  Modal,
  Button,
  Label,
  Separator
} from '../../components/ui/CustomComponents';

// --- IN-APP CHIPS/SWITCH FOR SHADCN FEEL ---
function Switch({ 
  id, 
  checked, 
  onChange 
}: { 
  id?: string; 
  checked: boolean; 
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-ring ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-xs ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// Course Type Model
interface Course {
  id: string; // Course Code
  name: string;
  duration: string;
  description: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
}

const INITIAL_COURSES: Course[] = [
  {
    id: 'CCC-01',
    name: 'Course on Computer Concepts (CCC)',
    duration: '3 Months',
    description: 'Fundamentals of information technology, introduction to operating systems, processing databases, spreadsheet algorithms, and mail structures.',
    level: 'Basic'
  },
  {
    id: 'DCA-02',
    name: 'Diploma in Computer Applications (DCA)',
    duration: '6 Months',
    description: 'Detailed study of business computing utilities, relational database paradigms, digital presentations, and client networking protocols.',
    level: 'Intermediate'
  },
  {
    id: 'ADCA-03',
    name: 'Advanced Diploma in Computer Applications (ADCA)',
    duration: '12 Months',
    description: 'Expert-level framework covering structural web designs, backend integration guidelines, advanced statistical spreadsheet math, and security parameters.',
    level: 'Advanced'
  },
  {
    id: 'OL-04',
    name: 'O Level Programming & Systems',
    duration: '12 Months',
    description: 'Accredited modular curriculum emphasizing structured programming semantics in C language, Python scripts, modular design, and network services.',
    level: 'Advanced'
  }
];

export default function OwnerSettings() {
  // --- TABS CONTROL STATE ---
  const [activeTab, setActiveTab] = React.useState<'profile' | 'account' | 'courses' | 'risk' | 'security'>('profile');

  // --- TRANSIT FEEDBACK ---
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // --- TAB 1: INSTITUTE PROFILE STATE ---
  const [logoPreset, setLogoPreset] = React.useState<string>('preset-indigo');
  const [instituteName, setInstituteName] = React.useState('Result Booster Academy');
  const [city, setCity] = React.useState('New Delhi');
  const [phone, setPhone] = React.useState('+91 98765 43210');
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      triggerToast('🏫 Institute Profile has been successfully synchronized and updated live.');
    }, 1000);
  };

  // --- TAB 2: ACCOUNT SETTINGS STATE ---
  const [accountName, setAccountName] = React.useState('Aarav Sharma');
  const [accountEmail, setAccountEmail] = React.useState('bk6500416@gmail.com');
  const [accountMobile, setAccountMobile] = React.useState('+91 90123 45678');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSavingAccount, setIsSavingAccount] = React.useState(false);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAccount(true);
    setTimeout(() => {
      setIsSavingAccount(false);
      triggerToast('👤 Personal administrative account profiles updated securely.');
    }, 1000);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerToast('⚠️ Please supply all cryptographic passphrase parameters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('❌ Passphrase confirmation discrepancy: Values do not align.');
      return;
    }
    triggerToast('🔐 Your master administrative passcode has been updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // --- TAB 3: COURSES CRUD STATE ---
  const [courses, setCourses] = React.useState<Course[]>(INITIAL_COURSES);
  const [coursesSearch, setCoursesSearch] = React.useState('');
  const [isCourseModalOpen, setIsCourseModalOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);

  // Course Form States
  const [formCourseId, setFormCourseId] = React.useState('');
  const [formCourseName, setFormCourseName] = React.useState('');
  const [formCourseDuration, setFormCourseDuration] = React.useState('3 Months');
  const [formCourseDescription, setFormCourseDescription] = React.useState('');
  const [formCourseLevel, setFormCourseLevel] = React.useState<'Basic' | 'Intermediate' | 'Advanced'>('Basic');

  const openAddCourse = () => {
    setEditingCourse(null);
    setFormCourseId('');
    setFormCourseName('');
    setFormCourseDuration('3 Months');
    setFormCourseDescription('');
    setFormCourseLevel('Basic');
    setIsCourseModalOpen(true);
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormCourseId(course.id);
    setFormCourseName(course.name);
    setFormCourseDuration(course.duration);
    setFormCourseDescription(course.description);
    setFormCourseLevel(course.level);
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = () => {
    if (!formCourseId || !formCourseName) {
      triggerToast('⚠️ Course Code and Course Title are mandatory fields.');
      return;
    }

    if (editingCourse) {
      // Edit operation
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? {
        id: formCourseId,
        name: formCourseName,
        duration: formCourseDuration,
        description: formCourseDescription,
        level: formCourseLevel
      } : c));
      triggerToast(`✏️ Course "${formCourseName}" updated successfully.`);
    } else {
      // Add operation
      if (courses.some(c => c.id.toLowerCase() === formCourseId.toLowerCase())) {
        triggerToast('❌ Conflict: An academic course with this unique code identifier already exists.');
        return;
      }
      const newCourse: Course = {
        id: formCourseId,
        name: formCourseName,
        duration: formCourseDuration,
        description: formCourseDescription,
        level: formCourseLevel
      };
      setCourses(prev => [...prev, newCourse]);
      triggerToast(`🎉 Created new course: "${formCourseName}"`);
    }

    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (code: string, name: string) => {
    if (window.confirm(`Are you certain you wish to completely archive "${name}" (${code}) from curriculum listings?`)) {
      setCourses(prev => prev.filter(c => c.id !== code));
      triggerToast(`🗑️ Curriculum "${name}" deleted from active records.`);
    }
  };

  const filteredCourses = React.useMemo(() => {
    const q = coursesSearch.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter(c => 
      c.id.toLowerCase().includes(q) || 
      c.name.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q)
    );
  }, [courses, coursesSearch]);


  // --- TAB 4: RISK SETTINGS STATE ---
  const [passThreshold, setPassThreshold] = React.useState<number>(60);
  const [weakStudentThreshold, setWeakStudentThreshold] = React.useState<number>(50);
  const [trackSkippedAsRisk, setTrackSkippedAsRisk] = React.useState<boolean>(true);
  const [skippedTestPenalty, setSkippedTestPenalty] = React.useState<number>(15);
  const [isSavingRisk, setIsSavingRisk] = React.useState(false);

  const handleSaveRisk = () => {
    setIsSavingRisk(true);
    setTimeout(() => {
      setIsSavingRisk(false);
      triggerToast('📈 Predictive evaluation and priority support thresholds updated.');
    }, 850);
  };


  // --- TAB 5: SECURITY CONTROL & PLATFORM STATES ---
  const [isPassResetModalOpen, setIsPassResetModalOpen] = React.useState(false);
  const [isPlatformResetConfirmOpen, setIsPlatformResetConfirmOpen] = React.useState(false);

  const handleLogoutAllDevices = () => {
    triggerToast('🔐 Purged other active sessions. Standard verification tokens cleared.');
  };

  const testLogoPresetColors: Record<string, string> = {
    'preset-indigo': 'bg-indigo-600 text-white',
    'preset-violet': 'bg-violet-600 text-white',
    'preset-rose': 'bg-rose-600 text-white',
    'preset-cyan': 'bg-cyan-600 text-black',
    'preset-amber': 'bg-amber-600 text-black',
  };

  return (
    <PageContainer>
      {/* Dynamic Toast Element */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-55 p-4.5 bg-foreground text-background dark:bg-card dark:text-foreground border border-border rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 font-semibold">
          <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col gap-1 w-full border-b border-border/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
          <Sliders className="h-3.5 w-3.5 text-primary" />
          <span>System Matrix Configurations</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-1">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight font-sans">
              Institute Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-normal">
              Administer global computer literacy curriculum modules, manage administrative credentials, security parameters, and predictive student priority thresholds.
            </p>
          </div>
        </div>
      </div>

      {/* TABS LAYOUT: RESPONSIVE FLEX DESIGN */}
      <div className="grid gap-6 md:grid-cols-4 items-start">
        
        {/* SIDE BAR BUTTONS FOR GRAPHIC CHIPS */}
        <div className="md:col-span-1 space-y-2">
          <Card className="p-2 gap-1.5 flex flex-col">
            {[
              { id: 'profile', label: 'Institute Profile', desc: 'Syllabus hub brand values', icon: Building },
              { id: 'account', label: 'Administrative Account', desc: 'Secure profile access parameters', icon: User },
              { id: 'courses', label: 'Academic Courses', desc: 'Curriculum syllabus CRUD catalog', icon: BookOpen },
              { id: 'risk', label: 'Risk Thresholds', desc: 'Priority analytical metrics', icon: ShieldAlert },
              { id: 'security', label: 'System & Security', desc: 'Password reset & active session tools', icon: Lock }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    triggerToast(`Switched interface focus: ${tab.label}`);
                  }}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all cursor-pointer font-sans ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-xs' 
                      : 'hover:bg-muted/75 text-foreground bg-transparent'
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-black tracking-tight leading-none truncate block">
                      {tab.label}
                    </div>
                    <div className={`text-[9px] mt-1 truncate ${isActive ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                      {tab.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </Card>

          {/* Quick Stats Support Box */}
          <Card className="bg-muted/15 p-4 space-y-3 hidden md:block">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono block">System Information</span>
            <div className="space-y-1.5 text-xs text-foreground font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Courses:</span>
                <span className="font-mono font-bold text-primary">{courses.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pass Target:</span>
                <span className="font-mono font-bold text-emerald-600">{passThreshold}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admin Login:</span>
                <span className="font-mono font-bold">1 Device</span>
              </div>
            </div>
            <Separator />
            <span className="text-[9px] text-muted-foreground font-semibold leading-relaxed block">
              Changes successfully committed are instantly distributed across student apps and diagnostic dashboards.
            </span>
          </Card>
        </div>

        {/* DETAILS CONTAINER */}
        <div className="md:col-span-3 space-y-6">
          
          {/* TAB 1: INSTITUTE PROFILE */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader className="border-b border-border pb-5">
                <CardTitle className="font-sans font-black text-lg gap-2 flex items-center text-foreground">
                  <Building className="h-5 w-5 text-primary" />
                  Institute Administrative Brand Profile
                </CardTitle>
                <CardDescription className="text-xs">
                  Review and customize the standard descriptors shown on certificates, reports, and student dashboards.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  {/* Custom simulated logo editor */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-foreground">Institute Digital Emblem Logo</Label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/20 p-4.5 rounded-2xl border border-dashed border-border">
                      
                      {/* Logo Preview box */}
                      <div className={`h-16 w-16 rounded-2xl flex flex-col items-center justify-center font-black text-lg tracking-wider shrink-0 shadow-sm ${testLogoPresetColors[logoPreset] || 'bg-indigo-600 text-white'}`}>
                        {instituteName ? instituteName.split(' ').map(p => p[0]).slice(0, 3).join('').toUpperCase() : 'RB'}
                      </div>

                      {/* Controls */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block font-mono">Select Theme Preset Colour Badge</span>
                        <div className="flex items-center gap-2">
                          {Object.keys(testLogoPresetColors).map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                setLogoPreset(preset);
                                triggerToast(`Selected logo identity palette: ${preset.replace('preset-', '')}`);
                              }}
                              className={`h-6 w-6 rounded-full border cursor-pointer hover:scale-110 active:scale-95 transition-all text-[8px] font-mono flex items-center justify-center ${
                                logoPreset === preset ? 'ring-2 ring-primary ring-offset-2 scale-105' : 'border-border'
                              } ${testLogoPresetColors[preset]}`}
                            >
                              {logoPreset === preset && <Check className="h-3.5 w-3.5" />}
                            </button>
                          ))}
                        </div>
                        <span className="text-[10.5px] text-muted-foreground leading-snug block">
                          The system auto-generates high-contrast logo placeholders matching your institute name initials.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4.5 sm:grid-cols-2">
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="institute-name" className="text-xs font-bold text-foreground">Institute Registered Organization Name</Label>
                      <Input 
                        id="institute-name"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        placeholder="Result Booster Academy"
                        required
                        className="font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="institute-city" className="text-xs font-bold text-foreground">Registering City Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="institute-city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="New Delhi"
                          required
                          className="pl-9.5 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="institute-phone" className="text-xs font-bold text-foreground">Official Helpline Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="institute-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          className="pl-9.5 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Accreditation Affiliation License</Label>
                      <div className="h-10 px-3 bg-muted/40 text-muted-foreground text-xs font-mono font-bold flex items-center rounded-lg border border-border">
                        NITI AAYOG CERTIFIED / MSME-1025582
                      </div>
                    </div>

                  </div>

                  <Separator />

                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      type="submit" 
                      disabled={isSavingProfile}
                      className="bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs inline-flex items-center gap-2 px-5 rounded-xl cursor-pointer"
                    >
                      {isSavingProfile ? (
                        <>
                          <div className="h-3.5 w-3.5 border-1.5 border-primary-foreground border-t-transparent animate-spin rounded-full" />
                          Synchronizing...
                        </>
                      ) : (
                        <>
                          Save Profile Brand
                        </>
                      )}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 2: ADMINISTRATIVE ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              
              <Card>
                <CardHeader className="border-b border-border pb-5">
                  <CardTitle className="font-sans font-black text-lg gap-2 flex items-center text-foreground">
                    <User className="h-5 w-5 text-primary" />
                    Personal Profile Details
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update username coordinates, emails, and direct mobile alerts settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSaveAccount} className="space-y-5">
                    
                    <div className="grid gap-4 sm:grid-cols-3">
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="account-name" className="text-xs font-bold text-foreground font-semibold">User Administrator Name</Label>
                        <Input 
                          id="account-name"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="account-email" className="text-xs font-bold text-foreground font-semibold">Administrative Alerts Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="account-email"
                            type="email"
                            value={accountEmail}
                            onChange={(e) => setAccountEmail(e.target.value)}
                            required
                            className="pl-9.5 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="account-mobile" className="text-xs font-bold text-foreground font-semibold">Alert SMS Mobile Contact</Label>
                        <Input 
                          id="account-mobile"
                          value={accountMobile}
                          onChange={(e) => setAccountMobile(e.target.value)}
                          className="font-mono text-xs font-bold"
                          required
                        />
                      </div>

                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={isSavingAccount}
                        className="bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs"
                      >
                        {isSavingAccount ? 'Saving Profile...' : 'Save Account Updates'}
                      </Button>
                    </div>

                  </form>
                </CardContent>
              </Card>

              {/* PASSWORD CHANGE MASTER CARD */}
              <Card>
                <CardHeader className="border-b border-border pb-5">
                  <CardTitle className="font-sans font-black text-base gap-2 flex items-center text-foreground">
                    <Lock className="h-4.5 w-4.5 text-primary" />
                    Cryptographic Passphrase Update
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Modify core systems administration passwords periodically to satisfy internal risk regulations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handlePasswordChangeSubmit} className="space-y-5">
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="orig-pass" className="text-xs font-bold text-foreground">Current Passphrase</Label>
                      <Input 
                        id="orig-pass"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                      />
                    </div>

                    <div className="grid gap-4.5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="p-new" className="text-xs font-bold text-foreground">New Master Passphrase</Label>
                        <Input 
                          id="p-new"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="p-conf" className="text-xs font-bold text-foreground">Confirm New Passphrase</Label>
                        <Input 
                          id="p-conf"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" variant="outline" className="border-border text-foreground hover:bg-muted font-bold text-xs">
                        Change Access Key
                      </Button>
                    </div>

                  </form>
                </CardContent>
              </Card>

            </div>
          )}

          {/* TAB 3: ACADEMIC COURSES CRUD */}
          {activeTab === 'courses' && (
            <Card>
              <CardHeader className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-5">
                <div>
                  <CardTitle className="font-sans font-black text-lg gap-2 flex items-center text-foreground">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Curriculum Academic Courses CRUD
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Maintain computer lit modules, course codes, syllabus timespans, and access scopes.
                  </CardDescription>
                </div>
                <button
                  onClick={openAddCourse}
                  className="inline-flex items-center gap-1.5 h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-black text-xs rounded-xl cursor-pointer shadow-xs shrink-0 self-start sm:self-center mt-3 sm:mt-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create New Course
                </button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                
                {/* Search Bar for filtering courses */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                  <Input 
                    value={coursesSearch}
                    onChange={(e) => setCoursesSearch(e.target.value)}
                    placeholder="Search courses by code, title, or syllabus objectives..."
                    className="pl-9.5 text-xs font-medium"
                  />
                </div>

                {/* Grid List representation of catalog to demonstrate highest premium feel */}
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/10">
                    <AlertCircle className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                    <span className="text-xs font-bold text-foreground block">Syllabus item not matched</span>
                    <p className="text-[11px] text-muted-foreground mt-1">No courses matched current objective criteria. Create or adjust filter query.</p>
                  </div>
                ) : (
                  <div className="grid gap-4.5 sm:grid-cols-2">
                    {filteredCourses.map((item) => (
                      <Card key={item.id} className="border-border hover:border-primary/45 transition-all p-4.5 flex flex-col justify-between group relative">
                        
                        <div>
                          
                          {/* Course code & badge level */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-black text-primary uppercase">
                              Code: {item.id}
                            </span>
                            <Badge 
                              variant={
                                item.level === 'Advanced' ? 'destructive' : item.level === 'Intermediate' ? 'secondary' : 'success'
                              }
                              className="text-[8.5px] uppercase font-black"
                            >
                              {item.level}
                            </Badge>
                          </div>

                          {/* verbose Title */}
                          <h4 className="text-sm font-black text-foreground font-sans mt-2 group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>

                          {/* description */}
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-2.5 line-clamp-3">
                            {item.description}
                          </p>

                        </div>

                        {/* footer metadata & actions */}
                        <div className="pt-4.5 mt-4 border-t border-border/60 flex items-center justify-between text-xs">
                          
                          <div className="flex items-center gap-1 font-semibold text-muted-foreground text-[10.5px]">
                            <span>Syllabus Span:</span>
                            <strong className="text-foreground font-mono">{item.duration}</strong>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditCourse(item)}
                              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer transition-colors"
                              title="Edit Syllabus parameters"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(item.id, item.name)}
                              className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-600/10 rounded-lg cursor-pointer transition-colors"
                              title="Archive Module"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                        </div>

                      </Card>
                    ))}
                  </div>
                )}

              </CardContent>
            </Card>
          )}

          {/* TAB 4: RISK SETTINGS CONTROLS */}
          {activeTab === 'risk' && (
            <Card>
              <CardHeader className="border-b border-border pb-5">
                <CardTitle className="font-sans font-black text-lg gap-2 flex items-center text-foreground">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  Predictive Support & Academic Risk Tolerances
                </CardTitle>
                <CardDescription className="text-xs">
                  Institute scoring thresholds dictate alert highlights on executive panels to tag lagging groups.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">

                {/* Grid controls */}
                <div className="space-y-7">
                  
                  {/* Slider 1: Pass Rate Percent threshold */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center sm:flex-row flex-col gap-1.5">
                      <div className="space-y-0.5">
                        <Label htmlFor="pass-pct-sl" className="text-xs font-extrabold text-foreground">Evaluation Pass standard (%)</Label>
                        <span className="text-[11px] text-muted-foreground block">Critical minimum target needed for successful booster diagnostics validation.</span>
                      </div>
                      <span className="font-mono text-sm font-black text-emerald-600 px-2.5 py-0.5 bg-emerald-500/10 rounded-lg shrink-0">
                        {passThreshold}% Accuracy Standard
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-muted-foreground">40%</span>
                      <input 
                        id="pass-pct-sl" 
                        type="range" 
                        min="40" 
                        max="90" 
                        value={passThreshold} 
                        onChange={(e) => setPassThreshold(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                      <span className="text-[10px] font-mono text-muted-foreground">90%</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Slider 2: Weak student alert value */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center sm:flex-row flex-col gap-1.5">
                      <div className="space-y-0.5">
                        <Label htmlFor="weak-std-sl" className="text-xs font-extrabold text-foreground">Lagging Margin Baseline Alert Threshold (%)</Label>
                        <span className="text-[11px] text-muted-foreground block">Students maintaining cumulative average below this mark generate urgent warnings headers.</span>
                      </div>
                      <span className="font-mono text-sm font-black text-rose-500 px-2.5 py-0.5 bg-rose-500/10 rounded-lg shrink-0">
                        &lt; {weakStudentThreshold}% Mean Score Risk
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-muted-foreground">30%</span>
                      <input 
                        id="weak-std-sl" 
                        type="range" 
                        min="30" 
                        max="70" 
                        value={weakStudentThreshold} 
                        onChange={(e) => setWeakStudentThreshold(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-rose-500" 
                      />
                      <span className="text-[10px] font-mono text-muted-foreground">70%</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Controls 3: Skipped testing penalty controls combining Switch and Slider */}
                  <div className="bg-muted/20 border border-border rounded-2xl p-5.5 space-y-4">
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-foreground block">Track Skipped Exams as Failure Risk</span>
                        <p className="text-[11px] text-muted-foreground leading-normal">
                          When enabled, skipped assigned tests count towards total standard deviation and reduce completion rate.
                        </p>
                      </div>
                      <Switch 
                        checked={trackSkippedAsRisk} 
                        onChange={(checked) => {
                          setTrackSkippedAsRisk(checked);
                          triggerToast(`Skipped test evaluation metrics altered: ${checked ? 'Penalty active' : 'Syllabus relaxed'}`);
                        }} 
                      />
                    </div>

                    {trackSkippedAsRisk && (
                      <div className="pt-3 border-t border-border/80 space-y-2.5 animate-in fade-in slide-in-from-top-1">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="penalty-sl" className="text-[10.5px] font-bold text-muted-foreground">Skipped Evaluation Penalty Score Coefficient</Label>
                          <span className="font-mono text-[11px] font-black text-primary">-{skippedTestPenalty}% off</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-muted-foreground">0%</span>
                          <input 
                            id="penalty-sl" 
                            type="range" 
                            min="0" 
                            max="50" 
                            value={skippedTestPenalty} 
                            onChange={(e) => setSkippedTestPenalty(parseInt(e.target.value))}
                            className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
                          />
                          <span className="text-[10px] font-mono text-muted-foreground">50%</span>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

                <div className="flex justify-end pt-3 border-t border-border mt-6">
                  <Button
                    onClick={handleSaveRisk}
                    disabled={isSavingRisk}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs inline-flex items-center gap-2"
                  >
                    {isSavingRisk ? 'Validating thresholds...' : 'Confirm Analytics Calibration'}
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}

          {/* TAB 5: PLATFORM SECURITY AND CREDENTIAL CONTROLS */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in">
              
              <Card>
                <CardHeader className="border-b border-border pb-5">
                  <CardTitle className="font-sans font-black text-lg gap-2 flex items-center text-foreground">
                    <Laptop className="h-5 w-5 text-primary" />
                    Authorized Active Sessions Controls
                  </CardTitle>
                  <CardDescription className="text-xs">
                    View active web and mobile client devices accessing the institute dashboard ledger currently.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  
                  {/* Active Devices Rows */}
                  <div className="space-y-3">
                    
                    <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <Laptop className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-foreground">Admin Desk (Chrome / Windows 11)</div>
                          <span className="text-[10px] font-mono text-muted-foreground">IP address: 103.25.101.44 • New Delhi, Delhi (This Session)</span>
                        </div>
                      </div>
                      <Badge variant="success">Current Client</Badge>
                    </div>

                    <div className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted/50 p-2 rounded-lg text-muted-foreground">
                          <Smartphone className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-foreground">iOS Application (Safari Mobile)</div>
                          <span className="text-[10px] font-mono text-muted-foreground">IP address: 203.44.12.87 • Mumbai, MH</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-serif">Registered 3 days ago</span>
                    </div>

                  </div>

                  <div className="pt-3 flex justify-start">
                    <button
                      onClick={handleLogoutAllDevices}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive text-xs hover:text-white rounded-xl font-bold cursor-pointer transition-all active:scale-95"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout All Other Devices & Terminate Session keys
                    </button>
                  </div>

                </CardContent>
              </Card>

              {/* SECURITY CRITICAL OPERATIONS TRIGGER PANEL */}
              <Card className="border-rose-500/30">
                <CardHeader className="bg-rose-500/5 border-b border-rose-500/20 pb-5">
                  <CardTitle className="font-sans font-black text-base text-rose-700 dark:text-rose-400 gap-2 flex items-center">
                    <AlertCircle className="h-5 w-5" />
                    Danger Zone & Emergency Actions
                  </CardTitle>
                  <CardDescription className="text-rose-600/90 dark:text-rose-400/90 text-xs">
                    High privilege database mutations which cannot be reverted. Handled with supreme precaution.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40 p-4 rounded-xl border border-border">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-foreground block">Administrative System Passcode Reset</span>
                      <p className="text-[10.5px] text-muted-foreground max-w-lg leading-normal">
                        Generate and transmit a random temporary cryptographic master key to standard verified alert inbox directories.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsPassResetModalOpen(true)}
                      className="px-4 h-9 bg-foreground text-background font-black text-xs rounded-xl cursor-pointer hover:opacity-90 transition-all shrink-0 self-start sm:self-center"
                    >
                      Reset Auth Token
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-rose-700 dark:text-rose-400 block">Wipe Platform Analysis Cache & Logs</span>
                      <p className="text-[10.5px] text-rose-600 dark:text-rose-300 max-w-lg leading-normal">
                        Archiving standard cache speeds up dashboard processing during curriculum updates but temporarily degrades chart load times.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsPlatformResetConfirmOpen(true)}
                      className="px-4 h-9 border border-rose-600/30 text-rose-600 bg-transparent hover:bg-rose-600 hover:text-white font-black text-xs rounded-xl cursor-pointer transition-all shrink-0 self-start sm:self-center"
                    >
                      Wipe Cache Suite
                    </button>
                  </div>

                </CardContent>
              </Card>

            </div>
          )}

        </div>

      </div>

      {/* MODAL DIALOG 1: ADD / EDIT COURSE INFORMATION */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title={editingCourse ? '✏️ Edit Syllabus Curriculum Item' : '🎉 Create Academic Course Program'}
        description="Configure modular parameters matching regional boards and government guidelines."
      >
        <div className="space-y-4 pt-1.5">
          
          <div className="space-y-1.5">
            <Label htmlFor="c-code" className="text-xs font-extrabold text-foreground">Acreeditation Course Code Identifier</Label>
            <Input 
              id="c-code"
              placeholder="e.g. ADCA-03"
              value={formCourseId}
              onChange={(e) => setFormCourseId(e.target.value)}
              disabled={!!editingCourse} // code serves as the relational identifier key
              className="font-mono text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-title" className="text-xs font-extrabold text-foreground">Verbose Academic Course Name</Label>
            <Input 
              id="c-title"
              placeholder="e.g. Advanced Diploma in Computer Applications (ADCA)"
              value={formCourseName}
              onChange={(e) => setFormCourseName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            
            <div className="space-y-1.5 font-sans">
              <Label htmlFor="c-span" className="text-xs font-bold text-foreground">Syllabus Span</Label>
              <select
                id="c-span"
                value={formCourseDuration}
                onChange={(e) => setFormCourseDuration(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
              >
                <option value="3 Months">3 Months (Special Semester)</option>
                <option value="6 Months">6 Months (Semester Scheme)</option>
                <option value="12 Months">12 Months (Full academic span)</option>
                <option value="24 Months">24 Months (Post-grad track)</option>
              </select>
            </div>

            <div className="space-y-1.5 font-sans">
              <Label htmlFor="c-lev" className="text-xs font-bold text-foreground">Competency Track</Label>
              <select
                id="c-lev"
                value={formCourseLevel}
                onChange={(e) => setFormCourseLevel(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
              >
                <option value="Basic">Basic Certificate level</option>
                <option value="Intermediate">Intermediate Diploma level</option>
                <option value="Advanced">Advanced Pro Level track</option>
              </select>
            </div>

          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-desc" className="text-xs font-extrabold text-foreground">Curriculum Syllabus Summary Objectives</Label>
            <Textarea
              id="c-desc"
              rows={4}
              placeholder="Summarize subject content, practical laboratories details, and exam pattern specs..."
              value={formCourseDescription}
              onChange={(e) => setFormCourseDescription(e.target.value)}
              className="text-xs leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCourse} className="bg-primary text-primary-foreground">
              Confirm & Save Parameters
            </Button>
          </div>

        </div>
      </Modal>

      {/* MODAL DIALOG 2: EMERGENCY CODE TOKEN RESET CONFIRMER */}
      <Modal
        isOpen={isPassResetModalOpen}
        onClose={() => setIsPassResetModalOpen(false)}
        title="⚠️ Critical Code Master Key Reset Request"
        description="This action overrides the cryptographic keys utilized to authenticate internal dashboards."
      >
        <div className="space-y-4 pt-1.5 text-xs leading-relaxed">
          <p className="text-muted-foreground">
            Upon confirmation, the centralized secure vault invalidates past authorization tokens. The registry generates a randomized temporary passcode and formats it securely to your registered mailbox <strong className="text-foreground">bk6500416@gmail.com</strong>.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-amber-700 dark:text-amber-400 font-semibold flex items-start gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>Warning: Mobile device client apps must be synchronized with the new credentials immediately.</span>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsPassResetModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-foreground text-background hover:opacity-90 font-black text-xs"
              onClick={() => {
                setIsPassResetModalOpen(false);
                triggerToast('📨 Secure Master admin key mailed! Check folder coordinates within 5 minutes.');
              }}
            >
              Confirm Transmit Code
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL DIALOG 3: HARD CACHE ERASE CONFIRMER */}
      <Modal
        isOpen={isPlatformResetConfirmOpen}
        onClose={() => setIsPlatformResetConfirmOpen(false)}
        title="🗑️ Confirm Platform Performance Cache Purge"
        description="Resetting compiled files helps fix performance discrepancies and ensures true raw ledger stats rendering."
      >
        <div className="space-y-4 pt-1.5 text-xs leading-relaxed">
          <p className="text-muted-foreground">
            This action flushes transient evaluation reports. No actual student test metadata rows are archived. Dashboards will recompile live analytics from baseline raw tables on next load.
          </p>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsPlatformResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-rose-600 hover:bg-rose-500 font-bold"
              onClick={() => {
                setIsPlatformResetConfirmOpen(false);
                triggerToast('🧹 Performance telemetry cache wiped. Dashboard is now ready for rebuild.');
              }}
            >
              Verify Erase Cache
            </Button>
          </div>
        </div>
      </Modal>

    </PageContainer>
  );
}
