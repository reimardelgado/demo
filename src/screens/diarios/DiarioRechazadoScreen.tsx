import React, { Component } from "react";
import { connect } from "react-redux";
import { FlatList } from "react-native";

import { selectDiario, getDiarios } from "../../store/diarios/actions";

import DiarioCard from "../../components/diarioCard/DiarioCard";
import { Diario } from "../../models/Diario";
import { Usuario } from "../../models/Usuario";
import { Perfil } from "../../models/Perfil";

interface DiarioRechazadoProps {
  navigation: any;
  loading: boolean;
  diarios: Diario[];
  usuario: Usuario;
  perfil: Perfil;
  selectDiario(diario: Diario): void;
  getDiarios(UserId: number, perfilId: number): void;
}

class DiarioRechazadoScreen extends Component<DiarioRechazadoProps, {}> {
  filtrarDiarios = () => {
    const { diarios } = this.props;

    return diarios.filter(diario => {
      return diario.EstadoDiarioName === "Rechazado";
    });
  };

  _onPressButton = (diario: Diario) => {
    this.props.selectDiario(diario);
    this.props.navigation.navigate(`${this.props.perfil.prefix}DiarioDetalle`);
  };

  _callEjecutar = (diario: Diario) => {
    this.props.selectDiario(diario);
    this.props.navigation.navigate(`${this.props.perfil.prefix}Diario`);
  };

  handleRefresh = async () => {
    const { usuario, perfil } = this.props;

    this.props.getDiarios(usuario.UserId, perfil.Id);
  };

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
                title: "DETALLES",
                onPress: () => this._onPressButton(item)
              },
              {
                title: "EJECUTAR",
                onPress: () => this._callEjecutar(item)
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
)(DiarioRechazadoScreen);
