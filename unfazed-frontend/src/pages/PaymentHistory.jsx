import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Info,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import { DEMO_APPOINTMENTS, DEMO_DOCTORS, DEMO_PATIENT_APPOINTMENTS, DEMO_PAYMENTS } from "../data/demoData";
import "./Payments.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const formatDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/appointments")
      .then(({ data }) => {
        if (active) setAppointments(data.appointments);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load appointment fee details.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const isDemoData = !loading && appointments.length === 0;
  const visibleAppointments = isDemoData
    ? (isDoctor ? DEMO_APPOINTMENTS : DEMO_PATIENT_APPOINTMENTS)
    : appointments;
  const demoDoctorsById = useMemo(() => new Map(DEMO_DOCTORS.map((doctor) => [doctor._id, doctor])), []);
  const feeFor = (appointment) => Number(
    appointment.doctor?.fees
    ?? demoDoctorsById.get(appointment.doctor?._id)?.fees
    ?? user?.fees
    ?? 0,
  );
  const completed = visibleAppointments.filter((item) => item.status === "completed");
  const upcoming = visibleAppointments.filter((item) => ["scheduled", "confirmed"].includes(item.status));
  const completedEstimate = completed.reduce((total, item) => total + feeFor(item), 0);
  const upcomingEstimate = upcoming.reduce((total, item) => total + feeFor(item), 0);
  const payments = DEMO_PAYMENTS;

  return (
    <main className="payment-page">
      <header className="payment-page-heading">
        <div>
          <span className="payment-eyebrow"><WalletCards size={15} /> {isDoctor ? "PRACTICE FINANCIALS" : "YOUR CARE & PAYMENTS"}</span>
          <h1>{isDoctor ? "Payment history" : "Payments"}</h1>
          <p>{isDoctor ? "Review consultation estimates and sample payment activity." : "Review consultation fees and payment activity in one place."}</p>
        </div>
        <Link to={isDoctor ? "/doctor-dashboard" : "/my-appointments"} className="payment-back-link">
          <CalendarDays size={15} /> {isDoctor ? "Appointments" : "My appointments"}
        </Link>
      </header>

      <div className="payment-demo-notice" role="note">
        <Info size={16} />
        <span><strong>Presentation demo</strong> Payment history and statuses below are fictional examples. No payment is processed, collected, or paid out through this page.</span>
      </div>

      {error && <p className="payment-error" role="alert">{error}</p>}

      <section className="payment-summary-grid" aria-label="Payment summary">
        <article className="payment-summary-card">
          <span className="payment-summary-icon blue"><CreditCard size={18} /></span>
          <small>{isDoctor ? "Completed consultation estimate" : "Completed consultation fees"}</small>
          <strong>{currency.format(completedEstimate)}</strong>
          <span>{completed.length} completed visits · {isDemoData ? "demo sample" : "based on appointments"}</span>
        </article>
        <article className="payment-summary-card">
          <span className="payment-summary-icon teal"><Clock3 size={18} /></span>
          <small>{isDoctor ? "Upcoming consultation estimate" : "Upcoming consultation fees"}</small>
          <strong>{currency.format(upcomingEstimate)}</strong>
          <span>{upcoming.length} upcoming visits · not a charge</span>
        </article>
        <article className="payment-summary-card">
          <span className="payment-summary-icon green"><CheckCircle2 size={18} /></span>
          <small>Demo payments marked paid</small>
          <strong>{currency.format(payments.filter((item) => item.status === "paid").reduce((total, item) => total + item.amount, 0))}</strong>
          <span>Sample history only · no transactions</span>
        </article>
      </section>

      <section className="payment-table-card">
        <div className="payment-table-heading">
          <div><span className="payment-section-kicker">SAMPLE ACTIVITY</span><h2>{isDoctor ? "Demo payment history" : "Payment history"}</h2></div>
          <span className="payment-sample-tag"><ReceiptText size={13} /> Demo entries</span>
        </div>
        <div className="payment-table-wrap">
          <table className="payment-table">
            <thead>
              <tr><th>Transaction</th><th>Date</th><th>Payment method</th><th>Reference</th><th>Status</th><th className="amount-cell">Amount</th></tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td><span className="payment-doctor-avatar">{payment.doctor.split(" ").slice(-1)[0].charAt(0)}</span><span className="payment-provider"><strong>{payment.doctor}</strong><small>{payment.speciality} consultation</small></span></td>
                  <td>{formatDate(payment.date)}</td>
                  <td>{payment.method}</td>
                  <td><code>{payment.reference}</code></td>
                  <td><span className={`payment-status payment-${payment.status}`}>{payment.status === "paid" ? <BadgeCheck size={13} /> : payment.status === "refunded" ? <ArrowDownLeft size={13} /> : <Clock3 size={13} />}{payment.status}</span></td>
                  <td className="amount-cell">{currency.format(payment.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="payment-footnote">
        <span><ArrowUpRight size={16} /></span>
        <div><strong>{isDoctor ? "Earnings are estimates, not payouts" : "Consultation fees are not charges"}</strong><p>{isDoctor
          ? "Completed appointment totals are estimated from listed consultation fees. Payment collection and payout services are not configured."
          : "Upcoming consultation totals are indicative only. Use your appointment details and the clinic’s instructions for actual payment information."}</p></div>
      </section>
    </main>
  );
};

export default PaymentHistory;
