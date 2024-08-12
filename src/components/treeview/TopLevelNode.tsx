import { AddCircleOutline } from "@mui/icons-material";
import { Box, Typography, IconButton } from "@mui/material";
import { ReactNode } from "react";

/**
 * A node in a treeview that supports "Adding" others below it
 */

export interface TopLevelNodeProps {
  label: ReactNode | string;
  title?: string;
  addCb?: () => void;
}
export const TopLevelNode = ({ label, title, addCb }: TopLevelNodeProps) => {
  return (
    <Box display={"flex"} justifyContent="space-between" gap="0.25rem">
      <Typography variant="body1">{label}</Typography>
      <IconButton
        size="small"
        title={title}
        onClick={(ev) => {
          // dont propagate event, otherwise the tree node will be toggled
          ev.stopPropagation();

          // call the add callback if defined
          addCb?.();
        }}
      >
        <AddCircleOutline fontSize="inherit" color="primary" />
      </IconButton>
    </Box>
  );
};
