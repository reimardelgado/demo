import React from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

import PerfilItem from "./PerfilItem";

const PerfilesList = ({ perfiles, perfilActual, onItemPress }) => {
  return (
    <FlatList
      data={perfiles}
      keyExtractor={(item, _) => item.Id.toString()}
      renderItem={({ item }) => (
        <PerfilItem
          perfil={item}
          onPress={onItemPress}
          selected={perfilActual && item.Id == perfilActual.Id}
        />
      )}
    />
  );
};

PerfilesList.propTypes = {
  perfiles: PropTypes.array.isRequired,
  onItemPress: PropTypes.func.isRequired,
  perfilActual: PropTypes.object
};

export default PerfilesList;
