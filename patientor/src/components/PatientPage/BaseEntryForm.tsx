import React, { useState } from "react";
import type { Diagnosis, NewEntryData } from "../../types";
import MultipleSelect from "./components/MultipleSelect";
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Box } from "@mui/material";

interface Props<T> {
  entry: T;
  setNewEntry: React.Dispatch<React.SetStateAction<T>>;
  diagnoses: Diagnosis[] | undefined;
}
export const BaseEntryForm = <Entry extends NewEntryData>({
  entry,
  setNewEntry,
  diagnoses,
}: Props<Entry>) => {
  const [value, setValue] = useState<Dayjs>(dayjs());

  return (
    <>
      <Box>
        <TextField
          required
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: "max-content",
            },
          }}
          id="outlined-required"
          label="Specialist"
          defaultValue=""
          onChange={(event) =>
            setNewEntry({ ...entry, specialist: event.target.value })
          }
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{
              width: {
                xs: "100%",
                sm: "max-content",
              },
            }}
            slotProps={{ textField: { size: "small" } }}
            label="Date"
            value={value}
            format="DD/MMM/YYYY"
            onChange={(newDate) => {
              if (newDate) {
                setNewEntry({
                  ...entry,
                  date: newDate.toISOString().slice(0, 10),
                });
                setValue(newDate);
              }
            }}
          />
        </LocalizationProvider>
      </Box>
      <TextField
        required
        size="medium"
        multiline
        id="outlined-required"
        label="Description"
        defaultValue=""
        onChange={(event) =>
          setNewEntry({ ...entry, description: event.target.value })
        }
      />

      <MultipleSelect
        diagnoses={diagnoses}
        entry={entry}
        setNewEntry={setNewEntry}
      />
    </>
  );
};
