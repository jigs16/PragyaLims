import { StyleSheet } from 'react-native';
import * as Utils from '../../utils';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  imageBackgroundCard3: {
    width: Utils.scaleWithPixel(40),
    height: Utils.scaleWithPixel(40),
    // width: moderateScale(60),
    // height: moderateScale(60),
  },
  dateTime: {
    paddingVertical: 5,
  },
  footer: {
    flexDirection: 'row',
  },
  hours: {
    flex: 1,
  },
  play: {
    flex: 1,
  },
  price: {
    flex: 1,
    textAlign: 'right',
  },
});
