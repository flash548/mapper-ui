import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Tab } from "@mui/material";
import React from "react";
import { ProgramsPanel } from "./ProgramsPanel";
import { RolesPanel } from "./RolesPanel";

/**
 * Container component holding the UI selectable tabs
 * @returns
 */

export enum TabPanelEnum {
  ROLES = "ROLES",
  PROGRAMS = "PROGRAMS",
}

export const MainPanel = () => {
  const [value, setValue] = React.useState<TabPanelEnum>(TabPanelEnum.ROLES);

  const handleChange = (_: React.SyntheticEvent, newValue: TabPanelEnum) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab label="Roles" value={TabPanelEnum.ROLES} />
            <Tab label="Programs" value={TabPanelEnum.PROGRAMS} />
          </TabList>
        </Box>
        <TabPanel value={TabPanelEnum.ROLES}>
          <RolesPanel />
        </TabPanel>
        <TabPanel value={TabPanelEnum.PROGRAMS}>
          <ProgramsPanel />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
