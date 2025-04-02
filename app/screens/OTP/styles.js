import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';
import {moderateScale} from '../../config/scaling';

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    // justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  topImageView:{
    width: moderateScale(250),
    height: moderateScale(250),
    marginVertical: moderateScale(40),
  },
  continueBtn: {
    poition: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  otpInputBackView: {
    borderRadius: 10,
    width: moderateScale(100),
    height: moderateScale(100),
   // borderWidth: 1,
    backgroundColor: BaseColor.inputBackColor,
    // borderColor: BaseColor.whiteColor,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: Platform.OS == 'ios' ? 1 : 0.8,
    shadowRadius: 5,
    elevation: 2,
    shadowColor: '#000000',
    // backgroundColor: lightColors.white,
  },
});
