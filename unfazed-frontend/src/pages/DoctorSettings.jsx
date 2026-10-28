import { useState } from "react";
import {
  BellRing,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Eye,
  HelpCircle,
  KeyRound,
  Moon,
  Save,
  Settings2,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LogoutButton from "../components/LogoutButton";

const settingsSections = [
  { id: "profile", label: "Profile", description: "Professional identity", icon: UserRound },
  { id: "security", label: "Security", description: "Account protection", icon: KeyRound },
  { id: "notifications", label: "Notifications", description: "Updates and reminders", icon: BellRing },
  { id: "appearance", label: "Appearance", description: "Workspace preferences", icon: Eye },
  { id: "availability", label: "Availability", description: "Days you see patients", icon: Clock3 },
  { id: "consultation", label: "Consultation settings", description: "Fees and experience", icon: Settings2 },
  { id: "payments", label: "Payment settings", description: "Payout information", icon: CreditCard },
  { id: "help", label: "Help & support", description: "Support and guidance", icon: HelpCircle },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorSettings = () => {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [availability, setAvailability] = useState(user?.availability || []);
  const [fee, setFee] = useState(user?.fees ?? 0);
  const [experience, setExperience] = useState(user?.experience || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState({ appointments: true, reminders: true, product: false });

  const showMessage = (text) => {
    setError("");
    setMessage(text);
  };

  const saveConsultation = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateProfile({ fees: Number(fee), experience });
      showMessage("Consultation settings saved.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save consultation settings.");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = async (day) => {
    const previous = availability;
    const next = previous.includes(day)
      ? previous.filter((item) => item !== day)
      : [...previous, day];
    setAvailability(next);
    setError("");
    setMessage("");
    try {
      await updateProfile({ availability: next });
      showMessage("Availability updated.");
    } catch (requestError) {
      setAvailability(previous);
      setError(requestError.response?.data?.message || "Unable to update availability.");
    }
  };

  const activeSetting = settingsSections.find((section) => section.id === activeSection);
  const ActiveSettingIcon = activeSetting?.icon;

  return (
    <div className="doctor-page-content doctor-settings-page">
      <div className="doctor-profile-page-heading">
        <div>
          <p className="doctor-portal-eyebrow">PREFERENCES &amp; ACCOUNT</p>
          <h1>Settings</h1>
          <p>Manage your professional workspace and account preferences.</p>
        </div>
        <span className="doctor-settings-account-chip"><span /> Doctor workspace</span>
      </div>

      {error && <p className="doctor-form-alert" role="alert">{error}</p>}
      {message && <p className="doctor-form-success" role="status"><Check size={15} /> {message}</p>}

      <div className="doctor-settings-layout">
        <nav className="doctor-settings-nav doctor-portal-card" aria-label="Settings sections">
          <p className="doctor-settings-nav-label">ACCOUNT SETTINGS</p>
          {settingsSections.map(({ id, label, description, icon: Icon }) => (
            <button
              type="button"
              className={`doctor-settings-nav-item${activeSection === id ? " active" : ""}`}
              key={id}
              onClick={() => { setActiveSection(id); setError(""); setMessage(""); }}
            >
              <span className="doctor-settings-nav-icon"><Icon size={17} /></span>
              <span className="doctor-settings-nav-copy"><strong>{label}</strong><small>{description}</small></span>
              <ChevronRight className="doctor-settings-nav-arrow" size={15} />
            </button>
          ))}
          <LogoutButton className="doctor-settings-logout">Log out</LogoutButton>
        </nav>

        <section className="doctor-settings-panel doctor-portal-card">
          <div className="doctor-settings-panel-heading">
            <span className="doctor-settings-panel-icon">{ActiveSettingIcon && <ActiveSettingIcon size={18} />}</span>
            <div><p className="doctor-portal-eyebrow">SETTINGS</p><h2>{activeSetting?.label}</h2><p>{activeSetting?.description}</p></div>
          </div>

          {activeSection === "profile" && (
            <div className="doctor-settings-section">
              <div className="doctor-settings-profile-preview">
                <span className="doctor-portal-avatar large">
                  {user?.image ? <img src={user.image} alt="" /> : user?.name?.charAt(0)?.toUpperCase()}
                </span>
                <span><strong>Dr. {user?.name || "Doctor"}</strong><small>{user?.speciality || "Speciality not added"} · {user?.email}</small></span>
              </div>
              <p className="doctor-settings-description">Your profile helps patients understand your experience and practice. Keep your details complete and up to date.</p>
              <Link to="/my-profile" className="doctor-primary-button">Edit professional profile <ChevronRight size={15} /></Link>
            </div>
          )}

          {activeSection === "security" && (
            <div className="doctor-settings-section">
              <div className="doctor-settings-info-box"><KeyRound size={19} /><div><strong>Secure account access</strong><p>Your account is protected by authenticated access. Password changes are not currently available through the connected account API.</p></div></div>
              <div className="doctor-settings-data-row"><span>Signed-in email</span><strong>{user?.email || "—"}</strong></div>
              <div className="doctor-settings-data-row"><span>Account type</span><strong>Doctor</strong></div>
              <p className="doctor-settings-description">For account access assistance, contact <a href="mailto:support@medicare.com">support@medicare.com</a>.</p>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="doctor-settings-section">
              <p className="doctor-settings-description">Choose which updates you want to receive in this workspace.</p>
              {[
                ["appointments", "Appointment updates", "New bookings, confirmations, and cancellations."],
                ["reminders", "Schedule reminders", "Reminders about upcoming appointments."],
                ["product", "Product announcements", "Occasional updates about workspace improvements."],
              ].map(([key, title, description]) => (
                <label className="doctor-settings-toggle-row" key={key}>
                  <span><strong>{title}</strong><small>{description}</small></span>
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={() => setNotifications((current) => ({ ...current, [key]: !current[key] }))}
                  />
                </label>
              ))}
              <p className="doctor-settings-note">These switches are a local UI preview only; notification delivery is not configured in the current API.</p>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="doctor-settings-section">
              <p className="doctor-settings-description">The doctor workspace uses a premium dark appearance.</p>
              <div className="doctor-appearance-options">
                <div className="doctor-appearance-option selected">
                  <Moon size={19} /><span><strong>Dark workspace</strong><small>Active across the doctor portal</small></span>
                  <span className="doctor-appearance-radio" />
                </div>
              </div>
              <p className="doctor-settings-note">Light and system themes are not configured for the doctor portal.</p>
            </div>
          )}

          {activeSection === "availability" && (
            <div className="doctor-settings-section">
              <p className="doctor-settings-description">Select the days you are available to see patients. Changes update your doctor profile immediately.</p>
              <div className="doctor-settings-weekdays">
                {weekdays.map((day) => (
                  <label className={`doctor-settings-day${availability.includes(day) ? " selected" : ""}`} key={day}>
                    <input type="checkbox" checked={availability.includes(day)} onChange={() => toggleDay(day)} />
                    <span>{availability.includes(day) ? <Check size={14} /> : null}</span>{day}
                  </label>
                ))}
              </div>
              <p className="doctor-settings-note">Available on {availability.length} of 7 days. Specific appointment time slots are not configured in the current scheduling API.</p>
            </div>
          )}

          {activeSection === "consultation" && (
            <form className="doctor-settings-section" onSubmit={saveConsultation}>
              <p className="doctor-settings-description">Keep the consultation details displayed on your doctor profile current.</p>
              <label className="doctor-form-field"><span>Consultation fee (INR)</span><input type="number" min="0" step="1" value={fee} onChange={(event) => setFee(event.target.value)} /></label>
              <label className="doctor-form-field"><span>Professional experience</span><input value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="e.g. 8 years" /></label>
              <div className="doctor-settings-info-box"><CircleDollarSign size={19} /><div><strong>Fees are shown as profile information</strong><p>Payment collection and payout management are not connected to the current backend.</p></div></div>
              <button type="submit" className="doctor-primary-button" disabled={saving}><Save size={15} />{saving ? "Saving…" : "Save consultation settings"}</button>
            </form>
          )}

          {activeSection === "payments" && (
            <div className="doctor-settings-section">
              <div className="doctor-settings-info-box"><CreditCard size={19} /><div><strong>Payment processing not connected</strong><p>This workspace does not currently have a payment or payout provider configured.</p></div></div>
              <div className="doctor-settings-data-row"><span>Consultation fee</span><strong>{user?.fees ? `₹${Number(user.fees).toLocaleString("en-IN")}` : "Not set"}</strong></div>
              <p className="doctor-settings-note">Dashboard revenue is an estimate based on completed appointments multiplied by your consultation fee. It is not a payment or payout balance.</p>
              <Link to="/doctor-payments" className="doctor-primary-button">View demo payment history <ChevronRight size={15} /></Link>
            </div>
          )}

          {activeSection === "help" && (
            <div className="doctor-settings-section">
              <div className="doctor-settings-info-box"><HelpCircle size={19} /><div><strong>How can we help?</strong><p>Our care support team can help with account access and workspace questions.</p></div></div>
              <a className="doctor-primary-button" href="mailto:support@medicare.com">Contact support <ChevronRight size={15} /></a>
              <p className="doctor-settings-note">For urgent clinical concerns, follow your organization&apos;s established care and escalation procedures.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DoctorSettings;
