import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from '../Loader/Loader.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader label="Проверяем доступ…" />
  if (!user) return <Navigate to="/admin" replace />

  return children
}
