import {StyleSheet} from 'react-native';
import {moderateScale} from '../../config/scaling';
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
    paddingBottom: 60,
    paddingTop: 0,
  },

  container: {flex: 1, marginBottom: 0, flexDirection:'row'},

  container1: {
    flex: 1,
    width:'100%',
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  event: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    //marginTop: 15,
  },

  event1: {
    width: '100%',
    height: '100%',
    //borderRadius: 10,
    //marginTop: 15,
  },

  Card: {
    paddingBottom: moderateScale(0),
    borderRadius: 8,
    flex:1,
    // borderWidth:2,
    // borderColor: BaseColor.Card,
    backgroundColor: BaseColor.Card,
    marginBottom: 10,
  },

});
