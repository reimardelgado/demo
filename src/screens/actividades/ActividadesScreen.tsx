import React, { Component } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  Platform,
  Alert,
  View,
  TouchableOpacity
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native-gesture-handler";
import { ListItem, colors } from "react-native-elements";
import { connect } from "react-redux";

import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";

import FabButton from "../../components/buttons/FabButton";

import { Diario } from "../../models/Diario";
import { Actividad } from "../../models/Actividad";
import { Perfil } from "../../models/Perfil";
import color from "../../styles/color";

interface Props {
  navigation: any;
  diario: Diario;
  perfil: Perfil;
}
interface State {
  actividades: Actividad[];
  loading: boolean;
  seleccionado: number;
}

class ActividadesScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "Actividades del diario"
  };

  static propTypes = {};
  actividadesPromise = null;
  eliminarActividadCancellable: utils.Cancellable = null;
  actividadDetalleCancellable: utils.Cancellable = null;

  readonly state: State = {
    actividades: [],
    loading: true,
    seleccionado: 0
  };

  componentDidMount() {
    this.cargarActividades();
  }

  componentWillUnmount() {
    if (this.actividadesPromise) this.actividadesPromise.cancel();
    if (this.eliminarActividadCancellable)
      this.eliminarActividadCancellable.cancel();
  }

  cargarActividades = async () => {
    const { diario } = this.props;

    this.actividadesPromise = utils.makeCancellable(
      api.getActividadesDeDiario(diario.Id)
    );

    this.actividadesPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ actividades: Data, loading: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ actividades: [], loading: false });
        }
      });
  };

  _callNuevo = () => {
    this.props.navigation.navigate(`${this.props.perfil.prefix}ActividadNueva`);
  };

  _callEditar = (id: number) => {
    const { diario } = this.props;

    this.actividadDetalleCancellable = utils.makeCancellable(
      api.getActividadDetalle(diario.Id, id)
    );

    this.actividadDetalleCancellable.promise
      .then(({ data: { Data } }) => {
        this.props.navigation.navigate(
          `${this.props.perfil.prefix}ActividadNueva`,
          { item: Data }
        );
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ actividades: [], loading: false });
        }
      });
  };

  eliminarActividad = (valor: string) => {
    Alert.alert(
      "Eliminar actividad",
      valor + " será eliminado(a) del diario. ¿Desea continuar?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Eliminar", onPress: this.doEliminarActividad }
      ],
      { cancelable: false }
    );
  };

  doEliminarActividad = () => {
    const { seleccionado } = this.state;

    this.eliminarActividadCancellable = utils.makeCancellable(
      api.eliminarActividad(seleccionado)
    );

    this.eliminarActividadCancellable.promise
      .then(() => {
        const actividades = this.state.actividades.filter(
          item => item.Id != seleccionado
        );
        this.setState({ actividades, seleccionado: 0, loading: false });
        Alert.alert("", "Registro eliminado");
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          Alert.alert("Eliminar actividad", "Error eliminado actividad");
        }
      });
  };

  render() {
    const { actividades, loading } = this.state;

    const subtitle = (item: Actividad) => {
      let _str = `Planificado: ${item.Planificado} ${item.UniDescripcion}`;
      _str = _str.concat(
        `\nUtilizado: ${item.Sobrante} ${item.UniDescripcion}`
      );
      if (item.Detalle) {
        const Detalle = (item.Detalle as string).trim();
        _str = Boolean(Detalle) ? _str.concat(`\n${Detalle}`) : _str;
      }
      return _str;
    };

    const renderIcon = (item: Actividad) => {
      if (this.state.seleccionado === item.Id) {
        return <MaterialIcons name="check-box" size={20} />;
      }
      return <MaterialIcons name="keyboard-arrow-right" size={20} />;
    };

    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}></Text>
          <TouchableOpacity onPress={this.cargarActividades}>
            <MaterialIcons
              name="refresh"
              backgroundColor="transparent"
              size={30}
            />
          </TouchableOpacity>
        </View>
        {this.state.seleccionado > 0 && (
          <View style={styles.header}>
            <Text
              style={styles.title}
              onPress={() => this.setState({ seleccionado: 0 })}
            >
              Cancelar
            </Text>
            <TouchableOpacity onPress={() => this.doEliminarActividad()}>
              <MaterialIcons
                name="delete"
                backgroundColor="transparent"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={actividades}
          refreshing={loading}
          onRefresh={() => {}}
          keyExtractor={(item, index) => `${item.Id.toString()}-${index}`}
          renderItem={({ item }) => (
            <TouchableHighlight
              onLongPress={() => this.setState({ seleccionado: item.Id })}
              onPress={() => this._callEditar(item.ActividadId)}
            >
              <ListItem
                containerStyle={[
                  styles.containerStyle,
                  this.state.seleccionado === item.Id ? styles.selected : null
                ]}
                title={`${item.Codigo}:   ${item.Descripcion}`}
                subtitle={subtitle(item)}
                subtitleStyle={styles.subtitleStyle}
                bottomDivider
                rightIcon={renderIcon(item)}
              />
            </TouchableHighlight>
          )}
        />
        <FabButton
          onPress={() => {
            this._callNuevo();
          }}
          child={<MaterialIcons name="add" size={24} color="white" />}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: { paddingVertical: 8 },
  selected: { backgroundColor: "#b8b8b8" },
  subtitleStyle: { lineHeight: 20 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.greyOutline
  },
  inputText: {
    fontSize: 14
  },
  title: {
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        fontSize: 17
      },
      default: {
        fontSize: 16
      }
    })
  },
  subtitle: {
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        fontSize: 15
      },
      default: {
        color: color.androidSecondary,
        fontSize: 14
      }
    })
  }
});

const mapStateToProps = ({ diarios, auth }) => ({
  diario: diarios.diarioActual,
  perfil: auth.perfil
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActividadesScreen);
