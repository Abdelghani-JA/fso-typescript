import { useMatch } from "react-router-dom";
import type {
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
  Patient,
  Diagnosis,
  Entry,
} from "../../types";
import patientService from "../../services/patients";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { EntryForm } from "./EntryForm";

interface PatientPageProps {
  diagnoses: Diagnosis[] | undefined;
  setDiagnoses: React.Dispatch<React.SetStateAction<Diagnosis[] | undefined>>;
  notification: {
    type: string;
    message: string;
  };
  setNotification: React.Dispatch<
    React.SetStateAction<{
      type: string;
      message: string;
    }>
  >;
}

const HealthCheckEntry = ({ entry }: { entry: HealthCheckEntry }) => (
  <p>healthCheckRating {entry.healthCheckRating}</p>
);

const OccupationalHealthcareEntry = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <>
      <p>Employer : {entry.employerName}</p>
      {entry.sickLeave && (
        <>
          <p>sick Leave start :{entry.sickLeave.startDate}</p>
          <p>sick Leave end :{entry.sickLeave.endDate}</p>
        </>
      )}
    </>
  );
};

const HospitalEntry = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <>
      <p>discharge date: {entry.discharge.date}</p>
      <p>discharge criteria :{entry.discharge.criteria}</p>
    </>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} />;
    default:
      return <OccupationalHealthcareEntry entry={entry} />;
  }
};

const PatientPage = ({
  diagnoses,
  setDiagnoses,
  notification,
  setNotification,
}: PatientPageProps) => {
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const id = useMatch("/:id")?.params?.id;

  useEffect(() => {
    let cancelled = false;
    const fetchPatient = async (id: string) => {
      try {
        let patientData: Patient;
        let diagnosesData = diagnoses;
        if (!diagnosesData) {
          [patientData, diagnosesData] = await Promise.all([
            patientService.getPatient(id),
            patientService.getDiagnoses(),
          ]);
          if (!cancelled) setDiagnoses(diagnosesData);
        } else {
          patientData = await patientService.getPatient(id);
        }
        patientData.entries = patientData.entries.map((entry) => {
          if (entry.diagnosisCodes) {
            const diagnosisCodes = entry.diagnosisCodes.map((code) => {
              const diagnosis = diagnosesData.find(
                (diagnosis) => diagnosis.code === code
              );
              if (diagnosis) {
                return `${code} ${diagnosis.name}`;
              }
              return code;
            });
            return { ...entry, diagnosisCodes };
          }
          return entry;
        });
        if (!cancelled) setPatient(patientData);
      } catch (e: unknown) {
        if (!cancelled)
          if (isAxiosError(e) && e?.response?.data) {
            setMessage("Patient not found!");
            alert(e.response.data.error);
          } else {
            alert("network error!");
          }
      }
    };
    if (id) {
      fetchPatient(id);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return !patient ? (
    <p>{message}</p>
  ) : (
    <>
      <h3>{patient.name}</h3>
      <h4>{patient.gender}</h4>
      <h4>{patient.dateOfBirth}</h4>
      {patient.ssn && <h4>SSN : {patient.ssn}</h4>}
      <h4>Occupation : {patient.occupation}</h4>
      <EntryForm
        diagnoses={diagnoses}
        patient={patient}
        setPatient={setPatient}
        notification={notification}
        setNotification={setNotification}
      />
      {patient.entries.map((entry) => (
        <div
          key={entry.id}
          style={{ border: "1px solid black", padding: "5px" }}
        >
          <h4> date {entry.date}</h4>
          <h4>description : {entry.description}</h4>
          <h4>specialist : {entry.specialist}</h4>
          {entry.diagnosisCodes &&
            entry.diagnosisCodes.map((code) => <li key={code}>{code}</li>)}
          <EntryDetails entry={entry} />
        </div>
      ))}
    </>
  );
};

export default PatientPage;
