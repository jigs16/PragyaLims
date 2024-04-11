import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import styles from './styles';
import {BaseColor} from '../../config';
import {Pressable, ImageBackground, View} from 'react-native';
import {moderateScale, verticalScale} from '../../config/scaling';
import Image from '../Image';

export default function MovieGrid(props) {
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
        marginBottom: moderateScale(20),
      }}>
      <ImageBackground
        style={{
          overflow: 'hidden',
          height: verticalScale(280),
          borderRadius: 15,
          marginBottom: moderateScale(15),
          // borderTopLeftRadius: 10,
          // borderTopRightRadius: 10,
        }}
        source={moviePoster}
        // resizeMode={'strech'}
      />
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

MovieGrid.propTypes = {
  style: PropTypes.object,
  name: PropTypes.string,
  //movie_poster: PropTypes.string,
};

MovieGrid.defaultProps = {
  style: {},
  name: '',
  //movie_poster: '',
};
