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
    paddingHorizontal: 6,
    paddingVertical: 12,
    paddingBottom: 0,
  },

  container: {flex: 1, marginBottom: 80},

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
    borderWidth:2,
    borderColor: BaseColor.whiteColor,
    backgroundColor: BaseColor.whiteColor,
    marginBottom: 12,
    width:'100%'
  },
  itemView: {
    // flexDirection: 'row',
    padding: 8,
    paddingLeft: 10,
    paddingRight: 12,
    paddingBottom: 5,
    // alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#fdeccc',
    padding: 25,
    borderRadius: 100,
    
  },
  cardImage: {
    width: moderateScale(65),
    height: moderateScale(65),
    marginBottom: 10,
  },
});
