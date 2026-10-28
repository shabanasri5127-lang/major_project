import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Heart,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Stethoscope,
  Sun,
  UserRound,
  X,
  Monitor,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PatientPortalProvider from "../context/PatientPortalProvider";
import LogoutButton from "./LogoutButton";
import "./PatientPortal.css";

const navigation = [
  { label: "Dashboard", to: "/patient-dashboard", icon: LayoutDashboard, end: true },
  { label: "My Profile", to: "/my-profile", icon: UserRound },
  { label: "Doctors", to: "/doctors", icon: Stethoscope },
  { label: "Book Appointment", to: "/doctors?book=1", icon: CalendarDays, end: true },
  { label: "My Appointments", to: "/my-appointments", icon: ClipboardList },
  { label: "Favorite Doctors", to: "/patient-favorites", icon: Heart },
  { label: "Reviews", to: "/patient-reviews", icon: Star },
  { label: "Notifications", to: "/patient-notifications", icon: Bell },
  { label: "Payments", to: "/patient-payments", icon: CreditCard },
  { label: "Settings", to: "/patient-settings", icon: Settings },
];

const pageTitles = {
  "/patient-dashboard": "Dashboard",
  "/my-profile": "My Profile",
  "/doctors": "Doctors",
  "/appointments": "Book Appointment",
  "/my-appointments": "My Appointments",
  "/patient-favorites": "Favorite Doctors",
  "/patient-reviews": "Reviews",
  "/patient-notifications": "Notifications",
  "/patient-payments": "Payments",
  "/patient-settings": "Settings",
};

const readStoredFavorites = (storageKey) => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(stored) ? stored.filter((doctor) => doctor && typeof doctor._id === "string") : [];
  } catch {
    return [];
  }
};

const readThemePreference = () => {
  const savedTheme = localStorage.getItem("patient-portal-theme");
  return ["light", "dark", "system"].includes(savedTheme) ? savedTheme : "light";
};

const PatientPortalLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const favoriteStorageKey = `patient-favorite-doctors:${user?.id || user?.email || "account"}`;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(readThemePreference);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [favorites, setFavorites] = useState(() => readStoredFavorites(favoriteStorageKey));
  const [toast, setToast] = useState(null);
  const isBookingPage = location.pathname === "/doctors" && new URLSearchParams(location.search).get("book") === "1";
  const title = isBookingPage ? "Book Appointment" : pageTitles[location.pathname] || "Your care";
  const appliedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    localStorage.setItem("patient-portal-theme", theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (event) => setSystemDark(event.matches);
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = useCallback((message, type = "success") => setToast({ message, type }), []);
  const toggleFavorite = useCallback((doctor) => {
    setFavorites((currentFavorites) => {
      const alreadySaved = currentFavorites.some((favorite) => favorite._id === doctor._id);
      const nextFavorites = alreadySaved
        ? currentFavorites.filter((favorite) => favorite._id !== doctor._id)
        : [...currentFavorites, doctor];
      localStorage.setItem(favoriteStorageKey, JSON.stringify(nextFavorites));
      notify(alreadySaved ? "Doctor removed from your favorites." : "Doctor saved to your favorites.");
      return nextFavorites;
    });
  }, [favoriteStorageKey, notify]);
  const portalValue = useMemo(() => ({
    favorites,
    isFavorite: (doctorId) => favorites.some((doctor) => doctor._id === doctorId),
    toggleFavorite,
    notify,
  }), [favorites, notify, toggleFavorite]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("search")?.toString().trim();
    navigate(query ? `/doctors?search=${encodeURIComponent(query)}` : "/doctors");
  };

  return (
    <PatientPortalProvider value={portalValue}>
      <div className={`patient-portal-shell patient-theme-${appliedTheme}`}>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.button
              type="button"
              className="patient-sidebar-backdrop"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.aside
          className={`patient-sidebar${sidebarOpen ? " sidebar-open" : ""}`}
          initial={false}
          animate={{ x: sidebarOpen ? 0 : undefined }}
        >
          <Link className="patient-brand" to="/patient-dashboard">
            <span className="patient-brand-mark"><Heart size={20} fill="currentColor" /></span>
            <span>UNFAZED<span>CARE</span></span>
            <button type="button" className="patient-sidebar-close" aria-label="Close navigation" onClick={(event) => { event.preventDefault(); setSidebarOpen(false); }}>
              <X size={18} />
            </button>
          </Link>

          <div className="patient-sidebar-profile">
            <span className="patient-avatar">{user?.image ? <img src={user.image} alt="" /> : user?.name?.charAt(0)?.toUpperCase() || "P"}</span>
            <span><strong>{user?.name || "Patient"}</strong><small>Patient account</small></span>
            <ShieldCheck size={16} />
          </div>

          <p className="patient-nav-label">YOUR HEALTH</p>
          <nav className="patient-nav" aria-label="Patient portal">
            {navigation.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={`${label}-${to}`}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => {
                  const isBookingRoute = label === "Book Appointment"
                    && location.pathname === "/doctors"
                    && new URLSearchParams(location.search).get("book") === "1";
                  const active = isBookingRoute
                    || (label === "Doctors" && isActive && !new URLSearchParams(location.search).has("book"))
                    || (label !== "Book Appointment" && label !== "Doctors" && isActive);
                  return `patient-nav-link${active ? " active" : ""}`;
                }}
              >
                <Icon size={18} />
                <span>{label}</span>
                {((label === "Book Appointment" && isBookingPage)
                  || (label === "Doctors" && location.pathname === "/doctors" && !isBookingPage)
                  || (label !== "Book Appointment" && label !== "Doctors" && location.pathname === to))
                  && <ChevronRight className="patient-nav-current" size={15} />}
              </NavLink>
            ))}
          </nav>

          <div className="patient-sidebar-footer">
            <div className="patient-sidebar-support"><ShieldCheck size={17} /><span><strong>Your care, protected</strong><small>Manage your health in one place</small></span></div>
            <LogoutButton className="patient-sidebar-logout">Log out</LogoutButton>
          </div>
        </motion.aside>

        <div className="patient-portal-main">
          <header className="patient-topbar">
            <div className="patient-topbar-leading">
              <button type="button" className="patient-menu-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
              <div><span>Patient portal</span><strong>{title}</strong></div>
            </div>
            <form className="patient-search" onSubmit={handleSearch}>
              <Search size={16} />
              <input name="search" aria-label="Search doctors" placeholder="Search doctors" />
              <kbd>⌘ K</kbd>
            </form>
            <div className="patient-topbar-actions">
              <Link to="/patient-notifications" className="patient-topbar-icon" aria-label="Notifications"><Bell size={18} /><span /></Link>
              <div className="patient-theme-switch" role="group" aria-label="Theme preference">
                <button type="button" className={theme === "light" ? "selected" : ""} aria-label="Light mode" aria-pressed={theme === "light"} onClick={() => setTheme("light")}><Sun size={15} /></button>
                <button type="button" className={theme === "dark" ? "selected" : ""} aria-label="Dark mode" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}><Moon size={15} /></button>
                <button type="button" className={theme === "system" ? "selected" : ""} aria-label="System theme" aria-pressed={theme === "system"} onClick={() => setTheme("system")}><Monitor size={15} /></button>
              </div>
              <Link to="/my-profile" className="patient-topbar-user"><span>{user?.image ? <img src={user.image} alt="" /> : user?.name?.charAt(0)?.toUpperCase() || "P"}</span><strong>{user?.name || "Patient"}</strong></Link>
            </div>
          </header>

          <main className="patient-route-content">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${location.pathname}${location.search}`}
                className="patient-route-transition"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {children || <Outlet />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              className={`patient-toast toast-${toast.type}`}
              role="status"
              initial={{ opacity: 0, y: -12, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <ShieldCheck size={17} />{toast.message}
              <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={15} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PatientPortalProvider>
  );
};

export default PatientPortalLayout;
