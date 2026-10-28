import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const Appointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctorId = searchParams.get("doctorId");
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!doctorId) return;
    api.get("/users/doctors")
      .then(({ data }) => {
        setDoctor(data.doctors.find((item) => item._id === doctorId) || null);
      })
      .catch(() => setError("Unable to load this doctor's details."));
  }, [doctorId]);

  const submitAppointment = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/appointments", { doctorId, date, time });
      navigate("/my-appointments");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to book this appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-8">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Schedule your visit</p>
      <h1 className="dashboard-title mt-1">Book an appointment</h1>
      {doctor ? (
        <div className="page-surface mt-6 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          {doctor.image ? (
            <img src={doctor.image} alt={doctor.name} className="h-32 w-32 rounded-lg bg-blue-50 object-cover" />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 text-4xl font-semibold text-primary">
              {doctor.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="mt-1 text-gray-600">{doctor.speciality}</p>
            <p className="mt-2">Consultation fee: ₹{doctor.fees || 0}</p>
            <p className="mt-2 text-sm text-gray-600">
              Available: {doctor.availability?.length ? doctor.availability.join(", ") : "No days configured"}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">
          {error || "Choose a doctor to continue booking."}
        </p>
      )}
      {doctor && (
        <form onSubmit={submitAppointment} className="mt-6 max-w-lg space-y-4">
          <label className="block">
            <span className="mb-1 block font-medium">Appointment date</span>
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="form-control"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-medium">Appointment time</span>
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="form-control"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary disabled:opacity-60"
          >
            {isSubmitting ? "Booking..." : "Confirm appointment"}
          </button>
        </form>
      )}
      <Link
        to="/doctors"
        className="button-secondary mt-5"
      >
        Browse doctors
      </Link>
    </div>
  );
};

export default Appointment;
