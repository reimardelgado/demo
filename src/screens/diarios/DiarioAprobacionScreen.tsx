import React, { Component } from "react";
import { connect } from "react-redux";
import { FlatList, Alert } from "react-native";

import { selectDiario, getDiarios } from "../../store/diarios/actions";
import * as utils from "../../utils/utils";

import * as api from "../../api/apiService";
import DiarioCard from "../../components/diarioCard/DiarioCard";
import { Diario } from "../../models/Diario";
import { Perfil } from "../../models/Perfil";
import { Usuario } from "../../models/Usuario";

interface DiarioAprobacionProps {
  loading: boolean;
  diarios: Diario[];
  perfil: Perfil;
  usuario: Usuario;
  navigation: any;
  selectDiario(diario: Diario): void;
  getDiarios(UserId: number, perfilId: number): void;
}

interface DiarioAprobacionState {
  diario: Diario;
}

class DiarioAprobacionScreen extends Component<
  DiarioAprobacionProps,
  DiarioAprobacionState
> {

  diarioPromise: utils.Cancellable = null;

  constructor(props: DiarioAprobacionProps) {
    super(props);
    this.state = {
      diario: {}
    };
  }

  componentWillUnmount() {
    if (this.diarioPromise) this.diarioPromise.cancel();
  }

  filtrarDiarios = () => {
    const { diarios, perfil } = this.props;

    return diarios.filter(diario => {
      if (perfil.Id == 1 || perfil.Id == 2) {
        return diario.EstadoDiarioName === "Pendiente de Aprobación";
      } else {
        return diario.EstadoDiarioName === "Revisado";
      }
    });
  };

  handleRefresh = async () => {
    const { usuario, perfil } = this.props;

    this.props.getDiarios(usuario.UserId, perfil.Id);
  };

  aprobar = (d: Diario) => {
    this.props.selectDiario(d);
    this.setState({ diario: d });
    Alert.alert(
      "Aprobar diario",
      `El diario ${d.Codigo} será aprobado. ¿Desea continuar? `,
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Aprobar", onPress: this.onApprove }
      ],
      { cancelable: false }
    );
  };

  onApprove = () => {
    const { usuario, perfil } = this.props;
    if ((perfil.Id == 1 || perfil.Id == 2) && this.state.diario.EstadoDiarioId == 4) {
      
      this.diarioPromise = utils.makeCancellable(
        api.changeEstadoDiario(
          this.state.diario.Id,
          "Revisado",
          usuario.UserId
        )
      );
  
      this.diarioPromise.promise
        .then(({ data: { Data } }) => {
          Alert.alert("Diario aprobado")
        })
        .catch(reason => {
          if (reason.isCanceled) {
            console.log("isCanceled", reason.isCanceled);
          } else {
            console.log("Error", reason);
          }
        });
    }
    if ((perfil.Id == 1 || perfil.Id == 2) && this.state.diario.EstadoDiarioId == 7) {
      this.diarioPromise = utils.makeCancellable(
        api.changeEstadoDiario(
          this.state.diario.Id,
          "Autorizado",
          usuario.UserId
        )
      );
  
      this.diarioPromise.promise
        .then(({ data: { Data } }) => {
          Alert.alert("Diario aprobado")
        })
        .catch(reason => {
          if (reason.isCanceled) {
            console.log("isCanceled", reason.isCanceled);
          } else {
            console.log("Error", reason);
          }
        });
    }
    this.handleRefresh();
  };

  recharzar = (d: Diario) => {
    this.props.selectDiario(d);
    this.setState({ diario: d });
    Alert.alert(
      "Rechazar diario",
      `El diario ${d.Codigo} será rechazado. ¿Desea continuar? `,
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Rechazar", onPress: this.onRefuse }
      ],
      { cancelable: false }
    );
  };

  onRefuse = () => {    
    this.props.navigation.navigate(`${this.props.perfil.prefix}MotivoRechazo`);
    // if ((perfil.Id == 1 || perfil.Id == 2) && this.state.diario.EstadoDiarioId == 4) {
      
    //   this.diarioPromise = utils.makeCancellable(
    //     api.changeEstadoDiario(
    //       this.state.diario.Id,
    //       "Rechazado",
    //       usuario.UserId
    //     )
    //   );
  
    //   this.diarioPromise.promise
    //     .then(({ data: { Data } }) => {
    //       Alert.alert("Diario rechazado")
    //     })
    //     .catch(reason => {
    //       if (reason.isCanceled) {
    //         console.log("isCanceled", reason.isCanceled);
    //       } else {
    //         console.log("Error", reason);
    //       }
    //     });
    // }
    // if ((perfil.Id == 1 || perfil.Id == 2) && this.state.diario.EstadoDiarioId == 7) {
    //   this.diarioPromise = utils.makeCancellable(
    //     api.changeEstadoDiario(
    //       this.state.diario.Id,
    //       "Rechazado Líder Técnico",
    //       usuario.UserId
    //     )
    //   );
  
    //   this.diarioPromise.promise
    //     .then(({ data: { Data } }) => {
    //       Alert.alert("Diario rechazado")
    //     })
    //     .catch(reason => {
    //       if (reason.isCanceled) {
    //         console.log("isCanceled", reason.isCanceled);
    //       } else {
    //         console.log("Error", reason);
    //       }
    //     });
    // }
    // this.handleRefresh();
  };

  verResumen = (d: Diario) => {
    this.props.selectDiario(d);
    const { usuario, perfil } = this.props;
    this.props.navigation.navigate(
      `${perfil.prefix}Visualizar`
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <FlatList
        data={this.filtrarDiarios()}
        keyExtractor={item => item.Codigo}
        refreshing={loading}
        onRefresh={this.handleRefresh}
        renderItem={({ item }) => (
          <DiarioCard
            diario={item}
            acciones={[
              {
                title: "APROBAR",
                onPress: () => this.aprobar(item)
              },
              {
                title: "RECHAZAR",
                onPress: () => this.recharzar(item)
              },
              {
                title: "VER PDF",
                onPress: () => this.verResumen(item)
              }
            ]}
          />
        )}
      />
    );
  }
}

const mapStateToProps = ({ diarios, auth }) => ({
  usuario: auth.user,
  perfil: auth.perfil,
  loading: diarios.loading,
  diarios: diarios.diarios
});

export default connect(
  mapStateToProps,
  { getDiarios, selectDiario }
)(DiarioAprobacionScreen);
