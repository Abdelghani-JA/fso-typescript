import { useState } from "react";
import { BaseEntryForm } from "./BaseEntryForm";
import type {
  Diagnosis,
  FormType,
  NewBaseEntry,
  NewEntryData,
  Patient,
} from "../../types";
import BasicSelect from "./components/BasicSelect";
import patientService from "../../services/patients";
import { isAxiosError } from "axios";
import FormDialog from "./components/FormDialog";
import { Box } from "@mui/material";

interface Props {
  diagnoses: Diagnosis[] | undefined;
  baseEntryData: NewBaseEntry;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  form: FormType;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
  setNotification: React.Dispatch<
    React.SetStateAction<{
      type: string;
      message: string;
    }>
  >;
}

export const HealthCheckForm = ({
  diagnoses,
  baseEntryData,
  setForm,
  patient,
  setPatient,
  setNotification,
  form,
}: Props) => {
  type NewHealthCheckEntry = Extract<NewEntryData, { type: "HealthCheck" }>;

  const entryData: NewHealthCheckEntry = {
    ...baseEntryData,
    type: "HealthCheck",
    healthCheckRating: 100,
  };

  const [newEntry, setNewEntry] = useState<NewHealthCheckEntry>(entryData);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const throwParseError = (e: string) => {
      throw new Error(e);
    };
    try {
      const newHealthCheckEntry: NewHealthCheckEntry = {
        type: "HealthCheck",
        description: newEntry.description || throwParseError("description"),
        date: newEntry.date || throwParseError("date"),
        specialist: newEntry.specialist || throwParseError("specialist"),
        diagnosisCodes: newEntry.diagnosisCodes,
        healthCheckRating:
          newEntry.healthCheckRating === 100
            ? throwParseError("health rating")
            : newEntry.healthCheckRating,
      };

      const entry = await patientService.createEntry(
        patient.id,
        newHealthCheckEntry
      );
      setPatient({ ...patient, entries: [...patient.entries, entry] });
      setForm("");
      setNotification({
        type: "success",
        message: "entry added successfully",
      });
    } catch (e: unknown) {
      if (!isAxiosError(e) && e instanceof Error)
        setNotification({
          type: "error",
          message: "Make sure you fill " + e.message + "field",
        });
      else
        setNotification({
          type: "error",
          message: "an error has occured",
        });
    }
  };

  return (
    <FormDialog setForm={setForm} form={form} handleSubmit={handleSubmit}>
      <Box
        component={"form"}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          padding: "0.5rem",
        }}
      >
        <BaseEntryForm
          entry={newEntry}
          setNewEntry={setNewEntry}
          diagnoses={diagnoses}
        />
        <BasicSelect entry={newEntry} setNewEntry={setNewEntry} />
      </Box>
    </FormDialog>
  );
};
