import express from "express";
import patientsService from "../services/patientsService";
import type { Request, Response, NextFunction } from "express";
import type {
  Entry,
  NewEntryData,
  NewPatientEntryData,
  NonSensitivePatientData,
  PatientData,
} from "../types";
import {
  NewHealthCheckEntrySchema,
  NewHospitalEntrySchema,
  NewOccupationalHealthcareEntrySchema,
  NewPatientEntrySchema,
} from "../utils";
import { z } from "zod";
import type { ParamsDictionary } from "express-serve-static-core";

const patientsRoute = express.Router();

patientsRoute.get("/", (_req, res: Response<NonSensitivePatientData[]>) => {
  res.send(patientsService.getNonSensitivePatients());
});

patientsRoute.get(
  "/:id",
  (req, res: Response<PatientData | { error: string }>) => {
    const { id } = req.params;
    const patient = patientsService.getPatient(id);
    if (patient) {
      res.send(patient);
    } else {
      res.status(400).send({ error: "not found !" });
    }
  }
);

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

patientsRoute.post(
  "/",
  newPatientParser,
  (
    /* we type the req.body if this md follows the parser fn successfully */
    req: Request<unknown, unknown, NewPatientEntryData>,
    res: Response<NonSensitivePatientData | string>
  ) => {
    try {
      const addedEntry = patientsService.addPatient(req.body);
      res.json(addedEntry);
    } catch (error: unknown) {
      let errorMessage = "Something went wrong.";
      if (error instanceof Error) {
        errorMessage += " Error: " + error.message;
      }
      res.status(400).send(errorMessage);
    }
  }
);

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const newEntry = req.body as unknown;
    if (!newEntry || !(typeof newEntry === "object") || !("type" in newEntry)) {
      throw new Error("invalid entry");
    }
    const entryType = newEntry.type as Entry["type"];

    switch (entryType) {
      case "HealthCheck":
        req.body = NewHealthCheckEntrySchema.parse(newEntry);
        break;
      case "OccupationalHealthcare":
        req.body = NewOccupationalHealthcareEntrySchema.parse(newEntry);
        break;
      case "Hospital":
        req.body = NewHospitalEntrySchema.parse(newEntry);
        break;
      default:
        throw new z.ZodError([
          {
            path: [],
            code: "invalid_literal",
            expected: ["HealthCheck", "OccupationalHealthcare", "Hospital"],
            received: entryType,
            message: "invalid entry type",
          },
        ]);
    }
    next();
  } catch (error: unknown) {
    next(error);
  }
};

patientsRoute.post(
  "/:id/entries",
  newEntryParser /* differ this md until the patient is found to optimize */,
  (
    req: Request<ParamsDictionary, unknown, NewEntryData>,
    res: Response<Entry | string>
  ) => {
    const { id } = req.params;
    try {
      const addedEntry = patientsService.addPatientEntry(id, req.body);
      res.json(addedEntry);
    } catch (error: unknown) {
      let errorMessage = "Something went wrong.";
      if (error instanceof Error) {
        errorMessage += " Error: " + error.message;
      }
      res.status(400).send(errorMessage);
    }
  }
);

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};
patientsRoute.use(errorMiddleware);
export default patientsRoute;
