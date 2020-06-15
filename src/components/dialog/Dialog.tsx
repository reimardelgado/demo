import React, { PureComponent } from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  Text,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
  ModalProps
} from "react-native";
const { OS } = Platform;

interface Props {
  title?: string;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
  buttonsStyle?: StyleProp<ViewStyle>;
  dialogStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  buttons?: React.ReactNode;
  onTouchOutside?: (event: any) => void;
  keyboardShouldPersistTaps?: boolean | "always" | "never" | "handled";
  keyboardDismissMode: "none" | "interactive" | "on-drag";
}

export type DialogProps = Props & ModalProps;

export default class Dialog extends PureComponent<DialogProps, {}> {
  static defaultProps = {
    onRequestClose: () => {},
    visible: false
  };

  renderContent = () => {
    const { children, contentStyle } = this.props;

    return (
      <View
        style={[
          {
            width: "100%",
            padding: 24,
            paddingTop: 20
          },
          contentStyle
        ]}
      >
        {children}
      </View>
    );
  };

  renderTitle = () => {
    const { title, titleStyle } = this.props;

    const textAlign = OS === "ios" ? "center" : null;

    if (title)
      return (
        <Text
          style={[
            {
              textAlign,
              color: "#000000DD",
              fontSize: 20,
              margin: 24,
              marginBottom: 0
            },
            titleStyle
          ]}
        >
          {title}
        </Text>
      );
  };

  renderButtons = () => {
    const { buttons, buttonsStyle } = this.props;

    const containerStyle =
      OS === "ios"
        ? {}
        : {
            width: "100%",
            paddingLeft: 24,
            paddingRight: 8,
            paddingTop: 8,
            paddingBottom: 8
          };

    if (buttons)
      return <View style={[containerStyle, buttonsStyle]}>{buttons}</View>;
  };

  _renderOutsideTouchable = onTouch => {
    const view = <View style={{ flex: 1, width: "100%" }} />;

    if (!onTouch) return view;

    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{ flex: 1, width: "100%" }}
      >
        {view}
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {
      dialogStyle,
      visible,
      animationType,
      onRequestClose,
      onShow,
      onOrientationChange,
      onTouchOutside,
      overlayStyle,
      supportedOrientations,
      keyboardDismissMode,
      keyboardShouldPersistTaps
    } = this.props;

    const dialogBackgroundColor = OS === "ios" ? "#e8e8e8" : "#ffffff";
    const dialogBorderRadius = OS === "ios" ? 5 : 1;

    return (
      <Modal
        animationType={animationType}
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={onShow}
        onOrientationChange={onOrientationChange}
        supportedOrientations={supportedOrientations}
      >
        <ScrollView
          style={{
            flex: 1
          }}
          contentContainerStyle={{
            flex: 1
          }}
          keyboardDismissMode={keyboardDismissMode}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          <View
            style={[
              {
                flex: 1,
                backgroundColor: "#000000AA",
                padding: 34
              },
              overlayStyle
            ]}
          >
            {this._renderOutsideTouchable(onTouchOutside)}

            <View
              style={[
                {
                  backgroundColor: dialogBackgroundColor,
                  width: "100%",
                  shadowOpacity: 0.24,
                  borderRadius: dialogBorderRadius,
                  elevation: 4,
                  shadowOffset: {
                    height: 4,
                    width: 2
                  }
                },
                dialogStyle
              ]}
            >
              {this.renderTitle()}

              {this.renderContent()}

              {this.renderButtons()}
            </View>

            {this._renderOutsideTouchable(onTouchOutside)}
          </View>
        </ScrollView>
      </Modal>
    );
  }
}
