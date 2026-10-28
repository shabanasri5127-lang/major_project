import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import api from "../services/api";

const TopDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users/doctors")
      .then(({ data }) => setDoctors(data.doctors.slice(0, 4)))
      .catch(() => setError("Unable to load doctors right now."));
  }, []);

  return (
    <section>
      <h2 className="text-center text-3xl font-bold tracking-tight text-slate-800">
        Top Doctors
      </h2>

      <p className="mt-3 text-center text-slate-500">
        Experienced doctors available for consultation.
      </p>
      {error && <p className="mt-4 text-center text-red-600" role="alert">{error}</p>}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {doctors.slice(0, 4).map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
      {!error && doctors.length === 0 && (
        <p className="mt-8 text-center text-gray-600">
          No doctor profiles are available yet.
        </p>
      )}
      <div className="mt-8 text-center">
        <Link
          to="/doctors"
          className="button-secondary"
        >
          View all doctors
        </Link>
      </div>
    </section>
  );
};

export default TopDoctors;