import {
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";

import {
  diariosNavigationOptions,
  drawTabConfig,
  defaultNavigationOptions
} from "./options";

import DiarioAprobacionScreen from "../../screens/diarios/DiarioAprobacionScreen";
import DiarioRechazadoScreen from "../../screens/diarios/DiarioRechazadoScreen";
import DiarioScreen from "../../screens/diarios/DiarioScreen";
import ResumenScreen from "../../screens/resumen/ResumenScreen";
import DiarioDetalleScreen from "../../screens/diarios/DiarioDetalleScreen";
import MotivoRechazoScreen from "../../screens/diarios/DiarioMotivoRechazo";

const FiscalizadorTabNavigation = createMaterialTopTabNavigator(
  {
    Aprobados: DiarioAprobacionScreen,
    Rechazados: DiarioRechazadoScreen
  },
  drawTabConfig
);

const FiscalizadorNavigation = createStackNavigator(
  {
    FiscalizadorScreen: {
      screen: FiscalizadorTabNavigation,
      navigationOptions: diariosNavigationOptions
    },
    FCLDiario: { screen: DiarioScreen },
    FCLDiarioDetalle: { screen: DiarioDetalleScreen },
    FCLVisualizar: { screen: ResumenScreen },
    FCLMotivoRechazo: { screen: MotivoRechazoScreen }
  },
  {
    defaultNavigationOptions
  }
);

export default FiscalizadorNavigation;
