import React, { Component } from "react";
import { connect } from "react-redux";
import { FlatList } from "react-native";

import { selectDiario, getDiarios } from "../../store/diarios/actions";

import { Diario } from "../../models/Diario";
import { Perfil } from "../../models/Perfil";
import { Usuario } from "../../models/Usuario";

import DiarioCard from "../../components/diarioCard/DiarioCard";

export interface DiarioEjecucionProps {
  loading: boolean;
  usuario: Usuario;
  diarios: Diario[];
  perfil: Perfil;
  navigation: any;
  selectDiario(diario: Diario): void;
  getDiarios(UserId: number, perfilId: number): void;
}

class DiarioEjecucionScreen extends Component<DiarioEjecucionProps, {}> {
  filtrarDiarios = () => {
    const { diarios } = this.props;

    return diarios.filter(diario => {
      return diario.EstadoDiarioName === "En Ejecución";
    });
  };

  _onPressButton = (diario: Diario) => {
    this.props.selectDiario(diario);
    console.log(`${this.props.perfil.prefix}DiarioDetalle`);
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
)(DiarioEjecucionScreen);
