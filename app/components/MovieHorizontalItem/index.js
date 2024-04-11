import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import styles from './styles';
import {BaseColor, Images} from '../../config';
import {Pressable, ImageBackground} from 'react-native';
import {moderateScale, verticalScale} from '../../config/scaling';
import Image from '../Image';

export default function MovieHorizontalItem(props) {
  const {type, name, moviePoster, onPressItem, ...attrs} = props;

  return (
    <Pressable
      onPress={onPressItem}
      style={{
        margin: 5,
        borderRadius: 15,
        shadowOffset: {
          height: 1,
          width: 1,
        },
        shadowOpacity: Platform.OS == 'ios' ? 0.9 : 0.8,
        shadowRadius: 5,
        elevation: 2,
        shadowColor: '#000000',
      }}>
      <ImageBackground
        borderRadius={15}
        style={{
          overflow: 'hidden',
          width: moderateScale(160),
          height: verticalScale(280),
          marginBottom: moderateScale(15),
        }}
        source={moviePoster}>
        <Image
        resizeMode='contain'
          style={{width: 50, hright: 50}}
          source={Images.ic_premium2}></Image>
      </ImageBackground>
      {/* {name != '' && <Text>{name}</Text>} */}
    </Pressable>
  );
}

MovieHorizontalItem.propTypes = {
  style: PropTypes.object,
  name: PropTypes.string,
  //movie_poster: PropTypes.string,
};

MovieHorizontalItem.defaultProps = {
  style: {},
  name: '',
  //movie_poster: '',
};
