import { AddCircleOutline, RemoveCircle } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useEffect, useState } from "react";
import {
  addNewFormToProgram,
  addNewProgram,
  addNewSecurityFunctionToProgram,
  deleteProgram,
  removeFormFromProgram,
  removeSecurityFunctionFromProgram,
} from "../service/api-service";
import { useAppState } from "../state/state";
import { DeleteConfirmationDialog } from "./dialogs/DeleteConfirmationDialog";
import { RemovableNode } from "./treeview/RemovableNode";
import { TextEntryDialog } from "./dialogs/TextEntryDialog";
import { TopLevelNode } from "./treeview/TopLevelNode";
import { ProgramDto } from "../openapi";
import { RolesMapper } from "./RolesMapper";
import { SecurityFunctionsNode } from "./treeview/SecurityFunctionsNode";

/**
 * Component that handles creation of Programs and its underlying Forms
 * and SecurityFunctions.
 *
 */

export interface TextEntryDialogState {
  show: boolean;
  title: string;
  args: any;
  action: (...rest: any) => Promise<void>;
}

export interface DeleteEntryDialogState {
  show: boolean;
  args: any;
  action: (...rest: any) => Promise<void>;
}

export const ProgramsPanel = () => {
  const appState = useAppState();
  const [currentProgram, setCurrentProgram] = useState<ProgramDto | undefined>(
    undefined
  );
  const [currentForm, setCurrentForm] = useState<string | undefined>(undefined);

  const [textEntryDialogState, setTextEntryDialogState] = useState<
    TextEntryDialogState | undefined
  >(undefined);
  const [deleteEntryDialogState, setDeleteEntryDialogState] = useState<
    DeleteEntryDialogState | undefined
  >(undefined);

  useEffect(() => {
    // if program state changes, re-set the selected Program
    if (currentProgram) {
      setCurrentProgram(
        appState.programs.find((p) => p.name === currentProgram.name)
      );
    }
  }, [appState.programs]);

  const textEntryDialogClose = () => {
    setTextEntryDialogState(undefined);
  };
  const deleteDialogClose = () => {
    setDeleteEntryDialogState(undefined);
  };
  const textEntryComplete = async (text: string) => {
    await textEntryDialogState?.action?.apply(null, [
      ...textEntryDialogState.args,
      text,
    ]);
    textEntryDialogClose();
  };
  const deleteAffirmed = async () => {
    await deleteEntryDialogState?.action?.apply(null, [
      ...deleteEntryDialogState.args,
    ]);
    deleteDialogClose();
  };
  const getProgramFromState = (name: string) => {
    return appState.programs.find((i) => i.name === name);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{ width: "50%", paddingBottom: "1rem" }}
        display={"flex"}
        justifyContent={"end"}
      >
        <Button
          startIcon={<AddCircleOutline />}
          onClick={() => {
            setTextEntryDialogState({
              show: true,
              args: [],
              title: "Enter new Program Name",
              action: addNewProgram,
            });
          }}
          variant="outlined"
        >
          Add Program
        </Button>
      </Box>
      <Box
        sx={{ width: "100%" }}
        display="flex"
        justifyContent={"space-between"}
      >
        <Box sx={{ width: "50%" }}>
          <SimpleTreeView expansionTrigger="iconContainer">
            {appState.programs?.map((p, i) => {
              const prgName = p?.name ?? "";
              return (
                <TreeItem
                  key={`${prgName}_${i}`}
                  onClick={() => {
                    setCurrentProgram(getProgramFromState(prgName));
                    setCurrentForm(undefined);
                  }}
                  label={
                    <RemovableNode
                      label={prgName}
                      deleteCb={() =>
                        setDeleteEntryDialogState({
                          show: true,
                          args: [prgName],
                          action: deleteProgram,
                        })
                      }
                    />
                  }
                  itemId={prgName}
                >
                  <TreeItem
                    key={`${prgName}_${i}_form_elements`}
                    itemId={`${prgName}_form_elements`}
                    label={
                      <TopLevelNode
                        label={"Forms"}
                        title={"Add new form under program"}
                        addCb={() => {
                          setTextEntryDialogState({
                            show: true,
                            title: "Enter New Form Name",
                            args: [prgName],
                            action: addNewFormToProgram,
                          });
                        }}
                      />
                    }
                  >
                    {p.forms
                      ?.map((f) => f?.name ?? "")
                      ?.sort((a, b) => a.localeCompare(b))
                      ?.map((formName, j) => {
                        return (
                          <TreeItem
                            itemId={`${prgName}_${formName}`}
                            key={`${prgName}_${formName}_${j}`}
                            onClick={() => {
                              setCurrentProgram(getProgramFromState(prgName));
                              setCurrentForm(formName);
                            }}
                            label={
                              <RemovableNode
                                label={formName}
                                deleteCb={() =>
                                  setDeleteEntryDialogState({
                                    show: true,
                                    args: [prgName, formName],
                                    action: removeFormFromProgram,
                                  })
                                }
                              />
                            }
                          />
                        );
                      })}
                  </TreeItem>
                  <TreeItem
                    key={`${prgName}_${i}_sec_func_elements`}
                    itemId={`${prgName}_sec_func_elements`}
                    label={
                      <TopLevelNode
                        label={<SecurityFunctionsNode />}
                        title={"Add Security Function to Program"}
                        addCb={() => {
                          setTextEntryDialogState({
                            show: true,
                            title: "Enter New Sec Func Name",
                            args: [prgName],
                            action: addNewSecurityFunctionToProgram,
                          });
                        }}
                      />
                    }
                  >
                    {p.securityFunctions?.sort().map((f, j) => {
                      const secFunName = f ?? "";
                      return (
                        <TreeItem
                          itemId={`${prgName}_${secFunName}`}
                          key={`${prgName}_${secFunName}_${j}`}
                          label={
                            <RemovableNode
                              label={<Chip size="small" label={secFunName} />}
                              deleteCtrl={
                                <IconButton
                                  title="Remove Security Function"
                                  size="small"
                                  color="error"
                                >
                                  <RemoveCircle fontSize="inherit" />
                                </IconButton>
                              }
                              deleteCb={() =>
                                setDeleteEntryDialogState({
                                  show: true,
                                  args: [prgName, secFunName],
                                  action: removeSecurityFunctionFromProgram,
                                })
                              }
                            />
                          }
                        />
                      );
                    })}
                  </TreeItem>
                </TreeItem>
              );
            })}
          </SimpleTreeView>
        </Box>
        <Box sx={{ width: "45%" }}>
          {/* We have at least a program selected... */}
          {currentProgram ? (
            <>
              <Typography>Program: {currentProgram.name}</Typography>
              {currentForm ? (
                <Typography>Form: {currentForm}</Typography>
              ) : null}
              <RolesMapper program={currentProgram} formName={currentForm} />
            </>
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
