import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Picker,
  Alert,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Input, colors, ListItem } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";

import * as api from "../../api/apiService";
import { w } from "../../api/Dimensions";
import * as utils from "../../utils/utils";

import { Diario } from "../../models/Diario";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { PersonaDetalle, PersonalList } from "../../models/Personal";
import FuncionDetalle from "../../models/FuncionDetalle";
import { Perfil } from "../../models/Perfil";
import color from "../../styles/color";
import moment from "moment-timezone";

import Autocomplete from "react-native-autocomplete-input";

interface PersonalDetalleScreenProps {
  navigation: any;
  diario: Diario;
  perfil: Perfil;
}
interface PersonalDetalleScreenState {
  personaDetalle: PersonaDetalle;
  personaList: PersonalList[];
  funcionList: FuncionDetalle[];
  loadingPersonalList: boolean;
  loadingFuncionList: boolean;
  isDateTimePickerVisible: boolean;
  pickerSelected: string;
  query: string;
}

class PersonalDetalleScreen extends Component<
  PersonalDetalleScreenProps,
  PersonalDetalleScreenState
> {
  static navigationOptions = () => {
    return {
      title: "Registro de persona"
    };
  };

  static renderPersonal(act) {
    const { Descripcion, Id } = act;
    return (
      <View>
        <Text style={styles.itemText}>{Descripcion}</Text>
      </View>
    );
  }

  personaDetallePromise: utils.Cancellable = null;
  personaListPromise: utils.Cancellable = null;
  funcionListPromise: utils.Cancellable = null;
  dateSeleccionado: Input;

  constructor(props: PersonalDetalleScreenProps) {
    super(props);

    this.state = {
      personaDetalle: {},
      loadingPersonalList: true,
      loadingFuncionList: true,
      isDateTimePickerVisible: false,
      personaList: [],
      funcionList: [],
      pickerSelected: "",
      query: ""
    };
  }

  componentDidMount() {
    this.loadPersonalList();
    this.loadFuncionList();
    if (this.props.navigation.state.params != null) {
      let item = this.props.navigation.state.params.item;
      if (item != null) {
        this.state.personaDetalle.Id = item.Id;
        this.state.personaDetalle.LibroObraId = this.props.diario.Id;
        this.state.personaDetalle.PersonalId = item.PersonalId;
        this.state.personaDetalle.Funcion = item.Funcion;
        this.state.personaDetalle.Casco = item.Casco;
        this.state.personaDetalle.Botas = item.Botas;
        this.state.personaDetalle.Camiseta = item.Camiseta;
        this.state.personaDetalle.Chaleco = item.Chaleco;
        this.state.personaDetalle.Gafas = item.Gafas;
        this.state.personaDetalle.Tarjeta = item.tarjeta;
        this.state.personaDetalle.Guantes = item.Guantes;
        this.state.personaDetalle.Observaciones = item.Observaciones;
        this.state.personaDetalle.HoraInicio = item.HoraInicio;
        this.state.personaDetalle.HoraFin = item.HoraFin;
        // console.log(personaDetalle);
      }
    }
  }

  componentWillUnmount() {
    if (this.personaDetallePromise) this.personaDetallePromise.cancel();
    if (this.personaListPromise) this.personaListPromise.cancel();
    if (this.funcionListPromise) this.funcionListPromise.cancel();
  }

  loadPersonalList() {
    this.personaListPromise = utils.makeCancellable(api.getPersonalList());

    this.personaListPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ personaList: Data || {}, loadingPersonalList: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ personaList: [], loadingPersonalList: false });
        }
      });
  }

  loadFuncionList() {
    this.funcionListPromise = utils.makeCancellable(api.getFuncionList());

    this.funcionListPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ funcionList: Data || {}, loadingFuncionList: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ funcionList: [], loadingFuncionList: false });
        }
      });
  }

  actualizarDato = (parametro: string, valor: any) => {
    this.setState(prevState => {
      return {
        personaDetalle: {
          ...prevState.personaDetalle,
          [parametro]: valor
        }
      };
    });
  };

  actualizarCheck = (parametro: string) => {
    this.setState(prevState => {
      return {
        personaDetalle: {
          ...prevState.personaDetalle,
          [parametro]: !prevState.personaDetalle[parametro]
        }
      };
    });
  };

  onTextChange = (text: string) => {
    this.setState(prevState => ({
      personaDetalle: { ...prevState.personaDetalle, Observaciones: text }
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
    this.actualizarDato(this.state.pickerSelected, date);
  };

  onSave = () => {
    console.log(this.state.personaDetalle.PersonalId);
    if (
      this.state.personaDetalle.PersonalId == 0 ||
      this.state.personaDetalle.Funcion == 0 
    ) {
      Alert.alert("Error", "Debe completar todos los campos.");
    } else {
      this.state.personaDetalle.LibroObraId = this.props.diario.Id;
      this.personaDetallePromise = utils.makeCancellable(
        api.saveDetallePersona(this.state.personaDetalle)
      );
      this.personaDetallePromise.promise
        .then(({ data: { Data } }) => {
          Alert.alert("Registro persona", "Datos guardados correctamente.");
          this.props.navigation.navigate(`${this.props.perfil.prefix}Personal`);
        })
        .catch(reason => {
          if (reason.isCanceled) {
            console.log("isCanceled", reason.isCanceled);
          } else {
            this.setState({
              personaDetalle: {},
              loadingPersonalList: false,
              loadingFuncionList: false
            });
          }
        });
    }
  };

  findPersonal(query) {
    if (query === "") {
      return [];
    }
    const { personaList } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return personaList.filter(x => x.Descripcion.search(regex) >= 0);
  }

  render() {
    const { navigation } = this.props;
    const {
      //personaList,
      funcionList,
      personaDetalle,
      loadingPersonalList,
      loadingFuncionList,
      query
    } = this.state;

    if (loadingPersonalList || loadingFuncionList)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

      const personaList = this.findPersonal(query);
      const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
  
    return (
      <View style={styles.list}>
        <View style={styles.header}>
          <Text style={styles.title}>Persona</Text>
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
          <Text
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Persona
            </Text>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              data={
                personaList.length === 1 &&
                comp(query, personaList[0].Descripcion)
                  ? []
                  : personaList
              }
              defaultValue={query}
              onChangeText={valor => this.setState({ query: valor })}
              keyExtractor={(item, index) => `${item.Id.toString()}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { 
                      this.actualizarDato("PersonalId", item.Id);
                      this.setState({query: item.Descripcion});
                    }}
                >
                  <Text style={styles.inputText}>{item.Descripcion}</Text>
                </TouchableOpacity>
              )}
            />
            {/* <Text
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Persona
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={personaDetalle.PersonalId}
              onValueChange={value => this.actualizarDato("PersonalId", value)}
              mode="dialog"
            >
              <Picker.Item value="0" label="Seleccione" />
              {personaList.map((l, i) => {
                return (
                  <Picker.Item value={l.Id} label={l.Descripcion} key={i} />
                );
              })}
            </Picker> */}
            <Text
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Función
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={personaDetalle.Funcion}
              onValueChange={value => this.actualizarDato("Funcion", value)}
              mode="dialog"
            >
              <Picker.Item value="0" label="Seleccione" />
              {funcionList.map((a, i) => {
                return (
                  <Picker.Item value={a.Id} label={a.Descripcion} key={i} />
                );
              })}
            </Picker>
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
                value={moment(personaDetalle.HoraInicio).format("HH:mm")}
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
                value={moment(personaDetalle.HoraFin).format("HH:mm")}
              />
              <TouchableOpacity
                onPress={() => this.showDateTimePicker("HoraFin")}
                style={{ paddingTop: 10 }}
              >
                <MaterialIcons name="today" size={30} />
              </TouchableOpacity>
            </View>
            <ListItem
              title="Casco"
              checkBox={{
                checked: personaDetalle.Casco || false,
                onPress: () => this.actualizarCheck("Casco")
              }}
              onPress={() => this.actualizarCheck("Casco")}
              bottomDivider
            />
            <ListItem
              title="Botas"
              checkBox={{
                checked: personaDetalle.Botas || false,
                onPress: () => this.actualizarCheck("Botas")
              }}
              onPress={() => this.actualizarCheck("Botas")}
              bottomDivider
            />
            <ListItem
              title="Camiseta"
              checkBox={{
                checked: personaDetalle.Camiseta || false,
                onPress: () => this.actualizarCheck("Camiseta")
              }}
              onPress={() => this.actualizarCheck("Camiseta")}
              bottomDivider
            />
            <ListItem
              title="Gafas"
              checkBox={{
                checked: personaDetalle.Gafas || false,
                onPress: () => this.actualizarCheck("Gafas")
              }}
              onPress={() => this.actualizarCheck("Gafas")}
              bottomDivider
            />
            <ListItem
              title="Guantes"
              checkBox={{
                checked: personaDetalle.Guantes || false,
                onPress: () => this.actualizarCheck("Guantes")
              }}
              onPress={() => this.actualizarCheck("Guantes")}
              bottomDivider
            />
            <ListItem
              title="Chaleco"
              checkBox={{
                checked: personaDetalle.Chaleco || false,
                onPress: () => this.actualizarCheck("Chaleco")
              }}
              onPress={() => this.actualizarCheck("Chaleco")}
              bottomDivider
            />
            <ListItem
              title="Tarjeta de identificación"
              checkBox={{
                checked: personaDetalle.Tarjeta || false,
                onPress: () => this.actualizarCheck("Tarjeta")
              }}
              onPress={() => this.actualizarCheck("Tarjeta")}
              bottomDivider
            />
            <Text
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Observaciones
            </Text>
            <Input
              onChangeText={this.onTextChange}
              multiline={true}
              numberOfLines={5}
              textAlignVertical={"top"}
              containerStyle={{ padding: 8, marginBottom: 80 }}
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
  },
  container: {
    backgroundColor: "#F5FCFF",
    flex: 1,
    padding: 16,
    marginTop: 40
  },
  autocompleteContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 0
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: "center"
  },
  itemText: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 0
  },
  infoText: {
    textAlign: "center",
    fontSize: 16
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
)(PersonalDetalleScreen);
