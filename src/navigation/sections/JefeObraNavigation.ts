import {
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";

import {
  diariosNavigationOptions,
  drawTabConfig,
  defaultNavigationOptions
} from "./options";

import DiarioEjecucionScreen from "../../screens/diarios/DiarioEjecucionScreen";
import DiarioRechazadoScreen from "../../screens/diarios/DiarioRechazadoScreen";
import DiarioScreen from "../../screens/diarios/DiarioScreen";
import PersonalScreen from "../../screens/personal/PersonalScreen";
import HerramientaScreen from "../../screens/herramientas/HerramientaScreen";
import HerramientaNuevaScreen from "../../screens/herramientas/HerramientaNuevaScreen";
import ActividadesScreen from "../../screens/actividades/ActividadesScreen";
import MaterialesScreen from "../../screens/materiales/MaterialesScreen";
import TrabajoScreen from "../../screens/trabajo/TrabajoScreen";
import CalidadScreen from "../../screens/calidad/CalidadScreen";
import ClimaScreen from "../../screens/clima/ClimaScreen";
import ResumenScreen from "../../screens/resumen/ResumenScreen";
import PersonalDetalleScreen from "../../screens/personal/PersonalDetalleScreen";
import FotosScreen from "../../screens/fotos/FotosScreen";
import MaterialNuevaScreen from "../../screens/materiales/MaterialNuevaScreen";
import ActividadNuevaScreen from "../../screens/actividades/ActividadNuevaScreen";
import FirmaScreen from "../../screens/firma/FirmaScreen";
import DiarioDetalleScreen from "../../screens/diarios/DiarioDetalleScreen";
import MotivoRechazoScreen from "../../screens/diarios/DiarioMotivoRechazo";

const JefeObraTabNavigation = createMaterialTopTabNavigator(
  {
    Ejecucion: DiarioEjecucionScreen,
    Rechazados: DiarioRechazadoScreen
  },
  drawTabConfig
);

const JefeObraNavigation = createStackNavigator(
  {
    JefeDeObraScreen: {
      screen: JefeObraTabNavigation,
      navigationOptions: diariosNavigationOptions
    },
    JDODiario: { screen: DiarioScreen },
    JDODiarioDetalle: { screen: DiarioDetalleScreen},
    JDOPersonal: { screen: PersonalScreen },
    JDONewPersonal: { screen: PersonalDetalleScreen },
    JDOHerramientas: { screen: HerramientaScreen },
    JDOHerramientaNueva: {screen: HerramientaNuevaScreen},
    JDOActividades: { screen: ActividadesScreen },
    JDOActividadNueva: {screen: ActividadNuevaScreen},
    JDOMateriales: { screen: MaterialesScreen },
    JDOMaterialNueva: {screen: MaterialNuevaScreen},
    JDOTrabajo: { screen: TrabajoScreen },
    JDOCalidad: { screen: CalidadScreen },
    JDOClima: { screen: ClimaScreen },
    JDOVisualizar: { screen: ResumenScreen },
    JDOFotos: { screen: FotosScreen },
    JDOFirma: { screen: FirmaScreen },
    JDOMotivoRechazo: { screen: MotivoRechazoScreen }
  },
  {
    defaultNavigationOptions
  }
);

export default JefeObraNavigation;
