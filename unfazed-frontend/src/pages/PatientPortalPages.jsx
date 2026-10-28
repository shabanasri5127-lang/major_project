import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MessageSquareText,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { usePatientPortal } from "../context/usePatientPortal";
import api from "../services/api";
import { DEMO_DOCTORS } from "../data/demoData";
import DoctorCard from "../components/DoctorCard";
import { Stethoscope } from "lucide-react";

const readReviews = (storageKey) => {
  try {
    const reviews = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(reviews) ? reviews : [];
  } catch {
    return [];
  }
};

export const PatientFavorites = () => {
  const { favorites } = usePatientPortal();
  return (
    <main className="patient-portal-page patient-extra-page">
      <header className="patient-extra-heading">
        <span className="patient-extra-eyebrow"><Heart size={15} /> YOUR CARE TEAM</span>
        <h1>Favorite doctors</h1>
        <p>Keep the doctors you’re interested in close at hand.</p>
      </header>
      {favorites.length ? (
        <div className="patient-extra-doctor-grid">
          {favorites.map((doctor) => <DoctorCard doctor={doctor} isDemo={String(doctor._id).startsWith("demo-")} key={doctor._id} />)}
        </div>
      ) : (
        <section className="patient-extra-empty">
          <span><Heart size={23} /></span>
          <h2>Your saved doctors will appear here</h2>
          <p>Browse the directory and select the heart on a doctor profile to save it.</p>
          <Link to="/doctors" className="button-primary">Explore doctors</Link>
        </section>
      )}
    </main>
  );
};

export const PatientReviews = () => {
  const { user } = useAuth();
  const reviewStorageKey = `patient-review-notes:${user?.id || user?.email || "account"}`;
  const { notify } = usePatientPortal();
  const [reviews, setReviews] = useState(() => readReviews(reviewStorageKey));
  const [rating, setRating] = useState(5);
  const [doctor, setDoctor] = useState("");
  const [message, setMessage] = useState("");

  const submitReview = (event) => {
    event.preventDefault();
    const review = { id: `${Date.now()}`, doctor: doctor.trim(), message: message.trim(), rating, date: new Date().toISOString() };
    const updated = [review, ...reviews];
    localStorage.setItem(reviewStorageKey, JSON.stringify(updated));
    setReviews(updated);
    setDoctor("");
    setMessage("");
    setRating(5);
    notify("Your private review note was saved on this device.");
  };

  const removeReview = (id) => {
    const updated = reviews.filter((review) => review.id !== id);
    localStorage.setItem(reviewStorageKey, JSON.stringify(updated));
    setReviews(updated);
    notify("Review note removed.");
  };

  return (
    <main className="patient-portal-page patient-extra-page">
      <header className="patient-extra-heading">
        <span className="patient-extra-eyebrow"><Star size={15} /> YOUR EXPERIENCE</span>
        <h1>Reviews</h1>
        <p>Save personal feedback notes about your care. Notes stay in this browser and are not sent to doctors.</p>
      </header>
      <div className="patient-extra-two-column">
        <form className="patient-extra-panel patient-review-form" onSubmit={submitReview}>
          <h2>Write a private note</h2>
          <label>Doctor or clinic
            <input value={doctor} onChange={(event) => setDoctor(event.target.value)} placeholder="e.g. Dr. Ananya Mehta" required />
          </label>
          <fieldset>
            <legend>Your rating</legend>
            <div className="patient-review-stars" role="group" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button type="button" key={value} aria-label={`${value} star${value === 1 ? "" : "s"}`} aria-pressed={rating === value} onClick={() => setRating(value)}>
                  <Star size={21} fill={value <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </fieldset>
          <label>Your note
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like to remember about your visit?" rows={5} required />
          </label>
          <button type="submit" className="button-primary"><MessageSquareText size={16} /> Save note</button>
          <p className="patient-extra-caption">Private note only · not published or shared.</p>
        </form>
        <section className="patient-extra-panel">
          <h2>Your saved notes</h2>
          {reviews.length ? (
            <div className="patient-saved-reviews">
              {reviews.map((review) => (
                <article className="patient-saved-review" key={review.id}>
                  <div className="patient-saved-review-heading"><span><strong>{review.doctor}</strong><small>{new Date(review.date).toLocaleDateString()}</small></span><button type="button" aria-label={`Remove note about ${review.doctor}`} onClick={() => removeReview(review.id)}><Trash2 size={15} /></button></div>
                  <div className="patient-review-rating" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill={index < review.rating ? "currentColor" : "none"} />)}</div>
                  <p>{review.message}</p>
                </article>
              ))}
            </div>
          ) : <p className="patient-extra-muted">Your private care notes will appear here.</p>}
        </section>
      </div>
    </main>
  );
};

export const PatientNotifications = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/appointments")
      .then(({ data }) => { if (active) setAppointments(data.appointments); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Unable to load appointment updates."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const updates = useMemo(() => appointments
    .slice()
    .sort((first, second) => `${second.date} ${second.time}`.localeCompare(`${first.date} ${first.time}`))
    .map((appointment) => ({
      id: appointment._id,
      icon: appointment.status === "confirmed" ? CheckCircle2 : appointment.status === "scheduled" ? Clock3 : CalendarDays,
      title: appointment.status === "confirmed" ? "Appointment confirmed" : appointment.status === "scheduled" ? "Appointment request received" : `Appointment ${appointment.status}`,
      detail: `${appointment.doctor?.name || "Your doctor"} · ${new Date(`${appointment.date}T${appointment.time}`).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`,
    })), [appointments]);

  return (
    <main className="patient-portal-page patient-extra-page">
      <header className="patient-extra-heading">
        <span className="patient-extra-eyebrow"><Bell size={15} /> CARE UPDATES</span>
        <h1>Notifications</h1>
        <p>Appointment updates from your connected care team.</p>
      </header>
      <section className="patient-extra-panel">
        {loading ? (
          <div className="patient-notification-skeletons" role="status" aria-label="Loading notifications">{[1, 2, 3].map((item) => <span key={item} />)}</div>
        ) : error ? (
          <p className="patient-extra-error" role="alert">{error}</p>
        ) : updates.length ? (
          <div className="patient-notifications-list">{updates.map(({ id, icon: Icon, title, detail }) => <article key={id}><span><Icon size={17} /></span><div><strong>{title}</strong><small>{detail}</small></div></article>)}</div>
        ) : (
          <div className="patient-extra-empty compact"><span><Bell size={21} /></span><h2>You’re all caught up</h2><p>Appointment activity will appear here.</p><Link to="/doctors" className="button-primary">Find a doctor</Link></div>
        )}
      </section>
    </main>
  );
};

export const PatientSettings = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("patient-portal-theme") || "light");
  const { notify } = usePatientPortal();
  const setThemePreference = (nextTheme) => {
    localStorage.setItem("patient-portal-theme", nextTheme);
    setTheme(nextTheme);
    notify(`Appearance set to ${nextTheme} mode.`);
  };

  return (
    <main className="patient-portal-page patient-extra-page">
      <header className="patient-extra-heading">
        <span className="patient-extra-eyebrow"><Settings size={15} /> PERSONALIZE YOUR SPACE</span>
        <h1>Settings</h1>
        <p>Manage your account shortcuts and patient portal appearance.</p>
      </header>
      <div className="patient-settings-grid">
        <section className="patient-extra-panel patient-settings-card">
          <span className="patient-settings-icon"><UserRound size={19} /></span>
          <div><h2>Profile</h2><p>Keep your personal details up to date.</p><strong>{user?.name || "Patient"}</strong><small>{user?.email}</small></div>
          <Link to="/my-profile" className="patient-settings-link">Manage profile</Link>
        </section>
        <section className="patient-extra-panel patient-settings-card">
          <span className="patient-settings-icon"><ShieldCheck size={19} /></span>
          <div><h2>Privacy &amp; security</h2><p>Your account uses the existing secure sign-in session.</p><strong>Session protected</strong><small>Sign out any time from the navigation.</small></div>
          <Link to="/my-profile" className="patient-settings-link">Review account</Link>
        </section>
        <section className="patient-extra-panel patient-settings-card patient-settings-appearance">
          <span className="patient-settings-icon"><Settings size={19} /></span>
          <div><h2>Appearance</h2><p>Choose how your portal looks on this device.</p></div>
          <div className="patient-settings-theme-options">
            {["light", "dark", "system"].map((option) => <button key={option} type="button" className={theme === option ? "selected" : ""} aria-pressed={theme === option} onClick={() => setThemePreference(option)}>{option.charAt(0).toUpperCase() + option.slice(1)}</button>)}
          </div>
        </section>
      </div>
      <p className="patient-settings-note"><ShieldCheck size={15} /> Demo features are clearly identified and do not modify your medical records or send review notes.</p>
    </main>
  );
};

export const PatientDoctorFavoritesDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { notify } = usePatientPortal();
  const query = new URLSearchParams(window.location.search);
  const search = query.get("search")?.trim().toLowerCase() || "";

  useEffect(() => {
    let active = true;
    api.get("/users/doctors")
      .then(({ data }) => { if (active) setDoctors(data.doctors); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Unable to load doctors."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const isDemo = !loading && doctors.length === 0;
  const directory = isDemo ? DEMO_DOCTORS : doctors;
  const visibleDoctors = directory.filter((doctor) => !search || `${doctor.name} ${doctor.speciality}`.toLowerCase().includes(search));

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("book") === "1") {
      notify("Choose a doctor to book your appointment.");
    }
  }, [notify]);

  return (
    <main className="patient-portal-page patient-extra-page">
      <header className="patient-extra-heading">
        <span className="patient-extra-eyebrow"><Stethoscope size={15} /> YOUR CARE TEAM</span>
        <h1>{search ? "Doctor search" : "Find your doctor"}</h1>
        <p>Explore available specialists and save doctors you’d like to revisit.</p>
      </header>
      {isDemo && <p className="patient-directory-demo"><ShieldCheck size={15} /> Sample doctor profiles · booking remains unavailable for these examples.</p>}
      {loading ? <div className="patient-doctor-skeletons" role="status" aria-label="Loading doctors">{[1, 2, 3].map((item) => <span key={item} />)}</div>
        : error ? <p className="patient-extra-error" role="alert">{error}</p>
          : visibleDoctors.length ? <div className="patient-extra-doctor-grid">{visibleDoctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} isDemo={isDemo} />)}</div>
            : <section className="patient-extra-empty"><h2>No doctors found</h2><p>Try a different name or specialty.</p><Link to="/doctors" className="button-primary">Browse all doctors</Link></section>}
    </main>
  );
};
