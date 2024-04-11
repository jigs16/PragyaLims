import React, {useState, useRef} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {BaseColor, Images} from '../../config';
import GetStartItem from './GetStartItem';
import Paginator from './Paginator';
import NextButton from './NextButton';
// import {useTranslation} from 'react-i18next';
import {moderateScale, verticalScale} from '../../config/scaling';

const GetStarted = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  // const {t} = useTranslation();
  const slides = [
    {
      id: '1',
      title: 'Lorem Ipsum is simply\ndummy text of\nthe printing',
      description: 'Lorem Ipsum has been the industrys \nstandard dummy text ever since the 1500s',
      image: Images.OnBoarding_1,
    },
    {
      id: '2',
      title: 'Lorem Ipsum is simply\ndummy text of\nthe printing',
      description: 'Lorem Ipsum has been the industrys \nstandard dummy text ever since the 1500s',
      image: Images.OnBoarding_2,
    },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChnaged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0]?.index);
  });

  const slideRef = useRef(null);

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const scrollto = () => {
    if (currentIndex < slides.length - 1) {
      slideRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      navigation.replace('SignIn', {
        screenType: '',
      });
    }
  };
  const ClassName = currentIndex != 0 ? 'space-between' : 'flex-end';

  const PreviousOn = () => {
    console.log('click');
    if (currentIndex > 0) {
      slideRef.current.scrollToIndex({index: currentIndex - 1});
    } else {
      navigation.replace('SignIn', {
        screenType: '',
      });
    }
  };

  const SkipContent = () => {
    navigation.replace('SignIn', {
      screenType: '',
    });
  };

  // const SkipContent = () => {
  //   navigation.replace('Languages', {
  //     screenType: '',
  //   });
  // };

  const backgroundStyle = {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: BaseColor.whiteColor,
  };

  return (
    <>
      <View style={backgroundStyle}>
        <StatusBar hidden />
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}

        {/* <View
            style={{
              flexDirection: "row",
              justifyContent: ClassName,
              marginTop: 20,
              paddingHorizontal: 20,
            }}
          >
            {currentIndex != 0 && <IC_Back onPress={PreviousOn} />}
            <Text
              style={{
                fontWeight: "400",
                fontSize: 12,
                color: "#000000",
              }}
              onPress={SkipContent}
            >
              {"Skip"}
            </Text>
          </View> */}

        <View style={{flex: 1}}>
          <FlatList
            data={slides}
            renderItem={({item, index}) => <GetStartItem item={item} index={index} onPress={() => {
              navigation.navigate("SignIn")
              // navigation.navigate("SocialLogin")
            }} />}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            bounces={false}
            
            keyExtractor={item => item.id}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ],
              {
                useNativeDriver: false,
              },
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChnaged?.current}
            viewabilityConfig={viewConfig}
            ref={slideRef}
          />
        </View>
        <View style={{position: 'absolute', bottom: 320}}>
          <Paginator
            data={slides}
            scrollX={scrollX}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </View>

        {/* <NextButton
            scrollto={scrollto}
            percentage={(currentIndex + 1) * (100 / slides.length)}
          /> */}

        {/* <View
          style={{
            width: '80%',
            marginVertical: verticalScale(30),
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          
          }}>
            
          <Text
            style={{
              padding: moderateScale(10),
              fontWeight: '500',
              fontSize: 12,
              color: BaseColor.blackColor,
            }}
            onPress={SkipContent}>
            {('skip')}
          </Text>

          <Text
            style={{
              backgroundColor: BaseColor.blackColor,
              // paddingHorizontal: 20,
              padding: 12,
              width: verticalScale(120),
              // alignItems: 'center',
              // justifyContent: 'center',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: 12,
              color: BaseColor.whiteColor,
              borderRadius: 10,
            }}
            onPress={scrollto}>
            {('next')}
          </Text>
        </View> */}
      </View>
    </>
  );
};

export default GetStarted;
