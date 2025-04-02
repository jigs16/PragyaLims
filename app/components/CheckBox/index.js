import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { BaseColor } from "../../config";
import Icon from "../Icon";
import Text from "../Text";

const CheckBox = ({
  onPress = () => {},
  title = "",
  checkedIcon = "check-square",
  uncheckedIcon = "square",
  // checked = true,
  color = "",
  style,
}) => {
  const [checked, setChecked] = useState(false);
  const handlePress = () => {
    setChecked(!checked);
    onPress(!checked); // Pass the new checked state to the onPress callback
  };

  return (
    <TouchableOpacity
      style={[style, { flexDirection: "row", alignItems: "center" }]}
      onPress={handlePress}
    >
      <Icon
        solid={checked}
        name={checked ? checkedIcon : uncheckedIcon}
        color={color || BaseColor.darkColor}
        size={24}
      />
      <Text body1 darkColor style={{ paddingHorizontal: 8 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
