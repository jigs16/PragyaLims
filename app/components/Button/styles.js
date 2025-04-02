import { StyleSheet } from 'react-native';
import { BaseColor, Typography, FontWeight } from '../../config';
import { moderateScale } from '../../config/scaling';
import { scaleWithPixel } from '../../utils';

export default StyleSheet.create({
  default: {
    height: 50,
    borderRadius: moderateScale(20),
    paddingHorizontal: scaleWithPixel(10),
    justifyContent: 'center',
    // shadowOffset: { height: 2, width: 0 },
    //   shadowOpacity: 1,
    //   shadowRadius: 4,
    //   backgroundColor: 'transparent',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: Platform.OS == 'ios' ? 0.9 : 0.8,
    shadowRadius: 5,
    elevation: 2,
    shadowColor: BaseColor.buttonGradient2,
  },
  textDefault: {
    ...Typography.body2,
    color: BaseColor.whiteColor,
    fontWeight: FontWeight.bold,
    fontSize:15
  },
  outline: {
    borderWidth: 1,
  },
  full: {
    width: '100%',
    alignSelf: 'auto',
  },
  round: {
    borderRadius: 28,
  },
});
