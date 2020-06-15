import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Avatar, ListItem } from "react-native-elements";

import color from "../../styles/color";
import { h, w } from "../../api/Dimensions";
import { getRouteFromProfileName, RUTAS } from "../../utils/utils";
import { setPerfil } from "../../store/usuarios/actions";
import { getDiarios } from "../../store/diarios/actions";

import PerfilesList from "../../components/perfilesList/PerfilesList";
import { Perfil } from "../../models/Perfil";
import { Usuario } from "../../models/Usuario";

interface SeleccionarPerfilProps {
  user: Usuario;
  perfil: Perfil;
  getDiarios(personalId: number, perfilId: number): Promise<void>;
  setPerfil(perfil: Perfil, persist?: boolean): Promise<void>;
  navigation: any;
}

interface SeleccionarPerfilState {
  perfiles: Perfil[];
}

class SeleccionarPerfilScreen extends Component<
  SeleccionarPerfilProps,
  SeleccionarPerfilState
> {
  static navigationOptions = {
    header: null
  };

  static propTypes = {};

  state = {
    perfiles: []
  };

  componentDidMount() {
    const { user } = this.props;

    // Se usará prefix para crear las subrutas del usuario
    const perfiles = user.Perfiles.map(perfil => {
      return { ...perfil, prefix: RUTAS[perfil.Descripcion].prefix };
    });

    this.setState({
      perfiles
    });
  }

  seleccionarPerfil = (perfil: Perfil) => {
    const { user, getDiarios, setPerfil, navigation } = this.props;

    setPerfil(perfil, true).then(() => {
      getDiarios(user.UserId, perfil.Id);
    });

    const ruta = getRouteFromProfileName(perfil.Descripcion);
    navigation.navigate(ruta);
  };

  render() {
    const { user } = this.props;
    const { perfiles } = this.state;

    if (perfiles.length == 1) {
      this.seleccionarPerfil(perfiles[0]);
    }

    return (
      <View style={styles.container}>
        <View style={styles.perfilesWrapper}>
          <ListItem
            title={user.NombreCompleto}
            subtitle={user.Email}
            containerStyle={styles.listContainerStyle}
            leftAvatar={
              <Avatar
                rounded
                title={user.NombreCompleto[0].toUpperCase()}
                size={h(6.5)}
                overlayContainerStyle={{ backgroundColor: "#1abc9c" }}
              />
            }
          />
          <PerfilesList
            perfiles={perfiles}
            perfilActual={this.props.perfil}
            onItemPress={this.seleccionarPerfil}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.blue1
  },
  perfilesWrapper: {
    width: w(80),
    marginTop: h(10),
    backgroundColor: "white",
    borderTopStartRadius: w(2),
    borderTopEndRadius: w(2)
  },
  listContainerStyle: {
    borderTopStartRadius: w(2),
    borderTopEndRadius: w(2)
  }
});

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
  perfil: auth.perfil
});

const mapDispatchToProps = { getDiarios, setPerfil };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeleccionarPerfilScreen);
