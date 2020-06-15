import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  ImageProps,
  TouchableOpacity,
  View
} from "react-native";

import { w } from "../../api/Dimensions";
import { MaterialIcons } from "@expo/vector-icons";

const FOTO_SIZE = w(24);

interface Props extends ImageProps {
  name: string;
  onPress?: (uri: string, selected: boolean) => void;
}

const TouchableFoto: React.FC<Props> = ({ name, onPress, style, ...props }) => {
  const [selected, setSelected] = useState(false);

  const toggleSelection = () => {
    onPress(name, !selected);
    setSelected(!selected);
  };

  return (
    <TouchableOpacity
      onPress={toggleSelection}
      onLongPress={() => {}}
      style={styles.pictureWrapper}
      activeOpacity={1}
    >
      <Image {...props} style={[style, selected ? styles.seleted : null]} />
      {selected && (
        <View style={{ position: "absolute", right: 5, bottom: 5 }}>
          <MaterialIcons
            name="check-box"
            size={24}
            color="#007dff"
            style={{ backgroundColor: "white" }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  seleted: {
    opacity: 0.5
  },
  pictureWrapper: {
    marginRight: 1,
    marginBottom: 1,
    width: FOTO_SIZE,
    height: FOTO_SIZE
  }
});

export default TouchableFoto;
