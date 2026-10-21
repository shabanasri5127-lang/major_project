import { Link } from "react-router-dom";

const Header = () => {
  return (
    <section className="bg-blue-600 text-white rounded-2xl p-10">
      <h1 className="text-4xl font-bold">
        Book Your Doctor Appointment
      </h1>

      <p className="mt-4 text-lg">
        Find experienced doctors and schedule appointments online in a few clicks.
      </p>

      <Link
        to="/doctors"
        className="inline-block mt-6 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold"
      >
        Book Appointment
      </Link>
    </section>
  );
};

export default Header;