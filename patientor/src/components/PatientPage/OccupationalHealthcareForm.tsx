import { useState } from "react";
import type {
  Diagnosis,
  FormType,
  NewBaseEntry,
  NewEntryData,
  Patient,
} from "../../types";
import FormDialog from "./components/FormDialog";
import { Box, TextField } from "@mui/material";
import { BaseEntryForm } from "./BaseEntryForm";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import patientService from "../../services/patients";
import { isAxiosError } from "axios";

interface Props {
  baseEntryData: NewBaseEntry;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  form: FormType;
  diagnoses: Diagnosis[] | undefined;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
  setNotification: React.Dispatch<
    React.SetStateAction<{
      type: string;
      message: string;
    }>
  >;
}

type NewOccupationalHealthcareEntry = Extract<
  NewEntryData,
  { type: "OccupationalHealthcare" }
>;

export const OccupationalHealthcareForm = ({
  baseEntryData,
  setForm,
  form,
  diagnoses,
  patient,
  setPatient,
  setNotification,
}: Props) => {
  const entryData: NewOccupationalHealthcareEntry = {
    ...baseEntryData,
    type: "OccupationalHealthcare",
    employerName: "",
    sickLeave: {
      startDate: "",
      endDate: "",
    },
  };

  const [newEntry, setNewEntry] =
    useState<NewOccupationalHealthcareEntry>(entryData);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  console.log(newEntry);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const throwParseError = (e: string) => {
      throw new Error(e);
    };

    const parseSickLeave = (
      newEntry: NewOccupationalHealthcareEntry
    ):
      | Record<PropertyKey, never>
      | { sickLeave: NewOccupationalHealthcareEntry["sickLeave"] }
      | undefined => {
      const { startDate, endDate } = newEntry.sickLeave!;
      if (!startDate && !endDate) return {};
      if (startDate && endDate) return { sickLeave: { startDate, endDate } };
      throwParseError("Sick Start or Leave is not correct");
    };

    try {
      const newOccupationalHealthcareEntry: NewOccupationalHealthcareEntry = {
        type: "OccupationalHealthcare",
        description: newEntry.description || throwParseError("description"),
        date: newEntry.date || throwParseError("date"),
        specialist: newEntry.specialist || throwParseError("specialist"),
        diagnosisCodes: newEntry.diagnosisCodes,
        employerName: newEntry.employerName || throwParseError("Employer name"),
        ...parseSickLeave(newEntry),
      };

      //console.log("our Entry: ", newOccupationalHealthcareEntry);

      const entry = await patientService.createEntry(
        patient.id,
        newOccupationalHealthcareEntry
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
        <TextField
          required
          fullWidth
          size="small"
          id="outlined-required"
          label="Employer name"
          defaultValue=""
          onChange={(event) =>
            setNewEntry({ ...newEntry, employerName: event.target.value })
          }
        />
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              slotProps={{ textField: { size: "small" } }}
              label="Sick leave start"
              value={startDate}
              format="DD/MMM/YYYY"
              onChange={(newDate) => {
                if (newDate) {
                  setNewEntry({
                    ...newEntry,
                    sickLeave: {
                      ...newEntry.sickLeave!,
                      startDate: newDate.toISOString().slice(0, 10),
                    },
                  });
                  setStartDate(newDate);
                }
              }}
            />
            <DatePicker
              slotProps={{ textField: { size: "small" } }}
              label="Sick leave end"
              value={endDate}
              format="DD/MMM/YYYY"
              onChange={(newDate) => {
                if (newDate) {
                  setNewEntry({
                    ...newEntry,
                    sickLeave: {
                      ...newEntry.sickLeave!,
                      endDate: newDate.toISOString().slice(0, 10),
                    },
                  });
                  setEndDate(newDate);
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
    </FormDialog>
  );
};
