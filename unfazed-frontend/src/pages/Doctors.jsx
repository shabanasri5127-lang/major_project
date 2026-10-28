import DoctorCard from "../components/DoctorCard";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { DEMO_DOCTORS } from "../data/demoData";

const Doctors = () => {
  const { specialty } = useParams();
  const selectedSpecialty = specialty?.replace(/\+/g, " ").toLowerCase() ?? "";
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/users/doctors", {
      params: selectedSpecialty ? { speciality: selectedSpecialty } : {},
    })
      .then(({ data }) => {
        if (active) setDoctors(data.doctors);
      })
      .catch(() => {
        if (active) setError("Unable to load doctors. Please try again later.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [selectedSpecialty]);

  const isDemoData = !loading && doctors.length === 0;
  const filteredDoctors = isDemoData
    ? DEMO_DOCTORS.filter((doctor) => !selectedSpecialty || doctor.speciality.toLowerCase() === selectedSpecialty)
    : doctors;

  return (
    <div className="py-8">

      <h1 className="text-center text-4xl font-bold tracking-tight text-slate-800">
        {specialty ? `${specialty.replace(/\+/g, " ")} Specialists` : "Our Doctors"}
      </h1>

      <p className="mt-3 text-center text-slate-500">
        {specialty ? "Choose a doctor for your appointment." : "Choose your preferred specialist."}
      </p>

      {isDemoData && (
        <p className="mx-auto mt-6 max-w-3xl rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm text-blue-800">
          Presentation preview · sample doctor profiles only. Booking is disabled for these examples.
        </p>
      )}

      {loading && <p className="mt-10 text-center text-gray-600">Loading doctors...</p>}
      {error && <p className="mt-10 text-center text-red-600" role="alert">{error}</p>}
      {!loading && !error && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
            isDemo={isDemoData}
          />
        ))}

      </div>}
      {!loading && !error && filteredDoctors.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-gray-600">No doctors are listed for this specialty yet.</p>
          <Link to="/doctors" className="mt-4 inline-block text-blue-600 underline">
            View all doctors
          </Link>
        </div>
      )}

    </div>
  );
};

export default Doctors;