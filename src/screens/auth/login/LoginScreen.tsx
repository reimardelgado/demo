import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text
} from "react-native";
import { connect } from "react-redux";

import color from "../../../styles/color";
import { w, h } from "../../../api/Dimensions";

import InputField from "./InputField";
import LoginButton from "./LoginButton";

import { login } from "../../../store/usuarios/actions";

const companyLogo = require("../../../../assets/images/login.png");
const password = require("../../../../assets/images/password.png");
const person = require("../../../../assets/images/person.png");

interface LoginScreenProps {
  loading: boolean;
  navigation: any;
  login(username: string, password: string): Promise<boolean>;
}

interface LoginScreenState {
  isUserNameCorrect: boolean;
  isPasswordCorrect: boolean;
  isLogin: boolean;
}

class LoginScreen extends Component<LoginScreenProps, LoginScreenState> {
  static navigationOptions = {
    header: null
  };

  username: InputField;
  password: InputField;

  state = {
    isUserNameCorrect: false,
    isPasswordCorrect: false,
    isLogin: false
  };

  login = () => {
    const username = this.username.getInputValue();
    const password = this.password.getInputValue();

    this.setState(
      {
        isUserNameCorrect: username === "",
        isPasswordCorrect: password === ""
      },
      async () => {
        if (username !== "" && password !== "") {
          if (await this.props.login(username, password)) {
            this.props.navigation.navigate("Perfil");
          } else {
            Alert.alert(
              "No se pudo realizar la autenticación",
              "Nombre de usuario o contraseña incorrectos"
            );
          }
        }
      }
    );
  };

  changeInputFocus = (name: string) => () => {
    if (name === "username") {
      this.setState({
        isUserNameCorrect: this.username.getInputValue() === ""
      });
      this.password.input.focus();
    } else {
      this.setState({
        isPasswordCorrect: this.password.getInputValue() === ""
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.icon} resizeMode="contain" source={companyLogo} />
        <InputField
          name="username"
          placeholder="Usuario o correo electrónico"
          style={styles.username}
          error={this.state.isUserNameCorrect}
          focus={this.changeInputFocus}
          ref={ref => (this.username = ref)}
          icon={person}
        />
        <InputField
          name="password"
          placeholder="Contraseña"
          returnKeyType="done"
          secureTextEntry={true}
          blurOnSubmit={true}
          error={this.state.isPasswordCorrect}
          ref={ref => (this.password = ref)}
          focus={this.changeInputFocus}
          icon={password}
        />
        {this.props.loading ? (
          <ActivityIndicator
            size="large"
            style={styles.spinner}
            color="white"
          />
        ) : (
          <>
            <LoginButton
              text="Entrar"
              onPress={this.login}
              isLogin={this.props.loading}
            />
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.navigate("Recovery")}
            >
              <Text style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableWithoutFeedback>
          </>
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
  username: {
    marginBottom: h(4.5)
  },
  touchable: {
    flex: 1
  },
  spinner: {
    marginTop: h(8),
    height: h(5)
  },
  forgotPassword: {
    color: "white",
    marginTop: h(2),
    paddingVertical: 8,
    paddingHorizontal: 16
  }
});

const mapStateToProps = ({ auth }) => ({
  loading: auth.loading,
  user: auth.user
});

export default connect(
  mapStateToProps,
  { login }
)(LoginScreen);
