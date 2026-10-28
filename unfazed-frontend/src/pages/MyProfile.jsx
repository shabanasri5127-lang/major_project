import { useState } from "react";
import { useAuth } from "../context/useAuth";

const MyProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(() => ({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    gender: user?.gender || "",
    dob: user?.dob || "",
    image: user?.image || "",
    speciality: user?.speciality || "",
    experience: user?.experience || "",
    fees: user?.fees || 0,
  }));

  const changeField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      await updateProfile(form);
      setMessage("Profile updated.");
      setIsEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-1 py-8">
      <div className="page-surface p-6 sm:p-9">
        <div className="flex flex-col md:flex-row gap-8">
          {user?.image ? (
            <img src={user.image} alt={`${user.name}'s profile`} className="w-44 h-44 rounded-xl object-cover" />
          ) : (
            <div className="flex w-44 h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 text-6xl font-semibold text-primary">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">{user?.name}</h1>
            <p className="mt-2 text-slate-500">{user?.email}</p>
            <p className="mt-3"><span className="status-pill">{user?.role}</span></p>
            <hr className="my-6 border-slate-100" />

            {isEditing ? (
              <form onSubmit={saveProfile} className="space-y-3">
                {[
                  ["name", "Full name"],
                  ["phone", "Phone"],
                  ["address", "Address"],
                  ["gender", "Gender"],
                  ["dob", "Date of birth"],
                  ["image", "Profile image URL"],
                ].map(([field, label]) => (
                  <label key={field} className="block">
                    <span className="mb-1 block text-sm font-medium">{label}</span>
                    <input
                      name={field}
                      type={field === "dob" ? "date" : "text"}
                      value={form[field]}
                      onChange={changeField}
                      required={field === "name"}
                      className="form-control"
                    />
                  </label>
                ))}
                {user?.role === "doctor" && (
                  <>
                    {[
                      ["speciality", "Speciality"],
                      ["experience", "Experience"],
                      ["fees", "Consultation fee"],
                    ].map(([field, label]) => (
                      <label key={field} className="block">
                        <span className="mb-1 block text-sm font-medium">{label}</span>
                        <input
                          name={field}
                          type={field === "fees" ? "number" : "text"}
                          min={field === "fees" ? "0" : undefined}
                          value={form[field]}
                          onChange={changeField}
                          className="form-control"
                        />
                      </label>
                    ))}
                  </>
                )}
                {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button disabled={isSaving} className="button-primary disabled:opacity-60">
                    {isSaving ? "Saving..." : "Save profile"}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="button-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-3">
                  {user?.role === "doctor" && <p><b>Speciality:</b> {user.speciality || "Not set"}</p>}
                  <p><b>Phone:</b> {user?.phone || "Not set"}</p>
                  <p><b>Address:</b> {user?.address || "Not set"}</p>
                  <p><b>Gender:</b> {user?.gender || "Not set"}</p>
                  <p><b>Date of birth:</b> {user?.dob || "Not set"}</p>
                  {user?.role === "doctor" && <p><b>Consultation fee:</b> ₹{user.fees || 0}</p>}
                </div>
                {message && <p className="mt-4 text-green-700" role="status">{message}</p>}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="button-primary mt-8"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
