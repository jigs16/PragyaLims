import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  ImageBackground,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import {Icon, Button, Text, TextInput, Image} from '../../components';
import Header from '../../components/Header';
import {BaseColor, BaseStyle, Images} from '../../config';
import {moderateScale} from '../../config/scaling';
import LinearGradient from 'react-native-linear-gradient';
import OtpInputs from 'react-native-otp-inputs';

const OTP = ({navigation, route}) => {
  const [screenType, setScreenType] = useState(route.params.screenType);
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
            onPressLeft={() =>{
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
            title={'OTP'}></Header>

          <View style={styles.container}>
            <Image
              style={styles.topImageView}
              resizeMode={'contain'}
              source={Images.ic_otp_img}
            />

            <Text textAlign={'center'}>
              {'Code has been send to +111 23******77'}
            </Text>

            <View
              style={{
                width: '95%',
                marginTop: moderateScale(60),
                flexDirection: 'row',
                alignSelf: 'center',
                marginBottom: moderateScale(30),
              }}>
              <OtpInputs
                autofillFromClipboard={true}
                inputContainerStyles={styles.otpInputBackView}
                inputStyles={{
                  //  color: BaseColor.whiteColor,
                  textAlign: 'center',
                  marginTop: Platform.OS == 'ios' ? moderateScale(22) : 0,
                  textAlign: 'center',
                }}
                focusStyles={
                  {
                    // borderBottomColor: lightColors.primary,
                  }
                }
                //value={otpCode}
                handleChange={code => setOtpCode(code)}
                numberOfInputs={4}
              />
            </View>

            <Text textAlign={'center'}>
              {'Resend code in '}
              <Text buttonGradient2 bold textAlign={'center'}>
                {' '}
                {'55'}
                <Text textAlign={'center'}> {' s'}</Text>
              </Text>
            </Text>
          </View>
          <Button
            onPress={() => {
              screenType == 'register'
                ? navigation.navigate('AddAvatar', {
                    screenType: 'register',
                  })
                : navigation.navigate('NewPassword');
            }}
            style={styles.continueBtn}
            full>
            {'VERIFY'}
          </Button>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

export default OTP;
