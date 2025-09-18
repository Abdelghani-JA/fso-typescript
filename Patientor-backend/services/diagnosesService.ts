import diagnosesData from "../data/diagnoses";
import type { DiagnosisData } from "../types";

export const getDiagnoses = (): DiagnosisData[] => {
  return diagnosesData;
};

export default { getDiagnoses };
