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
  
  const LiderTecnicoTabNavigation = createMaterialTopTabNavigator(
    {
      Aprobados: DiarioAprobacionScreen,
      Rechazados: DiarioRechazadoScreen
    },
    drawTabConfig
  );
  
  const LiderTecnicoNavigation = createStackNavigator(
    {
      LiderTecnicoScreen: {
        screen: LiderTecnicoTabNavigation,
        navigationOptions: diariosNavigationOptions
      },
      LTCDiario: { screen: DiarioScreen },
      LTCDiarioDetalle: { screen: DiarioDetalleScreen},      
      LTCVisualizar: { screen: ResumenScreen },
      LTCMotivoRechazo: { screen: MotivoRechazoScreen }
    },
    {
      defaultNavigationOptions
    }
  );
  
  export default LiderTecnicoNavigation;
  