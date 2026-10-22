import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { LandingPage } from '@/features/landing/LandingPage'
import { StudentLogin } from '@/features/auth/StudentLogin'
import { TeacherLogin } from '@/features/auth/TeacherLogin'
import { AdminLogin } from '@/features/auth/AdminLogin'
import { AdminLayout } from '@/features/admin/AdminLayout'
import { TeacherLayout } from '@/features/teacher/TeacherLayout'
import { StudentLayout } from '@/features/student/StudentLayout'
import { authService } from '@/services/authService'

type AppView =
  | 'LANDING'
  | 'LOGIN_STUDENT'
  | 'LOGIN_TEACHER'
  | 'LOGIN_ADMIN'
  | 'SPACE_STUDENT'
  | 'SPACE_TEACHER'
  | 'SPACE_ADMIN'

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('LANDING')

  useEffect(() => {
    // Check existing session
    const session = authService.getCurrentSession()
    if (session) {
      if (session.role === 'ADMIN') setCurrentView('SPACE_ADMIN')
      else if (session.role === 'TEACHER') setCurrentView('SPACE_TEACHER')
      else if (session.role === 'STUDENT') setCurrentView('SPACE_STUDENT')
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    setCurrentView('LANDING')
    toast.info('Session fermée.')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-[#7A1B29] selection:text-white">
      {/* Sonner Toasts System (Clean & High-Contrast) */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: '!bg-white !text-slate-900 !border-slate-200 !shadow-xl !font-sans !rounded-xl',
        }}
      />

      {/* Main View Switcher */}
      <div className="flex-1">
        {currentView === 'LANDING' && (
          <LandingPage
            onNavigateLogin={(role) => {
              if (role === 'STUDENT') setCurrentView('LOGIN_STUDENT')
              else if (role === 'TEACHER') setCurrentView('LOGIN_TEACHER')
              else if (role === 'ADMIN') setCurrentView('LOGIN_ADMIN')
            }}
          />
        )}

        {currentView === 'LOGIN_STUDENT' && (
          <StudentLogin
            onSuccess={() => setCurrentView('SPACE_STUDENT')}
            onNavigateHome={() => setCurrentView('LANDING')}
          />
        )}

        {currentView === 'LOGIN_TEACHER' && (
          <TeacherLogin
            onSuccess={() => setCurrentView('SPACE_TEACHER')}
            onNavigateHome={() => setCurrentView('LANDING')}
          />
        )}

        {currentView === 'LOGIN_ADMIN' && (
          <AdminLogin
            onSuccess={() => setCurrentView('SPACE_ADMIN')}
            onNavigateHome={() => setCurrentView('LANDING')}
          />
        )}

        {currentView === 'SPACE_ADMIN' && (
          <AdminLayout
            onLogout={handleLogout}
            onNavigateHome={() => setCurrentView('LANDING')}
          />
        )}

        {currentView === 'SPACE_TEACHER' && (
          <TeacherLayout
            onLogout={handleLogout}
            onNavigateHome={() => setCurrentView('LANDING')}
          />
        )}

        {currentView === 'SPACE_STUDENT' && (
          <StudentLayout
            onLogout={handleLogout}
            onNavigateHome={() => setCurrentView('LANDING')}
          />
        )}
      </div>
    </div>
  )
}

export default App
