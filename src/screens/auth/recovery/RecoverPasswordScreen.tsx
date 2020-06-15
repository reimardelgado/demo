import React, { Component } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import InputField from "../login/InputField";
import LoginButton from "../login/LoginButton";

import color from "../../../styles/color";
import { h, w } from "../../../api/Dimensions";
import * as api from "../../../api/apiService";

const companyLogo = require("../../../../assets/images/login.png");
const person = require("../../../../assets/images/person.png");

interface Props {
  loading: boolean;
  navigation: any;
  recuperarContrasena(username: string): Promise<any>;
}

interface State {
  userNameInvalid: boolean;
  isLogin: boolean;
}

class RecoverPasswordScreen extends Component<Props, State> {
  static navigationOptions = {
    header: null
  };

  readonly state: State = {
    userNameInvalid: false,
    isLogin: false
  };

  username: InputField;

  onSumbit = () => {
    const { navigation } = this.props;
    const username = this.username.getInputValue();

    this.setState(
      {
        userNameInvalid: username.trim() === "" || username.trim().length <= 3,
        isLogin: true
      },
      async () => {
        if (!this.state.userNameInvalid) {
          try {
            await api.recuperarContrasena(username);
            Alert.alert(
              "Operación completada",
              "Las instrucciones serán enviadas a su correo electrónico",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Login")
                }
              ]
            );
          } catch (error) {
            Alert.alert(
              "Su usuario no fue encontrado",
              "No se encuentra el usuario especificafo. Vuelve a intentarlo con otros datos."
            );
          }
        }
        this.setState({
          isLogin: false
        });
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.icon} resizeMode="contain" source={companyLogo} />
        <InputField
          name="username"
          placeholder="Usuario o correo electrónico"
          error={this.state.userNameInvalid}
          ref={ref => (this.username = ref)}
          icon={person}
        />
        {this.state.isLogin ? (
          <ActivityIndicator
            size="large"
            style={styles.spinner}
            color="white"
          />
        ) : (
          <LoginButton
            text="Recuperar contraseña"
            onPress={this.onSumbit}
            isLogin={this.state.isLogin}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: color.blue1
  },
  icon: {
    width: w(70),
    height: h(30),
    marginTop: h(7),
    marginBottom: h(2)
  },
  touchable: {
    flex: 1
  },
  spinner: {
    marginTop: h(8),
    height: h(5)
  }
});

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecoverPasswordScreen);
