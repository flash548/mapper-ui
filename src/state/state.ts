import { create } from "zustand";
import { ProgramDto } from "../openapi";

/**
 * Global app state type definition and store initialization
 */

export interface AppState {
  roles: string[] | undefined;
  setRoles: (roles: string[]) => void;
  programs: ProgramDto[];
  setPrograms: (programs: ProgramDto[]) => void;
  currentRole: string | undefined;
  setCurrentRole: (currentRole: string) => void;
  currentProgram: ProgramDto | undefined;
  setCurrentProgram: (currentProgram: ProgramDto) => void;
}

export const useAppState = create<AppState>((set) => ({
  roles: undefined,
  setRoles: (roles: string[]) => set(() => ({ roles })),
  programs: [],
  setPrograms: (programs: ProgramDto[]) => set(() => ({ programs })),
  currentRole: undefined,
  setCurrentRole: (currentRole: string) => set(() => ({ currentRole })),
  currentProgram: undefined,
  setCurrentProgram: (currentProgram: ProgramDto) =>
    set(() => ({ currentProgram })),
}));
