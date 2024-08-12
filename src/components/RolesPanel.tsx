import { AddCircleOutline } from "@mui/icons-material";
import SellIcon from "@mui/icons-material/Sell";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useEffect, useState } from "react";
import { roleApi } from "../App";
import { RoleWithProgramsDto, RoleWithProgramsListDto } from "../openapi";
import { addNewRole, deleteRole } from "../service/api-service";
import { useAppState } from "../state/state";
import { DeleteConfirmationDialog } from "./dialogs/DeleteConfirmationDialog";
import { TextEntryDialog } from "./dialogs/TextEntryDialog";
import { DeleteEntryDialogState, TextEntryDialogState } from "./ProgramsPanel";
import { RemovableNode } from "./treeview/RemovableNode";
import TerminalIcon from "@mui/icons-material/Terminal";
import { ProgramIdsNode } from "./treeview/ProgramIdsNode";
import { SecurityFunctionsNode } from "./treeview/SecurityFunctionsNode";
import { RoleMappingsNode } from "./treeview/RoleMappingsNode";

/**
 * Component for management of app-wide Role names
 */

export const RolesPanel = () => {
  const appState = useAppState();
  const [currentItem, setCurrentItem] = useState<string | undefined>(undefined);
  const [currentRoleDetails, setCurrentRoleDetails] = useState<
    RoleWithProgramsListDto | undefined
  >(undefined);
  const [fetchingRole, setFetchingRole] = useState(false);

  const [textEntryDialogState, setTextEntryDialogState] = useState<
    TextEntryDialogState | undefined
  >(undefined);
  const [deleteEntryDialogState, setDeleteEntryDialogState] = useState<
    DeleteEntryDialogState | undefined
  >(undefined);

  useEffect(() => {
    if (!currentItem) return;

    // fetch the associations for this role upon click...
    setFetchingRole(true);
    roleApi
      .getRoleDetails(currentItem)
      .then((resp) => {
        if (resp?.data) {
          setCurrentRoleDetails(resp.data);
        }
      })
      .catch() // TODO: handle
      .finally(() => setFetchingRole(false));
  }, [currentItem, appState.roles, appState.programs]);

  const textEntryDialogClose = () => {
    setTextEntryDialogState(undefined);
  };
  const deleteDialogClose = () => {
    setDeleteEntryDialogState(undefined);
  };
  const textEntryComplete = async (text: string) => {
    await textEntryDialogState?.action?.(text, "");
    textEntryDialogClose();
  };
  const deleteAffirmed = async () => {
    await deleteEntryDialogState?.action?.(...deleteEntryDialogState.args);
    deleteDialogClose();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ paddingBottom: "1rem" }}>
        <Typography>
          Here you can create/delete roles.
        </Typography>
        <Typography>
          Click on a Role to view how it is mapped across the various Programs and Forms.
        </Typography>
      </Box>
      <Box
        sx={{ width: "50%", paddingBottom: "1rem" }}
        display={"flex"}
        justifyContent={"end"}
      >
        <Button
          startIcon={<AddCircleOutline />}
          variant="outlined"
          onClick={() => {
            setTextEntryDialogState({
              show: true,
              args: [],
              title: "Enter new Role Name",
              action: addNewRole,
            });
          }}
        >
          Add Role
        </Button>
      </Box>
      <Box sx={{ width: "100%" }} display="flex">
        <Box sx={{ width: "50%" }}>
          <SimpleTreeView>
            {appState.roles?.map((role, i) => {
              return (
                <TreeItem
                  key={`${role}_${i}`}
                  onClick={() => {
                    setCurrentItem(role);
                  }}
                  label={
                    <RemovableNode
                      label={role}
                      startIcon={<SellIcon />}
                      title="Delete Role"
                      deleteCb={() =>
                        setDeleteEntryDialogState({
                          show: true,
                          args: [role],
                          action: deleteRole,
                        })
                      }
                    />
                  }
                  itemId={role}
                />
              );
            })}
          </SimpleTreeView>
        </Box>
        <Box sx={{ width: "50%", maxWidth: "50%", padding: "0.25rem" }}>
          {fetchingRole ? (
            <CircularProgress />
          ) : currentRoleDetails ? (
            <SimpleTreeView>
              {currentRoleDetails.roles?.map(
                (role: RoleWithProgramsDto, index) => {
                  return (
                    /* for each program... */
                    role.programs?.map((pgm, j) => {
                      return (
                        <Box key={`${role.roleName}_${pgm.name}_${j}`}>
                          <TreeItem
                            itemId={`${role.roleName}_${pgm.name}_${j}`}
                            label={<ProgramIdsNode label={pgm.name ?? ""} />}
                          >
                            {/* for each form... */}
                            <TreeItem
                              itemId={`${role.roleName}_${pgm.name}_${j}_Forms`}
                              label="Form IDs"
                            >
                              {pgm.forms?.map((form, f) => {
                                return (
                                  <TreeItem
                                    key={`${role.roleName}_${pgm.name}_${form.name}_${f}`}
                                    label={form.name}
                                    itemId={`${role.roleName}_${pgm.name}_${form.name}_${f}`}
                                  >
                                    {/*  for each rolemapping in that form (if it has any)... */}
                                    {Object.keys(
                                      form.roleMappings ?? {}
                                    ).flatMap((keyName) => {
                                      /* for each role mapping list its security functions therein... */
                                      return form.roleMappings?.[keyName]?.map(
                                        (secFuncName, m) => {
                                          return (
                                            <TreeItem
                                              itemId={`${role.roleName}_${pgm.name}_${form.name}_${keyName}_${secFuncName}_${m}`}
                                              key={`${role.roleName}_${pgm.name}_${form.name}_${keyName}_${secFuncName}_${m}`}
                                              label={
                                                <Chip
                                                  size="small"
                                                  label={secFuncName}
                                                />
                                              }
                                            />
                                          );
                                        }
                                      );
                                    })}
                                  </TreeItem>
                                );
                              })}
                            </TreeItem>
                          </TreeItem>

                          {Object.keys(pgm.roleMappings ?? {}).flatMap(
                            (keyName) => {
                              /* for each role mapping list its security functions therein... */
                              return pgm.roleMappings?.[keyName]?.map(
                                (secFuncName, m) => {
                                  return (
                                    <TreeItem
                                      itemId={`${role.roleName}_${pgm.name}_${keyName}_${secFuncName}_${m}`}
                                      key={`${role.roleName}_${pgm.name}_${keyName}_${secFuncName}_${m}`}
                                      label={
                                        <Chip
                                          size="small"
                                          label={secFuncName}
                                        />
                                      }
                                    />
                                  );
                                }
                              );
                            }
                          )}
                        </Box>
                      );
                    })
                  );
                }
              )}
            </SimpleTreeView>
          ) : null}
        </Box>
      </Box>
      <TextEntryDialog
        title={textEntryDialogState?.title ?? "Enter"}
        open={!!textEntryDialogState?.show}
        closeCb={textEntryDialogClose}
        entryCb={textEntryComplete}
      />
      <DeleteConfirmationDialog
        open={!!deleteEntryDialogState?.show}
        closeCb={deleteDialogClose}
        affirmCb={deleteAffirmed}
      />
    </Box>
  );
};
