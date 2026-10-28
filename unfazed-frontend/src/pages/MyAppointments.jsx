import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      const { data } = await api.get("/appointments");
      setAppointments(data.appointments);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/appointments")
      .then(({ data }) => {
        if (active) setAppointments(data.appointments);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load appointments.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const cancelAppointment = async (id) => {
    try {
      await api.patch(`/appointments/${id}`, { status: "cancelled" });
      await loadAppointments();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to cancel appointment.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-1 py-8">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Your care schedule</p>
        <h1 className="dashboard-title mt-1">My Appointments</h1>
      </div>
      {loading && <p className="text-slate-500">Loading appointments...</p>}
      {error && <p className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700" role="alert">{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p className="dashboard-card text-center text-slate-500">You do not have any appointments yet.</p>
      )}
      <div className="space-y-5">
        {appointments.map((item) => (
          <div
            key={item._id}
            className="dashboard-card flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{item.doctor?.name || "Doctor"}</h2>
              <p>{item.doctor?.speciality}</p>
              <p className="mt-2">Date: {new Date(`${item.date}T${item.time}`).toLocaleDateString()}</p>
              <p>Time: {item.time}</p>
              <p className="mt-3"><span className="status-pill">{item.status}</span></p>
              <p className="mt-1 text-sm text-gray-600">Patient: {user?.name}</p>
            </div>
            {["scheduled", "confirmed"].includes(item.status) && (
              <button
                type="button"
                onClick={() => cancelAppointment(item._id)}
                className="button-danger mt-5 md:mt-0"
              >
                Cancel Appointment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
