import React from 'react';
import { TouchableOpacity } from 'react-native';
import { BaseColor } from '../../config';
import Icon from '../Icon';
import Text from '../Text';

const CheckBox = ({
  onPress = () => {},
  title = '',
  checkedIcon = 'check-circle',
  uncheckedIcon = 'circle',
  checked = true,
  color = '',
  style,
}) => {
  return (
    <TouchableOpacity style={[style,{ flexDirection: 'row', alignItems: 'center' }]} onPress={onPress}>
      <Icon solid={checked} name={checked ? checkedIcon : uncheckedIcon} color={color || BaseColor.whiteColor} size={24} />
      <Text body1 style={{ paddingHorizontal: 8 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
