import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import About from './pages/About'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import PatientDashboard from './pages/PatientDashboard'
import DashboardRedirect from './pages/DashboardRedirect'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import EntryRoute from './pages/EntryRoute'
import PatientPortalLayout from './components/PatientPortalLayout'
import {
  PatientFavorites,
  PatientNotifications,
  PatientReviews,
  PatientSettings,
  PatientDoctorFavoritesDirectory,
} from './pages/PatientPortalPages'

const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'))
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'))
const DoctorSettings = lazy(() => import('./pages/DoctorSettings'))
const DoctorPortalLayout = lazy(() => import('./components/DoctorPortalLayout'))
const PaymentHistory = lazy(() => import('./pages/PaymentHistory'))


const App = () => {
  const { user } = useAuth()
  const location = useLocation()
  const isDoctorPortal = user?.role === 'doctor'
    && ['/doctor-dashboard', '/my-profile', '/doctor-settings', '/doctor-payments'].includes(location.pathname)
  const isPatientPortal = user?.role === 'patient'
    && (['/patient-dashboard', '/my-profile', '/appointments', '/my-appointments', '/patient-favorites', '/patient-reviews', '/patient-notifications', '/patient-payments', '/patient-settings'].includes(location.pathname)
      || location.pathname.startsWith('/doctors'))

  return (
    <div className={`app-shell${isDoctorPortal ? ' doctor-app-shell' : ''}${isPatientPortal ? ' patient-app-shell' : ''}`}>
      {!isDoctorPortal && !isPatientPortal && <Navbar/>}
      <Suspense fallback={(
        <div
          className="doctor-route-loading"
          role="status"
          style={isDoctorPortal ? { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#101114', color: '#c4c5ca' } : undefined}
        >
          Loading workspace…
        </div>
      )}>
        <Routes>
          <Route path="/" element={<EntryRoute />} />
          <Route path="/home" element={<EntryRoute />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={user?.role === 'patient'
            ? <PatientPortalLayout><PatientDoctorFavoritesDirectory /></PatientPortalLayout>
            : <Doctors />} />
          <Route path="/doctors/:specialty" element={user?.role === 'patient'
            ? <PatientPortalLayout><Doctors /></PatientPortalLayout>
            : <Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route
              path="/my-profile"
              element={user?.role === 'doctor'
                ? <DoctorPortalLayout><DoctorProfile /></DoctorPortalLayout>
                : user?.role === 'patient'
                  ? <PatientPortalLayout><MyProfile /></PatientPortalLayout>
                  : <MyProfile />}
            />
          </Route>
          <Route element={<ProtectedRoute roles={['doctor']} />}>
            <Route element={<DoctorPortalLayout />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor-settings" element={<DoctorSettings />} />
              <Route path="/doctor-payments" element={<PaymentHistory />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute roles={['patient']} />}>
            <Route element={<PatientPortalLayout />}>
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/appointments" element={<Appointment />} />
              <Route path="/patient-payments" element={<PaymentHistory />} />
              <Route path="/patient-favorites" element={<PatientFavorites />} />
              <Route path="/patient-reviews" element={<PatientReviews />} />
              <Route path="/patient-notifications" element={<PatientNotifications />} />
              <Route path="/patient-settings" element={<PatientSettings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      {!isDoctorPortal && !isPatientPortal && (
        <footer className="site-footer">
          &copy; 2026 UNFAZED. All rights reserved.
        </footer>
      )}
    </div>
  )
}

export default App
