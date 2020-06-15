import React, { Component } from "react";
import { connect } from "react-redux";

import { WebView, ActivityIndicator, Alert } from "react-native";

import getEnvVars from "../../../environment";
import * as utils from "../../utils/utils";

import { Diario } from "../../models/Diario";
import color from "../../styles/color";

const { diarioPdf } = getEnvVars();

interface ResumenScreenProps {
  navigation: any;
  diario: Diario;
}
interface ResumenScreenState {
  resumen: string;
}

class ResumenScreen extends Component<ResumenScreenProps, ResumenScreenState> {
  static navigationOptions = () => {
    return {
      title: "Resumen del diario"
    };
  };

  resumenPromise: utils.Cancellable = null;

  constructor(props: ResumenScreenProps) {
    super(props);

    this.state = {
      resumen: ""
    };
  }

  componentDidMount() {
    this.loadResumenDeDiario(this.props.diario.Id);
  }

  loadResumenDeDiario(diarioId: number) {
    if (this.props.diario.ClienteName == "CNT") {
      this.setState({
        resumen: `${diarioPdf}GenerarPdfCnt?libroDiarioId=${diarioId}`
      });
    } else {
      this.setState({
        resumen: `${diarioPdf}GenerarPdfResumen?libroDiarioId=${diarioId}`
      });
    }
  }

  onLoadError = () => {
    Alert.alert(
      "Error en la visualización",
      "No se pudo cargar el resumen del diario, intente nuevamente",
      [
        {
          onPress: this.props.navigation.goBack
        }
      ]
    );
  };

  render() {
    const { resumen } = this.state;

    return (
      <WebView
        style={{ marginTop: 20 }}
        source={{
          uri: resumen
        }}
        renderLoading={() => (
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        )}
        onError={this.onLoadError}
        startInLoadingState
      />
    );
  }
}

const mapStateToProps = ({ diarios }) => ({
  diario: diarios.diarioActual
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResumenScreen);
