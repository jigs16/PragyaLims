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
    width: 'auto',
    padding: moderateScale(20),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BaseColor.buttonGradient2,
    margin: 5,
    
  }
});
