import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  Pressable,
  FlatList,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import styles from "./styles";
import {
  Icon,
  Image,
  Loader,
  MovieGrid,
  SafeAreaView,
  Text,
  TextInput,
} from "../../components";
import Header from "../../components/Header";
import { BaseColor, BaseStyle, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, verticalScale } from "../../config/scaling";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserLogoutApiCall } from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";

const WorkProcess = ({ navigation }) => {
  const [alertModal, setAlertModal] = useState(false);
  const [title, setTitle] = useState("");
  const [msgModal, setMsgModal] = useState("");
  const [alertModal0, setAlertModal0] = useState(false);
  const [msgModal0, setMsgModal0] = useState("");
  const [Name, setName] = useState("");
  const [DesignationName, setDesignationName] = useState("");
  const [Photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setName(LoginDetails.Name);
    setDesignationName(LoginDetails.DesignationName);
    setPhoto(LoginDetails.Photo);
  };

  const UserLogoutApi = async () => {
    let data = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      LoginID: data.LoginIDEncrypt,
      DeviceType: Platform.OS == "android" ? 1 : Platform.OS == "ios" ? 2 : 1,
    };
    console.log("UserLogoutApi Params", params);
    UserLogoutApiCall(params)
      .then((res) => {
        if (res.IsSuccess) {
          AsyncStorage.clear();
          setLoading(false);
          setAlertModal(false);
          navigation.navigate("AuthNavigator");
        } else {
          setLoading(false);
          setMsgModal0(res.MessageCode);
          setAlertModal0(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  return (
    <>
      {/* <SafeAreaView
        style={{flex: 0, backgroundColor: BaseColor.backgroundGradient1}}
      /> */}
      <Loader loading={loading} />
      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        title={title}
        message={msgModal}
        logout={true}
        logoutPress={() => {
          UserLogoutApi();
        }}
      ></AlertModal>
      <AlertModal
        showAlertModal={alertModal0}
        setShowAlertModal={setAlertModal0}
        message={msgModal0}
      ></AlertModal>
      <SafeAreaView style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
        <View
          style={{
            flex: 1,
          }}
        >
          <StatusBar hidden />
          <Header
            onPressLeft={() => {
              navigation.goBack();
            }}
            renderLeft={() => {
              return (
                <Image
                  style={{ width: 25, height: 25 }}
                  resizeMode="contain"
                  tintColor={BaseColor.blackColor}
                  source={Images.ic_back}
                ></Image>
              );
            }}
            title={"Work Process"}
          ></Header>
          <View style={{ flex: 1, marginBottom: moderateScale(90) }}>
            <ScrollView
              contentContainerStyle={styles.paddingScrollView}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <Pressable
                onPress={() => {
                  navigation.navigate("Inward");
                }}
                style={styles.itemView}
              >
                <Image
                  style={styles.itemImg}
                  source={Images.WP_Inward}
                  tintColor={BaseColor.buttonGradient2}
                  resizeMode={'contain'}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Inward"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  tintColor={BaseColor.buttonGradient2}
                  source={Images.listRightArrow}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate("MachiningOutward");
                }}
                style={styles.itemView}
              >
                <Image
                  style={styles.itemImg}
                  source={Images.WP_MachingOutward}
                  tintColor={BaseColor.buttonGradient2}
                  resizeMode={'contain'}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Machining Outward"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  tintColor={BaseColor.buttonGradient2}
                  source={Images.listRightArrow}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate("Operation");
                }}
                style={styles.itemView}
              >
                <Image
                  style={styles.itemImg}
                  source={Images.WP_Operation}
                  tintColor={BaseColor.buttonGradient2}
                  resizeMode={'contain'}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Operation"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  tintColor={BaseColor.buttonGradient2}
                  source={Images.listRightArrow}
                />
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default WorkProcess;
