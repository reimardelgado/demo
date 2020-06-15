import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  GestureResponderEvent,
  StyleProp,
  ViewStyle
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface FabButtonProps {
  onPress(event: GestureResponderEvent): void;
  containerStyle?: StyleProp<ViewStyle>;
  fabButtonStyle?: StyleProp<ViewStyle>;
  child: React.ReactNode;
}

const FabButton: React.FC<FabButtonProps> = ({
  onPress,
  containerStyle,
  fabButtonStyle,
  child
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TouchableOpacity onPress={onPress} style={[styles.fab, fabButtonStyle]}>
        {child}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    right: 20
  },
  fab: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#1b5e20",
    borderRadius: 30,
    ...Platform.select({
      android: {
        elevation: 8
      }
    })
  },
  fabIcon: {
    fontSize: 40,
    color: "white"
  }
});

export default FabButton;
