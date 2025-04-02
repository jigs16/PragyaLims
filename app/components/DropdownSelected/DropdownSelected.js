import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, useColorScheme} from 'react-native';
import {BaseColor} from '../../config';
const DropdownSelected = props => {
  const {item, selected} = props;
  const isDarkMode = useColorScheme();
  return (
    <View
      style={{
        height: 35,
        paddingHorizontal: 10,
        justifyContent: 'center',
        width: '100%',
        backgroundColor: selected
          ? isDarkMode === 'dark'
            ? BaseColor.darkGraycolor
            : BaseColor.buttonGradient2
          : isDarkMode === 'dark'
          ? '#191919'
          : '#ffffff',
        // color: 'red'
      }}>
      <Text
        style={{
          color: selected
            ? isDarkMode === 'dark'
              ? '#191919'
              : BaseColor.whiteColor
            : isDarkMode === 'dark'
            ? '#ffffff'
            : '#191919',
        }}>
        {item}
      </Text>
    </View>
  );
};

export default DropdownSelected;
