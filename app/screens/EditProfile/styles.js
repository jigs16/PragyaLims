import { StyleSheet } from 'react-native';
import { BaseColor } from '../../config';
import { moderateScale } from '../../config/scaling';

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: { paddingHorizontal: 20, alignItems: 'center', flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  socialbtnMain: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: BaseColor.lightGrayColor,
    borderRadius: 15,
    padding: 18,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(60)
  },
  socialbtn: {
    width: moderateScale(30),
    height: moderateScale(30),
    marginRight: moderateScale(20),
  },
  orView:{
    flexDirection: 'row',
    marginTop: moderateScale(30),
    alignItems: 'center',
  },
  orLineView: {
    height: 1,
    backgroundColor: BaseColor.lightGrayColor,
    width: '25%',
  }
 
});
