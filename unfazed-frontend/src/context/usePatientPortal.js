import { useContext } from "react";
import PatientPortalContext from "./patientPortalContext";

export const usePatientPortal = () => useContext(PatientPortalContext);
