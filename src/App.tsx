import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import "./App.css";
import { MainPanel } from "./components/MainPanel";
import { RoleMappingControllerApi } from "./openapi/api";
import { useAppState } from "./state/state";

export const roleApi = new RoleMappingControllerApi(undefined, "/api");

function App() {
  const appState = useAppState();

  /**
   * On initial app load, ask the API for roles and programs it has
   */
  useEffect(() => {
    roleApi
      .getPrograms()
      .then((prg) => appState.setPrograms(prg?.data?.programs ?? []))
      .catch();  // TODO: handle this

    roleApi
      .getRoles()
      .then((roles) =>
        appState.setRoles(roles?.data?.roles?.map((r) => r.name) ?? [])
      )
      .catch(); // TODO: handle this
  }, []);

  /**
   * Dont show the MainPanel until we at least get roles downloaded
   */
  return <>{(appState.roles && <MainPanel />) || <CircularProgress />}</>;
}

export default App;
