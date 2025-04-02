import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BaseColor } from '../../config';
import Text from '../Text';
import styles from './styles';

export default function Tag(props) {
  const {
    style,
    textStyle,
    icon,
    primary,
    primaryIcon,
    outline,
    outlineIcon,
    outlineSecondary,
    outlineSecondaryIcon,
    small,
    light,
    gray,
    chip,
    status,
    rate,
    rateSmall,
    sale,
    children,
    iconRight,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      {...rest}
      style={StyleSheet.flatten([
        styles.default,
        primary && [styles.primary, { backgroundColor: BaseColor.buttonGradient2 }],
        primaryIcon && styles.primary,
        outline && [
          styles.outline,
          {
            borderColor: BaseColor.buttonGradient2,
            backgroundColor: BaseColor.backgroundGradient2,
          },
        ],
        outlineIcon && styles.outline,
        outlineSecondary && styles.outlineSecondary,
        outlineSecondaryIcon && [styles.outlineSecondary, { borderColor: BaseColor.backgroundGradient2 }],
        small && [styles.small, { backgroundColor: BaseColor.backgroundGradient1 }],
        light && [styles.light, { backgroundColor: BaseColor.backgroundGradient1}],
        gray && styles.gray,
        chip && [
          styles.chip,
          {
            backgroundColor: BaseColor.backgroundGradient1,
            borderColor:BaseColor.buttonGradient2,
          },
        ],
        status && [styles.status, { backgroundColor: BaseColor.buttonGradient2}],
        rate && [styles.rate, { backgroundColor: BaseColor.backgroundGradient1 }],
        rateSmall && [styles.rateSmall, { backgroundColor: BaseColor.buttonGradient1 }],
        sale && [styles.sale, { backgroundColor: BaseColor.darkColor}],
        iconRight && [styles.iconRight, { borderColor: BaseColor.lightGrayColor }],
        style,
      ])}
      activeOpacity={0.9}
    >
      {icon ? icon : null}
      <Text
        style={StyleSheet.flatten([
          primary && styles.textPrimary,
          primaryIcon && styles.textPrimary,
          outline && [styles.textOutline, { color: BaseColor.buttonGradient2 }],
          outlineIcon && [styles.textOutline, { color: BaseColor.buttonGradient2 }],
          outlineSecondary && [styles.textOutlineSecondary, { color: BaseColor.buttonGradient2 }],
          outlineSecondaryIcon && [styles.textOutlineSecondary, { color: BaseColor.buttonGradient2 }],
          small && styles.textSmall,
          light && [styles.textLight, { color: BaseColor.buttonGradient2 }],
          gray && styles.textGray,
          chip && [styles.textChip, { color: BaseColor.buttonGradient2 }],
          status && styles.textStatus,
          rate && styles.textRate,
          rateSmall && styles.textRateSmall,
          sale && styles.textSale,
          iconRight && styles.textIconRight,
          textStyle,
        ])}
        numberOfLines={1}
      >
        {children || 'Tag'}
      </Text>
    </TouchableOpacity>
  );
}

Tag.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node,
  primary: PropTypes.bool,
  primaryIcon: PropTypes.bool,
  outline: PropTypes.bool,
  outlineIcon: PropTypes.bool,
  outlineSecondary: PropTypes.bool,
  outlineSecondaryIcon: PropTypes.bool,
  small: PropTypes.bool,
  light: PropTypes.bool,
  gray: PropTypes.bool,
  chip: PropTypes.bool,
  rate: PropTypes.bool,
  rateSmall: PropTypes.bool,
  status: PropTypes.bool,
  sale: PropTypes.bool,
};

Tag.defaultProps = {
  style: {},
  textStyle: {},
  icon: null,
  primary: false,
  primaryIcon: false,
  outline: false,
  outlineIcon: false,
  outlineSecondary: false,
  outlineSecondaryIcon: false,
  small: false,
  light: false,
  gray: false,
  chip: false,
  status: false,
  rate: false,
  rateSmall: false,
  sale: false,
};
