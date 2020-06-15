import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Picker,
  ActivityIndicator,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Input, colors } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment-timezone";

import * as api from "../../api/apiService";
import { w } from "../../api/Dimensions";
import * as utils from "../../utils/utils";
import color from "../../styles/color";

import { Diario } from "../../models/Diario";
import { Registro, TipoTrabajoList } from "../../models/Registro";

interface TrabajoScreenProps {
  navigation: any;
  diario: Diario;
}
interface TrabajoScreenState {
  registro: Registro;
  loadingTrabajos: boolean;
  loadingRegistro: boolean;
  isDateTimePickerVisible: boolean;
  tipoTrabajoList: TipoTrabajoList[];
  tipoTrabajoSelect: TipoTrabajoList;
  pickerSelected: string;
}

class TrabajoScreen extends Component<TrabajoScreenProps, TrabajoScreenState> {
  static navigationOptions = () => {
    return {
      title: "Registro de trabajo del diario"
    };
  };

  registroPromise: utils.Cancellable = null;
  tipoTrabajoPromise: utils.Cancellable = null;
  dateSeleccionado: Input;

  readonly state: TrabajoScreenState = {
    registro: {},
    loadingTrabajos: true,
    loadingRegistro: true,
    isDateTimePickerVisible: false,
    tipoTrabajoList: [],
    tipoTrabajoSelect: {},
    pickerSelected: ""
  };

  componentDidMount() {
    this.loadTipoTrabajoList();
    this.cargarRegistroDeDiario();
  }

  componentWillUnmount() {
    if (this.registroPromise) this.registroPromise.cancel();
    if (this.tipoTrabajoPromise) this.tipoTrabajoPromise.cancel();
  }

  loadTipoTrabajoList() {
    this.tipoTrabajoPromise = utils.makeCancellable(api.getTipoTrabajoList());

    this.tipoTrabajoPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ tipoTrabajoList: Data || {}, loadingTrabajos: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ tipoTrabajoList: [], loadingTrabajos: false });
        }
      });
  }

  cargarRegistroDeDiario() {
    this.registroPromise = utils.makeCancellable(
      api.getRegistroDeDiario(this.props.diario.Id)
    );

    this.registroPromise.promise
      .then(response => {
        this.setState({
          registro: response || {},
          loadingRegistro: false
        });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ registro: {}, loadingRegistro: false });
        }
      });
  }

  actualizarRegistro = (parametro: string, valor: any) => {
    this.setState(prevState => {
      return {
        registro: {
          ...prevState.registro,
          [parametro]: valor
        }
      };
    });
  };

  onTextChange = (text: string) => {
    this.setState(prevState => ({
      registro: { ...prevState.registro, Observaciones: text }
    }));
  };

  showDateTimePicker = (value: string) => {
    this.setState({ isDateTimePickerVisible: true, pickerSelected: value });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = (date: Date) => {
    this.hideDateTimePicker();
    this.actualizarRegistro(this.state.pickerSelected, date);
  };

  onSave = () => {
    this.registroPromise = utils.makeCancellable(
      api.saveRegistroTrabajo(this.state.registro)
    );
    this.registroPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({
          loadingRegistro: false
        });
        Alert.alert("Registro de trabajo", "Datos guardados correctamente.");
        this.props.navigation.goBack();
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ registro: {}, loadingRegistro: false });
        }
      });
  };

  render() {
    const {
      registro,
      tipoTrabajoList,
      loadingTrabajos,
      loadingRegistro
    } = this.state;

    if (loadingTrabajos || loadingRegistro)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    return (
      <View style={styles.list}>
        <View style={styles.header}>
          <Text style={styles.title}>Trabajo realizado</Text>
          <TouchableOpacity onPress={this.onSave}>
            <MaterialIcons
              name="save"
              backgroundColor="transparent"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView style={{ padding: 8 }}>
            <Input
              label="Diario"
              inputStyle={styles.inputText}
              value={registro.CodigoDiario}
              onChangeText={() =>
                this.actualizarRegistro("CodigoDiario", registro.CodigoDiario)
              }
            />
            <Input
              label="Cliente"
              inputStyle={styles.inputText}
              value={registro.NombreCliente}
              onChangeText={() =>
                this.actualizarRegistro("NombreCliente", registro.NombreCliente)
              }
            />
            <Input
              label="Proyecto"
              inputStyle={styles.inputText}
              value={registro.NombreProyecto}
              onChangeText={() =>
                this.actualizarRegistro(
                  "NombreProyecto",
                  registro.NombreProyecto
                )
              }
            />
            <Input
              label="Orden"
              inputStyle={styles.inputText}
              value={registro.NombreOrden}
              onChangeText={() =>
                this.actualizarRegistro("NombreOrden", registro.NombreOrden)
              }
            />
            <Input
              label="Ciudad"
              inputStyle={styles.inputText}
              value={registro.Ciudad}
              onChangeText={() =>
                this.actualizarRegistro("Ciudad", registro.Ciudad)
              }
            />
            <Input
              label="Lugar"
              inputStyle={styles.inputText}
              placeholder="Entre lugar del trabajo"
              value={registro.Lugar}
              onChangeText={() =>
                this.actualizarRegistro("Lugar", registro.Lugar)
              }
            />
            <Text
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Tipo de trabajo
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={registro.TipoTrabajo}
              onValueChange={valor => this.actualizarRegistro("TipoTrabajo", valor)}
              mode="dialog"
            >
              {tipoTrabajoList.map((l, i) => {
                return (
                  <Picker.Item value={l.Id} label={l.Descripcion} key={i} />
                );
              })}
            </Picker>
            <Text
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Detalle del trabajo
            </Text>
            <Input
              onChangeText={value =>
                this.actualizarRegistro("Observaciones", value)
              }
              multiline={true}
              numberOfLines={5}
              textAlignVertical={"top"}
              containerStyle={{ width: "100%", padding: 8 }}
              inputContainerStyle={{
                borderWidth: 1,
                borderRadius: 5
              }}
              inputStyle={{
                height: null,
                padding: 8
              }}
              value={registro.Observaciones}
            />
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 8
              }}
            >
              <Input
                containerStyle={{ width: w(70) }}
                placeholder="Hora de Inicio"
                inputStyle={styles.inputText}
                value={moment(registro.HoraInicio).format("HH:mm")}
              />
              <TouchableOpacity
                onPress={() => this.showDateTimePicker("HoraInicio")}
                style={{ paddingTop: 10 }}
              >
                <MaterialIcons name="today" size={30} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 8
              }}
            >
              <Input
                containerStyle={{ width: w(70) }}
                placeholder="Hora de Fin"
                inputStyle={styles.inputText}
                value={moment(registro.HoraFin).format("HH:mm")}
              />
              <TouchableOpacity
                onPress={() => this.showDateTimePicker("HoraFin")}
                style={{ paddingTop: 10 }}
              >
                <MaterialIcons name="today" size={30} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 8
              }}
            >
              <Input
                containerStyle={{ width: w(70) }}
                placeholder="Hora de llegada"
                inputStyle={styles.inputText}
                value={moment(registro.HoraLlegada).format("HH:mm")}
              />
              <TouchableOpacity
                onPress={() => this.showDateTimePicker("HoraLlegada")}
                style={{ paddingTop: 10 }}
              >
                <MaterialIcons name="today" size={30} />
              </TouchableOpacity>
            </View>
            <Input
              label="Tiempo muerto"
              inputStyle={styles.inputText}
              placeholder="Entre tiempo muerto"
              value={
                registro.TiempoMuerto ? registro.TiempoMuerto.toString() : ""
              }
              onChangeText={(valor) =>
                this.actualizarRegistro("TiempoMuerto", valor)
              }
              keyboardType="numeric"
            />
            <Text
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                fontSize: 16
              }}
            >
              ¿ Por qué ?
            </Text>
            <Input
              onChangeText={valor => this.actualizarRegistro("PorQue", valor)}
              multiline={true}
              numberOfLines={5}
              textAlignVertical={"top"}
              containerStyle={{ width: "100%", padding: 8 }}
              inputContainerStyle={{
                borderWidth: 1,
                borderRadius: 5,
                marginBottom: 80
              }}
              inputStyle={{
                height: null,
                padding: 8
              }}
              value={registro.PorQue}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <DateTimePicker
          mode="time"
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          timeZoneOffsetInMinutes={-5 * 60}
          locale="es-EC"
        />
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
  }
});

const mapStateToProps = ({ diarios, auth }) => ({
  diario: diarios.diarioActual
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrabajoScreen);
