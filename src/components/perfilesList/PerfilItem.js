import React from "react";
import { View, Text, TouchableNativeFeedback, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { totalSize } from "../../api/Dimensions";
import color from "../../styles/color";

const PerfilItem = ({ perfil, selected, onPress }) => {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple(color.blue1, false)}
      onPress={() => {
        onPress(perfil);
      }}
      delayPressIn={0}
    >
      <View style={styles.itemContainer}>
        <MaterialIcons name="group" color="black" size={totalSize(3)} />
        <Text style={styles.descriptionText}>{perfil.Descripcion}</Text>
        {selected && (
          <MaterialIcons name="check" size={totalSize(3)} color={color.blue1} />
        )}
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  itemContainer: { flexDirection: "row", padding: 20 },
  descriptionText: { marginLeft: 15, paddingTop: 3, flex: 1 }
});

export default PerfilItem;
