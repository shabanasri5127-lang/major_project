import { PatientPortalContext } from "./patientPortalContext";

const PatientPortalProvider = ({ value, children }) => (
  <PatientPortalContext.Provider value={value}>{children}</PatientPortalContext.Provider>
);

export default PatientPortalProvider;
