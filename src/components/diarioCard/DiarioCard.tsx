import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

import color from "../../styles/color";
import CardHeader from "./CardHeader";
import { Diario } from "../../models/Diario";

interface DiarioCardProps {
  diario: Diario;
  acciones: any;
}

const DiarioCard: React.FC<DiarioCardProps> = ({ diario, acciones }) => {
  return (
    <View style={styles.card}>
      <CardHeader
        title={diario.Codigo}
        subtitle={diario.ClienteName}
        fechaRegistro={diario.Fecharegistro}
      />

      <View style={styles.descriptionWrapper}>
        <Text numberOfLines={3} style={styles.descripcion}>
          {diario.Descripcion}
        </Text>
      </View>

      {acciones && (
        <View style={styles.actionBar}>
          {acciones.map((accion: any, index: number) => {
            return (
              <View key={index} style={{ marginRight: 8 }}>
                <TouchableOpacity onPress={accion.onPress}>
                  <Text
                    style={{
                      padding: 8,
                      fontWeight: "bold",
                      color: color.blue1
                    }}
                  >
                    {accion.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    borderBottomWidth: 1,
    borderColor: "#CED0CE",
    marginBottom: 2
  },
  descriptionWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  descripcion: {
    fontSize: 14
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    marginBottom: 16
  }
});

export default DiarioCard;
