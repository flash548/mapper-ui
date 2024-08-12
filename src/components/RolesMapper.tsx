import { AddCircleOutline } from "@mui/icons-material";
import SellIcon from "@mui/icons-material/Sell";
import { Box, Button, Chip } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useState } from "react";
import { ProgramDto } from "../openapi";
import {
  addRoleToProgram,
  addRoleToProgramForm,
  removeRoleFromProgram,
  removeRoleFromProgramForm,
  removeSecurityFunctionFromProgramFormRole,
  removeSecurityFunctionFromProgramRole,
} from "../service/api-service";
import { DeleteEntryDialogState } from "./ProgramsPanel";
import { DeleteConfirmationDialog } from "./dialogs/DeleteConfirmationDialog";
import { RolePickerDialog } from "./dialogs/RolePickerDialog";
import { RemovableNode } from "./treeview/RemovableNode";
import { SecurityFunctionsNode } from "./treeview/SecurityFunctionsNode";

export interface RolesMapperProps {
  program: ProgramDto;
  formName: string | undefined;
}

export interface RolesMapperDialogState {
  show: boolean;
  title: string;
  args: any;
  action: (...args: any) => Promise<void>;
}

export interface DeleteSecFuncFromRoleState {
  show: boolean;
  title: string;
  args: any;
  action: (...args: any) => Promise<void>;
}

export const RolesMapper = ({ program, formName }: RolesMapperProps) => {
  const [roleMapperDialogState, setRoleMapperDialogState] = useState<
    RolesMapperDialogState | undefined
  >(undefined);
  const [deleteEntryDialogState, setDeleteEntryDialogState] = useState<
    DeleteEntryDialogState | undefined
  >(undefined);

  const roleSelectionClose = () => {
    setRoleMapperDialogState(undefined);
  };
  const roleSelectionComplete = async (role: string, secFuncs: string[]) => {
    await roleMapperDialogState?.action?.apply(null, [
      ...roleMapperDialogState.args,
      role,
      secFuncs,
    ]);
    roleSelectionClose();
  };

  const deleteDialogClose = () => {
    setDeleteEntryDialogState(undefined);
  };
  const deleteAffirmed = async () => {
    await deleteEntryDialogState?.action?.apply(null, [
      ...deleteEntryDialogState.args,
    ]);
    deleteDialogClose();
  };

  const showRoleAssignmentPane = () => {
    if (!formName) {
      return (
        <>
          <Box sx={{ width: "100%" }} display="flex" justifyContent="end">
            <Button
              onClick={() => {
                setRoleMapperDialogState({
                  show: true,
                  title: "Add Role To Program",
                  args: [program.name],
                  action: addRoleToProgram,
                });
              }}
              startIcon={<AddCircleOutline />}
              variant="text"
            >
              Add Role To Program
            </Button>
          </Box>
          <SimpleTreeView expansionTrigger="iconContainer">
            {Object.keys(program.roleMappings ?? {})
              .sort()
              .map((roleItem, i) => (
                <TreeItem
                  key={`${roleItem}_${i}`}
                  itemId={`${roleItem}_${i}`}
                  label={
                    <RemovableNode
                      startIcon={<SellIcon />}
                      label={roleItem}
                      deleteCb={() =>
                        setDeleteEntryDialogState({
                          show: true,
                          args: [program.name, roleItem],
                          action: removeRoleFromProgram,
                        })
                      }
                    />
                  }
                >
                  <TreeItem
                    label={<SecurityFunctionsNode />}
                    itemId={`${roleItem}_${i}_Security_Functions`}
                  >
                    {program.roleMappings?.[roleItem]?.sort()?.map((sf, j) => {
                      return (
                        <TreeItem
                          key={`${roleItem}_${sf}_${j}`}
                          itemId={`${roleItem}_${sf}_${j}`}
                          label={
                            <RemovableNode
                              label={<Chip size="small" label={sf} />}
                              deleteCb={() =>
                                setDeleteEntryDialogState({
                                  show: true,
                                  args: [program.name, roleItem, sf],
                                  action: removeSecurityFunctionFromProgramRole,
                                })
                              }
                            />
                          }
                        />
                      );
                    })}
                  </TreeItem>
                </TreeItem>
              ))}
          </SimpleTreeView>
          <RolePickerDialog
            selectedProgram={program}
            open={!!roleMapperDialogState?.show}
            closeCb={roleSelectionClose}
            affirmCb={roleSelectionComplete}
          />
          <DeleteConfirmationDialog
            open={!!deleteEntryDialogState?.show}
            closeCb={deleteDialogClose}
            affirmCb={deleteAffirmed}
          />
        </>
      );
    }
    return (
      <>
        <Box sx={{ width: "100%" }} display="flex" justifyContent="end">
          <Button
            onClick={() => {
              setRoleMapperDialogState({
                show: true,
                title: "Add Role To Form",
                args: [program.name, formName],
                action: addRoleToProgramForm,
              });
            }}
            startIcon={<AddCircleOutline />}
            variant="text"
          >
            Add Role To Form
          </Button>
        </Box>
        <SimpleTreeView expansionTrigger="iconContainer">
          {Object.keys(
            program.forms?.find((frm) => frm.name === formName)?.roleMappings ??
              {}
          )
            ?.sort()
            ?.map((roleItem, i) => (
              <TreeItem
                key={`${roleItem}_${i}`}
                itemId={`${roleItem}_${i}`}
                label={
                  <RemovableNode
                    startIcon={<SellIcon />}
                    label={roleItem}
                    deleteCb={() =>
                      setDeleteEntryDialogState({
                        show: true,
                        args: [program.name, formName, roleItem],
                        action: removeRoleFromProgramForm,
                      })
                    }
                  />
                }
              >
                <TreeItem
                  label={<SecurityFunctionsNode />}
                  itemId={`${roleItem}_${i}_Security_Functions`}
                >
                  {program.forms
                    ?.find((frm) => frm.name === formName)
                    ?.roleMappings?.[roleItem]?.map((sf, j) => {
                      return (
                        <TreeItem
                          key={`${roleItem}_${sf}_${j}`}
                          itemId={`${roleItem}_${sf}_${j}`}
                          label={
                            <RemovableNode
                              label={<Chip size="small" label={sf} />}
                              deleteCb={() =>
                                setDeleteEntryDialogState({
                                  show: true,
                                  args: [program.name, formName, roleItem, sf],
                                  action: removeSecurityFunctionFromProgramFormRole,
                                })
                              }
                            />
                          }
                        />
                      );
                    })}
                </TreeItem>
              </TreeItem>
            ))}
        </SimpleTreeView>
        <RolePickerDialog
          selectedProgram={program}
          open={!!roleMapperDialogState?.show}
          closeCb={roleSelectionClose}
          affirmCb={roleSelectionComplete}
        />
        <DeleteConfirmationDialog
          open={!!deleteEntryDialogState?.show}
          closeCb={deleteDialogClose}
          affirmCb={deleteAffirmed}
        />
      </>
    );
  };

  return <>{showRoleAssignmentPane()}</>;
};
