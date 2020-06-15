import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  StyleProp
} from "react-native";
import PropTypes from "prop-types";

import color from "../../styles/color";

interface NavigationCardProps {
  name: string;
  onPress(event: GestureResponderEvent): void;
  backgroundColor?: string;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const NavigationCard: React.FC<NavigationCardProps> = ({
  name,
  onPress,
  backgroundColor,
  icon,
  containerStyle
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.cardWrapper,
          { backgroundColor: backgroundColor || color.blue1 },
          containerStyle
        ]}
      >
        {icon && (
          <View style={{ position: "absolute", right: 15, top: 10 }}>
            {icon}
          </View>
        )}
        <View style={[styles.itemContainer]}>
          <Text style={styles.itemName}>{name}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    borderRadius: 5,
    margin: 5,
    height: 120
  },
  itemContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 15
  },
  itemName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600"
  }
});

export default NavigationCard;
