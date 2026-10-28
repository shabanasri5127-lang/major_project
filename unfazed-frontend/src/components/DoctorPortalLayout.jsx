import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Moon,
  Stethoscope,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LogoutButton from "./LogoutButton";
import "./DoctorPortal.css";

const navigation = [
  { label: "Overview", to: "/doctor-dashboard", icon: LayoutDashboard, end: true },
  { label: "Appointments", to: "/doctor-dashboard#appointments", icon: CalendarDays },
  { label: "Patients", to: "/doctor-dashboard#patients", icon: UsersRound },
  { label: "Analytics", to: "/doctor-dashboard#analytics", icon: Activity },
  { label: "Payments", to: "/doctor-payments", icon: WalletCards },
];

const pageTitles = {
  "/doctor-dashboard": "Overview",
  "/my-profile": "Doctor profile",
  "/doctor-settings": "Settings",
  "/doctor-payments": "Payment history",
};

const initials = (name = "") => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join("")
  .toUpperCase();

const DoctorAvatar = ({ user, className = "" }) => (
  <span className={`doctor-portal-avatar ${className}`}>
    {user?.image ? <img src={user.image} alt="" /> : initials(user?.name)}
  </span>
);

const DoctorPortalLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lightTheme, setLightTheme] = useState(() => localStorage.getItem("doctor-portal-theme") === "light");
  const pageTitle = pageTitles[location.pathname] || "Doctor workspace";

  useEffect(() => {
    localStorage.setItem("doctor-portal-theme", lightTheme ? "light" : "dark");
  }, [lightTheme]);

  const searchAppointments = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/doctor-dashboard?search=${encodeURIComponent(query)}#appointments` : "/doctor-dashboard#appointments");
  };

  return (
    <div className={`doctor-portal-shell${sidebarCollapsed ? " sidebar-collapsed" : ""}${lightTheme ? " theme-light" : ""}`}>
      <aside className="doctor-portal-sidebar">
        <Link className="doctor-portal-brand" to="/doctor-dashboard">
          <span className="doctor-portal-brand-mark"><Stethoscope size={19} /></span>
          <span>UNFAZED<span>CARE</span></span>
        </Link>
        <button
          type="button"
          className="doctor-portal-sidebar-toggle"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!sidebarCollapsed}
          onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
        >
          <Menu size={17} />
        </button>

        <p className="doctor-portal-nav-caption">WORKSPACE</p>
        <nav className="doctor-portal-nav" aria-label="Doctor portal">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) => {
                const hash = to.includes("#") ? to.slice(to.indexOf("#")) : "";
                const isCurrentSection = hash
                  ? location.hash === hash
                  : (end ? !location.hash : true);
                return `doctor-portal-nav-link${isActive && isCurrentSection ? " active" : ""}`;
              }}
              end={end}
              aria-label={label}
              key={label}
              to={to}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) => `doctor-portal-nav-link${isActive ? " active" : ""}`}
            aria-label="My profile"
            to="/my-profile"
          >
            <UserRound size={18} />
            <span>My profile</span>
          </NavLink>
        </nav>

        <p className="doctor-portal-nav-caption account-caption">PREFERENCES</p>
        <nav className="doctor-portal-nav" aria-label="Account settings">
          <NavLink
            className={({ isActive }) => `doctor-portal-nav-link${isActive ? " active" : ""}`}
            to="/doctor-settings"
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <LogoutButton className="doctor-portal-nav-link doctor-portal-logout-nav">Sign out</LogoutButton>
          <a className="doctor-portal-nav-link" href="mailto:support@medicare.com" aria-label="Help and support">
            <CircleHelp size={18} />
            <span>Help &amp; support</span>
          </a>
        </nav>

        <div className="doctor-portal-sidebar-bottom">
          <div className="doctor-portal-secure-note">
            <ShieldCheck size={17} />
            <span><strong>Private &amp; secure</strong><small>Your practice workspace</small></span>
          </div>
        </div>
      </aside>

      <div className="doctor-portal-main">
        <header className="doctor-portal-topbar">
          <div className="doctor-portal-topbar-leading">
            <button
              type="button"
              className="doctor-portal-menu-button"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            >
              <Menu size={18} />
            </button>
            <div className="doctor-portal-heading">
              <span>Workspace</span><span className="heading-divider">/</span><strong>{pageTitle}</strong>
            </div>
          </div>
          <div className="doctor-portal-topbar-actions">
            <span className="doctor-portal-date">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <button
              type="button"
              className="doctor-portal-icon-button doctor-theme-toggle"
              aria-label={`Switch to ${lightTheme ? "dark" : "light"} theme`}
              aria-pressed={lightTheme}
              onClick={() => setLightTheme((isLight) => !isLight)}
              title={`Switch to ${lightTheme ? "dark" : "light"} theme`}
            >
              {lightTheme ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <LogoutButton className="doctor-portal-topbar-logout">Log out</LogoutButton>
            {searchOpen && (
              <form className="doctor-portal-search-form" onSubmit={searchAppointments}>
                <input
                  autoFocus
                  aria-label="Search patients and appointments"
                  placeholder="Search patients or appointments"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <button type="submit" aria-label="Submit search"><Search size={15} /></button>
              </form>
            )}
            <button
              type="button"
              className={`doctor-portal-icon-button${searchOpen ? " selected" : ""}`}
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
            >
              {searchOpen ? <X size={17} /> : <Search size={17} />}
            </button>
            <div className="doctor-portal-popover-wrap">
              <button
                type="button"
                className={`doctor-portal-icon-button${notificationsOpen ? " selected" : ""}`}
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setProfileMenuOpen(false);
                }}
              >
                <Bell size={18} />
              </button>
              {notificationsOpen && (
                <div className="doctor-portal-popover notification-popover">
                  <strong>You&apos;re all caught up</strong>
                  <span>New appointment updates will appear here.</span>
                </div>
              )}
            </div>
            <div className="doctor-portal-popover-wrap">
              <button
                type="button"
                className="doctor-portal-account-button"
                aria-expanded={profileMenuOpen}
                onClick={() => {
                  setProfileMenuOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
              >
                <DoctorAvatar user={user} />
                <span className="doctor-portal-account-copy">
                  <strong>Dr. {user?.name || "Doctor"}</strong>
                  <small>{user?.speciality || "Medical professional"}</small>
                </span>
                <ChevronDown size={15} />
              </button>
              {profileMenuOpen && (
                <div className="doctor-portal-popover account-popover">
                  <Link to="/my-profile" onClick={() => setProfileMenuOpen(false)}>View profile</Link>
                  <Link to="/doctor-settings" onClick={() => setProfileMenuOpen(false)}>Settings</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            className="doctor-portal-page"
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {children || <Outlet />}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoctorPortalLayout;
