import React, { useState } from "react";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";

import { MaterialIcons } from "@expo/vector-icons";
import { useScreens } from "react-native-screens";

import store from "./src/store";
import NavigationService from "./src/services/NavigationService";

import AppNavigator from "./src/navigation/AppNavigator";

// Optimize memory usage and performance
// See: https://reactnavigation.org/docs/en/react-native-screens.html
useScreens();

export default function App(props: any) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <Provider store={store}>
          <AppNavigator
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </Provider>
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/login.png"),
      require("./assets/images/close.png"),
      require("./assets/images/email.png"),
      require("./assets/images/password.png"),
      require("./assets/images/person.png"),
      require("./assets/images/repeat.png")
    ]),
    Font.loadAsync({
      ...MaterialIcons.font
    })
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
