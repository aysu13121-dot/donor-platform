import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage  from './pages/LandingPage'
import LoginPage    from './pages/LoginPage'
import SignupPage   from './pages/SignupPage'
import DonorsPage   from './pages/DonorsPage'
import RequestsPage from './pages/RequestsPage'
import CreateRequestPage from './pages/CreateRequestPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<LandingPage />}  />
        <Route path="/login"   element={<LoginPage />}    />
        <Route path="/signup"  element={<SignupPage />}   />
        <Route path="/donors"  element={<DonorsPage />}   />
        <Route path="/requests" element={<RequestsPage />} />
        <Route
          path="/create-request"
          element={
            <ProtectedRoute>
              <CreateRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
