import MapIcon from '@mui/icons-material/Map';
import { Box, Typography } from "@mui/material";

export const RoleMappingsNode = () => {
  return (
    <Box
      display={"flex"}
      justifyContent="start"
      alignItems="center"
      gap="0.25rem"
    >
      <MapIcon fontSize="inherit" />
      <Typography variant="body1">Role Mappings</Typography>
    </Box>
  );
};
