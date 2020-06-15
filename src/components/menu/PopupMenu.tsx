import React, { Component } from "react";
import Menu, { MenuItem } from "react-native-material-menu";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";

import { logout } from "../../store/usuarios/actions";
import NavigationService from "../../services/NavigationService";

interface PopupMenuProps {
  logout(): Promise<void>;
}

class PopupMenu extends Component<PopupMenuProps, {}> {
  menu: Menu;

  hideMenu = () => this.menu.hide();
  showMenu = () => this.menu.show();

  cerrarSesion = async () => {
    await this.props.logout();
    this.menu.hide();
    NavigationService.navigate("Auth");
  };

  render() {
    return (
      <Menu
        ref={(ref: Menu) => (this.menu = ref)}
        button={
          <TouchableOpacity style={{ padding: 12 }} onPress={this.showMenu}>
            <MaterialIcons name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        }
      >
        <MenuItem onPress={this.cerrarSesion}>Cerrar sesión</MenuItem>
      </Menu>
    );
  }
}

export default connect(
  null,
  { logout }
)(PopupMenu);
