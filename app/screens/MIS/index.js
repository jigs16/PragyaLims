import React, {useEffect, useState} from 'react';
import {View, StatusBar, ScrollView, Pressable} from 'react-native';
import styles from './styles';
import {BaseColor, Images} from '../../config';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale} from '../../config/scaling';
import {Header, Image, Text} from '../../components';

const MIS = ({navigation}) => {
  useEffect(() => {}, []);

  return (
    <>
      <Header
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderLeft={() => {
          return (
            <Image
              style={{width: 25, height: 25}}
              resizeMode="contain"
              tintColor={BaseColor.blackColor}
              source={Images.ic_back}></Image>
          );
        }}
        title={'MIS'}></Header>
      <LinearGradient
        colors={[BaseColor.whiteColor, BaseColor.whiteColor]}
        locations={[0, 1]}
        style={styles.mainContainer}>
        <StatusBar hidden />
        <ScrollView>
          <View style={styles.container}>
            <Pressable
              onPress={() => {
                navigation.navigate('MISDetails', {
                  screenType: 'Inward Register',
                });
              }}
              style={styles.Card}>
              <View style={styles.itemView}>
                <Image
                  source={Images.InwardRegister}
                  style={styles.cardImage}
                />
                <Text darkColor subhead bold style={{marginBottom: 5, flex: 1}}>
                  Inward Register
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                navigation.navigate('MISDetails', {
                  screenType: 'Process Status',
                });
              }}
              style={styles.Card}>
              <View style={styles.itemView}>
                <Image source={Images.ProcessStatus} style={styles.cardImage} />
                <Text darkColor subhead bold style={{marginBottom: 5, flex: 1}}>
                  Process Status
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                navigation.navigate('MISDetails', {
                  screenType: 'Dispatch Report',
                });
              }}
              style={styles.Card}>
              <View style={styles.itemView}>
                <Image
                  source={Images.DispatchReport}
                  style={styles.cardImage}
                />
                <Text darkColor subhead bold style={{marginBottom: 5, flex: 1}}>
                  Dispatch Report
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                navigation.navigate('MISDetails', {
                  screenType: 'Dispatch Material',
                });
              }}
              style={styles.Card}>
              <View style={styles.itemView}>
                <Image
                  source={Images.DispatchMaterial}
                  style={styles.cardImage}
                />
                <Text darkColor subhead bold style={{marginBottom: 5, flex: 1}}>
                  Dispatch Material
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                navigation.navigate('MISDetails', {
                  screenType: 'Pending Testing',
                });
              }}
              style={styles.Card}>
              <View style={styles.itemView}>
                <Image
                  source={Images.PendingTesting}
                  style={styles.cardImage}
                />
                <Text darkColor subhead bold style={{marginBottom: 5, flex: 1}}>
                  Pending Testing
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default MIS;
