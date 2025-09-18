import patientsData from "../data/patients";
import { v4 as uuidv4 } from "uuid";
import type {
  PatientData,
  NonSensitivePatientData,
  NewPatientEntryData,
  Entry,
  NewEntryData,
} from "../types";

const getPatients = (): PatientData[] => {
  return patientsData;
};

const getNonSensitivePatients = (): NonSensitivePatientData[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string) => {
  return patientsData.find((patient) => patient.id === id);
};

const addPatient = (
  newPatientEntry: NewPatientEntryData
): NonSensitivePatientData => {
  const newPatient = {
    ...newPatientEntry,
    id: uuidv4(),
    entries: [],
  };
  patientsData.push(newPatient);
  const { ssn: _ssn, ...addedPatient } = newPatient;
  return addedPatient;
};

const addPatientEntry = (id: string, entry: NewEntryData): Entry => {
  const patient = patientsData.find((patient) => patient.id === id);
  if (!patient) {
    throw new Error("Patient not found !");
  }
  const newEntry: Entry = {
    ...entry,
    id: uuidv4(),
    diagnosisCodes: entry.diagnosisCodes ? entry.diagnosisCodes : [],
  };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatient,
  addPatientEntry,
};
