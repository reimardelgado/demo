import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { ListItem, Input, colors } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";

import { Diario } from "../../models/Diario";
import { Calidad } from "../../models/Calidad";
import color from "../../styles/color";

export interface CalidadScreenProps {
  navigation: any;
  diario: Diario;
  perfil: any;
}

export interface CalidadScreenState {
  calidad: Calidad;
  loading: boolean;
}

class CalidadScreen extends Component<CalidadScreenProps, CalidadScreenState> {
  static navigationOptions = () => {
    return {
      title: "Calidad del diario"
    };
  };

  calidadPromise: utils.Cancellable = null;

  constructor(props: CalidadScreenProps) {
    super(props);

    this.state = {
      calidad: {},
      loading: true
    };
  }

  componentDidMount() {
    this.cargarCalidadDeDiario();
  }

  componentWillUnmount() {
    if (this.calidadPromise) this.calidadPromise.cancel();
  }

  cargarCalidadDeDiario() {
    this.calidadPromise = utils.makeCancellable(
      api.getCalidadDeDiario(this.props.diario.Id)
    );

    this.calidadPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ calidad: Data || {}, loading: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ calidad: {}, loading: false });
        }
      });
  }

  onSave = () => {
    this.state.calidad.LibroDiarioId = this.props.diario.Id;
    this.calidadPromise = utils.makeCancellable(
      api.saveCalidad(this.state.calidad)
    );
    this.calidadPromise.promise
      .then(({ data: { Data } }) => {
        Alert.alert("Calidad", "Datos guardados correctamente.");
        this.props.navigation.goBack();
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ calidad: {}, loading: false });
        }
      });
  };

  actualizarCalidad = (parametro: string) => {
    this.setState(prevState => {
      return {
        calidad: {
          ...prevState.calidad,
          [parametro]: !prevState.calidad[parametro]
        }
      };
    });
  };

  onTextChange = (text: string) => {
    this.setState(prevState => ({
      calidad: { ...prevState.calidad, Recomendacion: text }
    }));
  };

  render() {
    const { calidad, loading } = this.state;

    if (loading)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    return (
      <View style={styles.list}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccione los que considere 'SI'</Text>
          <TouchableOpacity onPress={this.onSave}>
            <MaterialIcons
              name="save"
              backgroundColor="transparent"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView style={{ marginBottom: 75 }}>
            <ListItem
              title="Correcta organización de buffers"
              checkBox={{
                checked: calidad.CorrectaOrganizacion || false,
                onPress: () => this.actualizarCalidad("CorrectaOrganizacion")
              }}
              onPress={() => this.actualizarCalidad("CorrectaOrganizacion")}
              bottomDivider
            />
            <ListItem
              title="Planos en Obra"
              checkBox={{
                checked: calidad.PlanesObra || false,
                onPress: () => this.actualizarCalidad("PlanesObra")
              }}
              onPress={() => this.actualizarCalidad("PlanesObra")}
              bottomDivider
            />
            <ListItem
              title="Correcta ubicación de reservas"
              checkBox={{
                checked: calidad.CorrectaUbicacion || false,
                onPress: () => this.actualizarCalidad("CorrectaUbicacion")
              }}
              onPress={() => this.actualizarCalidad("CorrectaUbicacion")}
              bottomDivider
            />
            <ListItem
              title="Existen cruces de fibra"
              checkBox={{
                checked: calidad.ExistenCruces || false,
                onPress: () => this.actualizarCalidad("ExistenCruces")
              }}
              onPress={() => this.actualizarCalidad("ExistenCruces")}
              bottomDivider
            />
            <ListItem
              title="Correctamente etiquetado"
              checkBox={{
                checked: calidad.CorrectoEtiquetado || false,
                onPress: () => this.actualizarCalidad("CorrectoEtiquetado")
              }}
              onPress={() => this.actualizarCalidad("CorrectoEtiquetado")}
              bottomDivider
            />
            <ListItem
              title="Pruebas de continuidad"
              checkBox={{
                checked: calidad.PruebasContinuidad || false,
                onPress: () => this.actualizarCalidad("PruebasContinuidad")
              }}
              onPress={() => this.actualizarCalidad("PruebasContinuidad")}
              bottomDivider
            />
            <ListItem
              title="Buena calidad del material"
              checkBox={{
                checked: calidad.BuenaCalidad || false,
                onPress: () => this.actualizarCalidad("BuenaCalidad")
              }}
              onPress={() => this.actualizarCalidad("BuenaCalidad")}
              bottomDivider
            />
            <ListItem
              title="Transporte adecuado"
              checkBox={{
                checked: calidad.TransporteAdecuado || false,
                onPress: () => this.actualizarCalidad("TransporteAdecuado")
              }}
              onPress={() => this.actualizarCalidad("TransporteAdecuado")}
              bottomDivider
            />
            <ListItem
              title="Correcta sujeción de fibra/cables"
              checkBox={{
                checked: calidad.CorrectaSujecion || false,
                onPress: () => this.actualizarCalidad("CorrectaSujecion")
              }}
              onPress={() => this.actualizarCalidad("CorrectaSujecion")}
              bottomDivider
            />
            <ListItem
              title="Empalme de fusión menor que 0.1dB"
              checkBox={{
                checked: calidad.EmpalmeFusion01 || false,
                onPress: () => this.actualizarCalidad("EmpalmeFusion01")
              }}
              onPress={() => this.actualizarCalidad("EmpalmeFusion01")}
              bottomDivider
            />
            <ListItem
              title="Empalme de fusión menor que 0.2dB"
              checkBox={{
                checked: calidad.EmpalmeFusion02 || false,
                onPress: () => this.actualizarCalidad("EmpalmeFusion02")
              }}
              onPress={() => this.actualizarCalidad("EmpalmeFusion02")}
              bottomDivider
            />
            <ListItem
              title="Conector mecánico menor que 0.8dB"
              checkBox={{
                checked: calidad.ConectorMecanico || false,
                onPress: () => this.actualizarCalidad("ConectorMecanico")
              }}
              onPress={() => this.actualizarCalidad("ConectorMecanico")}
              bottomDivider
            />
            <ListItem
              title="Correcto armado de conectores RJ45"
              checkBox={{
                checked: calidad.CorrectoArmado || false,
                onPress: () => this.actualizarCalidad("CorrectoArmado")
              }}
              onPress={() => this.actualizarCalidad("CorrectoArmado")}
              bottomDivider
            />
            <ListItem
              title="Ubicación de senos de FO"
              checkBox={{
                checked: calidad.UbicacionSeno || false,
                onPress: () => this.actualizarCalidad("UbicacionSeno")
              }}
              onPress={() => this.actualizarCalidad("UbicacionSeno")}
              bottomDivider
            />
            <ListItem
              title="Limpieza adecuada del sitio"
              checkBox={{
                checked: calidad.LimpiezaAdecuada || false,
                onPress: () => this.actualizarCalidad("LimpiezaAdecuada")
              }}
              onPress={() => this.actualizarCalidad("LimpiezaAdecuada")}
              bottomDivider
            />
            <ListItem
              title="Buen trato del cliente"
              checkBox={{
                checked: calidad.BuenTratoDelCliente || false,
                onPress: () => this.actualizarCalidad("BuenTratoDelCliente")
              }}
              onPress={() => this.actualizarCalidad("BuenTratoDelCliente")}
              bottomDivider
            />
            <ListItem
              title="¿Quedó bien instalado?"
              checkBox={{
                checked: calidad.CorrectaInstalacion || false,
                onPress: () => this.actualizarCalidad("CorrectaInstalacion")
              }}
              onPress={() => this.actualizarCalidad("CorrectaInstalacion")}
              bottomDivider
            />
            <ListItem
              title="¿Equipo instalado correctamente?"
              checkBox={{
                checked: calidad.QuedoBienInstalado || false,
                onPress: () => this.actualizarCalidad("QuedoBienInstalado")
              }}
              onPress={() => this.actualizarCalidad("QuedoBienInstalado")}
              bottomDivider
            />
            <Text
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                fontSize: 16
              }}
            >
              Recomendaciones
            </Text>
            <Input
              onChangeText={this.onTextChange}
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
            />
          </ScrollView>
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
)(CalidadScreen);
