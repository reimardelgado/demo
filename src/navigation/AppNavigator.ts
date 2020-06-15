import { createAppContainer, createSwitchNavigator } from "react-navigation";

import AuthNavigation from "./AuthNavigation";
import AdminNavigation from "./sections/AdminNavigation";
import JefeObraNavigation from "./sections/JefeObraNavigation";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";
import LiderTecnicoNavigation from "./sections/LiderTecnicoNavigation";
import FiscalizadorNavigation from "./sections/FiscalizadorNavigation";

export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      AuthLoading: AuthLoadingScreen,
      Auth: AuthNavigation,
      Administrador: AdminNavigation,
      JefeDeObra: JefeObraNavigation,
      LiderTecnico: LiderTecnicoNavigation,
      Fiscalizador: FiscalizadorNavigation
    },
    { initialRouteName: "AuthLoading" }
  )
);
