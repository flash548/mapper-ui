import TerminalIcon from '@mui/icons-material/Terminal';
import { Box, Typography } from "@mui/material";

export interface ProgramIdsNodeProps {
  label: string,
}

export const ProgramIdsNode = ({ label }: ProgramIdsNodeProps) => {
  return (
    <Box
      display={"flex"}
      justifyContent="start"
      alignItems="center"
      gap="0.25rem"
    >
      <TerminalIcon fontSize="inherit" />
      <Typography variant="body1">{label}</Typography>
    </Box>
  );
};
