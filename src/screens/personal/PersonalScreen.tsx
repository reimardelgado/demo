import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Avatar, ListItem, colors } from "react-native-elements";
import { TouchableHighlight } from "react-native-gesture-handler";
import Moment from "moment";

import color from "../../styles/color";
import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";
import { h } from "../../api/Dimensions";

import FabButton from "../../components/buttons/FabButton";
import { Diario } from "../../models/Diario";
import { Personal, PersonaDetalle } from "../../models/Personal";
import { MaterialIcons } from "@expo/vector-icons";

interface PersonalScreenProps {
  navigation: any;
  diario: Diario;
  perfil: any;
}
interface PersonalScreenState {
  personal: Personal[];
  loading: boolean;
  seleccionado: number;
  personaDetalle: PersonaDetalle;
}

class PersonalScreen extends Component<
  PersonalScreenProps,
  PersonalScreenState
> {
  static navigationOptions = {
    title: "Personal asignado"
  };

  constructor(props: PersonalScreenProps) {
    super(props);

    this.state = {
      personal: [],
      loading: true,
      seleccionado: 0,
      personaDetalle: {}
    };
  }

  personalAsignadoPromise = null;
  eliminarPersonaCancellable: utils.Cancellable = null;
  personaDetalleCancellable: utils.Cancellable = null;

  componentDidMount() {
    this.cargarPersonalAsignado();
  }

  componentWillUnmount() {
    if (this.personalAsignadoPromise) this.personalAsignadoPromise.cancel();
    if (this.eliminarPersonaCancellable)
      this.eliminarPersonaCancellable.cancel();
    if (this.personaDetalleCancellable) this.personaDetalleCancellable.cancel();
  }

  cargarPersonalAsignado = async () => {
    const { diario } = this.props;

    this.personalAsignadoPromise = utils.makeCancellable(
      api.getPersonalDeDiario(diario.Id)
    );

    this.personalAsignadoPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ personal: Data, loading: false });
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ personal: [], loading: false });
        }
      });
  };

  _callNuevo = () => {
    this.props.navigation.navigate(`${this.props.perfil.prefix}NewPersonal`);
  };

  _callEditar = (id: number) => {
    const { diario } = this.props;

    this.personaDetalleCancellable = utils.makeCancellable(
      api.getPersonalDetalleDiario(diario.Id, id)
    );

    this.personaDetalleCancellable.promise
      .then(({ data: { Data } }) => {
        this.props.navigation.navigate(
          `${this.props.perfil.prefix}NewPersonal`,
          { item: Data }
        );
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ personal: [], loading: false });
        }
      });
  };

  eliminarPersona = () => {
    Alert.alert(
      "Eliminar persona",
      "La persona será eliminada del diario. ¿Desea continuar?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Eliminar", onPress: this.doEliminarPersona }
      ],
      { cancelable: false }
    );
  };

  doEliminarPersona = () => {
    const { seleccionado } = this.state;

    this.eliminarPersonaCancellable = utils.makeCancellable(
      api.eliminarPersona(seleccionado)
    );

    this.eliminarPersonaCancellable.promise
      .then(() => {
        const personal = this.state.personal.filter(
          item => item.Id != seleccionado
        );
        this.setState({ personal, seleccionado: 0, loading: false });
        Alert.alert("", "Registro eliminado");
      })
      .catch((reason: any) => {
        console.log(reason);
        if (reason.isCanceled) {
          Alert.alert("Eliminar persona", "Error eliminado persona");
        }
      });
  };

  render() {
    const { personal, loading } = this.state;

    const title = (personal: Personal) => (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text style={[styles.title, styles.expanded]} numberOfLines={1}>
          {personal.NombreCompleto}
        </Text>
        <Text style={styles.title}>
          {Moment(personal.HoraInicio).format("H:mm")}
          {" - "}
          {Moment(personal.HoraFin).format("H:mm")}
        </Text>
      </View>
    );

    const renderIcon = (item: Personal) => {
      if (this.state.seleccionado === item.Id) {
        return <MaterialIcons name="check-box" size={20} />;
      }
      return <></>;
    };

    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}></Text>
          <TouchableOpacity onPress={this.cargarPersonalAsignado}>
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
            <TouchableOpacity onPress={() => this.eliminarPersona()}>
              <MaterialIcons
                name="delete"
                backgroundColor="transparent"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={personal}
          refreshing={loading}
          onRefresh={() => {}}
          keyExtractor={(item, index) => `${item.Id.toString()}-${index}`}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => {}}>
              <ListItem
                title={title(item)}
                subtitle={item.Funcion}
                subtitleStyle={styles.subtitle}
                containerStyle={[
                  styles.containerStyle,
                  ,
                  this.state.seleccionado === item.Id ? styles.selected : null
                ]}
                bottomDivider
                rightIcon={renderIcon(item)}
                leftAvatar={
                  <Avatar
                    rounded
                    title={item.NombreCompleto[0].toUpperCase()}
                    size={h(6.5)}
                    overlayContainerStyle={{
                      backgroundColor: utils.getRandomColor(
                        item.NombreCompleto.charCodeAt(0)
                      )
                    }}
                  />
                }
                onLongPress={() => this.setState({ seleccionado: item.Id })}
                onPress={() => this._callEditar(item.PersonaId)}
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
  expanded: {
    flex: 1,
    paddingRight: 15
  },
  selected: { backgroundColor: "#b8b8b8" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    alignItems: "center",
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
  },
  containerStyle: { padding: 12 },
  subtitleStyle: { lineHeight: 20 },
  seleted: {
    opacity: 0.5,
    backgroundColor: colors.grey3
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
)(PersonalScreen);
