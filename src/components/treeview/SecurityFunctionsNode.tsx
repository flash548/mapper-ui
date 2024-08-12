import { LockOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export const SecurityFunctionsNode = () => {
  return (
    <Box
      display={"flex"}
      justifyContent="start"
      alignItems="center"
      gap="0.25rem"
    >
      <LockOutlined fontSize="inherit" />
      <Typography variant="body1">Security Functions</Typography>
    </Box>
  );
};
