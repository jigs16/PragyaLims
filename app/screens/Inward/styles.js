import { Platform, StyleSheet } from 'react-native';
import { BaseColor } from '../../config';
import { moderateScale } from '../../config/scaling';

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  container: { paddingHorizontal: 20 },
  paddingScrollView: {padding: 15, paddingTop: 10},
  itemView:{
    marginTop: moderateScale(20),
    backgroundColor: BaseColor.Card,
    padding: 10,
    paddingVertical: 13,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: Platform.OS == 'ios' ? 0.9 : 0.8,
    shadowRadius: 3,
    elevation: 4,
    shadowColor: BaseColor.blackColor,
  },
  itemImg: {
    width: moderateScale(35),
    height: moderateScale(35),
    marginRight: 10
  },
  rightArrow: {
    width: moderateScale(30),
    height: moderateScale(30),
    marginRight: 10
  }
});
