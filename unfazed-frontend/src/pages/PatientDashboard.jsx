import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardPlus,
  Clock3,
  FileHeart,
  HeartPulse,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import { DEMO_DOCTORS, DEMO_MEDICAL_RECORDS, DEMO_PATIENT_APPOINTMENTS } from "../data/demoData";
import "./PatientDashboard.css";

const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseDate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const formatDate = (value, options = { month: "short", day: "numeric" }) => {
  const date = parseDate(value);
  return date ? date.toLocaleDateString("en-US", options) : "Date unavailable";
};
const getInitials = (name = "") => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState("");
  const [doctorsError, setDoctorsError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    let active = true;
    api.get("/appointments")
      .then(({ data }) => {
        if (active) setAppointments(data.appointments);
      })
      .catch((error) => {
        if (active) setAppointmentsError(error.response?.data?.message || "Unable to load your appointments.");
      })
      .finally(() => {
        if (active) setAppointmentsLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/users/doctors")
      .then(({ data }) => {
        if (active) setDoctors(data.doctors);
      })
      .catch((error) => {
        if (active) setDoctorsError(error.response?.data?.message || "Unable to load doctor recommendations.");
      })
      .finally(() => {
        if (active) setDoctorsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const todayKey = dateKey(new Date());
  const isDemoData = !appointmentsLoading && appointments.length === 0;
  const dashboardAppointments = isDemoData ? DEMO_PATIENT_APPOINTMENTS : appointments;
  const displayedDoctors = !doctorsLoading && doctors.length === 0 ? DEMO_DOCTORS : doctors;
  const usingDemoDoctors = !doctorsLoading && doctors.length === 0;
  const upcomingAppointments = useMemo(() => dashboardAppointments
    .filter((appointment) => appointment.date >= todayKey && ["scheduled", "confirmed"].includes(appointment.status))
    .sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`)), [dashboardAppointments, todayKey]);
  const historyAppointments = useMemo(() => dashboardAppointments
    .filter((appointment) => appointment.date < todayKey || ["completed", "cancelled"].includes(appointment.status))
    .sort((first, second) => `${second.date} ${second.time}`.localeCompare(`${first.date} ${first.time}`)), [dashboardAppointments, todayKey]);
  const appointmentsByDate = useMemo(() => dashboardAppointments.reduce((result, appointment) => {
    if (appointment.date && appointment.status !== "cancelled") {
      result[appointment.date] = (result[appointment.date] || 0) + 1;
    }
    return result;
  }, {}), [dashboardAppointments]);

  const calendarDays = useMemo(() => {
    const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [calendarMonth]);

  const notifications = upcomingAppointments.filter((appointment) => appointment.status === "scheduled").slice(0, 2);
  const metrics = [
    { label: "Total appointments", value: dashboardAppointments.length, icon: CalendarDays, color: "blue", note: "All your visits" },
    { label: "Upcoming visits", value: upcomingAppointments.length, icon: Clock3, color: "teal", note: "Scheduled or confirmed" },
    { label: "Completed visits", value: dashboardAppointments.filter((appointment) => appointment.status === "completed").length, icon: CheckCircle2, color: "green", note: "Your care history" },
    { label: "Doctors available", value: displayedDoctors.length, icon: UsersRound, color: "violet", note: "Browse the doctor directory" },
  ];

  return (
    <main className="patient-dashboard">
      <section className="patient-welcome">
        <div className="patient-welcome-copy">
          <span className="patient-eyebrow"><HeartPulse size={15} /> YOUR HEALTH, IN GOOD HANDS</span>
          <h1>Welcome back, {user?.name || "there"}</h1>
          <p>Stay connected to your care team and keep your health journey on track.</p>
          <div className="patient-welcome-actions">
            <Link to="/doctors" className="patient-primary-button"><Search size={16} /> Find a doctor</Link>
            <Link to="/my-appointments" className="patient-quiet-link">View appointments <ArrowRight size={15} /></Link>
          </div>
        </div>
        <div className="patient-welcome-art" aria-hidden="true">
          <span className="patient-art-orbit orbit-one" />
          <span className="patient-art-orbit orbit-two" />
          <span className="patient-art-center"><HeartPulse size={47} /></span>
          <span className="patient-art-plus">+</span>
        </div>
      </section>
      {(isDemoData || usingDemoDoctors) && (
        <p className="patient-demo-banner"><ShieldCheck size={15} /> Presentation preview · fictional sample data · no appointments, records, or payments were created.</p>
      )}

      <section className="patient-metric-grid" aria-label="Your care overview">
        {metrics.map(({ label, value, icon: Icon, color, note }, index) => (
          <motion.article
            className={`patient-metric-card metric-${color}`}
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.38, ease: "easeOut" }}
            whileHover={{ y: -5, scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
          >
            <span className="patient-metric-icon"><Icon size={19} /></span>
            <div className="patient-metric-value">{appointmentsLoading && index < 3 ? "—" : doctorsLoading && index === 3 ? "—" : value}</div>
            <div className="patient-metric-label">{label}</div>
            <div className="patient-metric-note">{note}</div>
          </motion.article>
        ))}
      </section>

      {appointmentsError && <p className="patient-dashboard-alert" role="alert">{appointmentsError}</p>}
      {doctorsError && <p className="patient-dashboard-alert" role="alert">{doctorsError}</p>}

      <div className="patient-dashboard-grid">
        <section className="patient-section-card patient-upcoming-card">
          <div className="patient-section-heading">
            <div><span className="patient-section-kicker">YOUR CARE SCHEDULE</span><h2>Upcoming appointments</h2></div>
            <Link to="/my-appointments" className="patient-section-link">See all <ArrowRight size={15} /></Link>
          </div>
          {appointmentsLoading ? <p className="patient-empty-state">Loading your care schedule…</p> : upcomingAppointments.length ? (
            <div className="patient-appointment-list">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <article className="patient-appointment-row" key={appointment._id}>
                  <div className="patient-appointment-date">
                    <strong>{formatDate(appointment.date, { day: "2-digit" })}</strong>
                    <span>{formatDate(appointment.date, { month: "short" })}</span>
                  </div>
                  <div className="patient-doctor-avatar">{getInitials(appointment.doctor?.name || "Doctor")}</div>
                  <div className="patient-appointment-copy">
                    <strong>{appointment.doctor?.name || "Doctor"}</strong>
                    <span>{appointment.doctor?.speciality || "Healthcare provider"}</span>
                  </div>
                  <div className="patient-appointment-time"><Clock3 size={14} /> {appointment.time}</div>
                  <span className={`patient-status status-${appointment.status}`}>{appointment.status}</span>
                </article>
              ))}
            </div>
          ) : (
            <div className="patient-empty-state patient-empty-action">
              <CalendarDays size={23} />
              <span>No upcoming appointments yet.</span>
              <Link to="/doctors">Find a doctor to get started <ArrowRight size={14} /></Link>
            </div>
          )}
        </section>

        <section className="patient-section-card patient-calendar-card">
          <div className="patient-section-heading">
            <div><span className="patient-section-kicker">PLAN AHEAD</span><h2>Care calendar</h2></div>
            <div className="patient-calendar-controls">
              <button type="button" aria-label="Previous month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={16} /></button>
              <button type="button" aria-label="Next month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={16} /></button>
            </div>
          </div>
          <p className="patient-calendar-month">{calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          <div className="patient-calendar-grid">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span className="patient-calendar-weekday" key={`${day}-${index}`}>{day}</span>)}
            {calendarDays.map((date) => {
              const dateString = dateKey(date);
              return (
                <span className={`patient-calendar-day${date.getMonth() !== calendarMonth.getMonth() ? " outside-month" : ""}${dateString === todayKey ? " is-today" : ""}`} key={dateString}>
                  {date.getDate()}
                  {appointmentsByDate[dateString] > 0 && <i aria-label={`${appointmentsByDate[dateString]} appointment${appointmentsByDate[dateString] === 1 ? "" : "s"}`} />}
                </span>
              );
            })}
          </div>
          <div className="patient-calendar-legend"><i /> Appointment scheduled</div>
        </section>

        <section className="patient-section-card patient-history-card">
          <div className="patient-section-heading">
            <div><span className="patient-section-kicker">YOUR JOURNEY</span><h2>Appointment history</h2></div>
            <Link to="/my-appointments" className="patient-section-link">Full history <ArrowRight size={15} /></Link>
          </div>
          {appointmentsLoading ? <p className="patient-empty-state">Loading appointment history…</p> : historyAppointments.length ? (
            <div className="patient-history-list">
              {historyAppointments.slice(0, 4).map((appointment) => (
                <div className="patient-history-row" key={appointment._id}>
                  <span className="patient-history-icon"><Stethoscope size={16} /></span>
                  <span className="patient-history-copy"><strong>{appointment.doctor?.name || "Doctor"}</strong><small>{appointment.doctor?.speciality || "Healthcare provider"} · {formatDate(appointment.date, { month: "short", day: "numeric", year: "numeric" })}</small></span>
                  <span className={`patient-status status-${appointment.status}`}>{appointment.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="patient-empty-state">Completed and past appointments will appear here.</p>}
        </section>

        <section className="patient-section-card patient-notifications-card">
          <div className="patient-section-heading">
            <div><span className="patient-section-kicker">STAY INFORMED</span><h2>Notifications</h2></div>
            <span className="patient-notification-icon"><Bell size={17} /></span>
          </div>
          {appointmentsLoading ? <p className="patient-empty-state">Checking for updates…</p> : notifications.length ? (
            <div className="patient-notification-list">
              {notifications.map((appointment) => (
                <div className="patient-notification-row" key={appointment._id}>
                  <span className="patient-notification-dot" />
                  <span><strong>Appointment awaiting confirmation</strong><small>{appointment.doctor?.name || "Your doctor"} · {formatDate(appointment.date)} at {appointment.time}</small></span>
                </div>
              ))}
            </div>
          ) : <div className="patient-notification-clear"><ShieldCheck size={19} /><span><strong>You’re all caught up</strong><small>Appointment updates will appear here.</small></span></div>}
        </section>

        <section className="patient-section-card patient-recommendations-card">
          <div className="patient-section-heading">
            <div><span className="patient-section-kicker">YOUR CARE TEAM</span><h2>Doctors to explore</h2></div>
            <Link to="/doctors" className="patient-section-link">Browse all <ArrowRight size={15} /></Link>
          </div>
          {doctorsLoading ? <p className="patient-empty-state">Finding available doctors…</p> : displayedDoctors.length ? (
            <div className="patient-doctor-grid">
              {displayedDoctors.slice(0, 3).map((doctor) => (
                <article className="patient-doctor-card" key={doctor._id}>
                  <div className="patient-recommended-avatar">{doctor.image ? <img src={doctor.image} alt="" /> : getInitials(doctor.name || "Doctor")}</div>
                  <div className="patient-recommended-copy"><strong>{doctor.name || "Doctor"}</strong><span>{doctor.speciality || "Healthcare provider"}</span></div>
                  {doctor.address?.line1 && <span className="patient-doctor-location"><MapPin size={12} /> {doctor.address.line1}</span>}
                  <Link to="/doctors" aria-label={`Explore ${doctor.name || "doctor"} in the doctor directory`}>Explore doctor <ArrowRight size={14} /></Link>
                </article>
              ))}
            </div>
          ) : <p className="patient-empty-state">No doctors are listed right now. Please check back soon.</p>}
        </section>

        <section className="patient-section-card patient-records-panel">
          <div className="patient-section-heading">
            <div><span className="patient-section-kicker">HEALTH INFORMATION</span><h2>Medical records</h2></div>
            <span className="patient-records-status"><ClipboardPlus size={14} /> {isDemoData ? "Sample records" : "Not connected"}</span>
          </div>
          {isDemoData ? (
            <div className="patient-record-list">
              {DEMO_MEDICAL_RECORDS.map((record) => (
                <article className="patient-record-row" key={record.id}>
                  <span className="patient-record-icon"><FileHeart size={16} /></span>
                  <span><strong>{record.title}</strong><small>{record.detail}</small></span>
                  <time>{formatDate(record.date, { month: "short", day: "numeric" })}</time>
                </article>
              ))}
            </div>
          ) : (
            <div className="patient-records-copy">
              <p>Medical record storage is not connected to this account. No real documents are available in this portal.</p>
              <Link to="/my-profile" aria-label="View your patient profile"><UserRound size={15} /> View profile</Link>
            </div>
          )}
        </section>

        <section className="patient-profile-strip">
          <span className="patient-profile-strip-icon"><UserRound size={18} /></span>
          <span><strong>Your patient profile</strong><small>{user?.email || "Keep your details up to date"}</small></span>
          <Link to="/my-profile">View profile <ArrowRight size={14} /></Link>
        </section>
      </div>
    </main>
  );
};

export default PatientDashboard;
