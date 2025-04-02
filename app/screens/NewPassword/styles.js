import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';
import {moderateScale, verticalScale} from '../../config/scaling';

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    // justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  topImageView: {
    width: moderateScale(250),
    height: moderateScale(250),
    marginVertical: moderateScale(40),
  },
  selectionCard: {
    backgroundColor: BaseColor.inputBackColor,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  continueBtn: {
    poition: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: BaseColor.inputBackColor,
    borderRadius: 25,
    position: 'absolute',
    elevation: 5,
    width: '90%',
    padding: moderateScale(25),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  modalCheckImg: {
    width: moderateScale(170),
    height: moderateScale(170),
    marginBottom: moderateScale(20),
  },
  btnExplore:{
    width: '60%',
    height: verticalScale(90),
    marginTop: moderateScale(30),
  }
});
