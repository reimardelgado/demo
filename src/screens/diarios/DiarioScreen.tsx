import React, { Component } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";

import NavigationCard from "../../components/navigationCard/NavigationCard";
import { Perfil } from "../../models/Perfil";
import { Usuario } from "../../models/Usuario";

const NUM_COLUMNS = 3;
const opciones = [
  { name: "TRABAJO", code: "#1abc9c", url: "Trabajo", icon: "library-books" },
  { name: "PERSONAL", code: "#2ecc71", url: "Personal", icon: "group" },
  { name: "CLIMA", code: "#3498db", url: "Clima", icon: "cloud" },
  {
    name: "HERRAMIENTAS",
    code: "#9b59b6",
    url: "Herramientas",
    icon: "build"
  },
  { name: "MATERIALES", code: "#34495e", url: "Materiales", icon: "bookmark" },
  {
    name: "ACTIVIDADES",
    code: "#16a085",
    url: "Actividades",
    icon: "list"
  },
  { name: "CALIDAD", code: "#27ae60", url: "Calidad", icon: "done-all" },
  { name: "FOTOS", code: "#2980b9", url: "Fotos", icon: "camera-alt" },
  {
    name: "VISTA PREVIA",
    code: "#8e44ad",
    url: "Visualizar",
    icon: "visibility"
  },
  { name: "FIRMA", code: "#2c3e50", url: "Firma", icon: "edit" }
];

interface DiarioScreenProps {
  navigation: any;
  perfil: Perfil;
  usuario: Usuario;
}

class DiarioScreen extends Component<DiarioScreenProps, {}> {
  static navigationOptions: Object;

  formatData = (data, numColumns: number) => {
    // const numberOfFullRows = Math.floor(data.length / numColumns);
    // let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    let numberOfElementsLastRow = data.length % numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };

  renderItem = ({ item }) => {
    if (item.empty === true) {
      return <View style={styles.item} />;
    }
    return (
      <NavigationCard
        name={item.name}
        backgroundColor={item.code}
        onPress={() => {
          if (item.url === "Firma") {
            if (this.props.usuario.firmaCargada) {
              this.props.navigation.navigate(
                `${this.props.perfil.prefix}${item.url}`
              );
            } else {
              Alert.alert(
                "Información",
                "Debe cargar su firma para acceder a esta opción"
              );
            }
          } else {
            this.props.navigation.navigate(
              `${this.props.perfil.prefix}${item.url}`
            );
          }
        }}
        icon={<MaterialIcons name={item.icon} size={36} color="white" />}
      />
    );
  };

  render() {
    return (
      <FlatList
        data={this.formatData(opciones, NUM_COLUMNS)}
        style={styles.container}
        renderItem={this.renderItem}
        keyExtractor={(_, index) => index.toString()}
        numColumns={NUM_COLUMNS}
      />
    );
  }
}

DiarioScreen.navigationOptions = () => ({
  title: `Opciones del diario`
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16
  },
  item: {
    flex: 1,
    margin: 5,
    height: 120, // aproximadamente un cuadrado
    backgroundColor: "transparent"
  }
});

const mapStateToProps = ({ diarios, auth }) => ({
  diario: diarios.diarioActual,
  perfil: auth.perfil,
  usuario: auth.user
});

export default connect(
  mapStateToProps,
  null
)(DiarioScreen);
