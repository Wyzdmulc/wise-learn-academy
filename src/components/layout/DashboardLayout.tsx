import { ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { 
  Library, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu,
  ChevronRight,
  GraduationCap
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Catalog', href: '/catalog', icon: Library },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: ShieldCheck })
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background font-sans">
        <Sidebar collapsible="icon" className="border-r border-border/50 bg-secondary/30">
          <SidebarHeader className="h-16 flex items-center px-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-primary rounded-xl p-2 shadow-elegant transition-transform group-hover:scale-110">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-primary group-data-[state=collapsed]:hidden">
                Wise Learn
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.name}
                      className={`
                        transition-all duration-200 
                        ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'}
                      `}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                        <span>{item.name}</span>
                        {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border/50 bg-secondary/10">
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-3 px-2 py-3 group-data-[state=collapsed]:hidden">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate">{user?.name || 'Student'}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                </div>
                <SidebarMenuButton 
                  onClick={() => logout()}
                  tooltip="Logout"
                  className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex flex-col h-full overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-secondary transition-colors" />
              <Separator orientation="vertical" className="h-6" />
              <h2 className="text-lg font-medium text-muted-foreground capitalize">
                {location.pathname.substring(1) || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
                Support
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-background/50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
