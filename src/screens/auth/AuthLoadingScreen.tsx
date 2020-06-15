import React, { Component } from "react";
import { AsyncStorage, ActivityIndicator, View, Text } from "react-native";
import { connect } from "react-redux";

import { getDiarios } from "../../store/diarios/actions";
import { getUsuario, setPerfil, setUsuario } from "../../store/usuarios/actions";

import * as utils from "../../utils/utils";
import color from "../../styles/color";
import { Perfil } from "../../models/Perfil";
import { Usuario } from "../../models/Usuario";

interface AuthLoadingProps {
  navigation: any;
  setPerfil(perfil: Perfil, persist?: boolean): Promise<void>;
  getDiarios(personalId: number, perfilId: number): Promise<void>;
  getUsuario(UserId: number): Promise<boolean>;
  setUsuario(usuario: Usuario, persist?: boolean): Promise<boolean>;
  perfil: Perfil;
  usuario: Usuario;
}

interface AuthLoadingState {
  loading: boolean;
}

class AuthLoadingScreen extends Component<AuthLoadingProps, AuthLoadingState> {
  static propTypes = {};

  state = {
    loading: false
  };

  // Obtener la información del usuario diapositivo
  // y luego se navega al screen correcto
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    let usuario: any = await AsyncStorage.getItem("usuario");
    let perfil: any = await AsyncStorage.getItem("perfil");

    if (usuario && perfil) {
      this.setState(
        {
          loading: true
        },
        async () => {
          usuario = JSON.parse(usuario);
          perfil = JSON.parse(perfil);

          // Se necesita cargar el perfil en el estado
          // porque las subrutas dependen del prefix
          // almacenado en el perfil
          await this.props.setPerfil(perfil);

          // Cargando datos iniciales del usuario
          this.props.getDiarios(usuario.UserId, perfil.Id);

          // Se utiliza el usuario que esta en el 
          // dispositivo mientras se pide la informacion
          // al API
          this.props.setUsuario(usuario);
          this.props.getUsuario(usuario.UserId);

          const ruta = utils.getRouteFromProfileName(perfil.Descripcion);
          this.props.navigation.navigate(ruta);
        }
      );
    } else {
      this.props.navigation.navigate("Auth");
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color.blue1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {this.state.loading && (
          <>
            <Text style={{ color: "white", fontSize: 16 }}>
              Inicializando la aplicación ...
            </Text>
            <ActivityIndicator color="white" style={{ marginTop: 10 }} />
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  usuario: auth.user,
  perfil: auth.perfil
});

const mapDispatchToProps = {
  getUsuario,
  setUsuario,
  getDiarios,
  setPerfil
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);
