import { Navigate } from 'react-router-dom'

// Only lets admins in. Everyone else is redirected.
export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}