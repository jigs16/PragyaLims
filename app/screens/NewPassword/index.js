import React, {useEffect, useState} from 'react';
import {View, StatusBar, Modal, SafeAreaView} from 'react-native';
import styles from './styles';
import {Icon, Button, Text, TextInput, Image} from '../../components';
import Header from '../../components/Header';
import {BaseColor, BaseStyle, Images} from '../../config';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from '../../config/scaling';

const NewPassword = ({navigation}) => {
  const [Password, setPassword] = useState('');
  const [ConfPassword, setConfPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {}, []);

  return (
    <>
    <SafeAreaView
        style={{flex: 0, backgroundColor: BaseColor.backgroundGradient1}}
      /> 
     <SafeAreaView
        style={{flex: 1, backgroundColor: BaseColor.backgroundGradient2}}>

     
      <LinearGradient
        colors={[BaseColor.backgroundGradient1, BaseColor.backgroundGradient2]}
        style={styles.flex1}>
        <StatusBar hidden />

        <Header
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
            style={styles.topImageView}
            resizeMode={'contain'}
            source={Images.ic_forgot_img}
          />

          <Text textAlign={'center'}>{'Create your new password'}</Text>
          <TextInput
           style={{marginTop: moderateScale(20)}}
            value={Password}
            onChangeText={text => setPassword(text)}
            iconLeft={Images.ic_pass}
            iconRight={Images.ic_pass_show}
            placeholder={'Enter new password'}
        
            secureTextEntry={true}
          />

          <TextInput
           style={{marginTop: moderateScale(20)}}
            value={ConfPassword}
            onChangeText={text => setConfPassword(text)}
            iconLeft={Images.ic_pass}
            iconRight={Images.ic_pass_show}
            placeholder={'Enter confirm password'}
        
            secureTextEntry={true}
          />
        </View>
        <Button
          onPress={() => {
            setModalVisible(true);
          }}
          style={styles.continueBtn}
          full>
          {'CONTINUE'}
        </Button>
      </LinearGradient>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={styles.modalCheckImg}
                resizeMode="contain"
                source={Images.ic_right_round}></Image>

              <Text title2 bold>
                {'Congratulations!'}
              </Text>
              <Text textAlign={'center'}>
                {
                  'Your account ready to use. You will be\nredirect to the home page\nautomatically within few seconds. '
                }
              </Text>

              <Button
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('SignIn');
                }}
                style={styles.btnExplore}>
                {'EXPLORE NOW'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default NewPassword;
