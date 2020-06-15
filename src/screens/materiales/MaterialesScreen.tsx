import React, { Component } from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  Alert,
  View,
  Platform
} from "react-native";
import { connect } from "react-redux";
import {
  TouchableHighlight,
  TouchableOpacity
} from "react-native-gesture-handler";
import { ListItem, colors } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";

import FabButton from "../../components/buttons/FabButton";
import { Diario } from "../../models/Diario";
import { Material } from "../../models/Material";
import { Perfil } from "../../models/Perfil";
import color from "../../styles/color";

interface MaterialesScreenProps {
  navigation: any;
  diario: Diario;
  perfil: Perfil;
}
interface MaterialesScreenState {
  materiales: Material[];
  loading: boolean;
  seleccionado: number;
}

class MaterialesScreen extends Component<
  MaterialesScreenProps,
  MaterialesScreenState
> {
  static navigationOptions = {
    title: "Materiales del diario"
  };

  static propTypes = {};
  materialesPromise = null;
  eliminarMaterialCancellable: utils.Cancellable = null;
  materialDetalleCancellable: utils.Cancellable = null;

  constructor(props: MaterialesScreenProps) {
    super(props);

    this.state = {
      materiales: [],
      loading: true,
      seleccionado: 0
    };
  }

  componentDidMount() {
    this.cargarMateriales();
  }

  componentWillUnmount() {
    if (this.materialesPromise) this.materialesPromise.cancel();
    if (this.eliminarMaterialCancellable)
      this.eliminarMaterialCancellable.cancel();
  }

  cargarMateriales = async () => {
    const { diario } = this.props;

    this.materialesPromise = utils.makeCancellable(
      api.getMaterialesDeDiario(diario.Id)
    );

    this.materialesPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ materiales: Data, loading: false });
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ materiales: [], loading: false });
        }
      });
  };

  _callNuevo = () => {
    this.props.navigation.navigate(`${this.props.perfil.prefix}MaterialNueva`);
  };

  _callEditar = (id: number) => {
    const { diario } = this.props;

    this.materialDetalleCancellable = utils.makeCancellable(
      api.getMaterialDetalle(diario.Id, id)
    );

    this.materialDetalleCancellable.promise
      .then(({ data: { Data } }) => {
        console.log(Data);
        this.props.navigation.navigate(
          `${this.props.perfil.prefix}MaterialNueva`,
          { item: Data }
        );
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ materiales: [], loading: false });
        }
      });
  };

  eliminarMaterial = (valor: string) => {
    Alert.alert(
      "Eliminar material",
      valor + " será eliminado(a) del diario. ¿Desea continuar?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Eliminar", onPress: this.doEliminarMaterial }
      ],
      { cancelable: false }
    );
  };

  doEliminarMaterial = () => {
    const { seleccionado } = this.state;

    this.eliminarMaterialCancellable = utils.makeCancellable(
      api.eliminarMaterial(seleccionado)
    );

    this.eliminarMaterialCancellable.promise
      .then(() => {
        const materiales = this.state.materiales.filter(
          item => item.Id != seleccionado
        );
        this.setState({ materiales, seleccionado: 0, loading: false });
        Alert.alert("", "Registro eliminado");
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          Alert.alert("Eliminar material", "Error eliminado material");
        }
      });
  };

  render() {
    const { materiales, loading } = this.state;

    const subtitle = (item: Material) => {
      let _str = `Panificado: ${item.Planificado} ${item.UniDescripcion}`;
      _str = _str.concat(
        `\nUtilizado: ${item.Sobrante}  ${item.UniDescripcion}`
      );
      if (item.Detalle) {
        const detalle = item.Detalle.trim();
        _str = Boolean(detalle) ? _str.concat(`\n${detalle}`) : _str;
      }

      return _str;
    };

    const renderIcon = (item: Material) => {
      if (this.state.seleccionado === item.Id) {
        return <MaterialIcons name="check-box" size={20} />;
      }
      return <MaterialIcons name="keyboard-arrow-right" size={20} />;
    };

    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}></Text>
          <TouchableOpacity onPress={this.cargarMateriales}>
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
            <TouchableOpacity onPress={() => this.doEliminarMaterial()}>
              <MaterialIcons
                name="delete"
                backgroundColor="transparent"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={materiales}
          refreshing={loading}
          onRefresh={() => {}}
          keyExtractor={(item, index) => `${item.Id.toString()}-${index}`}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => {}}>
              <ListItem
                title={item.Descripcion}
                subtitle={subtitle(item)}
                subtitleStyle={styles.subtitleStyle}
                containerStyle={[
                  styles.containerStyle,
                  this.state.seleccionado === item.Id ? styles.selected : null
                ]}
                bottomDivider
                rightIcon={renderIcon(item)}
                onLongPress={() => this.setState({ seleccionado: item.Id })}
                onPress={() => this._callEditar(item.MaterialId)}
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
  containerStyle: { paddingHorizontal: 16, paddingVertical: 8 },
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
)(MaterialesScreen);
