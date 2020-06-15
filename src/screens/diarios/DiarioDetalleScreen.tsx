import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import { colors, Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import color from "../../styles/color";

import { Diario } from "../../models/Diario";

interface PersonalScreenProps {
  navigation: any;
  diario: Diario;
  perfil: any;
}
interface PersonalScreenState {
  loading: boolean;
  diario: Diario;
}

class PersonalScreen extends Component<
  PersonalScreenProps,
  PersonalScreenState
> {
  static navigationOptions = {
    title: "Detalles de Diario"
  };

  constructor(props: PersonalScreenProps) {
    super(props);

    this.state = {
      loading: true,
      diario: {}
    };
  }

  DiarioDetallePromise = null;

  componentDidMount() {
      this.setState({
        diario: this.props.diario,
        loading: false
      });
  }

  componentWillUnmount() {}

  render() {
    const { diario } = this.props;
    const { loading } = this.state;

    if (loading)
      return (
        <View style={styles.list}>
          <ActivityIndicator color={color.blue1} style={{ marginTop: 10 }} />
        </View>
      );

    return (
      <View style={styles.list}>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView style={{ padding: 8 }}>
            <Input
              label="Diario"
              inputStyle={styles.inputText}
              value={diario.Codigo}
              editable={false}
            />
            <Input
              label="Fecha de registro"
              inputStyle={styles.inputText}
              value={diario.Fecharegistro.toString()}
              editable={false}
            />
            <Input
              label="Cliente"
              inputStyle={styles.inputText}
              value={diario.ClienteName}
              editable={false}
            />
            <Input
              label="Proyecto"
              inputStyle={styles.inputText}
              value={diario.ProyectoName}
              editable={false}
            />
            <Input
              label="Orden de compra"
              inputStyle={styles.inputText}
              value={diario.OrdenCompra}
              editable={false}
            />
            <Input
              label="Ciudad"
              inputStyle={styles.inputText}
              value={diario.Ciudad}
              editable={false}
            />
            <Input
              label="Dirección"
              inputStyle={styles.inputText}
              value={diario.Edificio}
              editable={false}
            />
            <Input
              label="Tipo de trabajo"
              inputStyle={styles.inputText}
              value={diario.TipoTrabajo}
              editable={false}
            />
            <Text
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                fontSize: 16,
                color: colors.grey3,
                fontWeight: "bold"
              }}
            >
              Descripción
            </Text>
            <Input
              multiline={true}
              numberOfLines={5}
              textAlignVertical={"top"}
              containerStyle={{ width: "100%", padding: 8 }}
              inputContainerStyle={{
                borderWidth: 1,
                borderRadius: 5
              }}
              inputStyle={{
                height: null,
                padding: 8
              }}
              value={diario.Descripcion}
              editable={false}
            />
            <Input
              label="Jefe de Obra"
              inputStyle={styles.inputText}
              value={diario.ProyectoName}
              editable={false}
            />
            <Input
              label="Estado"
              inputStyle={styles.inputText}
              value={diario.EstadoDiarioName}
              editable={false}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  selected: { backgroundColor: "#b8b8b8" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    alignItems: "center",
    borderColor: colors.greyOutline
  },
  inputText: {
    fontSize: 14
  },
  title: {
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        fontSize: 17
      },
      default: {
        fontSize: 16
      }
    })
  },
  subtitle: {
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        fontSize: 15
      },
      default: {
        color: color.androidSecondary,
        fontSize: 14
      }
    })
  },
  containerStyle: { padding: 12 },
  subtitleStyle: { lineHeight: 20 },
  seleted: {
    opacity: 0.5,
    backgroundColor: colors.grey3
  }
});

const mapStateToProps = ({ diarios, auth }) => ({
  perfil: auth.perfil,
  diarios: diarios.diarios,
  diario: diarios.diarioActual
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalScreen);
