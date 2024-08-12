import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

/**
 * A modal delete confirmation dialog
 */

export interface DeleteConfirmationDialogProps {
  open: boolean;
  affirmCb: () => void; // fired on user confirming delete action
  closeCb: () => void;
}

export const DeleteConfirmationDialog = ({
  open,
  affirmCb,
  closeCb,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Delete Confirm</DialogTitle>
      <DialogContent>Are you sure you want to delete this?</DialogContent>
      <DialogActions>
        <Button onClick={closeCb}>No</Button>
        <Button type="submit" color="error" onClick={affirmCb}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
