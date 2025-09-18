"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const diagnosesService_1 = __importDefault(require("./services/diagnosesService"));
const patientsRoute_1 = __importDefault(require("./routes/patientsRoute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/api/ping", (_req, res) => {
    res.send("pong");
});
app.get("/api/diagnoses", (_req, res) => {
    res.send(diagnosesService_1.default.getDiagnoses());
});
app.use("/api/patients", patientsRoute_1.default);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
