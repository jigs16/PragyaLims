import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  Pressable,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import {Button, TextInput, Image} from '../../components';
import Header from '../../components/Header';
import {BaseColor, Images} from '../../config';
import {moderateScale} from '../../config/scaling';
import LinearGradient from 'react-native-linear-gradient';

const EditProfile = ({navigation}) => {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [MobileNo, setMobileNo] = useState('');
  const [Password, setPassword] = useState('');

  useEffect(() => {}, []);

  return (
    <>
      <StatusBar hidden />

      <SafeAreaView
        style={{flex: 1, backgroundColor: BaseColor.backgroundGradient1}}>
        <LinearGradient
          colors={[
            BaseColor.backgroundGradient1,
            BaseColor.backgroundGradient2,
          ]}
          style={{
            flex: 1,
          }}>
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
            title={'Edit Profile'}></Header>

          <View style={styles.container}>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Image
                style={{
                  width: moderateScale(140),
                  height: moderateScale(140),
                }}
                source={Images.movie_12}
              />
              <Pressable
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}>
                <Image
                  source={Images.ic_edit_profile}
                  style={{
                    width: moderateScale(50),
                    height: moderateScale(50),
                    marginBottom: 10,
                    marginTop: -17,
                  }}
                />
              </Pressable>
            </View>

            <TextInput
              style={{marginTop: moderateScale(15)}}
              value={Name}
              onChangeText={text => setName(text)}
              iconLeft={Images.ic_email}
              placeholder={'Enter your name here'}
            />

            <TextInput
              style={{marginTop: moderateScale(15)}}
              value={Email}
              onChangeText={text => setEmail(text)}
              iconLeft={Images.ic_email}
              placeholder={'Enter your email here'}
              keyboardType={'email-address'}
            />

            <TextInput
              style={{marginTop: moderateScale(15)}}
              value={MobileNo}
              onChangeText={text => setMobileNo(text)}
              iconLeft={Images.ic_email}
              placeholder={'Enter your number here'}
              keyboardType={'phone-pad'}
            />

            <TextInput
              style={{marginTop: moderateScale(15)}}
              value={Password}
              onChangeText={text => setPassword(text)}
              iconLeft={Images.ic_pass}
              iconRight={Images.ic_pass_show}
              placeholder={'Enter your password'}
              secureTextEntry={true}
            />

            <Button
              style={{marginTop: moderateScale(30)}}
              full
              onPress={() => {}}>
              {'EDIT PROFILE'}
            </Button>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

export default EditProfile;
