import { 
  createRootRoute, 
  createRoute, 
  createRouter, 
  RouterProvider, 
  Outlet,
  Navigate
} from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import Home from '@/pages/Home'
import Catalog from '@/pages/Catalog'
import Admin from '@/pages/Admin'
import Profile from '@/pages/Profile'
import { Loader2 } from 'lucide-react'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
})

// Public index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

// Protected Catalog route
const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: function ProtectedCatalog() {
    const { isAuthenticated, isLoading } = useAuth()
    
    if (isLoading) return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    )
    
    if (!isAuthenticated) return <Navigate to="/" />
    return <Catalog />
  },
})

// Protected Admin route
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: function ProtectedAdmin() {
    const { isAuthenticated, isAdmin, isLoading } = useAuth()
    
    if (isLoading) return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    )
    
    if (!isAuthenticated) return <Navigate to="/" />
    if (!isAdmin) return <Navigate to="/catalog" />
    return <Admin />
  },
})

// Protected Profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: function ProtectedProfile() {
    const { isAuthenticated, isLoading } = useAuth()
    
    if (isLoading) return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    )
    
    if (!isAuthenticated) return <Navigate to="/" />
    return <Profile />
  },
})

// Create router tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  adminRoute,
  profileRoute
])

const router = createRouter({ routeTree })

// Register for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}

export default App
