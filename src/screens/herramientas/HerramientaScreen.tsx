import React, { Component } from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  View,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { ListItem, colors } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native-gesture-handler";

import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";

import FabButton from "../../components/buttons/FabButton";
import { Diario } from "../../models/Diario";
import color from "../../styles/color";
import { Herramienta } from "../../models/Herramienta";

interface HerramientaScreenProps {
  navigation: any;
  diario: Diario;
  perfil: any;
}
interface HerramientaScreenState {
  herramientas: Herramienta[];
  loading: boolean;
  seleccionado: number;
}

class HerramientaScreen extends Component<
  HerramientaScreenProps,
  HerramientaScreenState
> {
  static navigationOptions = {
    title: "Herramientas del diario"
  };

  static propTypes = {};
  herramientasPromise = null;
  eliminarHerramientaCancellable: utils.Cancellable = null;
  herramientaDetalleCancellable: utils.Cancellable = null;

  readonly state: HerramientaScreenState = {
    herramientas: [],
    loading: true,
    seleccionado: 0
  };

  componentDidMount() {
    this.cargarListadoHerramientas();
  }

  componentWillUnmount() {
    if (this.herramientasPromise) this.herramientasPromise.cancel();
    if (this.eliminarHerramientaCancellable)
      this.eliminarHerramientaCancellable.cancel();
  }

  cargarListadoHerramientas = async () => {
    const { diario } = this.props;

    this.herramientasPromise = utils.makeCancellable(
      api.getHerramientasDeDiario(diario.Id)
    );

    this.herramientasPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ herramientas: Data, loading: false });
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ herramientas: [], loading: false });
        }
      });
  };

  _callNuevo = () => {
    this.props.navigation.navigate(
      `${this.props.perfil.prefix}HerramientaNueva`
    );
  };

  _callEditar = (id: number) => {
    const { diario } = this.props;

    this.herramientaDetalleCancellable = utils.makeCancellable(
      api.getHerramientaDetalle(diario.Id, id)
    );

    this.herramientaDetalleCancellable.promise
      .then(({ data: { Data } }) => {
        console.log(Data);
        this.props.navigation.navigate(
          `${this.props.perfil.prefix}HerramientaNueva`,
          { item: Data }
        );
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ herramientas: [], loading: false });
        }
      });
  };

  eliminarHerramienta = () => {
    Alert.alert(
      "Eliminar herramienta",
      "La herramienta será eliminado(a) del diario. ¿Desea continuar?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Eliminar", onPress: this.doEliminarHerramienta }
      ],
      { cancelable: false }
    );
  };

  doEliminarHerramienta = () => {
    const { seleccionado } = this.state;

    this.eliminarHerramientaCancellable = utils.makeCancellable(
      api.eliminarHerramienta(seleccionado)
    );

    this.eliminarHerramientaCancellable.promise
      .then(() => {
        const herramientas = this.state.herramientas.filter(
          item => item.Id != seleccionado
        );
        this.setState({ herramientas, seleccionado: 0, loading: false });
        Alert.alert("", "Registro eliminado");
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          Alert.alert("Eliminar herramienta", "Error eliminado herramienta");
        }
      });
  };

  render() {
    const { herramientas, loading } = this.state;

    const subtitle = item => {
      let _str = `Cantidad: ${item.Cantidad} ${item.UniDescripcion}`;
      _str = _str.concat(`\nEstado: ${item.Estado}`);

      return _str;
    };

    const renderIcon = (item: Herramienta) => {
      if (this.state.seleccionado === item.Id) {
        return <MaterialIcons name="check-box" size={20} />;
      }
      return <MaterialIcons name="keyboard-arrow-right" size={20} />;
    };

    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}></Text>
          <TouchableOpacity onPress={this.cargarListadoHerramientas}>
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
            <TouchableOpacity onPress={() => this.eliminarHerramienta()}>
              <MaterialIcons
                name="delete"
                backgroundColor="transparent"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={herramientas}
          refreshing={loading}
          onRefresh={() => {}}
          keyExtractor={(item, index) => `${item.Id.toString()}-${index}`}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => {}}>
              <ListItem
                title={item.Descripcion}
                subtitle={subtitle(item)}
                containerStyle={[
                  styles.containerStyle,
                  this.state.seleccionado === item.Id ? styles.selected : null
                ]}
                subtitleStyle={styles.subtitleStyle}
                bottomDivider
                rightIcon={renderIcon(item)}
                onLongPress={() => this.setState({ seleccionado: item.Id })}
                onPress={() => this._callEditar(item.HerramientaId)}
              />
            </TouchableHighlight>
          )}
        />
        <FabButton
          onPress={() => this._callNuevo()}
          child={<MaterialIcons name="add" size={24} color="white" />}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: { paddingHorizontal: 16, paddingVertical: 8 },
  selected: { backgroundColor: "#b8b8b8" },
  subtitleStyle: { lineHeight: 20 },
  fab: {
    // position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    backgroundColor: "#1b5e20",
    borderRadius: 30,
    ...Platform.select({
      android: {
        elevation: 8
      }
    })
  },
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
  perfil: auth.perfil,
  diarios: diarios.diarios,
  diario: diarios.diarioActual
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HerramientaScreen);
