import React, {useEffect, useState, useTransition} from 'react';
import {View, StatusBar} from 'react-native';
import styles from './styles';
import {Icon, SafeAreaView, Text, TextInput} from '../../components';
import Header from '../../components/Header';
import {BaseColor} from '../../config';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';

const Splash = ({navigation}) => {
  useEffect(() => {
    const setData = async () => {
      try {
        setTimeout(
          function () {
            navigation.replace('AuthNavigator');
          }.bind(this),
          3000,
        );
      } catch (e) {
        alert(e);
      }
    };
    setData();
  }, []);

  return (
    <LinearGradient
      colors={[BaseColor.backgroundGradient3, BaseColor.backgroundGradient4]}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <StatusBar hidden />

      <FastImage
        style={{width: '100%', height: '50%',left:15}}
        source={require('../../assets/images/splash1.gif')}
        resizeMode={'cover'}
        onLoadEnd={async () =>
          await AsyncStorage.getItem('loginData').then(res => {
            return setTimeout(() => {
              if (res) {
                console.log('inside');
                navigation.replace('AppNavigator', {
                  screen: 'MSelection',
                  params: {type: 'login'},
                });
              } else {
                console.log('outside');
                navigation.replace('AuthNavigator');
              }
            }, 3000);
          })
        }></FastImage>
    </LinearGradient>
  );
};

export default Splash;
