import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => (
  <article className="overflow-hidden rounded-xl border border-gray-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <img
      src={doctor.image}
      alt={doctor.name}
      className="h-56 w-full bg-blue-50 object-cover"
    />
    <div className="p-4">
      <h2 className="text-lg font-semibold">{doctor.name}</h2>
      <p className="mt-1 text-gray-600">{doctor.speciality}</p>
      <p className="mt-2 text-sm text-gray-600">{doctor.experience} experience</p>
      <p className="mt-2 font-semibold">Consultation fee: ₹{doctor.fees}</p>
      <Link
        to={`/appointments?doctorId=${encodeURIComponent(doctor._id)}`}
        className="mt-4 block rounded-lg bg-blue-600 py-2 text-center font-medium text-white transition hover:bg-blue-700"
      >
        Book Appointment
      </Link>
    </div>
  </article>
);

export default DoctorCard;