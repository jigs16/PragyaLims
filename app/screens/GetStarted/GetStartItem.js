import {
  View,
  Text,
  Image,
  useWindowDimensions,
  StyleSheet,
  useColorScheme,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {BaseColor, Images} from '../../config';
import fonts from '../../config/fonts';
import {moderateScale, verticalScale} from '../../config/scaling';
import {Button} from '../../components';
import LinearGradient from 'react-native-linear-gradient';

export default function GetStartItem({item, index, onPress}) {
  const {width} = useWindowDimensions();
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    AsyncStorage.setItem('isIntroScreen', 'true');
  }, []);

  return (
    <ImageBackground source={item.image} style={[styles.container, {width}]}>
      <View style={{marginBottom: 50}}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.description]}>{item.description}</Text>

        <Button onPress={onPress}>{index == 0 ?'SWIPE TO CONTINUE >>>' : 'GET STARTED'}</Button>
        {/* <TouchableOpacity onPress={onPress}  activeOpacity={0.6}>
          <View style={styles.buttonParent}>
            <LinearGradient
              useAngle={true}
              // colors={['#5be9aa', '#09949d']}
              colors={[BaseColor.buttonGradient1, BaseColor.buttonGradient2]}
              style={styles.buttonGrad}>
              <Text
                style={{
                  fontWeight: '600',
                  fontFamily: fonts.Poppins_Regular,
                  fontSize: 18,
                  color: BaseColor.whiteColor,
                  letterSpacing: 1
                }}>
                {'Get Started'}
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontFamily: fonts.Poppins_Regular,
    fontSize: 30,
    color: BaseColor.whiteColor,
    textAlign: 'center',
  },
  description: {
    fontWeight: '500',
    fontFamily: fonts.Poppins_Regular,
    fontSize: 16,
    color: BaseColor.lightGrayColor,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: moderateScale(50),
  },
  buttonGrad: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    position: 'absolute',
    bottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonParent: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    // backgroundColor: '#024e51',
    backgroundColor: '#E77F26',
  },
});
