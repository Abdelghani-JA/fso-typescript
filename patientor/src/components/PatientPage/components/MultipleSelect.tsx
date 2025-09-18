import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Diagnosis, NewEntryData } from "../../../types";
import { useEffect, useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props<T> {
  entry: T;
  setNewEntry: React.Dispatch<React.SetStateAction<T>>;
  diagnoses: Diagnosis[] | undefined;
}

function getStyles(name: string, diagnosisCodes: string[], theme: Theme) {
  return {
    fontWeight: diagnosisCodes.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect<Entry extends NewEntryData>({
  diagnoses,
  entry,
  setNewEntry,
}: Props<Entry>) {
  const theme = useTheme();
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>(
    entry.diagnosisCodes!
  );

  useEffect(() => {
    setNewEntry({ ...entry, diagnosisCodes: diagnosisCodes });
  }, [diagnosisCodes]);

  const handleChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    diagnoses && (
      <>
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-name-label">
            --Select diagnosis Code--
          </InputLabel>
          <Select
            label="--Select diagnosis Code--"
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={diagnosisCodes}
            onChange={handleChange}
            input={<OutlinedInput label="--Select diagnosis Code--" />}
            MenuProps={MenuProps}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem
                key={diagnosis.code}
                value={diagnosis.code}
                style={getStyles(diagnosis.code, diagnosisCodes, theme)}
              >
                {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    )
  );
}
