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

import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";
import color from "../../styles/color";

import { Diario } from "../../models/Diario";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { Herramienta, HerramientaList } from "../../models/Herramienta";
import { UnidadDetalle } from "../../models/UnidadDetalle";

import Autocomplete from "react-native-autocomplete-input";

interface Props {
  navigation: any;
  diario: Diario;
}
interface State {
  herramienta: Herramienta;
  herramientaList: HerramientaList[];
  unidadList: UnidadDetalle[];
  loadingHerramientas: boolean;
  loadingUnidades: boolean;
  query: string;
}

class HerramientaNuevaScreen extends Component<Props, State> {
  static navigationOptions = () => {
    return {
      title: "Registro de herramienta"
    };
  };

  static renderHerramienta(act) {
    const { Descripcion, Id } = act;
    return (
      <View>
        <Text style={styles.itemText}>{Descripcion}</Text>
      </View>
    );
  }

  herramientaPromise: utils.Cancellable = null;
  herramientaListPromise: utils.Cancellable = null;
  unidadListPromise: utils.Cancellable = null;
  dateSeleccionado: Input;

  readonly state: State = {
    herramienta: {
      HerramientaId: 0,
      Unidad: 0,
      Estado: "0"
    },
    herramientaList: [],
    unidadList: [],
    loadingHerramientas: true,
    loadingUnidades: true,
    query: ""
  };

  componentDidMount() {
    this.loadHerramientaList();
    this.loadUnidadesList();
    if (this.props.navigation.state.params != null) {
      let item = this.props.navigation.state.params.item;
      if (item != null) {
        this.state.herramienta = item;
      }
    } else {
      this.state.herramienta.Cantidad = 0;
    }
  }

  componentWillUnmount() {
    if (this.herramientaPromise) this.herramientaPromise.cancel();
    if (this.herramientaListPromise) this.herramientaListPromise.cancel();
    if (this.unidadListPromise) this.unidadListPromise.cancel();
  }

  loadHerramientaList() {
    this.herramientaListPromise = utils.makeCancellable(
      api.getHerramientaList()
    );

    this.herramientaListPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({
          herramientaList: Data || {},
          loadingHerramientas: false
        });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ herramientaList: [], loadingHerramientas: false });
        }
      });
  }

  loadUnidadesList() {
    this.unidadListPromise = utils.makeCancellable(api.getUnidadesList());

    this.unidadListPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ unidadList: Data || {}, loadingUnidades: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ unidadList: [], loadingUnidades: false });
        }
      });
  }

  actualizarDato = (parametro: string, valor: any) => {
    this.setState(prevState => {
      return {
        herramienta: {
          ...prevState.herramienta,
          [parametro]: valor
        }
      };
    });
  };

  onTextChange = (text: string) => {
    this.setState(prevState => ({
      herramienta: { ...prevState.herramienta, Descripcion: text }
    }));
  };

  onSave = () => {
    console.log(this.state.herramienta.HerramientaId);
    if (
      this.state.herramienta.HerramientaId == 0 ||
      this.state.herramienta.Estado == "0" ||
      this.state.herramienta.Unidad == 0
    ) {
      Alert.alert("Error", "Debe completar todos los campos.");
    } else {
      this.state.herramienta.LibroObraId = this.props.diario.Id;
      this.herramientaPromise = utils.makeCancellable(
        api.saveDetalleHerramienta(this.state.herramienta)
      );
      this.herramientaPromise.promise
        .then(({ data: { Data } }) => {
          Alert.alert("Herramienta", "Datos guardados correctamente.");
          this.props.navigation.goBack();
        })
        .catch(reason => {
          Alert.alert("Error", "Error guardando la herramienta.");
          if (reason.isCanceled) {
            console.log("isCanceled", reason.isCanceled);
          } else {
            this.setState({
              herramienta: {},
              loadingHerramientas: false,
              loadingUnidades: false
            });
          }
        });
    }
  };

  findHerramienta(query) {
    if (query === "") {
      return [];
    }
    const { herramientaList } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return herramientaList.filter(x => x.Descripcion.search(regex) >= 0);
  }

  render() {
    const {
      //herramientaList,
      herramienta,
      unidadList,
      loadingHerramientas,
      loadingUnidades,
      query
    } = this.state;

    if (loadingHerramientas || loadingUnidades)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    const herramientaList = this.findHerramienta(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.list}>
        <View style={styles.header}>
          <Text style={styles.title}>Nueva herramienta</Text>
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
              Herramienta
            </Text>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              data={
                herramientaList.length === 1 &&
                comp(query, herramientaList[0].Descripcion)
                  ? []
                  : herramientaList
              }
              defaultValue={query}
              onChangeText={valor => this.setState({ query: valor })}
              keyExtractor={(item, index) => `${item.Id.toString()}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.actualizarDato("HerramientaId", item.Id);
                    this.setState({ query: item.Descripcion });
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
              Herramienta
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={herramienta.HerramientaId}
              onValueChange={valor =>
                this.actualizarDato("HerramientaId", valor)
              }
              mode="dropdown"
            >
              <Picker.Item value="0" label="Seleccione" />
              {herramientaList.map((l, i) => {
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
              Estado
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={herramienta.Estado}
              onValueChange={valor => this.actualizarDato("Estado", valor)}
              mode="dropdown"
            >
              <Picker.Item value="0" label="Seleccione" />
              <Picker.Item value="Bueno" label="BUENO" />
              <Picker.Item value="Regular" label="REGULAR" />
              <Picker.Item value="Malo" label="MALO" />
            </Picker>
            <Input
              label="Cantidad"
              inputStyle={styles.inputText}
              onChangeText={valor => this.actualizarDato("Cantidad", valor)}
              value={herramienta.Cantidad.toString()}
              keyboardType="numeric"
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
              Unidad
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={herramienta.Unidad}
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
)(HerramientaNuevaScreen);
