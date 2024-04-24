import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from '../../config/scaling';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 0,
  },

  container: {flex: 1, marginBottom: 80},

  tabView: {
    flex: 1,
    justifyContent: 'center',
    padding: moderateScale(15),
    paddingTop: moderateScale(1),
    flexDirection: 'row',
    marginHorizontal: moderateScale(10),
  },
  tabCountView: {
    marginLeft: 5,
    color: BaseColor.whiteColor,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    paddingTop: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    height: moderateScale(70),
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BaseColor.mainTransp,
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: BaseColor.whiteColor,
    borderRadius: 25,
    position: 'absolute',
    elevation: 5,
    width: '92%',
    padding: moderateScale(20),
    paddingBottom: moderateScale(5),
    // alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    maxHeight:verticalScale(1255)
  },
  modalCheckImg: {
    width: moderateScale(35),
    height: moderateScale(35),
    // marginBottom: moderateScale(20),
  },
  btnExplore:{
    width: '60%',
    height: verticalScale(90),
    marginTop: moderateScale(30),
  }
});
