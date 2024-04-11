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
    paddingBottom: 0,
  },

  container: {flex: 1, marginBottom: 80},

  dropdown: {
    width: '100%',
    height: 50,
    borderColor: BaseColor.mainTransp,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginTop: moderateScale(15)
  },
  placeholderStyle: {
    fontSize: 16,
    color: BaseColor.mainTransp
  },
  selectedTextStyle: {
    fontSize: 16,
    color: BaseColor.mainTransp
  },

});
