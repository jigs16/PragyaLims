import React from 'react';
import { View } from 'react-native';
import { BaseColor } from '../../../config';
import styles from './styles';

const ProgressBar = ({ style = {}, height = 5, color = '', percent = 10, width = '100%', backgroundColor = '' }) => {
  return (
    <View style={[{ height: height, width: width }, style]}>
      <View style={styles.content}>
        <View
          style={{
            height: height,
            width: '100%',
            backgroundColor: backgroundColor ? backgroundColor : BaseColor.whiteColor,
            borderRadius: height,
            position: 'absolute',
          }}
        />
        <View
          style={{
            height: height,
            width: `${percent}%`,
            backgroundColor: color ? color : BaseColor.whiteColor,
            borderRadius: height,
            position: 'absolute',
          }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
