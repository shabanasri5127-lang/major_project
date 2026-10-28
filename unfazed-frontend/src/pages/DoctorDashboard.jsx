import { useCallback, useEffect, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FilePlus2,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Sparkles,
  Star,
  UserRoundPen,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import { DEMO_APPOINTMENTS } from "../data/demoData";
import "./DoctorDashboard.css";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (dateString, options = { month: "short", day: "numeric", year: "numeric" }) => (
  dateString ? parseDate(dateString).toLocaleDateString("en-US", options) : "Date unavailable"
);

const initials = (name = "") => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join("")
  .toUpperCase();

const AnimatedMetric = ({ value, loading, prefix = "", suffix = "", formatted = false }) => {
  const count = useMotionValue(0);
  const display = useTransform(count, (current) => {
    const rounded = Math.round(current);
    return formatted ? rounded.toLocaleString("en-IN") : String(rounded);
  });

  useEffect(() => {
    if (typeof value !== "number") return undefined;
    const animation = animate(count, value, { duration: .65, ease: "easeOut" });
    return animation.stop;
  }, [count, value]);

  if (loading) return <span className="doctor-metric-skeleton" aria-label="Loading metric" />;
  if (typeof value !== "number") return <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{value}</motion.span>;

  return (
    <span>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix && <small className="doctor-stat-suffix">{suffix}</small>}
    </span>
  );
};

const AnalyticsLine = ({ data, valueKey, color, label }) => {
  const maxValue = Math.max(...data.map((point) => point[valueKey]), 1);
  const points = data.map((point, index) => ({
    x: 8 + (index * 344) / Math.max(data.length - 1, 1),
    y: 96 - (point[valueKey] / maxValue) * 72,
  }));
  const linePath = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L 352 105 L 8 105 Z`;

  return (
    <div className="doctor-line-chart" role="img" aria-label={label}>
      <svg viewBox="0 0 360 112" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`fill-${valueKey}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".24" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[24, 48, 72, 96].map((y) => <line key={y} x1="0" x2="360" y1={y} y2={y} className="doctor-chart-gridline" />)}
        <motion.path d={areaPath} fill={`url(#fill-${valueKey})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6 }} />
        <motion.path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .9, ease: "easeOut" }} />
        {points.map((point, index) => (
          <motion.circle key={index} cx={point.x} cy={point.y} r="3" fill="#0b1220" stroke={color} strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .15 + index * .07 }} />
        ))}
      </svg>
      <div className="doctor-line-chart-labels">{data.map((point) => <span key={point.label}>{point.label}</span>)}</div>
    </div>
  );
};

const DoctorDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState(user?.availability || []);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });

  const loadAppointments = useCallback(async () => {
    try {
      const { data } = await api.get("/appointments");
      setAppointments(data.appointments);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/appointments")
      .then(({ data }) => {
        if (active) setAppointments(data.appointments);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || "Unable to load appointments.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const isDemoData = !loading && appointments.length === 0;
  const dashboardAppointments = isDemoData ? DEMO_APPOINTMENTS : appointments;
  const todaysAppointments = dashboardAppointments.filter(
    (appointment) => appointment.date === todayString && appointment.status !== "cancelled",
  );
  const pendingAppointments = dashboardAppointments.filter((appointment) => appointment.status === "scheduled");
  const completedAppointments = dashboardAppointments.filter((appointment) => appointment.status === "completed");
  const cancelledAppointments = dashboardAppointments.filter((appointment) => appointment.status === "cancelled");
  const upcomingAppointments = dashboardAppointments.filter(
    (appointment) => appointment.date >= todayString && appointment.status !== "cancelled",
  );
  const filteredAppointments = dashboardAppointments.filter((appointment) => {
    if (!searchQuery) return true;
    return [
      appointment.patient?.name,
      appointment.patient?.email,
      appointment.status,
      appointment.date,
      appointment.time,
    ].some((value) => String(value || "").toLowerCase().includes(searchQuery));
  });

  const patientRecords = useMemo(() => {
    const records = new Map();
    dashboardAppointments.forEach((appointment) => {
      const patient = appointment.patient;
      if (!patient?._id) return;
      const current = records.get(patient._id);
      const nextAppointment = !current || appointment.date > current.lastVisit
        ? appointment.date
        : current.lastVisit;
      records.set(patient._id, {
        ...patient,
        appointmentCount: (current?.appointmentCount || 0) + 1,
        lastVisit: nextAppointment,
      });
    });
    return [...records.values()].sort((first, second) => first.name.localeCompare(second.name));
  }, [dashboardAppointments]);

  const calendarDays = useMemo(() => {
    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const firstMondayOffset = (monthStart.getDay() + 6) % 7;
    const startDate = new Date(monthStart);
    startDate.setDate(monthStart.getDate() - firstMondayOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return {
        date,
        dateString,
        inMonth: date.getMonth() === calendarMonth.getMonth(),
        hasAppointments: upcomingAppointments.some((appointment) => appointment.date === dateString),
      };
    });
  }, [calendarMonth, upcomingAppointments]);

  const selectedDayAppointments = upcomingAppointments.filter((appointment) => (
    appointment.date === [
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, "0"),
      String(selectedDate.getDate()).padStart(2, "0"),
    ].join("-")
  ));

  const activityDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: dashboardAppointments.filter((appointment) => appointment.date === dateString).length,
      };
    });
  }, [dashboardAppointments]);
  const monthlyAnalytics = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const month = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const monthAppointments = dashboardAppointments.filter((appointment) => {
        const appointmentDate = parseDate(appointment.date);
        return appointmentDate.getFullYear() === month.getFullYear()
          && appointmentDate.getMonth() === month.getMonth();
      });
      return {
        label: month.toLocaleDateString("en-US", { month: "short" }),
        patients: new Set(monthAppointments.map((appointment) => appointment.patient?._id).filter(Boolean)).size,
        revenue: monthAppointments.filter((appointment) => appointment.status === "completed").length
          * Number(user?.fees || 0),
      };
    });
  }, [dashboardAppointments, user?.fees]);
  const patientGrowth = monthlyAnalytics[monthlyAnalytics.length - 1].patients
    - monthlyAnalytics[monthlyAnalytics.length - 2].patients;
  const maxActivity = Math.max(...activityDays.map((day) => day.count), 1);
  const statusTotals = [
    { label: "Confirmed", count: dashboardAppointments.filter((item) => item.status === "confirmed").length, className: "confirmed", color: "#22d3ee" },
    { label: "Pending", count: pendingAppointments.length, className: "pending", color: "#f59e0b" },
    { label: "Completed", count: completedAppointments.length, className: "completed", color: "#34d399" },
    { label: "Cancelled", count: cancelledAppointments.length, className: "cancelled", color: "#fb7185" },
  ];
  const statusTotal = statusTotals.reduce((total, item) => total + item.count, 0);
  const statusStops = statusTotals.reduce((state, item) => {
    const start = state.offset;
    const end = start + (statusTotal ? item.count / statusTotal : 0) * 100;
    state.stops.push(`${item.color} ${start}% ${end}%`);
    state.offset = end;
    return state;
  }, { offset: 0, stops: [] }).stops.join(", ");
  const estimatedRevenue = completedAppointments.length * Number(user?.fees || 0);
  const toggleAvailability = async (day) => {
    const previousAvailability = availability;
    const nextAvailability = previousAvailability.includes(day)
      ? previousAvailability.filter((item) => item !== day)
      : [...previousAvailability, day];
    setAvailability(nextAvailability);
    try {
      await updateProfile({ availability: nextAvailability });
    } catch (requestError) {
      setAvailability(previousAvailability);
      setError(requestError.response?.data?.message || "Unable to update availability.");
    }
  };

  const setAppointmentStatus = async (id, status) => {
    setUpdatingAppointmentId(id);
    try {
      await api.patch(`/appointments/${id}`, { status });
      await loadAppointments();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update appointment.");
    } finally {
      setUpdatingAppointmentId("");
    }
  };

  const moveCalendar = (monthOffset) => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + monthOffset, 1));
  };

  const statCards = [
    {
      label: "Total patients",
      value: patientRecords.length,
      note: "Across your practice",
      icon: UsersRound,
      className: "patients",
    },
    {
      label: "Today's appointments",
      value: todaysAppointments.length,
      note: "Active appointments today",
      icon: CalendarDays,
      className: "today",
    },
    {
      label: "Pending appointments",
      value: pendingAppointments.length,
      note: "Awaiting confirmation",
      icon: Clock3,
      className: "pending",
    },
    {
      label: "Completed appointments",
      value: completedAppointments.length,
      note: "Successfully completed",
      icon: CheckCircle2,
      className: "completed",
    },
    {
      label: "Cancelled appointments",
      value: cancelledAppointments.length,
      note: "Cancelled visits",
      icon: X,
      className: "cancelled",
    },
    {
      label: "Available slots",
      value: isDemoData ? 4 : availability.length,
      note: isDemoData ? "Sample clinic days · demo only" : "Clinic days configured · no timed slots",
      icon: Clock3,
      className: "available",
      suffix: "/ 7 days",
    },
    {
      label: "Revenue",
      value: estimatedRevenue,
      note: "Estimate from completed visits",
      icon: Activity,
      className: "revenue",
      prefix: "₹",
      formatted: true,
    },
    {
      label: "Average rating",
      value: "—",
      note: "No review data available",
      icon: Star,
      className: "rating",
    },
  ];

  return (
    <main className="doctor-dashboard">
        <div className="doctor-content">
          {error && <p className="doctor-alert" role="alert">{error}</p>}

          <section id="overview" className="doctor-welcome">
            <div>
              <p className="doctor-eyebrow">YOUR PRACTICE, AT A GLANCE</p>
              <h1>Good Morning, Dr. {user?.name || "Doctor"}</h1>
              <p>Here&apos;s what&apos;s happening with your practice today.</p>
              {isDemoData && <span className="doctor-demo-data-banner">Presentation preview · fictional sample data · no appointments were changed</span>}
            </div>
            <Link to="/my-profile" className="doctor-profile-button">
              View profile <ArrowRight size={16} />
            </Link>
          </section>

          <section className="doctor-quick-actions" aria-label="Quick actions">
            <div>
              <span className="doctor-quick-icon"><Zap size={16} /></span>
              <span><strong>Quick actions</strong><small>Get to what matters, faster.</small></span>
            </div>
            <div className="doctor-quick-links">
              <a href="#appointments"><CalendarDays size={15} /> Review appointments</a>
              <button type="button" className="doctor-quick-disabled" disabled title="Prescription creation is not available in the current portal">
                <FilePlus2 size={15} /> Create prescription
              </button>
              <Link to="/my-profile"><UserRoundPen size={15} /> Update profile</Link>
              <a href="#availability"><Plus size={15} /> Add availability</a>
              <a href="#patients"><UsersRound size={15} /> View patients</a>
            </div>
          </section>

          <section className="doctor-stat-grid" aria-label="Practice overview">
            {statCards.map(({ label, value, note, icon: Icon, className, prefix, suffix, formatted }) => (
              <motion.article className={`doctor-stat-card stat-${className}`} key={label} whileHover={{ y: -4 }} transition={{ duration: .18 }}>
                <div className="doctor-stat-top">
                  <span className="doctor-stat-icon"><Icon size={19} /></span>
                  <MoreHorizontal size={16} className="doctor-stat-trend muted" />
                </div>
                <p className="doctor-stat-label">{label}</p>
                <div className="doctor-stat-bottom">
                  <strong><AnimatedMetric value={value} loading={loading} prefix={prefix} suffix={suffix} formatted={formatted} /></strong>
                  <span>{note}</span>
                </div>
              </motion.article>
            ))}
          </section>

          <div className="doctor-main-grid">
            <section id="appointments" className="doctor-panel doctor-appointments-panel">
              <div className="doctor-panel-heading">
                <div>
                  <p className="doctor-eyebrow">YOUR SCHEDULE</p>
                  <h2>Recent appointments</h2>
                </div>
                <span className="doctor-count-chip">{isDemoData ? "Demo sample" : `${appointments.length} total`}</span>
              </div>
              <div className="doctor-table-wrap">
                <table className="doctor-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date &amp; time</th>
                      <th>Status</th>
                      <th className="doctor-actions-heading">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.slice(0, 5).map((appointment) => (
                      <tr key={appointment._id}>
                        <td>
                          <div className="doctor-table-person">
                            <div className="doctor-avatar doctor-table-avatar">
                              {appointment.patient?.image
                                ? <img src={appointment.patient.image} alt="" />
                                : initials(appointment.patient?.name || "Patient")}
                            </div>
                            <div><strong>{appointment.patient?.name || "Patient"}</strong><span>{appointment.patient?.email || "—"}</span></div>
                          </div>
                        </td>
                        <td><strong className="doctor-date">{formatDate(appointment.date)}</strong><span className="doctor-time">{appointment.time}</span></td>
                        <td><span className={`doctor-status status-${appointment.status}`}>{appointment.status}</span></td>
                        <td>
                          {isDemoData ? (
                            <span className="doctor-demo-readonly">Demo only</span>
                          ) : appointment.status === "scheduled" ? (
                            <div className="doctor-row-actions">
                              <button
                                type="button"
                                className="doctor-action-button confirm"
                                onClick={() => setAppointmentStatus(appointment._id, "confirmed")}
                                disabled={updatingAppointmentId === appointment._id}
                              >
                                <Check size={14} /> Confirm
                              </button>
                              <button
                                type="button"
                                className="doctor-action-button cancel"
                                aria-label={`Cancel ${appointment.patient?.name || "patient"} appointment`}
                                onClick={() => setAppointmentStatus(appointment._id, "cancelled")}
                                disabled={updatingAppointmentId === appointment._id}
                              >
                                <X size={15} />
                              </button>
                            </div>
                          ) : appointment.status === "confirmed" ? (
                            <button
                              type="button"
                              className="doctor-action-button confirm"
                              onClick={() => setAppointmentStatus(appointment._id, "completed")}
                              disabled={updatingAppointmentId === appointment._id}
                            >
                              <CheckCircle2 size={14} /> Complete
                            </button>
                          ) : <span className="doctor-no-action">—</span>}
                        </td>
                      </tr>
                    ))}
                    {!loading && filteredAppointments.length === 0 && (
                      <tr><td colSpan="4" className="doctor-empty-cell">{searchQuery ? `No appointments match “${searchQuery}”.` : "No appointments yet. New bookings will appear here."}</td></tr>
                    )}
                    {loading && Array.from({ length: 4 }, (_, index) => (
                      <tr key={`skeleton-${index}`} className="doctor-skeleton-row">
                        <td colSpan="4"><span /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="doctor-panel doctor-profile-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">YOUR ACCOUNT</p><h2>Doctor profile</h2></div>
                <Link to="/my-profile" className="doctor-panel-more" aria-label="Edit doctor profile"><MoreHorizontal size={20} /></Link>
              </div>
              <div className="doctor-profile-identity">
                <div className="doctor-avatar doctor-profile-avatar">
                  {user?.image ? <img src={user.image} alt="" /> : initials(user?.name)}
                </div>
                <div><h3>Dr. {user?.name || "Doctor"}</h3><p>{user?.speciality || "Medical professional"}</p></div>
              </div>
              <div className="doctor-profile-details">
                <div><span>Experience</span><strong>{user?.experience || "—"}</strong></div>
                <div><span>Consultation fee</span><strong>{user?.fees ? `₹${user.fees}` : "—"}</strong></div>
                <div><span>Email address</span><strong>{user?.email || "—"}</strong></div>
              </div>
              <Link to="/my-profile" className="doctor-profile-edit">Manage profile <ArrowRight size={15} /></Link>
            </section>
          </div>

          <div className="doctor-secondary-grid">
            <section id="patients" className="doctor-panel doctor-patients-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">CARE DIRECTORY</p><h2>Patient records</h2></div>
                <span className="doctor-count-chip">{patientRecords.length} patients</span>
              </div>
              <div className="doctor-table-wrap">
                <table className="doctor-table patient-table">
                  <thead><tr><th>Patient</th><th>Appointments</th><th>Last appointment</th><th>Medical history</th></tr></thead>
                  <tbody>
                    {patientRecords.map((patient) => (
                      <tr key={patient._id}>
                        <td>
                          <div className="doctor-table-person">
                            <div className="doctor-avatar doctor-table-avatar">
                              {patient.image ? <img src={patient.image} alt="" /> : initials(patient.name)}
                            </div>
                            <div><strong>{patient.name}</strong><span>{patient.email || "—"}</span></div>
                          </div>
                        </td>
                        <td><span className="doctor-patient-visits">{patient.appointmentCount} appointments</span></td>
                        <td className="doctor-last-visit">{formatDate(patient.lastVisit)}</td>
                        <td className="doctor-patient-history">{patient.medicalHistory || "Not available"}</td>
                      </tr>
                    ))}
                    {!loading && patientRecords.length === 0 && (
                      <tr><td colSpan="4" className="doctor-empty-cell">Patients with appointments will appear here.</td></tr>
                    )}
                    {loading && <tr><td colSpan="4" className="doctor-empty-cell">Loading patient records...</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="calendar" className="doctor-panel doctor-calendar-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">PLAN AHEAD</p><h2>Upcoming calendar</h2></div>
                <div className="doctor-calendar-controls">
                  <button type="button" aria-label="Previous month" onClick={() => moveCalendar(-1)}><ChevronLeft size={17} /></button>
                  <button type="button" aria-label="Next month" onClick={() => moveCalendar(1)}><ChevronRight size={17} /></button>
                </div>
              </div>
              <div className="doctor-calendar-month">{monthFormatter.format(calendarMonth)}</div>
              <div className="doctor-calendar-grid" role="group" aria-label={monthFormatter.format(calendarMonth)}>
                {weekLabels.map((label) => <span className="doctor-calendar-weekday" key={label}>{label}</span>)}
                {calendarDays.map(({ date, dateString, inMonth, hasAppointments }) => {
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const isToday = dateString === todayString;
                  return (
                    <button
                      type="button"
                      aria-label={`${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}${hasAppointments ? ", has appointments" : ""}`}
                      aria-pressed={isSelected}
                      className={`doctor-calendar-day${inMonth ? "" : " outside-month"}${isSelected ? " selected" : ""}${isToday ? " is-today" : ""}`}
                      key={dateString}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date.getDate()}
                      {hasAppointments && <span className="doctor-calendar-dot" />}
                    </button>
                  );
                })}
              </div>
              <div className="doctor-calendar-agenda">
                <div className="doctor-agenda-heading">
                  <strong>{selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong>
                  <span>{selectedDayAppointments.length} appointments</span>
                </div>
                {selectedDayAppointments.length ? selectedDayAppointments.slice(0, 3).map((appointment) => (
                  <div className="doctor-agenda-item" key={appointment._id}>
                    <span className="doctor-agenda-time">{appointment.time}</span>
                    <span className="doctor-agenda-marker" />
                    <div><strong>{appointment.patient?.name || "Patient"}</strong><span>{appointment.status}</span></div>
                  </div>
                )) : <p className="doctor-agenda-empty">No upcoming appointments for this day.</p>}
              </div>
            </section>
          </div>

          <div className="doctor-widget-grid">
            <section className="doctor-panel doctor-schedule-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">COMING UP</p><h2>Upcoming schedule</h2></div>
                <a className="doctor-widget-action" href="#calendar">Calendar <ArrowRight size={13} /></a>
              </div>
              {upcomingAppointments.length ? upcomingAppointments.slice(0, 4).map((appointment) => (
                <div className="doctor-timeline-item" key={appointment._id}>
                  <div className="doctor-timeline-date">
                    <strong>{parseDate(appointment.date).getDate()}</strong>
                    <span>{parseDate(appointment.date).toLocaleDateString("en-US", { month: "short" })}</span>
                  </div>
                  <span className="doctor-timeline-line" />
                  <div className="doctor-timeline-copy">
                    <strong>{appointment.patient?.name || "Patient"}</strong>
                    <span>{appointment.time} <i /> {appointment.status}</span>
                  </div>
                  <span className="doctor-timeline-specialty">{user?.speciality || "Consultation"}</span>
                </div>
              )) : <p className="doctor-widget-empty">{loading ? "Loading your schedule…" : "No upcoming appointments."}</p>}
            </section>

            <section className="doctor-panel doctor-notifications-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">UPDATES</p><h2>Notifications</h2></div>
                <span className="doctor-notification-count">{pendingAppointments.length}</span>
              </div>
              {pendingAppointments.length ? pendingAppointments.slice(0, 3).map((appointment) => (
                <div className="doctor-notification-item" key={appointment._id}>
                  <span className="doctor-notification-icon"><CalendarDays size={15} /></span>
                  <span><strong>Appointment request</strong><small>{appointment.patient?.name || "A patient"} · {formatDate(appointment.date, { month: "short", day: "numeric" })} at {appointment.time}</small></span>
                </div>
              )) : <div className="doctor-notification-empty"><BadgeCheck size={18} /><span><strong>You&apos;re up to date</strong><small>New appointment requests will show here.</small></span></div>}
            </section>

            <section className="doctor-panel doctor-messages-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">PATIENT CARE</p><h2>Patient messages</h2></div>
                <span className="doctor-message-icon"><MessageCircle size={16} /></span>
              </div>
              <div className="doctor-messages-empty">
                <span><MessageCircle size={19} /></span>
                <strong>Messages are not connected</strong>
                <p>Patient messaging isn&apos;t available in the current workspace.</p>
              </div>
            </section>
          </div>

          <div className="doctor-analytics-grid" id="analytics">
            <section className="doctor-panel doctor-activity-panel doctor-analytics-wide">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">WEEKLY PERFORMANCE</p><h2>Appointments this week</h2></div>
                <span className="doctor-chart-period">Last 7 days</span>
              </div>
              <div className="doctor-chart-summary">
                <strong>{loading ? "—" : activityDays.reduce((total, day) => total + day.count, 0)}</strong>
                <span>appointments in the last seven days</span>
              </div>
              <div className="doctor-bar-chart" role="img" aria-label="Appointment counts during the last seven days">
                {activityDays.map((day, index) => (
                  <div className="doctor-bar-column" key={`${day.label}-${index}`}>
                    <span className="doctor-bar-value">{day.count || ""}</span>
                    <div className="doctor-bar-track">
                      <motion.div className="doctor-bar-fill" initial={{ height: 0 }} animate={{ height: `${Math.max((day.count / maxActivity) * 100, 4)}%` }} transition={{ duration: .55, delay: index * .06 }} />
                    </div>
                    <span className="doctor-bar-label">{day.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="doctor-panel doctor-monthly-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">PATIENT GROWTH</p><h2>Monthly patients</h2></div>
                <span className={`doctor-growth-chip${patientGrowth < 0 ? " negative" : ""}`}>
                  {patientGrowth < 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                  {patientGrowth > 0 ? "+" : ""}{patientGrowth} this month
                </span>
              </div>
              <div className="doctor-line-chart-summary"><strong>{monthlyAnalytics[monthlyAnalytics.length - 1].patients}</strong><span>unique patients this month</span></div>
              <AnalyticsLine data={monthlyAnalytics} valueKey="patients" color="#a78bfa" label="Unique patients by month, based on appointment records" />
            </section>

            <section className="doctor-panel doctor-status-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">APPOINTMENT MIX</p><h2>Appointment status</h2></div>
                <span className="doctor-count-chip">{statusTotal} total</span>
              </div>
              <div className="doctor-status-overview">
                <div className="doctor-status-ring" style={{ background: statusTotal ? `conic-gradient(${statusStops})` : "#253046" }}>
                  <div><strong>{statusTotal}</strong><span>Bookings</span></div>
                </div>
                <div className="doctor-status-legend">
                  {statusTotals.map((item) => (
                    <div key={item.label}>
                      <span className={`doctor-legend-dot ${item.className}`} style={{ backgroundColor: item.color }} />
                      <span>{item.label}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="doctor-panel doctor-revenue-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">REVENUE TREND</p><h2>Completed visit estimate</h2></div>
                <span className="doctor-chart-period">6 months</span>
              </div>
              <div className="doctor-line-chart-summary"><strong>₹{estimatedRevenue.toLocaleString("en-IN")}</strong><span>estimated total</span></div>
              <AnalyticsLine data={monthlyAnalytics} valueKey="revenue" color="#fb923c" label="Estimated monthly revenue based on completed visits and consultation fee" />
              <p className="doctor-analytics-footnote">Estimate only · not payment or payout data</p>
            </section>

            <section className="doctor-panel doctor-growth-panel">
              <div className="doctor-panel-heading">
                <div><p className="doctor-eyebrow">PRACTICE MOMENTUM</p><h2>Patient growth</h2></div>
                <Sparkles size={16} className="doctor-growth-sparkle" />
              </div>
              <div className="doctor-growth-total">{patientRecords.length}<span>unique patients on record</span></div>
              <div className="doctor-growth-summary">
                <span className={`doctor-growth-indicator${patientGrowth < 0 ? " negative" : ""}`}>{patientGrowth > 0 ? "+" : ""}{patientGrowth}</span>
                <span>net change in monthly patient count</span>
              </div>
              <div className="doctor-growth-months">{monthlyAnalytics.map((month) => <span key={month.label}>{month.label}</span>)}</div>
            </section>
          </div>

          <section id="availability" className="doctor-panel doctor-availability-panel">
            <div className="doctor-panel-heading">
              <div><p className="doctor-eyebrow">SCHEDULE PREFERENCES</p><h2>Availability management</h2></div>
              <span className="doctor-availability-hint">Select your available days</span>
            </div>
            <div className="doctor-availability-days">
              {weekdays.map((day) => {
                const isAvailable = availability.includes(day);
                return (
                  <label className={`doctor-availability-day${isAvailable ? " available" : ""}`} key={day}>
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={() => toggleAvailability(day)}
                    />
                    <span className="doctor-availability-check">{isAvailable ? <Check size={13} /> : null}</span>
                    {day}
                  </label>
                );
              })}
            </div>
          </section>

          <footer className="doctor-dashboard-footer">
            <span>UNFAZED CARE <span>·</span> DOCTOR WORKSPACE</span>
            <span>Designed for better care.</span>
          </footer>
        </div>
    </main>
  );
};

export default DoctorDashboard;
