import React from "react";

import color from "../../styles/color";
import PopupMenu from "../../components/menu/PopupMenu";
import { TabNavigatorConfig } from "react-navigation";

export const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: color.blue1
  },
  headerTintColor: "#FFFFFF"
};

export const diariosNavigationOptions = {
  title: "Diarios de Obra",
  headerRight: <PopupMenu />
};

export const drawTabConfig: TabNavigatorConfig = {
  tabBarPosition: "top",
  swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: "#FFFFFF",
    inactiveTintColor: "#F8F8F8",
    style: {
      backgroundColor: color.blue1
    },
    labelStyle: {
      textAlign: "center"
    },
    indicatorStyle: {
      borderBottomColor: "#87B56A",
      borderBottomWidth: 2
    }
  }
};
