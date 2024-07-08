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
    paddingTop: 5,
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

  itemView: {
    flexDirection: 'row',
    padding: 8,
    flex:1,
    alignItems: 'center',
  },

  imageContainer: {
    backgroundColor: '#fdeccc',
    padding: 6,
    borderRadius: 8,
    marginRight: 6,
    alignItems:'center',
    justifyContent:'center'
  },

  cardImage: {
    width: moderateScale(34),
    height: moderateScale(34),
    marginTop: 0,
  },

  cardImage1: {
    width: moderateScale(36),
    height: moderateScale(36),
    marginTop: 0,
    marginRight:10
  },

  contain: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#fcfcfc',
    borderBottomWidth: 2,
    borderBottomColor: BaseColor.bg,
    elevation:1,
    paddingLeft:12,
    justifyContent: 'space-between',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: BaseColor.whiteColor,
    padding: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 0,
  },
});
