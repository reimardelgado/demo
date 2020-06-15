import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Picker,
  Alert,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Input, colors } from "react-native-elements";

import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";

import { Diario } from "../../models/Diario";
import { Clima } from "../../models/ClimaObras";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import color from "../../styles/color";

const estadosCLima = [
  {
    id: 0,
    descripcion: "Despejado"
  },
  {
    id: 1,
    descripcion: "Nublado"
  },
  {
    id: 2,
    descripcion: "Lluvia débil"
  },
  {
    id: 3,
    descripcion: "Lluvia intermitente"
  },
  {
    id: 4,
    descripcion: "Lluvia fuerte"
  }
];

interface ClimaScreenProps {
  navigation: any;
  diario: Diario;
}
interface ClimaScreenState {
  clima: Clima;
  loading: boolean;
}

class ClimaScreen extends Component<ClimaScreenProps, ClimaScreenState> {
  static navigationOptions = () => {
    return {
      title: "Registro de estado del clima"
    };
  };

  climaPromise: utils.Cancellable = null;
  dateSeleccionado: Input;

  constructor(props: ClimaScreenProps) {
    super(props);

    this.state = {
      clima: {},
      loading: true
    };
  }

  componentDidMount() {
    this.cargarClimaDeDiario();
  }

  componentWillUnmount() {
    if (this.climaPromise) this.climaPromise.cancel();
  }

  cargarClimaDeDiario() {
    this.climaPromise = utils.makeCancellable(
      api.getClimaDeDiario(this.props.diario.Id)
    );

    this.climaPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ clima: Data || {}, loading: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ clima: {}, loading: false });
        }
      });
  }

  actualizarClima = (parametro: string, valor: any) => {
    this.setState(prevState => {
      return {
        clima: {
          ...prevState.clima,
          [parametro]: valor
        }
      };
    });
  };

  onSave = () => {
    this.state.clima.LibroDiarioId = this.props.diario.Id;
    this.climaPromise = utils.makeCancellable(
      api.saveClimaObra(this.state.clima)
    );
    this.climaPromise.promise
      .then(({ data: { Data } }) => {
        Alert.alert("Clima", "Datos guardados correctamente.");
        this.props.navigation.goBack();
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ clima: {}, loading: false });
        }
      });
  };

  render() {
    const { clima, loading } = this.state;

    if (loading)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    return (
      <View style={styles.list}>
        <View style={styles.header}>
          <Text style={styles.title}>Estados del clima</Text>
          <TouchableOpacity onPress={this.onSave}>
            <MaterialIcons
              name="save"
              backgroundColor="transparent"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView behavior="padding">
          <View style={{ paddingHorizontal: 8 }}>
            <Text
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Mañana
            </Text>
            <Picker
              style={{ paddingHorizontal: 16 }}
              itemStyle={{ fontSize: 16 }}
              selectedValue={clima.Manana}
              onValueChange={valor => this.actualizarClima("Manana", valor)}
              mode="dropdown"
            >
              <Picker.Item value="0" label="Seleccione" />
              {estadosCLima.map((l, i) => {
                return (
                  <Picker.Item value={l.id} label={l.descripcion} key={i} />
                );
              })}
            </Picker>
            <Text
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Tarde
            </Text>
            <Picker
              itemStyle={{ fontSize: 16 }}
              selectedValue={clima.Tarde}
              onValueChange={valor => this.actualizarClima("Tarde", valor)}
              mode="dialog"
            >
              <Picker.Item value="0" label="Seleccione" />
              {estadosCLima.map((l, i) => {
                return (
                  <Picker.Item value={l.id} label={l.descripcion} key={i} />
                );
              })}
            </Picker>
            <Text
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Noche
            </Text>
            <Picker
              itemStyle={{ fontSize: 16 }}
              selectedValue={clima.Noche}
              onValueChange={valor => this.actualizarClima("Noche", valor)}
            >
              <Picker.Item value="0" label="Seleccione" />
              {estadosCLima.map((l, i) => {
                return (
                  <Picker.Item value={l.id} label={l.descripcion} key={i} />
                );
              })}
            </Picker>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    // marginTop: 10
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: colors.greyOutline
  },
  title: {
    fontSize: 18
  },
  inputText: {
    fontSize: 14
  },
  headerFooterContainer: {
    padding: 10,
    alignItems: "center"
  }
});

const mapStateToProps = ({ diarios }) => ({
  diario: diarios.diarioActual
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClimaScreen);
