import { useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BottomNav, TopBar, SidebarNav } from './components/nav/NavBar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/Chat'
import TimelinePage from './pages/Timeline'
import MapPage from './pages/MapPage'
import Education from './pages/Education'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, refetchOnWindowFocus: false },
  },
})

/** Wrapper that adds the responsive navigation chrome */
function AppShell({ children }) {
  const { user, logout } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const location = useLocation()
  const isChat = location.pathname === '/chat'

  return (
    <div className="app-shell">

      {/* Sidebar — lg+ */}
      <SidebarNav 
        user={user} 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <div className="app-shell__body">
        {/* Top Header Bar — always visible */}
        <TopBar user={user} onLogout={logout} />

        <main id="main-content" className={`app-shell__main ${isChat ? 'app-shell__main--chat' : ''}`}>
          {children}
        </main>
      </div>

      {/* BottomNav — mobile */}
      <div className="app-shell__bottomnav">
        <BottomNav />
      </div>
    </div>
  )
}

import { Outlet } from 'react-router-dom'

/** Route guard — redirects to /login if not authenticated */
function ProtectedRoute() {
  const { user, loading } = useAuth()
  
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B35]"></div>
    </div>
  )
  
  if (!user) return <Navigate to="/login" replace />
  return <AppShell><Outlet /></AppShell>
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/onboarding" replace /> : <Signup />} />
      
      {/* Onboarding - special case (authenticated but needs setup) */}
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" replace />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/education" element={<Education />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
