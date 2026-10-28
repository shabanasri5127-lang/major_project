import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { usePatientPortal } from "../context/usePatientPortal";

const DoctorCard = ({ doctor, isDemo = false }) => {
  const { user } = useAuth();
  const patientPortal = usePatientPortal();
  const favorite = patientPortal?.isFavorite(doctor._id) || false;

  return (
  <article className={`patient-doctor-directory-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg${user?.role === "patient" ? " patient-doctor-directory-card-saved" : ""}`}>
    {user?.role === "patient" && patientPortal && (
      <button
        type="button"
        className={`patient-doctor-favorite${favorite ? " is-favorite" : ""}`}
        aria-label={favorite ? `Remove ${doctor.name} from favorites` : `Add ${doctor.name} to favorites`}
        aria-pressed={favorite}
        onClick={() => patientPortal.toggleFavorite(doctor)}
      >
        <Heart size={17} fill={favorite ? "currentColor" : "none"} />
      </button>
    )}
    {doctor.image ? (
      <img
        src={doctor.image}
        alt={doctor.name}
        className="h-56 w-full bg-blue-50 object-cover"
      />
    ) : (
      <div className="flex h-56 items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 text-5xl font-semibold text-primary" aria-label="No profile image">
        {doctor.name?.charAt(0) || "D"}
      </div>
    )}
    <div className="p-5">
      <h2 className="text-lg font-semibold text-slate-800">{doctor.name}</h2>
      <p className="mt-1 text-sm font-medium text-primary">{doctor.speciality}</p>
      {doctor.qualification && <p className="mt-2 text-sm text-gray-600">{doctor.qualification}</p>}
      {doctor.experience && <p className="mt-2 text-sm text-gray-600">{doctor.experience} experience</p>}
      <p className="mt-2 font-semibold">Consultation fee: ₹{doctor.fees}</p>
      {doctor.availability?.length > 0 && <p className="mt-2 text-sm text-gray-600">Available: {doctor.availability.join(", ")}</p>}
      {isDemo ? (
        <button type="button" className="button-secondary mt-5 w-full" disabled title="Sample profile only; it is not connected to a booking account">
          Demo profile · booking unavailable
        </button>
      ) : (
        <Link
          to={`/appointments?doctorId=${encodeURIComponent(doctor._id)}`}
          className="button-primary mt-5 w-full"
        >
          Book Appointment
        </Link>
      )}
    </div>
  </article>
  );
};

export default DoctorCard;