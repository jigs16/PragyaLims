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
 container: {
  marginBottom: 10,
  backgroundColor: BaseColor.inputBackColor,
  flexDirection: 'row',
  padding: moderateScale(20),
  borderRadius: 10,
  // shadowColor: BaseColor.blackColor,
  // shadowOffset: {width: -2, height: 4},
  // shadowOpacity: 0.2,
  // shadowRadius: 3,
  // elevation: 10,
  shadowOffset: {
    height: 1,
    width: 1,
  },
  shadowOpacity: Platform.OS == 'ios' ? 0.9 : 0.8,
  shadowRadius: 3,
  elevation: 2,
  shadowColor: BaseColor.blackColor,
},
  movieImg: {
    overflow: 'hidden',
    width: verticalScale(120),
    height: verticalScale(120),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  watchBtn: {
    backgroundColor: BaseColor.buttonGradient2,
    width: 100,
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  dltImg: {width: 25, height: 25,alignSelf: 'center'}
});
