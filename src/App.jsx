import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import PoemPage from './pages/PoemPage/PoemPage.jsx'
import AdminLogin from './pages/Admin/AdminLogin.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import PoemForm from './pages/Admin/PoemForm.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poem/:id" element={<PoemPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/new"
            element={
              <ProtectedRoute>
                <PoemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute>
                <PoemForm />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
