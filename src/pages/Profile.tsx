import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CloudUpload, 
  Clock, 
  CheckCircle2,
  Trophy,
  History,
  FileUp,
  ChevronRight,
  GraduationCap,
  Zap,
  PlayCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { AddMaterialDialog } from '@/components/materials/AddMaterialDialog'

export default function Profile() {
  const { user, isEnriched, isAdmin } = useAuth()

  if (!user) return null

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and track your learning progress.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 bg-background/60 backdrop-blur-sm shadow-elegant overflow-hidden rounded-3xl group">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40 group-hover:from-primary/30 group-hover:to-primary/50 transition-all duration-700" />
              <CardContent className="relative pt-0 px-6 pb-8">
                <div className="flex justify-center -mt-12 mb-6">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-2 ring-primary/20 transition-transform duration-500 hover:scale-110">
                    <AvatarImage src={user.avatarUrl} alt={user.name || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {user.name?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-serif font-bold">{user.name || 'Student'}</h2>
                    {isAdmin && <Shield className="h-5 w-5 text-primary" title="Administrator" />}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/30 text-center">
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-primary">12</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Courses</p>
                  </div>
                  <div className="space-y-1 border-l border-border/30">
                    <p className="text-lg font-bold text-primary">85%</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Progress</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {joinedDate}
                </div>
                <Badge variant="outline" className="rounded-full bg-background border-primary/20 text-primary uppercase text-[10px]">
                  Basic Plan
                </Badge>
              </CardFooter>
            </Card>

            <Card className="border-border/50 bg-background/60 rounded-3xl overflow-hidden shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" /> Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Early Adopter', date: 'Jan 2024', icon: CheckCircle2, color: 'text-emerald-500' },
                  { title: 'Fast Learner', date: 'Feb 2024', icon: Zap, color: 'text-amber-500' },
                  { title: 'Knowledge Sharer', date: 'Mar 2024', icon: GraduationCap, color: 'text-primary' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-default">
                    <div className={`p-2 rounded-xl bg-background border border-border/50 shadow-sm group-hover:border-primary/30 transition-colors ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Progress & Contributions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-background/60 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-serif font-bold">Current Learning</CardTitle>
                <CardDescription>Track your active courses and materials.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: 'Mastering TypeScript Ecosystem', progress: 75, instructor: 'Sarah Drasner' },
                  { title: 'Advanced React Architecture', progress: 40, instructor: 'Kent C. Dodds' }
                ].map((course, i) => (
                  <div key={i} className="space-y-3 p-4 rounded-2xl border border-border/30 hover:border-primary/20 hover:bg-primary/5 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{course.title}</h4>
                        <p className="text-xs text-muted-foreground">Instructor: {course.instructor}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-secondary" />
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-primary font-bold rounded-xl group">
                  View Full History <History className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced/Contributor Section */}
            {isEnriched ? (
              <Card className="border-primary/20 bg-primary/5 rounded-3xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                  <CloudUpload className="h-32 w-32 text-primary" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary p-2 rounded-xl shadow-elegant">
                      <FileUp className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="default" className="bg-primary shadow-sm uppercase tracking-widest text-[10px]">Trusted Contributor</Badge>
                  </div>
                  <CardTitle className="text-2xl font-serif font-bold">Share Your Wisdom</CardTitle>
                  <CardDescription className="text-primary/70 font-medium">
                    Because you've been with us for over 10 days, you can now contribute documents to the academy!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 max-w-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background rounded-2xl border border-primary/10 shadow-sm flex flex-col items-center text-center space-y-3">
                      <div className="bg-primary/10 p-2.5 rounded-full">
                        <FileUp className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-bold">Upload PDFs</p>
                    </div>
                    <div className="p-4 bg-background rounded-2xl border border-primary/10 shadow-sm flex flex-col items-center text-center space-y-3">
                      <div className="bg-primary/10 p-2.5 rounded-full">
                        <PlayCircle className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-bold">Share Videos</p>
                    </div>
                  </div>
                  <AddMaterialDialog
                    isUserContribution={true}
                    trigger={
                      <Button className="w-full h-14 rounded-full bg-primary shadow-elegant hover:scale-105 transition-all text-lg font-bold">
                        Add New Resource <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    }
                  />
                </CardContent>
                <div className="absolute bottom-4 right-6 text-[10px] text-primary/50 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="h-3 w-3" /> Community Verified
                </div>
              </Card>
            ) : (
              <Card className="border-border/30 bg-secondary/10 rounded-3xl overflow-hidden relative">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="bg-background h-16 w-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-border/50">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-serif font-bold">Unlock Contributor Status</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Stay active for just a few more days to unlock the ability to share your own materials with the community.
                  </p>
                  <div className="pt-4 max-w-xs mx-auto">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      <span>Early Access Progress</span>
                      <span>70%</span>
                    </div>
                    <Progress value={70} className="h-2 bg-background border border-border/30" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
