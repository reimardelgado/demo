import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle
} from "react-native";
import { w, h, totalSize } from "../../../api/Dimensions";

interface Props extends TouchableOpacityProps {
  isLogin: boolean;
  text: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
}

const LoginButton: React.FC<Props> = ({
  isLogin,
  text,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.button, props.style]}
      activeOpacity={0.6}
      disabled={isLogin}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "85%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: w(2),
    backgroundColor: "#888",
    borderRadius: w(10),
    marginTop: h(6)
  },
  text: {
    color: "white",
    fontWeight: "700",
    paddingVertical: h(1),
    fontSize: totalSize(2.1)
  }
});

export default LoginButton;
