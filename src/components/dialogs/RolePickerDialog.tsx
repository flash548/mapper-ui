/**
 * Simple dialog for picking a role to assign to a resource.
 * Roles will be app wide so we can grab them from global state.
 */

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ProgramDto } from "../../openapi";
import { useAppState } from "../../state/state";

export interface RolePickerDialogProps {
  open: boolean;
  closeCb: () => void;
  affirmCb: (pickedRoleName: string, selectedSecFuncs: string[]) => void;
  selectedProgram: ProgramDto;
}

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
function getStyles(name: string, secFunc: readonly string[], theme: Theme) {
  return {
    fontWeight:
      secFunc.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightBold,
  };
}

export const RolePickerDialog = ({
  open,
  closeCb,
  selectedProgram,
  affirmCb,
}: RolePickerDialogProps) => {
  const theme = useTheme();
  const appState = useAppState();
  const [localRoles, setLocalRoles] = useState<string[]>(appState.roles ?? []);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    localRoles[0]
  );
  const [secFuncs] = useState<string[]>(
    selectedProgram.securityFunctions ?? []
  );
  const [selectedSecFuncs, setSelectedSecFuncs] = useState<string[]>([]);

  useEffect(() => {
    // filter out roles that are already assigned to this selected Program
    const newLocalRoles =
      appState.roles
        ?.sort()
        ?.filter(
          (name) =>
            !Object.keys(selectedProgram?.roleMappings ?? {}).includes(name)
        ) ?? [];
    setLocalRoles(newLocalRoles);

    if (newLocalRoles.length > 0) {
      setSelectedRole(newLocalRoles[0]);
      setSelectedSecFuncs([]);
    }
  }, [appState.roles, selectedProgram]);

  // handle role picker single select change
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as string);
  };

  // handle sec function picker multi select change
  const handleSecFuncChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedSecFuncs(
      typeof value === "string" ? value.split(",") : [...value]
    );
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Pick Role to Map</DialogTitle>
      <DialogContent>
        <FormControl sx={{ width: "100%" }}>
          <Select
            label="Role"
            variant="standard"
            sx={{ width: "100%" }}
            value={selectedRole}
            onChange={handleChange}
          >
            {localRoles.map((name, index) => {
              return (
                <MenuItem value={name} key={`${name}_${index}_item`}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>Role Name</FormHelperText>
        </FormControl>
        <FormControl variant="standard" sx={{ width: "100%" }}>
          <Select
            label="Security Functions"
            variant="standard"
            multiple
            sx={{ width: "100%" }}
            value={selectedSecFuncs}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            onChange={handleSecFuncChange}
            MenuProps={MenuProps}
          >
            {secFuncs.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, selectedSecFuncs, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Security Function Assignments</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            closeCb();
            setSelectedSecFuncs([]);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={selectedRole === undefined}
          onClick={() => {
            affirmCb(
              selectedRole! /* hard coercion because we disable otherwise */,
              selectedSecFuncs
            );
            setSelectedSecFuncs([]);
          }}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};
