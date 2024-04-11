import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import styles from './styles';
import {BaseColor, Images} from '../../config';
import {Pressable, ImageBackground, View} from 'react-native';
import {moderateScale, verticalScale} from '../../config/scaling';
import Image from '../Image';

export default function MovieContinueItem(props) {
  const {type, name, moviePoster, onPressItem, ...attrs} = props;

  return (
    <Pressable
      onPress={onPressItem}
      style={{
        margin: 5,
        shadowColor: BaseColor.blackColor,
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 10,
      }}>
      <ImageBackground
        style={{
          overflow: 'hidden',
          width: moderateScale(200),
          height: verticalScale(150),
          borderRadius: 15,
          marginBottom: moderateScale(15),
          // borderTopLeftRadius: 10,
          // borderTopRightRadius: 10,
        }}
        source={moviePoster}
        // resizeMode={'strech'}
      >
        <Image
          resizeMode="contain"
          style={{width: 30, hright: 30}}
          source={Images.ic_premium1}></Image>
      </ImageBackground>
      {/* {type == 'uri' ? (
          <ImageBackground
            style={{
              overflow: 'hidden',
              height: moderateScale(220),
              borderRadius: 10,
            }}
            source={{uri: movie_poster}}
            resizeMode={'stretch'}
          />
        ) : (
          <ImageBackground
            style={{
              overflow: 'hidden',
              height: verticalScale(280),
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            source={movie_poster}
            resizeMode={'stretch'}
          />
        )} */}
      {/* {name != '' && <Text>{name}</Text>} */}
    </Pressable>
  );
}

MovieContinueItem.propTypes = {
  style: PropTypes.object,
  name: PropTypes.string,
  //movie_poster: PropTypes.string,
};

MovieContinueItem.defaultProps = {
  style: {},
  name: '',
  //movie_poster: '',
};
