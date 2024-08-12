import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import { ReactNode } from "react";
/**
 * A treeview node that supports "removing"/deleting itself
 */

export interface RemovableNodeProps {
  label: string | ReactNode;
  startIcon?: ReactNode;
  title?: string;
  deleteCtrl?: ReactNode;
  deleteCb?: () => void;
}
export const RemovableNode = ({
  label,
  startIcon,
  deleteCtrl,
  title,
  deleteCb,
}: RemovableNodeProps) => {
  return (
    <Box
      display={"flex"}
      justifyContent="space-between"
      alignItems="center"
      gap="0.25rem"
    >
      <Box display="flex" gap="0.25rem">
        {startIcon || null}
        <Typography variant="body1">{label}</Typography>
      </Box>
      {deleteCtrl || (
        <IconButton
          size="small"
          title={title}
          onClick={() => /* fire delete callback if defined */ deleteCb?.()}
        >
          <CloseIcon fontSize="inherit" color="error" />
        </IconButton>
      )}
    </Box>
  );
};
