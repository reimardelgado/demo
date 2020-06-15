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
import { Input, colors, ListItem } from "react-native-elements";

import * as api from "../../api/apiService";
import { w } from "../../api/Dimensions";
import * as utils from "../../utils/utils";

import { Diario } from "../../models/Diario";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { UnidadDetalle } from "../../models/UnidadDetalle";
import {
  Actividad,
  ActividadList,
  TipoActividadList
} from "../../models/Actividad";
import color from "../../styles/color";

import Autocomplete from "react-native-autocomplete-input";

interface ActividadNuevaScreenProps {
  navigation: any;
  diario: Diario;
}
interface ActividadNuevaScreenState {
  actividad: Actividad;
  actividadList: ActividadList[];
  tipoActividadList: TipoActividadList[];
  unidadList: UnidadDetalle[];
  loadingActividadList: boolean;
  loadingTipoActividadList: boolean;
  loadingUnidadList: boolean;
  query: string;
}

class ActividadNuevaScreen extends Component<
  ActividadNuevaScreenProps,
  ActividadNuevaScreenState
> {
  static navigationOptions = () => {
    return {
      title: "Registro de actividad"
    };
  };

  static renderActividad(act) {
    const { Descripcion, Id } = act;

    return (
      <View>
        <Text style={styles.itemText}>{Descripcion}</Text>
      </View>
    );
  }

  actividadPromise: utils.Cancellable = null;
  actividadListPromise: utils.Cancellable = null;
  tipoActividadListPromise: utils.Cancellable = null;
  unidadListPromise: utils.Cancellable = null;
  dateSeleccionado: Input;

  constructor(props: ActividadNuevaScreenProps) {
    super(props);

    this.state = {
      actividad: {
        ActividadId: 0,
        TipoActividadId: 0,
        Unidad: 0
      },
      loadingActividadList: true,
      loadingTipoActividadList: true,
      loadingUnidadList: true,
      actividadList: [],
      tipoActividadList: [],
      unidadList: [],
      query: ""
    };
  }

  componentDidMount() {
    this.loadActividadList();
    this.loadUnidadesList();
    this.loadTipoActividadList();
    if (this.props.navigation.state.params != null) {
      let item = this.props.navigation.state.params.item;
      if (item != null) {
        this.state.actividad.Id = item.Id;
        this.state.actividad.ActividadId = item.ActividadId;
        this.state.actividad.LibroObraId = item.LibroObraId;
        this.state.actividad.TipoActividadId = item.TipoActividadId;
        this.state.actividad.Codigo = item.Codigo;
        this.state.actividad.Detalle = item.Detalle;
        this.state.actividad.Planificado = item.Planificado;
        this.state.actividad.Sobrante = item.Sobrante;
        this.state.actividad.Unidad = item.Unidad;
        this.state.actividad.Descripcion = item.Descripcion;
      }
    } else {
      this.state.actividad.Planificado = 0;
      this.state.actividad.Sobrante = 0;
    }
  }

  componentWillUnmount() {
    if (this.actividadListPromise) this.actividadListPromise.cancel();
    if (this.tipoActividadListPromise) this.tipoActividadListPromise.cancel();
    if (this.unidadListPromise) this.unidadListPromise.cancel();
  }

  loadActividadList() {
    this.actividadListPromise = utils.makeCancellable(
      api.getActividadList(this.props.diario.Id)
    );

    this.actividadListPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({
          actividadList: Data || {},
          loadingActividadList: false
        });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ actividadList: [], loadingActividadList: false });
        }
      });
  }

  loadTipoActividadList() {
    this.tipoActividadListPromise = utils.makeCancellable(
      api.getTipoActividadList()
    );

    this.tipoActividadListPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({
          tipoActividadList: Data || {},
          loadingTipoActividadList: false
        });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({
            tipoActividadList: [],
            loadingTipoActividadList: false
          });
        }
      });
  }

  loadUnidadesList() {
    this.unidadListPromise = utils.makeCancellable(api.getUnidadesList());

    this.unidadListPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ unidadList: Data || {}, loadingUnidadList: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ unidadList: [], loadingUnidadList: false });
        }
      });
  }

  actualizarDato = (parametro: string, valor: any) => {
    this.setState(prevState => {
      return {
        actividad: {
          ...prevState.actividad,
          [parametro]: valor
        }
      };
    });
  };

  onTextChange = (text: string) => {
    this.setState(prevState => ({
      actividad: { ...prevState.actividad, Descripcion: text }
    }));
  };

  onSave = () => {
    if (
      this.state.actividad.ActividadId == 0 ||
      this.state.actividad.TipoActividadId == 0 ||
      this.state.actividad.Unidad == 0
    ) {
      Alert.alert("Error", "Debe completar todos los campos.");
    } else {
      this.state.actividad.LibroObraId = this.props.diario.Id;
      this.actividadPromise = utils.makeCancellable(
        api.saveActividad(this.state.actividad)
      );
      this.actividadPromise.promise
        .then(({ data: { Data } }) => {
          Alert.alert("Actividad", "Datos guardados correctamente.");
          this.props.navigation.goBack();
        })
        .catch(reason => {
          if (reason.isCanceled) {
            console.log("isCanceled", reason.isCanceled);
          } else {
            this.setState({
              actividad: {},
              loadingActividadList: false,
              loadingTipoActividadList: false,
              loadingUnidadList: false
            });
          }
        });
    }
  };

  findActividad(query) {
    if (query === "") {
      return [];
    }
    const { actividadList } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return actividadList.filter(
      x => x.Descripcion.search(regex) >= 0 || x.Codigo.search(regex) >= 0
    );
  }

  render() {
    const {
      //actividadList,
      actividad,
      unidadList,
      tipoActividadList,
      loadingActividadList,
      loadingTipoActividadList,
      loadingUnidadList,
      query
    } = this.state;

    if (loadingActividadList || loadingTipoActividadList || loadingUnidadList)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    const actividadList = this.findActividad(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.list}>
        <View style={styles.header}>
          <Text style={styles.title}>Nueva actividad</Text>
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
              Actividad
            </Text>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              data={
                actividadList.length === 1 &&
                comp(query, actividadList[0].Descripcion)
                  ? []
                  : actividadList
              }
              defaultValue={query}
              onChangeText={valor => this.setState({ query: valor })}
              keyExtractor={(item, index) => `${item.Id.toString()}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.actualizarDato("ActividadId", item.Id);
                    this.setState({ query: item.Descripcion });
                  }}
                >
                  <Text style={styles.inputText}>
                    {item.Codigo} - {item.Descripcion}
                  </Text>
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
              Actividad
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={actividad.ActividadId}
              onValueChange={valor => this.actualizarDato("ActividadId", valor)}
              mode="dropdown"
            >
              <Picker.Item value="0" label="Seleccione" />
              {actividadList.map((l, i) => {
                return (
                  <Picker.Item
                    value={l.Id}
                    label={`${l.Codigo}-${l.Descripcion}`}
                    key={i}
                  />
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
              Tipo de Actividad
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={actividad.TipoActividadId}
              onValueChange={valor =>
                this.actualizarDato("TipoActividadId", valor)
              }
              mode="dropdown"
            >
              <Picker.Item value="0" label="Seleccione" />
              {tipoActividadList.map((l, i) => {
                return (
                  <Picker.Item value={l.Id} label={l.Descripcion} key={i} />
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
              Unidad
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={actividad.Unidad}
              onValueChange={valor => this.actualizarDato("Unidad", valor)}
              mode="dropdown"
            >
              <Picker.Item value="0" label="Seleccione" />
              {unidadList.map((a, i) => {
                return (
                  <Picker.Item value={a.Id} label={a.Descripcion} key={i} />
                );
              })}
            </Picker>
            <Input
              label="Planificado"
              inputStyle={styles.inputText}
              onChangeText={valor => this.actualizarDato("Planificado", valor)}
              keyboardType="numeric"
              value={actividad.Planificado.toString()}
            />
            <Input
              label="Realizado"
              inputStyle={styles.inputText}
              onChangeText={valor => this.actualizarDato("Sobrante", valor)}
              keyboardType="numeric"
              value={actividad.Sobrante.toString()}
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
              Observaciones / Detalles
            </Text>
            <Input
              onChangeText={valor => this.actualizarDato("Detalle", valor)}
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
              value={actividad.Detalle}
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

const mapStateToProps = ({ diarios }) => ({
  diario: diarios.diarioActual
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActividadNuevaScreen);
