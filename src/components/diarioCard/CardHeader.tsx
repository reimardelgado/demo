import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";

interface CardHeaderProps {
  title: string;
  fechaRegistro: Date;
  subtitle: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  fechaRegistro,
  subtitle
}) => {
  return (
    <View style={styles.cardHeader}>
      <View style={{ flexDirection: "row" }}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.date}>
          {Moment(fechaRegistro).format("YYYY-MM-DD")}
        </Text>
        <View style={{ padding: 3 }}>
          <MaterialIcons name="today" size={16} />
        </View>
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#232F34",
    fontWeight: "bold",
    paddingRight: 15
  },
  date: { fontSize: 16, fontWeight: "bold" },
  subtitle: {
    fontSize: 14,
    color: "grey",
    fontWeight: "bold",
    paddingVertical: 5
  }
});

export default CardHeader;
