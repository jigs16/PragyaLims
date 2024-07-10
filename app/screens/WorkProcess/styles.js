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
  
  mainContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 60,
    paddingTop: 5,
  },
  
  container: { paddingHorizontal: 20 },

  paddingScrollView: {padding: 12, paddingTop: 10},

  itemView:{
    marginBottom: moderateScale(15),
    backgroundColor: BaseColor.Card,
    padding: 12,
    paddingVertical: 12,
    // flexDirection: 'row',
    borderRadius: 10,
    // alignItems: 'center',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: Platform.OS == 'ios' ? 0.9 : 0.8,
    shadowRadius:4,
    // elevation: 3,
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
  },

  cardImage: {
    width: moderateScale(34),
    height: moderateScale(34),
    marginTop: 0,
  },

});
