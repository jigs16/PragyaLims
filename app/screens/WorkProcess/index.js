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
import { BaseColor, BaseStyle, FontWeight, Images } from "../../config";
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
      <LinearGradient
        colors={[BaseColor.bg, BaseColor.bg]}
        locations={[0, 1]}
        style={{ flex: 1 }}
      >
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
              <View style={styles.itemView}>
                <Text
                  bold
                  callout
                  style={{
                    marginBottom: 5,
                    paddingLeft: 5,
                    fontSize: 14.5,
                    flex: 1,
                    color: BaseColor.darkColor,
                  }}
                >
                  {"Inward / Machining Outward"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("ControlCenter");
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.IW_MaterialInward}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text
                      darkColor
                      caption2
                      textAlign={"center"}
                      // style={{ fontSize: 12.5 }}
                    >
                      Material Inward
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("TCTestAllocation");
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.IW_TCAllocation}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text
                      darkColor
                      caption2
                      textAlign={"center"}
                      // style={{ fontSize: 12.5 }}
                    >
                      {"TC Allocation"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("MachiningOutward");
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.WP_MachingOutward}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text
                      darkColor
                      caption2
                      textAlign={"center"}
                      // style={{ fontSize: 12.5 }}
                    >
                      {"Machining Outward"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.itemView}>
                <Text
                  bold
                  callout
                  style={{
                    marginBottom: 5,
                    paddingLeft: 5,
                    fontSize: 14.5,
                    flex: 1,
                    color: BaseColor.darkColor,
                  }}
                >
                  {"Operation"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TestingList");
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.OT_Testing}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text
                      darkColor
                      caption2
                      textAlign={"center"}
                      // style={{ fontSize: 12.5 }}
                    >
                      {"Testing"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("ReportPrinting");
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.OT_ReportPrinting}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text
                      darkColor
                      caption2
                      textAlign={"center"}
                      style={{ fontSize: 12.5 }}
                    >
                      {"Report Printing"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("ReportDispatch");
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.OT_DispatchReport}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text
                      darkColor
                      caption2
                      textAlign={"center"}
                      // style={{ fontSize: 12.5 }}
                    >
                      {"Dispatch\nReport"}
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("MaterialDispatch");
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.OT_DispatchMaterial}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text
                      darkColor
                      caption2
                      textAlign={"center"}
                      // style={{ fontSize: 12.5 }}
                    >
                      {"Dispatch Material"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("UploadScancopy");
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.OT_UplodeScanCopy}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text
                      darkColor
                      caption2
                      textAlign={"center"}
                      // style={{ fontSize: 12.5 }}
                    >
                      {"Upload Scan Copy"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

export default WorkProcess;
