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
import DiarioEjecucionScreen from "../../screens/diarios/DiarioEjecucionScreen";
import DiarioRechazadoScreen from "../../screens/diarios/DiarioRechazadoScreen";
import DiarioScreen from "../../screens/diarios/DiarioScreen";
import PersonalScreen from "../../screens/personal/PersonalScreen";
import PersonalDetalleScreen from "../../screens/personal/PersonalDetalleScreen";
import HerramientaScreen from "../../screens/herramientas/HerramientaScreen";
import HerramientaNuevaScreen from "../../screens/herramientas/HerramientaNuevaScreen";
import ActividadesScreen from "../../screens/actividades/ActividadesScreen";
import MaterialesScreen from "../../screens/materiales/MaterialesScreen";
import TrabajoScreen from "../../screens/trabajo/TrabajoScreen";
import CalidadScreen from "../../screens/calidad/CalidadScreen";
import ClimaScreen from "../../screens/clima/ClimaScreen";
import ResumenScreen from "../../screens/resumen/ResumenScreen";
import FotosScreen from "../../screens/fotos/FotosScreen";
import MaterialNuevaScreen from "../../screens/materiales/MaterialNuevaScreen";
import ActividadNuevaScreen from "../../screens/actividades/ActividadNuevaScreen";
import FirmaScreen from '../../screens/firma/FirmaScreen'
import DiarioDetalleScreen from "../../screens/diarios/DiarioDetalleScreen";
import MotivoRechazoScreen from "../../screens/diarios/DiarioMotivoRechazo";

const AdminTabNavigation = createMaterialTopTabNavigator(
  {
    Ejecucion: DiarioEjecucionScreen,
    Aprobados: DiarioAprobacionScreen,
    Rechazados: DiarioRechazadoScreen
  },
  drawTabConfig
);

const AdminNavigation = createStackNavigator(
  {
    AdminScreen: {
      screen: AdminTabNavigation,
      navigationOptions: diariosNavigationOptions
    },
    ADMDiario: { screen: DiarioScreen },
    ADMDiarioDetalle: { screen: DiarioDetalleScreen},
    ADMMotivoRechazo: { screen: MotivoRechazoScreen },
    ADMPersonal: { screen: PersonalScreen },
    ADMNewPersonal: { screen: PersonalDetalleScreen },
    ADMHerramientas: { screen: HerramientaScreen },
    ADMHerramientaNueva: { screen: HerramientaNuevaScreen },
    ADMActividades: { screen: ActividadesScreen },
    ADMActividadNueva: { screen: ActividadNuevaScreen },
    ADMMateriales: { screen: MaterialesScreen },
    ADMMaterialNueva: { screen: MaterialNuevaScreen },
    ADMTrabajo: { screen: TrabajoScreen },
    ADMCalidad: { screen: CalidadScreen },
    ADMClima: { screen: ClimaScreen },
    ADMVisualizar: { screen: ResumenScreen },
    ADMFotos: { screen: FotosScreen },
    ADMFirma: { screen: FirmaScreen },
  },
  {
    defaultNavigationOptions
  }
);

export default AdminNavigation;
