import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";
import { apiBaseUrl } from "./constants";
import type { Diagnosis, Patient } from "./types";
import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";
import { Notification } from "./components/Notification";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | undefined>(
    undefined
  );
  const [notification, setNotification] = useState({ type: "", message: "" });

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  return (
    <div className="App">
      {notification.type && (
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      )}
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route
              path="/"
              element={
                <PatientListPage
                  patients={patients}
                  setPatients={setPatients}
                />
              }
            />
            <Route
              path=":id"
              element={
                <PatientPage
                  diagnoses={diagnoses}
                  setDiagnoses={setDiagnoses}
                  notification={notification}
                  setNotification={setNotification}
                />
              }
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
