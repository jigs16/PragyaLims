import React, {useEffect, useState} from 'react';
import {View, StatusBar, Pressable, FlatList, ScrollView} from 'react-native';
import styles from './styles';
import {
  Icon,
  Image,
  MovieGrid,
  SafeAreaView,
  Text,
  TextInput,
} from '../../components';
import Header from '../../components/Header';
import {BaseColor, BaseStyle, Images} from '../../config';
import LinearGradient from 'react-native-linear-gradient';
import {MovieListData} from '../../config/data';

const MyAccount = ({navigation}) => {
  const [movieSearch, setMovieSearch] = useState('');

  useEffect(() => {}, []);

  const filteredData = movieSearch
    ? MovieListData.filter(x =>
        x.movieName?.toLowerCase().includes(movieSearch?.toLowerCase()),
      )
    : MovieListData;

  return (
    <>
      {/* <SafeAreaView
        style={{flex: 0, backgroundColor: BaseColor.backgroundGradient1}}
      /> */}
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
            title={'My Account'}></Header>
          <View style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={styles.paddingScrollView}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <Pressable
                onPress={() => {
                  navigation.navigate('DeviceManageList');
                }}
                style={styles.itemView}>
                <Image style={styles.itemImg} source={Images.ic_avoid} />
                <Text body2  style={{flex: 1}}>
                  {'Device Management'}
                </Text>
                <Image
                  style={styles.rightArrow}
                  source={Images.ic_right_arrow_new}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate('TransactionHistory');
                }} style={styles.itemView}>
                <Image style={styles.itemImg} source={Images.ic_transaction_history} />
                <Text body2  style={{flex: 1}}>
                  {'My Transaction'}
                </Text>
                <Image
                  style={styles.rightArrow}
                  source={Images.ic_right_arrow_new}
                />
               </Pressable>
            </ScrollView>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

export default MyAccount;
