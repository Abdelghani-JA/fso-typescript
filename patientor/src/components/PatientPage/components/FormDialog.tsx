import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Fragment } from "react";
import { FormType } from "../../../types";
import { Divider } from "@mui/material";

interface Props {
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  children: React.ReactNode;
  form: FormType;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
}

export default function FormDialog({
  setForm,
  form,
  children,
  handleSubmit,
}: Props) {
  const handleClose = () => {
    setForm("");
  };

  return (
    <Fragment>
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>{form} entry</DialogTitle>
        <Divider></Divider>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            form="subscription-form"
            onClick={handleSubmit}
            variant="outlined"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
