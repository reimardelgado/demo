import { createStackNavigator } from "react-navigation";

import LoginScreen from "../screens/auth/login/LoginScreen";
import PerfilScreen from "../screens/perfil/PerfilScreen";
import RecoverPasswordScreen from "../screens/auth/recovery/RecoverPasswordScreen";

const AuthNavigation = createStackNavigator({
  Login: LoginScreen,
  Recovery: RecoverPasswordScreen,
  Perfil: PerfilScreen
});

export default AuthNavigation;
