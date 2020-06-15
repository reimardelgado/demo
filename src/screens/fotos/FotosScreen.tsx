import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";

import { w } from "../../api/Dimensions";
import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";
import color from "../../styles/color";

import { Diario } from "../../models/Diario";
import TouchableFoto from "../../components/touchableFoto/TouchableFoto";
import FabButton from "../../components/buttons/FabButton";
import { ProgressDialog } from "../../components/dialog/ProgressDialog";

type OmitNested<T, K1 extends keyof T, K2 extends keyof T[K1]> = Pick<
  T,
  Exclude<keyof T, K1>
> &
  { [P1 in K1]: Pick<T[K1], Exclude<keyof T[K1], K2>> };

type CleanedPosition = OmitNested<Position, "coords", "altitudeAccuracy">;

const RESIZE_HEIGHT = 896;
const RESIZE_WIDTH = 672;

interface State {
  loading: boolean;
  saving: boolean;
  fotos: string[];
  nombres: string[];
  selected: string[];
  localizacion?: CleanedPosition;
}

interface Props {
  navigation: any;
  diario: Diario;
}

class FotosScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => ({
    title: "Fotos del diario",
    headerRight: (
      <TouchableOpacity
        style={{ margin: 13 }}
        onPress={navigation.getParam("showCamera")}
      >
        <MaterialIcons
          name="add-a-photo"
          size={24}
          style={{ margin: 3 }}
          color="white"
        />
      </TouchableOpacity>
    )
  });

  getFotosCancellable: utils.Cancellable = null;
  saveFotosCancellable: utils.Cancellable = null;
  eliminarFotosCancellable: utils.Cancellable = null;

  readonly state: State = {
    loading: true,
    saving: false,
    fotos: [],
    nombres: [],
    selected: []
  };

  componentDidMount = async () => {
    this.props.navigation.setParams({
      showCamera: () => this.showCamera(ImagePicker.MediaTypeOptions.Images)
    });
    this.getFotosDiario();
  };

  componentWillUnmount() {
    if (this.getFotosCancellable) this.getFotosCancellable.cancel();
    if (this.saveFotosCancellable) this.saveFotosCancellable.cancel();
  }

  getFotosDiario = async () => {
    this.getFotosCancellable = utils.makeCancellable(
      api.getFotosDiario(this.props.diario.Id)
    );

    this.getFotosCancellable.promise
      .then(({ data: { Data } }) => {
        this.setState({
          fotos: Data.Foto,
          nombres: Data.Nombre,
          loading: false
        });
      })
      .catch((reason: any) => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ fotos: [], nombres: [], loading: false });
        }
      });
  };

  doEliminarFoto = () => {
    const { selected } = this.state;
    const { diario } = this.props;

    this.eliminarFotosCancellable = utils.makeCancellable(
      api.eliminarFotosDiario(diario.Id, selected)
    );

    this.setState({ saving: true }, () =>
      this.eliminarFotosCancellable.promise
        .then(() => {
          let newArray = [...this.state.nombres];
          this.state.selected.forEach(foto => {
            newArray = newArray.filter(nombre => nombre != foto);
          });
          this.setState({ saving: false, nombres: newArray, selected: [] });
        })
        .catch((reason: any) => {
          if (reason.isCanceled) {
            console.log("isCanceled", reason.isCanceled);
          } else {
            this.setState({ saving: false });
          }
        })
    );
  };

  eliminarFotosDiario = () => {
    Alert.alert(
      "Eliminar Fotos",
      "Las fotos seleccionadas serán eliminadas del diario. ¿Desea continuar?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "OK", onPress: this.doEliminarFoto }
      ],
      { cancelable: false }
    );
  };

  obtenerLocalizacion = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return;
    }

    const result = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    this.setState({ localizacion: result });
  };

  showCamera = async (
    mediaTypes: ImagePicker.MediaTypeOptions,
    allowsEditing = false
  ) => {
    try {
      // Se piden todos los accesos de una vez.
      // Si se ejecuta la apk en Expo, se permite
      // que Expo tenga acceso a la camara
      const permissionResult = await utils.requestPermissionAsync(
        ...([
          Permissions.CAMERA,
          Permissions.LOCATION
        ] as Permissions.PermissionType[])
      );

      if (permissionResult !== true) {
        Alert.alert(
          "No se puede acceder a funciones del dispositivo",
          "Son requeridos el acceso a la camara y a la localizacion. Otorgue los permisos necesarios para poder continuar."
        );
        return;
      }

      await this.obtenerLocalizacion();

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes,
        allowsEditing
      });

      if (result.cancelled) {
        return;
      }

      // Se identifica la mayor de las dimensiones
      // y se calcula el factor de escalado
      let imageHeight: number;
      let imageWidth: number;
      if (result["height"] > RESIZE_HEIGHT || result["width"] > RESIZE_WIDTH) {
        const aspectRatio = result["height"] / result["width"];
        const resizeFactor = result["height"] / RESIZE_HEIGHT;

        imageHeight = Math.floor(result["height"] / resizeFactor);
        imageWidth = Math.floor(imageHeight * aspectRatio);
      } else {
        imageHeight = result["height"];
        imageWidth = result["width"];
      }

      const imageResult: ImageManipulator.ImageResult = await ImageManipulator.manipulateAsync(
        result["uri"],
        [
          {
            resize: {
              width: imageHeight,
              height: imageWidth
            }
          }
        ],
        {
          compress: 0.5,
          base64: true
        }
      );

      if (!result.cancelled) {
        const { diario } = this.props;
        const nombreFoto = `${utils.UUIDv4()}.jpg`;

        // Se utiliza un cancelable para prevenir
        // fugas de memoria si el usuario cierra la vista
        this.saveFotosCancellable = utils.makeCancellable(
          api.saveFotosDiario({
            LibroDiarioId: diario.Id,
            Nombre: [nombreFoto],
            Foto: [imageResult.base64],
            Longitud: this.state.localizacion.coords.longitude,
            Latitud: this.state.localizacion.coords.latitude,
            Fecha: new Date()
          })
        );

        this.setState({ saving: true }, () =>
          this.saveFotosCancellable.promise
            .then(() => {
              this.setState({
                ...this.state,
                saving: false,
                nombres: [...this.state.nombres, nombreFoto]
              });
            })
            .catch((reason: any) => {
              if (reason.isCanceled) {
                console.log("isCanceled", reason.isCanceled);
              } else {
                this.setState({ saving: false });
              }
            })
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "No se puede acceder a funciones del dispositivo",
        "Son requeridos el acceso a la camara y a la localizacion. Otorgue los permisos necesarios para poder continuar."
      );
    }
  };

  toggleSelection = (uri: string, isSelected: boolean) => {
    let selected = this.state.selected;
    if (isSelected) {
      selected.push(uri);
    } else {
      selected = selected.filter(item => item !== uri);
    }
    this.setState({ selected });
  };

  renderFoto = (filename: string, index: number) => (
    <TouchableFoto
      key={index}
      name={filename}
      source={{ uri: `${api.RESOURCE_URL}${filename}` }}
      style={{ width: w(24), height: w(24), backgroundColor: "#e1e4e8" }}
      resizeMode="cover"
      onPress={this.toggleSelection}
    />
  );

  render() {
    if (this.state.loading)
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    return (
      <>
        <ProgressDialog
          message="Por favor espere"
          keyboardDismissMode="interactive"
          activityIndicatorSize="large"
          visible={this.state.saving}
        />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={styles.pictures}>
              {this.state.nombres.map(this.renderFoto)}
            </View>
          </ScrollView>
        </View>
        {this.state.selected.length > 0 && (
          <FabButton
            onPress={this.eliminarFotosDiario}
            child={<MaterialIcons name="delete" size={24} color="white" />}
            fabButtonStyle={{ backgroundColor: color.pinterest }}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  pictures: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    paddingLeft: 6,
    paddingTop: 4
  },
  button: {
    padding: 13
  },
  whiteText: {
    color: "white"
  }
});

const mapStateToProps = ({ diarios }) => ({
  diario: diarios.diarioActual
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FotosScreen);
