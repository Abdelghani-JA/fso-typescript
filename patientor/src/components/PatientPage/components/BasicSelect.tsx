import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { NewEntryData } from "../../../types";
import { useEffect, useState } from "react";

interface Props {
  entry: NewHealthCheckEntry;
  setNewEntry: React.Dispatch<React.SetStateAction<NewHealthCheckEntry>>;
}

type NewHealthCheckEntry = Extract<NewEntryData, { type: "HealthCheck" }>;

export default function BasicSelect({ entry, setNewEntry }: Props) {
  const [rating, setRating] = useState("");

  useEffect(() => {
    setNewEntry({ ...entry, healthCheckRating: Number(rating) });
  }, [rating]);

  const handleChange = (event: SelectChangeEvent) => {
    setRating(event.target.value);
  };

  return (
    <Box>
      <FormControl sx={{ minWidth: 160 }} required>
        <InputLabel id="demo-simple-select-label">Patient's Health</InputLabel>
        <Select
          fullWidth
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={String(rating)}
          label="Patient's Health"
          onChange={handleChange}
        >
          <MenuItem value={0}>Healthy</MenuItem>
          <MenuItem value={1}>LowRisk</MenuItem>
          <MenuItem value={2}>HighRisk</MenuItem>
          <MenuItem value={3}>CriticalRisk</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
