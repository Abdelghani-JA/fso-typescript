import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import type { Diagnosis, FormType, NewBaseEntry, Patient } from "../../types";
import { HealthCheckForm } from "./HealthCheckForm";
import { OccupationalHealthcareForm } from "./OccupationalHealthcareForm";
import { HospitalForm } from "./HospitalForm";

interface Props {
  diagnoses: Diagnosis[] | undefined;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
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

export const EntryForm = ({
  diagnoses,
  patient,
  setPatient,
  setNotification,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [form, setForm] = useState<FormType>("");
  const open = Boolean(anchorEl);

  const baseEntryData: NewBaseEntry = {
    date: new Date().toISOString().slice(0, 10),
    description: "",
    specialist: "",
    diagnosisCodes: [],
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button id="basic-button" onClick={handleClick}>
        Add new Entry
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            setForm("HealthCheck");
            handleClose();
          }}
        >
          HealthCheck
        </MenuItem>
        <MenuItem
          onClick={() => {
            setForm("OccupationalHealthcare");
            handleClose();
          }}
        >
          OccupationalHealthcare
        </MenuItem>
        <MenuItem
          onClick={() => {
            setForm("Hospital");
            handleClose();
          }}
        >
          Hospital
        </MenuItem>
      </Menu>
      {form === "HealthCheck" && (
        <HealthCheckForm
          diagnoses={diagnoses}
          baseEntryData={baseEntryData}
          form={form}
          setForm={setForm}
          patient={patient}
          setPatient={setPatient}
          setNotification={setNotification}
        />
      )}
      {form === "OccupationalHealthcare" && (
        <OccupationalHealthcareForm
          diagnoses={diagnoses}
          baseEntryData={baseEntryData}
          form={form}
          setForm={setForm}
          setNotification={setNotification}
          patient={patient}
          setPatient={setPatient}
        />
      )}
      {form === "Hospital" && (
        <HospitalForm
          diagnoses={diagnoses}
          baseEntryData={baseEntryData}
          form={form}
          setForm={setForm}
          setNotification={setNotification}
          patient={patient}
          setPatient={setPatient}
        />
      )}
    </div>
  );
};
