import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav className="mb-5 flex items-center justify-between border-b border-gray-300 py-4">
      <NavLink to="/" className="text-xl font-bold">
        UNFAZED
      </NavLink>
      <ul className="hidden items-center gap-6 font-medium md:flex">
        <li className="py-1"><NavLink to="/">HOME</NavLink></li>
        <li className="py-1"><NavLink to="/doctors">DOCTORS</NavLink></li>
        <li className="py-1"><NavLink to="/about">ABOUT</NavLink></li>
        <li className="py-1"><NavLink to="/contact">CONTACT</NavLink></li>
      </ul>
      <div className="flex items-center gap-4">
        <button
          id="button-login"
          type="button"
          onClick={() => navigate('/login')}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-black transition hover:bg-primary/80"
        >
          LOGIN | SIGN UP
        </button>
      </div>
    </nav>
  )
}

export default Navbar
