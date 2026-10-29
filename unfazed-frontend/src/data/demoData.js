import doctorOneImage from "../assets/doc1.png";
import doctorTwoImage from "../assets/doc2.png";
import doctorThreeImage from "../assets/doc3.png";
import doctorFourImage from "../assets/doc4.png";
import doctorFiveImage from "../assets/doc5.png";
import patientOneImage from "../assets/demo-patient-one.svg";
import patientTwoImage from "../assets/demo-patient-two.svg";

const dateOffset = (offset) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const DEMO_ACCOUNTS = [
  { role: "Doctor", email: "doctor1@example.com", password: "Doctor@123" },
  { role: "Doctor", email: "doctor2@example.com", password: "Doctor@123" },
  { role: "Patient", email: "patient1@example.com", password: "Patient@123" },
  { role: "Patient", email: "patient2@example.com", password: "Patient@123" },
];

export const DEMO_DOCTORS = [
  { _id: "demo-doctor-1", name: "Dr. Ananya Mehta", image: doctorOneImage, qualification: "MBBS, MD", speciality: "Cardiology", experience: "12 years", fees: 1200, availability: ["Monday", "Tuesday", "Thursday", "Friday"], hospital: "Harborview Medical Centre", languages: ["English", "Hindi"] },
  { _id: "demo-doctor-2", name: "Dr. Rahul Nair", image: doctorTwoImage, qualification: "MBBS, MS (Orthopaedics)", speciality: "Orthopaedics", experience: "10 years", fees: 1000, availability: ["Monday", "Wednesday", "Friday", "Saturday"], hospital: "Lakeside Specialty Clinic", languages: ["English", "Tamil", "Malayalam"] },
  { _id: "demo-doctor-3", name: "Dr. Priya Kapoor", image: doctorThreeImage, qualification: "MBBS, MD (Paediatrics)", speciality: "Paediatrics", experience: "9 years", fees: 850, availability: ["Tuesday", "Wednesday", "Thursday", "Saturday"], hospital: "Northstar Children’s Hospital", languages: ["English", "Hindi"] },
  { _id: "demo-doctor-4", name: "Dr. Karthik Iyer", image: doctorFourImage, qualification: "MBBS, MD (Dermatology)", speciality: "Dermatology", experience: "8 years", fees: 900, availability: ["Monday", "Tuesday", "Friday", "Saturday"], hospital: "Harborview Medical Centre", languages: ["English", "Tamil"] },
  { _id: "demo-doctor-5", name: "Dr. Sara Thomas", image: doctorFiveImage, qualification: "MBBS, MD (Neurology)", speciality: "Neurology", experience: "14 years", fees: 1500, availability: ["Monday", "Wednesday", "Thursday", "Friday"], hospital: "Lakeside Specialty Clinic", languages: ["English", "Malayalam"] },
];

const patientProfiles = [
  ["demo-patient-1", "Aarav Sharma", "aarav.sharma@example.com", "Seasonal allergies"],
  ["demo-patient-2", "Maya Iyer", "maya.iyer@example.com", "Routine wellness visit"],
  ["demo-patient-3", "Vivaan Rao", "vivaan.rao@example.com", "Follow-up consultation"],
  ["demo-patient-4", "Isha Menon", "isha.menon@example.com", "Skin health consultation"],
  ["demo-patient-5", "Kabir Patel", "kabir.patel@example.com", "Blood pressure review"],
  ["demo-patient-6", "Diya Nair", "diya.nair@example.com", "Paediatric follow-up"],
  ["demo-patient-7", "Arjun Das", "arjun.das@example.com", "Joint pain assessment"],
  ["demo-patient-8", "Anika Verma", "anika.verma@example.com", "Preventive health check"],
  ["demo-patient-9", "Reyansh Shah", "reyansh.shah@example.com", "Dermatology follow-up"],
  ["demo-patient-10", "Tara Krishnan", "tara.krishnan@example.com", "Neurology consultation"],
  ["demo-patient-11", "Ibrahim Khan", "ibrahim.khan@example.com", "General consultation"],
  ["demo-patient-12", "Meera Joshi", "meera.joshi@example.com", "Annual health review"],
];

export const DEMO_PATIENTS = patientProfiles.map(([_id, name, email, medicalHistory], index) => ({
  _id,
  name,
  email,
  image: index % 2 === 0 ? patientOneImage : patientTwoImage,
  medicalHistory,
}));

const appointmentSeed = [
  [0, 1, -65, "completed", "09:00"],
  [1, 0, -42, "completed", "10:30"],
  [2, 2, -23, "completed", "11:00"],
  [3, 3, -10, "completed", "13:00"],
  [4, 0, -3, "completed", "14:30"],
  [5, 2, 0, "confirmed", "09:30"],
  [6, 1, 0, "scheduled", "11:00"],
  [7, 4, 1, "confirmed", "10:00"],
  [8, 3, 3, "scheduled", "12:30"],
  [9, 4, 7, "confirmed", "14:00"],
  [10, 0, 10, "scheduled", "09:00"],
  [11, 1, 14, "cancelled", "15:30"],
  [0, 2, -18, "cancelled", "16:00"],
  [2, 3, 5, "confirmed", "10:30"],
  [4, 0, 21, "scheduled", "13:30"],
];

export const DEMO_APPOINTMENTS = appointmentSeed.map(([patientIndex, doctorIndex, offset, status, time], index) => {
  const patient = DEMO_PATIENTS[patientIndex];
  const doctor = DEMO_DOCTORS[doctorIndex];
  return {
    _id: `demo-appointment-${index + 1}`,
    patient: { _id: patient._id, name: patient.name, email: patient.email, image: patient.image, medicalHistory: patient.medicalHistory },
    doctor: { _id: doctor._id, name: doctor.name, speciality: doctor.speciality, image: doctor.image, fees: doctor.fees },
    date: dateOffset(offset),
    time,
    status,
  };
});

export const DEMO_PATIENT_APPOINTMENTS = [
  { ...DEMO_APPOINTMENTS[0], _id: "demo-patient-appointment-1", date: dateOffset(-65) },
  { ...DEMO_APPOINTMENTS[5], _id: "demo-patient-appointment-2", date: dateOffset(0) },
  { ...DEMO_APPOINTMENTS[7], _id: "demo-patient-appointment-3", date: dateOffset(1) },
  { ...DEMO_APPOINTMENTS[12], _id: "demo-patient-appointment-4", date: dateOffset(-18) },
];

export const DEMO_PAYMENTS = [
  { _id: "demo-payment-1", date: dateOffset(-2), doctor: "Dr. Ananya Mehta", speciality: "Cardiology", amount: 1200, method: "Card ending 2048", status: "paid", reference: "DEMO-2048" },
  { _id: "demo-payment-2", date: dateOffset(-18), doctor: "Dr. Priya Kapoor", speciality: "Paediatrics", amount: 850, method: "UPI · demo", status: "paid", reference: "DEMO-1832" },
  { _id: "demo-payment-3", date: dateOffset(0), doctor: "Dr. Rahul Nair", speciality: "Orthopaedics", amount: 1000, method: "Not processed", status: "pending", reference: "DEMO-2201" },
  { _id: "demo-payment-4", date: dateOffset(-35), doctor: "Dr. Sara Thomas", speciality: "Neurology", amount: 1500, method: "Card ending 7712", status: "refunded", reference: "DEMO-1484" },
  { _id: "demo-payment-5", date: dateOffset(-47), doctor: "Dr. Karthik Iyer", speciality: "Dermatology", amount: 900, method: "UPI · demo", status: "paid", reference: "DEMO-1097" },
];

export const DEMO_MEDICAL_RECORDS = [
  { id: "demo-record-1", title: "Annual wellness summary", date: dateOffset(-47), detail: "Routine visit · sample record" },
  { id: "demo-record-2", title: "Consultation notes", date: dateOffset(-18), detail: "Follow-up visit · sample record" },
  { id: "demo-record-3", title: "Prescription overview", date: dateOffset(-2), detail: "Illustrative demo entry · not a prescription" },
];
