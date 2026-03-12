import { Link } from '@tanstack/react-router'
import { 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  Globe, 
  Users, 
  Zap,
  GraduationCap,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { isAuthenticated, login } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg shadow-elegant">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-2xl text-primary">Wise Learn</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#curriculum" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Curriculum</a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button asChild className="rounded-full shadow-elegant bg-primary hover:bg-primary/90">
                  <Link to="/catalog">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              ) : (
                <Button onClick={login} className="rounded-full shadow-elegant bg-primary hover:bg-primary/90">
                  Start Learning
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-primary bg-primary/10 border-primary/20 animate-bounce">
                  ✨ Empowering 10,000+ Students
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight text-foreground">
                  Master Your <span className="text-primary italic">Craft</span> with Expert Wisdom
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Join Wise Learn Academy for a curated collection of high-quality learning materials, 
                  interactive videos, and expert-led documents designed to accelerate your career.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" onClick={login} className="rounded-full h-14 px-8 text-lg bg-primary shadow-elegant">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-primary/20 text-primary hover:bg-primary/10">
                    Browse Catalog
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="h-10 w-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-xs font-bold text-white">
                      +
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Trusted by developers worldwide
                  </p>
                </div>
              </div>
              
              <div className="relative lg:block hidden animate-in slide-in-from-right duration-1000">
                <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-3xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1770307939909-f27b8e4ae9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Learning Platform" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <div className="bg-primary rounded-full p-2">
                        <PlayCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold">250+ Video Lectures</p>
                        <p className="text-white/70 text-xs">Self-paced learning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-5xl font-serif font-bold text-foreground">Why Choose Wise Learn?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide the tools and resources you need to succeed in the modern digital landscape.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Curated Content',
                  desc: 'Hand-picked materials from industry leaders and expert educators.',
                  icon: FileText,
                  color: 'bg-blue-500/10 text-blue-600'
                },
                {
                  title: 'Interactive Learning',
                  desc: 'Engage with videos, documents, and external links in one unified viewer.',
                  icon: PlayCircle,
                  color: 'bg-primary/10 text-primary'
                },
                {
                  title: 'Secure & Private',
                  desc: 'Your learning progress is saved and protected with enterprise-grade security.',
                  icon: ShieldCheck,
                  color: 'bg-emerald-500/10 text-emerald-600'
                }
              ].map((feature, i) => (
                <div key={i} className="bg-background rounded-2xl p-8 shadow-sm border border-border/50 transition-all hover:shadow-elegant hover:-translate-y-1">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Courses', value: '150+' },
                { label: 'Students', value: '12k' },
                { label: 'Experts', value: '45' },
                { label: 'Satisfaction', value: '98%' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl font-serif font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary opacity-5" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Unlock the full potential of your career with Wise Learn Academy. 
              Join thousands of students and start learning today.
            </p>
            <div className="flex justify-center pt-4">
              <Button size="lg" onClick={login} className="rounded-full h-16 px-12 text-xl bg-primary shadow-elegant hover:scale-105 transition-transform">
                Sign Up Now — It's Free
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              {['Unlimited Access', 'Expert Guidance', 'Progress Tracking', 'Community Support'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/50 py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-1 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <span className="font-serif font-bold text-xl text-primary">Wise Learn</span>
            </div>
            
            <div className="flex gap-8 text-sm text-muted-foreground font-medium">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Wise Learn Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
