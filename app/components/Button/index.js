import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {BaseColor, Images} from '../../config';
import Text from '../Text';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, verticalScale} from '../../config/scaling';
import Image from '../Image';

export default function Button(props) {
  const {
    style,
    styleText,
    icon,
    outline,
    full,
    round,
    loading,
    children,
    disabled,
    ...rest
  } = props;

  return (
    <LinearGradient
      colors={
        outline
          ? ['#FFEDF0', '#FFEDF0']
          : [BaseColor.buttonGradient1, BaseColor.buttonGradient2]
      }
      start={{x: 0.1, y: 0.25}}
      end={{x: 0.5, y: 1.5}}
      locations={[0.1, 0.6, 0.7]}
      useAngle={true}
      style={StyleSheet.flatten([
        [styles.default],

        full && [styles.full],
        round && styles.round,
        disabled && {
          borderColor: BaseColor.blackColor,
        },
        style,
      ])}>
      <TouchableOpacity
        {...rest}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 56,
          flexDirection: 'row',
        }}
        activeOpacity={0.9}>
        {/* {icon ? icon : null} */}
        {icon && (
          <Image
            style={{width: 22, height: 22, marginRight: moderateScale(10)}}
            resizeMode="contain"
            source={Images.ic_download}></Image>
        )}

        <Text
          style={StyleSheet.flatten([
            styles.textDefault,
            outline && {color: BaseColor.blackColor},
            disabled && {color: BaseColor.whiteColor},
            styleText,
          ])}
          numberOfLines={1}>
          {children}
        </Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={outline ? BaseColor.whiteColor : BaseColor.whiteColor}
            style={{paddingLeft: 5}}
          />
        ) : null}
      </TouchableOpacity>
    </LinearGradient>
  );
}

Button.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node,
  outline: PropTypes.bool,
  full: PropTypes.bool,
  round: PropTypes.bool,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  style: {},
  icon: null,
  outline: false,
  full: false,
  round: false,
  loading: false,
};
