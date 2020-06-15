import * as ExpoPixi from "expo-pixi";
import React, { Component } from "react";
import {
  Button,
  Platform,
  AppState,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Alert
} from "react-native";
import { connect } from "react-redux";
import * as FileSystem from "expo-file-system";

import { UUIDv4 } from "../../utils/utils";
import color from "../../styles/color";
import * as api from "../../api/apiService";
import { Diario } from "../../models/Diario";
import { ProgressDialog } from "../../components/dialog/ProgressDialog";

const isAndroid = Platform.OS === "android";

interface Props {
  diario: Diario;
  navigation: any;
}
interface State {
  strokeColor: number;
  appState: string;
  linesCli: boolean;
  linesSup: boolean;
  id?: string;
  enviando: boolean;
}

class FirmaScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "Firma Digital"
  };

  readonly state = {
    strokeColor: 0,
    appState: AppState.currentState,
    linesCli: false,
    linesSup: false,
    enviando: false
  };

  sketchSup: any;
  sketchCli: any;

  handleAppStateChangeAsync = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (isAndroid && this.sketchCli && this.sketchSup) {
        this.setState({
          appState: nextAppState,
          id: UUIDv4()
        });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChangeAsync);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChangeAsync);
  }

  onReady = () => {
    console.log("ready!");
  };

  render() {
    return (
      <>
        <ProgressDialog
          message="Espere por favor"
          activityIndicatorSize="large"
          keyboardDismissMode="interactive"
          visible={this.state.enviando}
        />
        <View style={styles.container}>
          <View style={styles.sketchContainer}>
            <ExpoPixi.Signature
              ref={ref => (this.sketchSup = ref)}
              style={styles.sketch}
              strokeColor={"blue"}
              strokeAlpha={1}
              onReady={this.onReady}
              onChange={() => this.setState({ linesSup: true })}
            />
            <View
              style={{
                position: "absolute",
                zIndex: 1,
                top: 8,
                left: 16
              }}
            >
              <Text style={{ padding: 8 }}>Firma del Jefe de Obra</Text>
            </View>
            {this.state.linesSup && (
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: 8,
                  right: 16
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.sketchSup.clear();
                    this.setState({ linesSup: false });
                  }}
                >
                  <Text style={{ padding: 8 }}>Borrar</Text>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
          <View style={styles.sketchContainer}>
            <ExpoPixi.Signature
              ref={ref => (this.sketchCli = ref)}
              style={styles.sketch}
              strokeColor={"blue"}
              strokeAlpha={1}
              onReady={this.onReady}
              onChange={() => this.setState({ linesCli: true })}
            />
            <View
              style={{
                position: "absolute",
                zIndex: 1,
                top: 8,
                left: 16
              }}
            >
              <Text style={{ padding: 8 }}>Firma del Cliente</Text>
            </View>
            {this.state.linesCli && (
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: 8,
                  right: 16
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.sketchCli.clear();
                    this.setState({ linesCli: false });
                  }}
                >
                  <Text style={{ padding: 8 }}>Borrar</Text>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
        </View>
        <View style={styles.button}>
          <Button
            color={color.blue1}
            title="Enviar"
            onPress={() => {
              this.setState(
                {
                  enviando: true
                },
                this.guardarFirmas
              );
            }}
          />
        </View>
      </>
    );
  }

  guardarFirmas = async () => {
    if (this.state.linesCli === false || this.state.linesSup === false) {
      this.setState({ enviando: false }, () => {
        Alert.alert(
          "Información",
          "No es posible enviar los datos. Complete las dos firmas para continuar",
          [{ text: "OK" }],
          { cancelable: false }
        );
      });
      return;
    }

    try {
      const cliSnapshot = await this.sketchCli.takeSnapshotAsync({
        quality: 0.5,
        format: "jpg"
      });

      const supSnapshot = await this.sketchSup.takeSnapshotAsync({
        quality: 0.5,
        format: "jpg"
      });

      const fileCli = await FileSystem.readAsStringAsync(cliSnapshot.uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      const fileSup = await FileSystem.readAsStringAsync(supSnapshot.uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      await api.saveFirmas({
        LibroDiarioId: this.props.diario.Id,
        FirmaJefeObra: fileSup,
        FirmaCliente: fileCli
      });

      // await api.changeEstadoDiario(this.props.diario.Id, )

      this.setState({ enviando: false }, () =>
        Alert.alert(
          "Se han guardado los datos",
          "La firma del diario se ha completado correctamente.",
          [{ text: "OK", onPress: () => this.props.navigation.goBack() }],
          { cancelable: false }
        )
      );
    } catch (error) {
      console.log(error)
      this.setState({ enviando: false }, () =>
        Alert.alert(
          "Información",
          "No se guardaron las firmas. Por favor revise que tenga personal asignado al diario e intente nuevamente.",
          [{ text: "OK" }],
          { cancelable: false }
        )
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sketch: {
    flex: 1
  },
  sketchContainer: {
    height: "50%",
    borderWidth: 1
  },
  image: {
    flex: 1
  },
  label: {
    width: "100%",
    padding: 5,
    alignItems: "center"
  },
  button: {
    zIndex: 1
  }
});

const mapStateToProps = ({ diarios }) => ({
  diario: diarios.diarioActual
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirmaScreen);
