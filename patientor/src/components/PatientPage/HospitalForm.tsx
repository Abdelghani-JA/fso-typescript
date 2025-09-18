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

type NewHospitalEntry = Extract<NewEntryData, { type: "Hospital" }>;

export const HospitalForm = ({
  baseEntryData,
  setForm,
  form,
  diagnoses,
  patient,
  setPatient,
  setNotification,
}: Props) => {
  const entryData: NewHospitalEntry = {
    ...baseEntryData,
    type: "Hospital",
    discharge: {
      date: "",
      criteria: "",
    },
  };

  const [newEntry, setNewEntry] = useState<NewHospitalEntry>(entryData);
  const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const throwParseError = (e: string) => {
      throw new Error(e);
    };

    try {
      const newHospitalEntry: NewHospitalEntry = {
        type: "Hospital",
        description: newEntry.description || throwParseError("description"),
        date: newEntry.date || throwParseError("date"),
        specialist: newEntry.specialist || throwParseError("specialist"),
        diagnosisCodes: newEntry.diagnosisCodes,
        discharge: {
          date: newEntry.discharge.date || throwParseError("discharge date"),
          criteria:
            newEntry.discharge.criteria ||
            throwParseError("discharge criteria"),
        },
      };

      const entry = await patientService.createEntry(
        patient.id,
        newHospitalEntry
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
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              slotProps={{ textField: { size: "small" } }}
              label="Discharge date"
              value={dischargeDate}
              format="DD/MMM/YYYY"
              onChange={(newDate) => {
                if (newDate) {
                  setNewEntry({
                    ...newEntry,
                    discharge: {
                      ...newEntry.discharge,
                      date: newDate.toISOString().slice(0, 10),
                    },
                  });
                  setDischargeDate(newDate);
                }
              }}
            />
          </LocalizationProvider>
          <TextField
            required
            fullWidth
            size="small"
            id="outlined-required"
            label="Discharge criteria"
            value={newEntry.discharge.criteria}
            onChange={(event) =>
              setNewEntry({
                ...newEntry,
                discharge: {
                  ...newEntry.discharge,
                  criteria: event.target.value,
                },
              })
            }
          />
        </Box>
      </Box>
    </FormDialog>
  );
};
