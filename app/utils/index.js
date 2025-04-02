import {
  Platform,
  UIManager,
  LayoutAnimation,
  PixelRatio,
  Dimensions,
  I18nManager,
  Alert,
} from 'react-native';
// import RNRestart from 'react-native-restart';
import {Languages} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { TRANSPARENCIES } from './transparencies';
import {
  NavigationService,
  navigationRef,
  navigate,
  changeStack,
} from '../navigation/NavigationService';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
const scaleValue = PixelRatio.get() / 2;

export const setupLayoutAnimation = () => {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
};

export const enableExperimental = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const scaleWithPixel = (size, limitScale = 1.2) => {
  /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
  const value = scaleValue > limitScale ? limitScale : scaleValue;
  return size * value;
};

export const heightHeader = () => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const landscape = width > height;

  if (Platform.OS === 'android') return 45;
  if (Platform.isPad) return 65;
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      return landscape ? 45 : 88;
    default:
      return landscape ? 45 : 65;
  }
};

export const heightTabView = () => {
  const height = Dimensions.get('window').height;
  let size = height - heightHeader();
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      size -= 30;
      break;
    default:
      break;
  }

  return size;
};

export const getWidthDevice = () => {
  return Dimensions.get('window').width;
};

export const getHeightDevice = () => {
  return Dimensions.get('window').height;
};

export const scrollEnabled = (contentWidth, contentHeight) => {
  return contentHeight > Dimensions.get('window').height - heightHeader();
};

export const languageFromCode = code => {
  return Languages?.[code]?.name || 'Unknown';
};

export const isLanguageRTL = code => {
  switch (code) {
    case 'ar':
    case 'he':
      return true;
    default:
      return false;
  }
};

// export const reloadLocale = (oldLanguage, newLanguage) => {
//   const oldStyle = isLanguageRTL(oldLanguage);
//   const newStyle = isLanguageRTL(newLanguage);
//   if (oldStyle !== newStyle) {
//     I18nManager.forceRTL(newStyle);
//     RNRestart.Restart();
//   }
// };

// export const parseHexTransparency = (hexColor = '#ffffff', transparency = 0) => {
//   return `${hexColor}${TRANSPARENCIES?.[transparency] ?? '00'}`;
// };

export const haveChildren = (parent = '', children = '') => {
  const parentNew = parent?.toLowerCase?.();
  const childrenNew = children?.toLowerCase?.();
  return parentNew?.includes(childrenNew);
};

export const handleNavigation = async data => {
  try {
    console.log('data : ', data);
    const isUserLoggedIn = await AsyncStorage.getItem('isUserLoggedIn');
    // await AsyncStorage.removeItem("notification");
    console.log('isUserLoggedIn', isUserLoggedIn);
    if (isUserLoggedIn == 'true') {
      if (data.ModuleTypeID == '1') {
        // AllNotificationsRead(notificationData.NotificationID);
        console.log('59846594159614');
        navigate('BottomTabNavigator');
      } else {
        //  AllNotificationsRead(notificationData.NotificationID);
      }
    }
  } catch (e) {
    alert(e);
  }
};

export const checkInternetConnection = () => {
  NetInfo.fetch().then(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
    // Toast.show('Please check your internet connection.', Toast.LONG);
    // alert(state.isConnected.toString());
    // setIsConnected(state.isConnected);
    var isNet = state.isConnected;
    if (!isNet) {
      AsyncStorage.setItem('IsIntConnected', isNet.toString());
      // Toast.show('Please check your internet connection.', Toast.LONG);
    }else{
      AsyncStorage.setItem('IsIntConnected', isNet.toString());
    }

    return state.isConnected;
  });
};
