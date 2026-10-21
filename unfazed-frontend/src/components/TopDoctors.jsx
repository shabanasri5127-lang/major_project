import { Link } from "react-router-dom";
import { doctors } from "../assets/assets (1).js";
import DoctorCard from "./DoctorCard";

const TopDoctors = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center">
        Top Doctors
      </h2>

      <p className="text-center mt-3">
        Experienced doctors available for consultation.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {doctors.slice(0, 4).map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/doctors"
          className="inline-block rounded-full bg-primary px-8 py-3 font-medium text-black transition hover:bg-primary/80"
        >
          View all doctors
        </Link>
      </div>
    </section>
  );
};

export default TopDoctors;