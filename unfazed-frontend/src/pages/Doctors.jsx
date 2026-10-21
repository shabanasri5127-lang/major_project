import { doctors } from "../assets/assets (1).js";
import DoctorCard from "../components/DoctorCard";
import { Link, useParams } from "react-router-dom";

const Doctors = () => {
  const { specialty } = useParams();
  const selectedSpecialty = specialty?.replace(/\+/g, " ").toLowerCase() ?? "";
  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doctor) => doctor.speciality.toLowerCase() === selectedSpecialty)
    : doctors;

  return (
    <div className="py-10">

      <h1 className="text-4xl font-bold text-center">
        {specialty ? `${specialty.replace(/\+/g, " ")} Specialists` : "Our Doctors"}
      </h1>

      <p className="text-center text-gray-600 mt-3">
        {specialty ? "Choose a doctor for your appointment." : "Choose your preferred specialist."}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
          />
        ))}

      </div>
      {filteredDoctors.length === 0 && (
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