export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum HealthCheckRating /* why export ? */ {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
  "never" = 100,
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}
export type NewBaseEntry = Omit<BaseEntry, "id">;

/* export type NewHealthCheckEntry = Omit<
  HealthCheckEntry,
  "id" | "healthCheckRating"
> & { healthCheckRating: HealthCheckRating | "" }; */

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export type NewEntryData = UnionOmit<Entry, "id">;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth: string;
  entries: Entry[];
}

/* 
there is a patient type global and one specific !
we did n
*/

export type PatientFormValues = Omit<Patient, "id" | "entries">;

export type FormType =
  | ""
  | "HealthCheck"
  | "OccupationalHealthcare"
  | "Hospital";
