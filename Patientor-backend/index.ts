import express from "express";
import cors from "cors";
import diagnosesService from "./services/diagnosesService";
import type { NextFunction, Response, Request } from "express";
import type { DiagnosisData } from "./types";
import patientsRoute from "./routes/patientsRoute";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.get("/api/diagnoses", (_req, res: Response<DiagnosisData[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

app.use("/api/patients", patientsRoute);

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(error);
  res.status(400).send({ error: "unknown error has occured" });
};

app.use(errorMiddleware);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
