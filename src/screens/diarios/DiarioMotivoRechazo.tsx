import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Picker,
  ActivityIndicator,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Input, colors, ListItem } from "react-native-elements";

import * as api from "../../api/apiService";
import * as utils from "../../utils/utils";

import { Diario, MotivoRechazo } from "../../models/Diario";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import color from "../../styles/color";
import { Perfil } from "../../models/Perfil";
import { Usuario } from "../../models/Usuario";

interface MotivoRechazoScreenProps {
  navigation: any;
  diario: Diario;
  perfil: Perfil;
  usuario: Usuario;
}
interface MotivoRechazoScreenState {
  motivo: MotivoRechazo;
  loading: boolean;
}

class MotivoRechazoScreen extends Component<
  MotivoRechazoScreenProps,
  MotivoRechazoScreenState
> {
  static navigationOptions = () => {
    return {
      title: "Motivo de rechazo"
    };
  };

  motivoPromise: utils.Cancellable = null;

  constructor(props: MotivoRechazoScreenProps) {
    super(props);

    this.state = {
      loading: true,
      motivo: {}
    };
  }

  componentDidMount() {
      this.loadMotivo();
  }

  componentWillUnmount() {
    if (this.motivoPromise) this.motivoPromise.cancel();
   
  }

  loadMotivo() {
    this.motivoPromise = utils.makeCancellable(api.getMotivo(this.props.diario.Id));

    this.motivoPromise.promise
      .then(({ data: { Data } }) => {
        this.setState({ motivo: Data || {}, loading: false });
      })
      .catch(reason => {
        if (reason.isCanceled) {
          console.log("isCanceled", reason.isCanceled);
        } else {
          this.setState({ motivo: {}, loading: false });
        }
      });
  }

  actualizarDato = (parametro: string, valor: any) => {
    this.setState(prevState => {
      return {
        motivo: {
          ...prevState.motivo,
          [parametro]: valor
        }
      };
    });
  };

  onSave = () => {
    if (
      this.state.motivo.Motivo == ""
    ) {
      Alert.alert("Error", "Debe completar el motivo de rechazo.");
    } else {
      this.state.motivo.LibroObraId = this.props.diario.Id;
      this.motivoPromise = utils.makeCancellable(
        api.saveMotivo(this.props.diario.Id,this.state.motivo.Motivo, this.props.perfil.Id, this.props.usuario.UserId)
      );
      this.motivoPromise.promise
        .then(({ data: { Data } }) => {
          Alert.alert("Motivo de rechazo", "Datos guardados correctamente.");
          this.props.navigation.goBack();
        })
        .catch(reason => {
          if (reason.isCanceled) {
            console.log("isCanceled", reason.isCanceled);
          } else {
            this.setState({
              motivo: {},
              loading: false
            });
          }
        });
    }
  };

  render() {
    const {
      motivo,
      loading
    } = this.state;

    if (loading)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    return (
      <View style={styles.list}>
        <View style={styles.header}>
          <Text style={styles.title}>Motivo de rechazo</Text>
          <TouchableOpacity onPress={this.onSave}>
            <MaterialIcons
              name="save"
              backgroundColor="transparent"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView style={{ padding: 8 }}>
            <Text
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Motivo
            </Text>
            <Input
              onChangeText={valor => this.actualizarDato("Motivo", valor)}
              multiline={true}
              numberOfLines={7}
              textAlignVertical={"top"}
              containerStyle={{ padding: 8, marginBottom: 80 }}
              inputContainerStyle={{
                borderWidth: 1,
                borderRadius: 5
              }}
              inputStyle={{
                height: null,
                padding: 8
              }}
              value={motivo.Motivo}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    // marginTop: 10
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: colors.greyOutline
  },
  title: {
    fontSize: 18
  },
  inputText: {
    fontSize: 14
  }
});

const mapStateToProps = ({ diarios, auth }) => ({
  diario: diarios.diarioActual,
  perfil: auth.perfil,
  usuario: auth.user
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MotivoRechazoScreen);
