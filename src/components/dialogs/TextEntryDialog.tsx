import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

/**
 * Simple modal dialog that allows entry of a text string
 */

export interface TextEntryDialogProps {
  title: string;
  open: boolean;

  /**
   * Callback fired with the user clicks OK
   * @param textEntered
   * @returns
   */
  entryCb: (textEntered: string) => void;
  closeCb: () => void;
}

export const TextEntryDialog = ({
  title,
  open,
  entryCb,
  closeCb,
}: TextEntryDialogProps) => {
  const [text, setText] = useState("");
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          value={text}
          label={"Name"}
          autoFocus
          autoCapitalize={"off"}
          autoComplete={"off"}
          variant={"standard"}
          required
          onChange={(ev) => setText(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeCb();
            setText("");
          }}
          variant="text"
          color="error"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={text.trim().length === 0}
          variant="text"
          onClick={() => {
            entryCb(text);
            setText("");
          }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
