"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientsService_1 = __importDefault(require("../services/patientsService"));
const utils_1 = require("../utils");
const zod_1 = require("zod");
const patientsRoute = express_1.default.Router();
patientsRoute.get("/", (_req, res) => {
    res.send(patientsService_1.default.getNonSensitivePatients());
});
const newPatientParser = (req, _res, next) => {
    try {
        utils_1.NewPatientEntrySchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const errorMiddleware = (error, _req, res, next) => {
    if (error instanceof zod_1.z.ZodError) {
        res.status(400).send({ error: error.issues });
    }
    else {
        next(error);
    }
};
patientsRoute.post("/", newPatientParser, (
/* we type the req.body if this md follows the parser successfully */
req, res) => {
    try {
        const addedEntry = patientsService_1.default.addPatient(req.body);
        res.json(addedEntry);
    }
    catch (error) {
        let errorMessage = "Something went wrong.";
        if (error instanceof Error) {
            errorMessage += " Error: " + error.message;
        }
        res.status(400).send(errorMessage);
    }
});
patientsRoute.use(errorMiddleware);
exports.default = patientsRoute;
