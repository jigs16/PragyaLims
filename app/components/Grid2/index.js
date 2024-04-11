import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import styles from './styles';
import {BaseColor, Images} from '../../config';
import {Pressable} from 'react-native';
import {moderateScale} from '../../config/scaling';
import Image from '../Image';

export default function Grid2(props) {
  const {name, flag, style, onPress, ...attrs} = props;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.textSelectionMainContainer,
        {
          backgroundColor: flag
            ? BaseColor.buttonGradient2
            : BaseColor.darkColor,
        },
      ]}>
        <Image style={{width: 40, height: 40, marginTop: -10}} resizeMode='contain' source={Images.ic_interest1}></Image>
      <Text style={{width: '90%', marginTop: 5}} textAlign={'center'} numberOfLines={1} bold overline>
        {name}
      </Text>
    </Pressable>
  );
}

Grid2.propTypes = {
  style: PropTypes.object,
  name: PropTypes.string,
};

Grid2.defaultProps = {
  style: {},
  name: '',
};