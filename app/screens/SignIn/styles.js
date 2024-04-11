import { StyleSheet } from 'react-native';
import { BaseColor } from '../../config';
import { moderateScale } from '../../config/scaling';

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: { paddingHorizontal: 20, marginBottom:120, justifyContent: 'flex-end', alignItems: 'center', flex: 1 },
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
  // orView:{
  //   flexDirection: 'row',
  //   marginTop: moderateScale(30),
  //   alignItems: 'center',
  // },
  // orLineView: {
  //   height: 1,
  //   backgroundColor: BaseColor.lightGrayColor,
  //   width: '25%'
  // },
  orView: {
    flexDirection: 'row',
    height:'auto',
    marginTop: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center', // Align items horizontally in the center
  },
  orLineView: {
    height: 1,
    backgroundColor: BaseColor.lightGrayColor,
    flex: 1, // Take up remaining space evenly
    marginHorizontal: moderateScale(8), // Add margin for spacing
    // width:'20%'
  },
  
  
  socialMainContainer: {flexDirection: 'row', marginTop: moderateScale()},
  socialView: {
    borderWidth: 1,
    borderColor: BaseColor.lightGrayColor,
    borderRadius: 15,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(18),
    marginHorizontal: moderateScale(5)
  },
 
});
