import doctorOneImage from "../assets/doc1.png";
import doctorTwoImage from "../assets/doc2.png";
import patientOneImage from "../assets/demo-patient-one.svg";
import patientTwoImage from "../assets/demo-patient-two.svg";

const demoAvatars = {
  "doctor1@example.com": doctorOneImage,
  "doctor2@example.com": doctorTwoImage,
  "patient1@example.com": patientOneImage,
  "patient2@example.com": patientTwoImage,
};

export const addDemoAvatars = (value) => {
  if (Array.isArray(value)) return value.map(addDemoAvatars);
  if (!value || typeof value !== "object") return value;

  const decorated = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, addDemoAvatars(child)]),
  );
  const email = typeof decorated.email === "string" ? decorated.email.toLowerCase() : "";
  if (!decorated.image && demoAvatars[email]) {
    decorated.image = demoAvatars[email];
  }
  return decorated;
};
