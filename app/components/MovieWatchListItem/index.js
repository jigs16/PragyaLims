import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import styles from './styles';
import {BaseColor, Images} from '../../config';
import {Pressable, ImageBackground, View} from 'react-native';
import {moderateScale, verticalScale} from '../../config/scaling';
import Image from '../Image';
import Button from '../Button';

export default function MovieWatchListItem(props) {
  const {type, name, desc, moviePoster, onPressItem, dltPress, ...attrs} =
    props;

  return (
    <Pressable onPress={onPressItem} style={styles.container}>
      <ImageBackground style={styles.movieImg} source={moviePoster}>
        <Image style={{width: 20, height: 20}} source={Images.ic_play}></Image>
      </ImageBackground>
      <View style={{flex: 1}}>
        {name != '' && (
          <Text body2 semibold>
            {name}
          </Text>
        )}
        {desc != '' && (
          <Text caption2 style={{marginTop: 5}}>
            {desc}
          </Text>
        )}
         {desc != '' && (
          <Text caption2 style={{marginTop: 5}}>
            {'02hr 20min'}
          </Text>
        )}

        {/* <Pressable style={styles.watchBtn}>
          <Text footnote>{'Watch Now'}</Text>
        </Pressable> */}
        {/* <Button style={{width: '60%', height: verticalScale(65)}}>{'Watch Now'}</Button> */}
      </View>
      <Pressable onPress={dltPress}>
        <Image
          source={Images.ic_delete_new}
          style={styles.dltImg}
          resizeMode={'contain'}
        />
      </Pressable>
    </Pressable>
  );
}

MovieWatchListItem.propTypes = {
  style: PropTypes.object,
 // name: PropTypes.string,
  //movie_poster: PropTypes.string,
};

MovieWatchListItem.defaultProps = {
  style: {},
  //name: '',
  //movie_poster: '',
};
