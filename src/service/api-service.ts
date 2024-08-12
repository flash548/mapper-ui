import { roleApi } from "../App";
import { ProgramDto } from "../openapi";
import { useAppState } from "../state/state";

/**
 * Service functions for various API actions... calls the
 * OpenAPI generated functions.  Would be better to refactor to use
 * ReactQuery mutations to better manage global state updates
 */

export const addNewFormToProgram = async (
  programName: string,
  formName: string
) => {
  // send api mutation
  const modPrg = (await roleApi.postForm(programName, formName))?.data;

  // get back program and replace in state
  const updatedPrograms = useAppState.getState().programs.map((p) => {
    if (p.name === programName) {
      return { ...modPrg };
    }

    return p;
  });

  // update state
  useAppState.getState().setPrograms(updatedPrograms);
};

export const addNewSecurityFunctionToProgram = async (
  programName: string,
  securityFunctionName: string
) => {
  // send api mutation
  const modPrg = (
    await roleApi.postSecurityFunctions(programName, [securityFunctionName])
  )?.data;

  // get back program and replace in state
  const updatedPrograms = useAppState.getState().programs.map((p) => {
    if (p.name === programName) {
      return { ...modPrg };
    }

    return p;
  });

  useAppState.getState().setPrograms(updatedPrograms);
};

export const removeSecurityFunctionFromProgram = async (
  programName: string,
  securityFunctionName: string
) => {
  const modPrg = (
    await roleApi.removeSecurityFunction(programName, securityFunctionName)
  )?.data;
  const updatedPrograms = useAppState.getState().programs.map((p) => {
    if (p.name === programName) {
      return { ...modPrg };
    }

    return p;
  });
  useAppState.getState().setPrograms(updatedPrograms);
};

export const removeFormFromProgram = async (
  programName: string,
  formName: string
) => {
  const modPrg = (await roleApi.removeForm(programName, formName))?.data;
  const updatedPrograms = useAppState.getState().programs.map((p) => {
    if (p.name === programName) {
      return { ...modPrg };
    }

    return p;
  });
  useAppState.getState().setPrograms(updatedPrograms);
};

export const deleteProgram = async (programName: string) => {
  await roleApi.deleteProgram(programName);
  const updatedPrograms = useAppState.getState().programs.filter((p) => {
    if (p.name !== programName) {
      return p;
    }
  });
  useAppState.getState().setPrograms(updatedPrograms);
};

export const addNewProgram = async (programName: string) => {
  const newPrg = (await roleApi.postProgram(programName))?.data;

  // add new program to global state vs querying for the whole lot
  useAppState
    .getState()
    .setPrograms([...useAppState.getState().programs, newPrg]);
};

export const addNewRole = async (roleName: string) => {
  const newRole = (await roleApi.postRole(roleName))?.data;

  useAppState
    .getState()
    .setRoles([...(useAppState.getState().roles ?? []), newRole.name]);
};

export const deleteRole = async (roleName: string) => {
  await roleApi.deleteRole(roleName);

  useAppState
    .getState()
    .setRoles(
      useAppState.getState().roles?.filter((f) => f !== roleName) ?? []
    );
};

export const addRoleToProgram = async (
  programName: string,
  roleName: string,
  secFuncs: string[]
) => {
  const updatedProgram = (
    await roleApi.mapRoleToProgram(programName, roleName, secFuncs)
  )?.data;

  const updatedPrograms = useAppState.getState().programs.map((p) => {
    if (p.name === programName) {
      return { ...updatedProgram };
    }

    return p;
  });

  useAppState.getState().setPrograms(updatedPrograms);
};

export const addRoleToProgramForm = async (
  programName: string,
  formName: string,
  roleName: string,
  secFuncs: string[]
) => {
  const updatedProgram = (
    await roleApi.mapRoleToForm(programName, formName, roleName, secFuncs)
  )?.data;

  const updatedPrograms = useAppState.getState().programs.map((p) => {
    if (p.name === programName) {
      return { ...updatedProgram };
    }

    return p;
  });

  useAppState.getState().setPrograms(updatedPrograms);
};

export const removeRoleFromProgram = async (
  programName: string,
  roleName: string
) => {
  const updatedProgram = (
    await roleApi.removeRoleFromProgram(programName, roleName)
  )?.data;

  const updatedPrograms = useAppState.getState().programs.map((p) => {
    if (p.name === programName) {
      return { ...updatedProgram };
    }

    return p;
  });

  useAppState.getState().setPrograms(updatedPrograms);
};

export const removeRoleFromProgramForm = async (
  programName: string,
  formName: string,
  roleName: string
) => {
  const updatedProgram = (
    await roleApi.removeRoleFromProgramForm(programName, formName, roleName)
  )?.data;

  const updatedPrograms = useAppState.getState().programs.map((p) => {
    if (p.name === programName) {
      return { ...updatedProgram };
    }

    return p;
  });

  useAppState.getState().setPrograms(updatedPrograms);
};

export const removeSecurityFunctionFromProgramRole = async (
  programName: string,
  roleName: string,
  ...rest: any[]
) => {
  const program = useAppState
    .getState()
    .programs.find((p) => p.name === programName);

  // TODO: handle
  if (!program) return;

  const updatedProgram: ProgramDto = {
    ...program,
    roleMappings: { ...(program.roleMappings ?? {}) },
  };

  // hard coercion because we guarded against it above.
  // remove the old sec func from this role.
  const updatedSecFuncList = updatedProgram.roleMappings![roleName].filter(
    (i) => !rest.includes(i)
  );
  // apply the changes
  return addRoleToProgram(program.name!, roleName, updatedSecFuncList);
};

export const removeSecurityFunctionFromProgramFormRole = async (
  programName: string,
  formName: string,
  roleName: string,
  ...rest: any[]
) => {
  const program = useAppState
    .getState()
    .programs.find((p) => p.name === programName);

  // TODO: handle
  if (!program) return;

  // hard coercion because we guarded against it above.
  // remove the old sec func from this role.
  const updatedSecFuncList =
    program.forms
      ?.find((f) => f.name === formName)
      ?.roleMappings?.[roleName]?.filter((i) => !rest.includes(i)) ?? [];

  // apply the changes
  return addRoleToProgramForm(
    program.name!,
    formName,
    roleName,
    updatedSecFuncList
  );
};
