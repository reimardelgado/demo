import React from "react";
import {
  Text,
  View,
  StyleProp,
  ViewProps,
  ActivityIndicator
} from "react-native";
import Dialog, { DialogProps } from "./Dialog";

interface Props {
  message: string | React.ReactNode;
  messageStyle?: StyleProp<ViewProps>;
  activityIndicatorStyle?: StyleProp<ViewProps>;
  activityIndicatorColor?: string;
  activityIndicatorSize?: number | "small" | "large";
}

type ProgressDialogProps = Props & DialogProps;

export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  message,
  messageStyle,
  activityIndicatorColor,
  activityIndicatorSize,
  activityIndicatorStyle,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ActivityIndicator
          animating={true}
          color={activityIndicatorColor}
          size={activityIndicatorSize}
          style={activityIndicatorStyle}
        />
        <Text
          style={[
            { marginLeft: 20, fontSize: 18, color: "#00000089" },
            messageStyle
          ]}
        >
          {message}
        </Text>
      </View>
    </Dialog>
  );
};
