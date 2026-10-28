import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import LogoutButton from './LogoutButton'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const links = user?.role === 'doctor'
    ? [
        ['HOME', '/doctor-dashboard'],
        ['DOCTOR PROFILE', '/my-profile'],
        ["TODAY'S APPOINTMENTS", '/doctor-dashboard#appointments'],
        ['PATIENT LIST', '/doctor-dashboard#patients'],
        ['AVAILABILITY', '/doctor-dashboard#availability'],
        ['SETTINGS', '/doctor-settings'],
      ]
    : user
      ? [
          ['HOME', '/patient-dashboard'],
          ['MY PROFILE', '/my-profile'],
          ['DOCTORS LIST', '/doctors'],
          ['BOOK APPOINTMENT', '/doctors'],
          ['MY APPOINTMENTS', '/my-appointments'],
          ['PAYMENTS', '/patient-payments'],
          ['SETTINGS', '/my-profile'],
        ]
      : [
          ['HOME', '/'],
          ['DOCTORS', '/doctors'],
          ['ABOUT', '/about'],
          ['CONTACT', '/contact'],
        ]

  return (
    <nav className="site-navbar">
      <NavLink to="/" className="brand-link">
        <span className="brand-mark" aria-hidden="true">+</span>
        <span>UNFAZED<span className="ml-1 font-medium text-slate-400">CARE</span></span>
      </NavLink>
      <ul className="site-links">
        {links.map(([label, path]) => (
          <li key={`${label}-${path}`} className="py-1"><NavLink to={path}>{label}</NavLink></li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-slate-600 sm:inline">{user.name}</span>
            <LogoutButton className="button-secondary text-sm">Log out</LogoutButton>
          </div>
        ) : (
          <button
            id="button-login"
            type="button"
            onClick={() => navigate('/login')}
            className="button-primary text-sm"
          >
            LOGIN | SIGN UP
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
