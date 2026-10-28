import { Link } from "react-router-dom";

const Header = () => {
  return (
    <section className="dashboard-hero">
      <p className="text-xs font-bold uppercase tracking-[.18em]">UNFAZED CARE · YOUR HEALTH PARTNER</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Book Your Doctor Appointment
      </h1>

      <p className="mt-4 max-w-xl text-base">
        Find experienced doctors and schedule appointments online in a few clicks.
      </p>

      <Link
        to="/doctors"
        className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-white px-6 py-3 font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50"
      >
        Book Appointment
      </Link>
    </section>
  );
};

export default Header;