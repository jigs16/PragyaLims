import { StyleSheet } from 'react-native';
import { BaseColor } from '../../config';
import { horizontalScale, moderateScale, verticalScale } from '../../config/scaling';

export default StyleSheet.create({
  style: {
    paddingVertical: 0,
  },
  thumb: {
    width: verticalScale(150),
    height: verticalScale(150),
  },
  textSelectionMainContainer: {
    width: verticalScale(150),
    height: verticalScale(150),
    padding: moderateScale(10),
    borderRadius: verticalScale(150 / 2),
    borderWidth: 1,
    borderColor: BaseColor.buttonGradient2,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
