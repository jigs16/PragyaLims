import React, {useEffect, useState} from 'react';
import {View, StatusBar, SafeAreaView, Pressable} from 'react-native';
import styles from './styles';
import {Icon, Button, Text, TextInput, Image} from '../../components';
import Header from '../../components/Header';
import {BaseColor, BaseStyle, Images} from '../../config';
import {moderateScale} from '../../config/scaling';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPassword = ({navigation}) => {
  const [MobileNo, setMobileNo] = useState('');
  const [Password, setPassword] = useState('');
  useEffect(() => {}, []);

  return (
    <>
      <SafeAreaView
        style={{flex: 0, backgroundColor: BaseColor.backgroundGradient1}}
      />
      <SafeAreaView
        style={{flex: 1, backgroundColor: BaseColor.backgroundGradient2}}>
        <LinearGradient
          colors={[
            BaseColor.backgroundGradient1,
            BaseColor.backgroundGradient2,
          ]}
          style={styles.flex1}>
          <StatusBar hidden />

          <Header
            onPressLeft={() => {
              navigation.goBack();
            }}
            renderLeft={() => {
              return (
                <Image
                  style={{width: 25, height: 25}}
                  resizeMode="contain"
                  source={Images.ic_back}></Image>
              );
            }}
            title={'Forgot Password'}></Header>

          <View style={styles.container}>
            <Image
              style={[styles.topImageView, {}]}
              // resizeMode={'contain'}
              resizeMode="contain"
              source={Images.ic_forgot_img}
            />

            <Text textAlign={'center'}>
              {
                'Select which contact details should\nwe use to reset your password'
              }
            </Text>

            <Pressable style={styles.selectionCard}>
              <Image
                style={{width: moderateScale(50), height: moderateScale(50)}}
                resizeMode={'contain'}
                source={Images.ic_msg}
              />
              <View style={{marginHorizontal: 10, flex: 1}}>
                <Text footnote>{'Via Sms'}</Text>
                <Text bold>{'+111 234 45677'}</Text>
              </View>
              <Image
                style={{width: moderateScale(35), height: moderateScale(35)}}
                resizeMode={'contain'}
                tintColor={BaseColor.buttonGradient2}
                source={Images.ic_check_radio}
              />
            </Pressable>

            <Pressable style={styles.selectionCard}>
              <Image
                style={{width: moderateScale(50), height: moderateScale(50)}}
                resizeMode={'contain'}
                source={Images.ic_msg}
              />
              <View style={{marginHorizontal: 10, flex: 1}}>
                <Text footnote>{'Via Email'}</Text>
                <Text bold>{'john.kiniya@gmail.com'}</Text>
              </View>
              <Image
                style={{width: moderateScale(35), height: moderateScale(35)}}
                resizeMode={'contain'}
                source={Images.ic_uncheck_radio}
              />
            </Pressable>
          </View>
          <Button
            onPress={() => {
              navigation.navigate('OTP', {
                screenType: 'forgot',
              });
            }}
            style={styles.continueBtn}
            full>
            {'CONTINUE'}
          </Button>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

export default ForgotPassword;
