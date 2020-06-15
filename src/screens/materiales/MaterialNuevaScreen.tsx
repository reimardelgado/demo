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
import { Material, MaterialList } from "../../models/Material";
import color from "../../styles/color";

import Autocomplete from "react-native-autocomplete-input";

interface MaterialNuevaScreenProps {
  navigation: any;
  diario: Diario;
}
interface MaterialNuevaScreenState {
  material: Material;
  materialList: MaterialList[];
  unidadList: UnidadDetalle[];
  loadingMaterialList: boolean;
  loadingUnidadList: boolean;
  query: string;
}

class MaterialNuevaScreen extends Component<
  MaterialNuevaScreenProps,
  MaterialNuevaScreenState
> {
  static navigationOptions = () => {
    return {
      title: "Registro de material"
    };
  };

  static renderMaterial(mat) {
    const { Descripcion, Id } = mat;

    return (
      <View>
        <Text style={styles.itemText}>{Descripcion}</Text>
      </View>
    );
  }

  materialPromise: utils.Cancellable = null;
  materialListPromise: utils.Cancellable = null;
  unidadListPromise: utils.Cancellable = null;
  dateSeleccionado: Input;

  constructor(props: MaterialNuevaScreenProps) {
    super(props);

    this.state = {
      material: {
        MaterialId: 0,
        Unidad: 0
      },
      loadingMaterialList: true,
      loadingUnidadList: true,
      materialList: [],
      unidadList: [],
      query: ""
    };
  }

  componentDidMount() {
    this.loadMaterialList();
    this.loadUnidadesList();
    if (this.props.navigation.state.params != null) {
      let item = this.props.navigation.state.params.item;
      if (item != null) {
        this.state.material.Id = item.Id;
        this.state.material.MaterialId = item.MaterialId;
        this.state.material.LibroObraId = item.LibroObraId;
        this.state.material.Planificado = item.Planificado;
        this.state.material.Sobrante = item.Sobrante;
        this.state.material.Unidad = item.Unidad;
        this.state.material.Detalle = item.Detalle;
      }
    } else {
      this.state.material.Planificado = 0;
      this.state.material.Sobrante = 0;
    }
  }

  componentWillUnmount() {
    if (this.materialPromise) this.materialPromise.cancel();
    if (this.materialListPromise) this.materialListPromise.cancel();
    if (this.unidadListPromise) this.unidadListPromise.cancel();
  }

  loadMaterialList() {
    this.materialListPromise = utils.makeCancellable(api.getMaterialList());

    this.materialListPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ materialList: Data || {}, loadingMaterialList: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ materialList: [], loadingMaterialList: false });
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
        material: {
          ...prevState.material,
          [parametro]: valor
        }
      };
    });
  };

  onTextChange = (text: string) => {
    this.setState(prevState => ({
      material: { ...prevState.material, Descripcion: text }
    }));
  };

  onSave = () => {
    if (
      this.state.material.MaterialId == 0 ||
      this.state.material.Unidad == 0
    ) {
      Alert.alert("Error", "Debe completar todos los campos.");
    } else {
      this.state.material.LibroObraId = this.props.diario.Id;
      this.materialPromise = utils.makeCancellable(
        api.saveMaterial(this.state.material)
      );
      this.materialPromise.promise
        .then(({ data: { Data } }) => {
          Alert.alert("Material", "Datos guardados correctamente.");
          this.props.navigation.goBack();
        })
        .catch(reason => {
          if (reason.isCanceled) {
            console.log("isCanceled", reason.isCanceled);
          } else {
            this.setState({
              material: {},
              loadingMaterialList: false,
              loadingUnidadList: false
            });
          }
        });
    }
  };

  findMaterial(query) {
    if (query === "") {
      return [];
    }
    const { materialList } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return materialList.filter(x => x.Descripcion.search(regex) >= 0);
  }

  render() {
    const {
      //materialList,
      material,
      unidadList,
      loadingMaterialList,
      loadingUnidadList,
      query
    } = this.state;

    if (loadingMaterialList || loadingUnidadList)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    const materialList = this.findMaterial(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.list}>
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo material</Text>
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
              Material
            </Text>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              data={
                materialList.length === 1 &&
                comp(query, materialList[0].Descripcion)
                  ? []
                  : materialList
              }
              defaultValue={query}
              onChangeText={valor => this.setState({ query: valor })}
              keyExtractor={(item, index) => `${item.Id.toString()}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.actualizarDato("MaterialId", item.Id);
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
              Material
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={material.MaterialId}
              onValueChange={valor => this.actualizarDato("MaterialId", valor)}
              mode="dropdown"
            >
              <Picker.Item value="0" label="Seleccione" />
              {materialList.map((l, i) => {
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
              Unidad
            </Text>
            <Picker
              itemStyle={{ fontSize: 14 }}
              selectedValue={material.Unidad}
              onValueChange={f => this.actualizarDato("Unidad", f)}
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
              value={material.Planificado.toString()}
            />
            <Input
              label="Realizado"
              inputStyle={styles.inputText}
              onChangeText={valor => this.actualizarDato("Sobrante", valor)}
              keyboardType="numeric"
              value={material.Sobrante.toString()}
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
              value={material.Detalle}
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
    fontSize: 16
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
)(MaterialNuevaScreen);
