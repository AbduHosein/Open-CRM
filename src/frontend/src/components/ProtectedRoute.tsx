import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { NavbarWithTooltips } from './navbar/NavbarWithTooltips'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return null // or a spinner

  if (!user) return <Navigate to="/login" replace />

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <NavbarWithTooltips />
      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}