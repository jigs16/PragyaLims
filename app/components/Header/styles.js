import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  contain: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: BaseColor.HeaderColor,
  },
  contentLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    // width: 60,
  },
  contentCenter: {
    flex: 6,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  contentRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 20,
    height: '100%',
  },
  contentRightSecond: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
  },
  right: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
