import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import {I18nManager, TextInput, TouchableOpacity, View} from 'react-native';
import {BaseColor, BaseStyle} from '../../config';
import fonts from '../../config/fonts';
import Image from '../Image';
import {moderateScale} from '../../config/scaling';

const Index = forwardRef((props, ref) => {
  // const cardColor = BaseColor.inputBackColor;
  const {
    style,
    onChangeText,
    onFocus,
    placeholder,
    value,
    success,
    secureTextEntry,
    keyboardType,
    multiline,
    textAlignVertical,
    icon,
    iconLeft,
    iconLeftWidth = 20,
    iconLeftHeight = 20,
    iconRight,
    onSubmitEditing,
    inputStyle,
    onRightPress,
    ...attrs
  } = props;
  return (
    <View style={[BaseStyle.textInput, {}, style]}>
      {/* {iconLeft} */}
      <Image
        style={{
          width: iconLeftWidth,
          height: iconLeftHeight,
          marginRight: moderateScale(10),
        }}
        tintColor={BaseColor.darkGraycolor}
        resizeMode="contain"
        source={iconLeft}></Image>
      <TextInput
        ref={ref}
        style={[
          {
            fontFamily: fonts.Poppins_Regular,
            flex: 1,
            height: '100%',
            textAlign: I18nManager.isRTL ? 'right' : 'auto',
            color: BaseColor.blackColor,
            paddingTop: 5,
            paddingBottom: 5,
          },
          inputStyle,
        ]}
        onChangeText={text => onChangeText(text)}
        onFocus={() => onFocus()}
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={
          success ? BaseColor.mainTransp : BaseColor.blackColor
        }
        secureTextEntry={secureTextEntry}
        value={value}
        selectionColor={BaseColor.backgroundGradient1}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={textAlignVertical}
        onSubmitEditing={onSubmitEditing}
        {...attrs}
      />
      {/* {icon} */}
      <TouchableOpacity onPress={onRightPress}>
        <Image
          style={{width: 20, height: 20, marginRight: moderateScale(10)}}
          resizeMode="contain"
          tintColor={BaseColor.darkGraycolor}
          source={iconRight}></Image>
      </TouchableOpacity>
    </View>
  );
});

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeText: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  success: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  icon: PropTypes.node,
  iconLeft: PropTypes.node,
  onSubmitEditing: PropTypes.func,
  inputStyle: PropTypes.object,
};

Index.defaultProps = {
  inputStyle: {},
  style: {},
  onChangeText: () => {},
  onFocus: () => {},
  placeholder: 'Placeholder',
  value: '',
  success: true,
  secureTextEntry: false,
  keyboardType: 'default',
  multiline: false,
  textAlignVertical: 'center',
  icon: null,
  iconLeft: null,
  onSubmitEditing: () => {},
};

export default Index;
