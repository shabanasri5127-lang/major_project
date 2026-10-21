import { Link, useSearchParams } from "react-router-dom";
import { doctors } from "../assets/assets (1).js";

const Appointment = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const doctor = doctors.find((item) => item._id === doctorId);

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold">Book an appointment</h1>
      {doctor ? (
        <div className="mt-6 flex flex-col gap-5 rounded-xl border p-6 sm:flex-row sm:items-center">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="h-32 w-32 rounded-lg bg-blue-50 object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="mt-1 text-gray-600">{doctor.speciality}</p>
            <p className="mt-2">Consultation fee: ₹{doctor.fees}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">Choose a doctor to continue booking.</p>
      )}
      <Link
        to="/doctors"
        className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        {doctor ? "Choose a different doctor" : "Browse doctors"}
      </Link>
    </div>
  )
}

export default Appointment
