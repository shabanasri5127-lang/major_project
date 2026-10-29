import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseMedical,
  Building2,
  Check,
  CircleDollarSign,
  FileBadge2,
  Globe2,
  MapPin,
  Pencil,
  Save,
  ShieldCheck,
  Stethoscope,
  Star,
  Upload,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import ProfilePhotoPicker from "../components/ProfilePhotoPicker";

const getProfileForm = (user) => ({
  name: user?.name || "",
  image: user?.image || "",
  speciality: user?.speciality || "",
  qualification: user?.qualification || "",
  experience: user?.experience || "",
  fees: user?.fees ?? 0,
  languages: (user?.languages || []).join(", "),
  hospital: user?.hospital || "",
  bio: user?.bio || "",
  phone: user?.phone || "",
  address: user?.address || "",
});

const profileSections = [
  { title: "Speciality", field: "speciality", icon: Stethoscope },
  { title: "Qualifications", field: "qualification", icon: FileBadge2 },
  { title: "Experience", field: "experience", icon: BriefcaseMedical },
  { title: "Consultation fee", field: "fees", icon: CircleDollarSign },
  { title: "Languages", field: "languages", icon: Globe2 },
  { title: "Hospital / clinic", field: "hospital", icon: Building2 },
];

const DoctorProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(() => getProfileForm(user));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [certificateName, setCertificateName] = useState("");

  const changeField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    const updates = {
      ...form,
      fees: Number(form.fees),
      languages: form.languages.split(",").map((language) => language.trim()).filter(Boolean),
    };

    try {
      await updateProfile(updates);
      setForm(getProfileForm({ ...user, ...updates }));
      setMessage("Your profile has been updated.");
      setIsEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const profileName = user?.name || "Doctor";
  const isVerified = Boolean(user?.isVerified);

  return (
    <div className="doctor-page-content doctor-profile-page">
      <div className="doctor-profile-page-heading">
        <div>
          <p className="doctor-portal-eyebrow">YOUR PROFESSIONAL IDENTITY</p>
          <h1>Doctor profile</h1>
          <p>Keep your professional information current for your patients.</p>
        </div>
        <Link className="doctor-back-link" to="/doctor-dashboard"><ArrowLeft size={15} /> Dashboard</Link>
      </div>

      {error && <p className="doctor-form-alert" role="alert">{error}</p>}
      {message && <p className="doctor-form-success" role="status"><Check size={15} /> {message}</p>}

      <motion.section className="doctor-profile-hero-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
        <div className="doctor-profile-cover" />
        <div className="doctor-profile-hero-content">
          <div className="doctor-profile-large-avatar">
            {user?.image ? <img src={user.image} alt={`${profileName} profile`} /> : profileName.charAt(0).toUpperCase()}
          </div>
          <div className="doctor-profile-hero-copy">
            <div className="doctor-profile-name-row">
              <h2>Dr. {profileName}</h2>
              <span className={`doctor-verification-badge${isVerified ? " verified" : ""}`}>
                <BadgeCheck size={15} /> {isVerified ? "Verified clinician" : "Doctor account"}
              </span>
            </div>
            <p>{user?.speciality || "Speciality not added"}{user?.hospital ? ` · ${user.hospital}` : ""}</p>
            <div className="doctor-profile-meta">
              <span><MapPin size={14} />{user?.address || "Practice location not added"}</span>
              <span><ShieldCheck size={14} />Professional account</span>
            </div>
          </div>
          <button type="button" className="doctor-profile-edit-button" onClick={() => { setIsEditing((editing) => !editing); setError(""); setMessage(""); }}>
            <Pencil size={15} /> {isEditing ? "Close editor" : "Edit profile"}
          </button>
        </div>
      </motion.section>

      {isEditing && (
        <motion.form
          className="doctor-profile-editor doctor-portal-card"
          onSubmit={saveProfile}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: .22 }}
        >
          <div className="doctor-card-heading">
            <div><p className="doctor-portal-eyebrow">EDIT DETAILS</p><h2>Professional information</h2></div>
            <span className="doctor-edit-hint">Changes save to your doctor account</span>
          </div>
          <div className="doctor-profile-form-grid">
            <label className="doctor-form-field"><span>Full name</span><input name="name" value={form.name} onChange={changeField} required /></label>
            <label className="doctor-form-field"><span>Profile image URL (optional)</span><input name="image" value={form.image} onChange={changeField} type="text" placeholder="https://…" /></label>
            <div className="doctor-form-field-full"><ProfilePhotoPicker image={form.image} name={form.name} onChange={(image) => setForm((current) => ({ ...current, image }))} /></div>
            <label className="doctor-form-field"><span>Speciality</span><input name="speciality" value={form.speciality} onChange={changeField} /></label>
            <label className="doctor-form-field"><span>Qualification</span><input name="qualification" value={form.qualification} onChange={changeField} placeholder="e.g. MBBS, MD" /></label>
            <label className="doctor-form-field"><span>Experience</span><input name="experience" value={form.experience} onChange={changeField} placeholder="e.g. 8 years" /></label>
            <label className="doctor-form-field"><span>Consultation fee (INR)</span><input name="fees" value={form.fees} onChange={changeField} type="number" min="0" step="1" /></label>
            <label className="doctor-form-field"><span>Languages</span><input name="languages" value={form.languages} onChange={changeField} placeholder="English, Hindi" /></label>
            <label className="doctor-form-field"><span>Hospital / clinic</span><input name="hospital" value={form.hospital} onChange={changeField} /></label>
            <label className="doctor-form-field"><span>Phone</span><input name="phone" value={form.phone} onChange={changeField} /></label>
            <label className="doctor-form-field"><span>Practice location</span><input name="address" value={form.address} onChange={changeField} /></label>
            <label className="doctor-form-field doctor-form-field-full"><span>Professional bio</span><textarea name="bio" value={form.bio} onChange={changeField} rows="4" maxLength="1200" placeholder="Share your approach to care and areas of clinical focus." /></label>
          </div>
          <div className="doctor-form-actions">
            <button type="button" className="doctor-secondary-button" onClick={() => { setForm(getProfileForm(user)); setIsEditing(false); }}>Cancel</button>
            <button type="submit" className="doctor-primary-button" disabled={isSaving}><Save size={15} />{isSaving ? "Saving…" : "Save changes"}</button>
          </div>
        </motion.form>
      )}

      <div className="doctor-profile-detail-grid">
        <section className="doctor-portal-card doctor-profile-about">
          <div className="doctor-card-heading">
            <div><p className="doctor-portal-eyebrow">ABOUT</p><h2>Care &amp; expertise</h2></div>
            <UserRound size={17} />
          </div>
          <p className="doctor-profile-bio">{user?.bio || "Add a short professional introduction so patients can learn more about your approach to care."}</p>
          <div className="doctor-profile-facts">
            {profileSections.map(({ title, field, icon: Icon }) => {
              const value = field === "fees"
                ? (user?.fees ? `₹${Number(user.fees).toLocaleString("en-IN")}` : "")
                : field === "languages"
                  ? (user?.languages || []).join(", ")
                  : user?.[field];
              return (
                <div className="doctor-profile-fact" key={field}>
                  <span className="doctor-profile-fact-icon"><Icon size={16} /></span>
                  <span><small>{title}</small><strong>{value || "Not added yet"}</strong></span>
                </div>
              );
            })}
          </div>
          <div className="doctor-profile-rating">
            <span className="doctor-profile-fact-icon"><Star size={16} /></span>
            <span><small>Average rating</small><strong>Not available · reviews are not connected</strong></span>
          </div>
        </section>

        <section className="doctor-portal-card doctor-profile-contact">
          <div className="doctor-card-heading">
            <div><p className="doctor-portal-eyebrow">PRACTICE DETAILS</p><h2>Contact information</h2></div>
            <Building2 size={17} />
          </div>
          <div className="doctor-contact-detail"><span>Email</span><strong>{user?.email || "Not added"}</strong></div>
          <div className="doctor-contact-detail"><span>Phone</span><strong>{user?.phone || "Not added yet"}</strong></div>
          <div className="doctor-contact-detail"><span>Hospital / clinic</span><strong>{user?.hospital || "Not added yet"}</strong></div>
          <div className="doctor-contact-detail"><span>Location</span><strong>{user?.address || "Not added yet"}</strong></div>
          <Link className="doctor-profile-settings-link" to="/doctor-settings">Manage account settings <Pencil size={14} /></Link>
        </section>
      </div>

      <section className="doctor-certificate-card doctor-portal-card">
        <span className="doctor-certificate-icon"><ShieldCheck size={18} /></span>
        <span className="doctor-certificate-copy"><strong>Professional credentials</strong><small>{certificateName || "Certificate upload is not connected to a secure storage service."}</small></span>
        <label className="doctor-certificate-upload">
          <Upload size={14} /> Choose certificate
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            aria-label="Choose a certificate file"
            onChange={(event) => setCertificateName(event.target.files?.[0]?.name || "")}
          />
        </label>
      </section>
    </div>
  );
};

export default DoctorProfile;
