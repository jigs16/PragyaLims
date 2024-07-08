import React, { useEffect, useRef, useState } from "react";
import { View, StatusBar, Pressable } from "react-native";
import styles from "./styles";
import { BaseColor, FontWeight, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import { Image, Loader, Text } from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GetTodaysSummaryDataApiCall } from "../../redux/services/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertModal from "../../components/AlertModal";
import Toast from "react-native-simple-toast";
import { moderateScale } from "../../config/scaling";

const Dashboard = ({ navigation }) => {
  useEffect(() => {}, []);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [Photo, setPhoto] = useState(null);
  const [DesignationName, setDesignationName] = useState("");
  const [TodaysInwardCount, setTodaysInwardCount] = useState(0);
  const [TodaysTestingCount, setTodaysTestingCount] = useState(0);
  const [
    TodaysInwardApprovalPendingCount,
    setTodaysInwardApprovalPendingCount,
  ] = useState(0);
  const [
    TodaysTestingApprovalPendingCount,
    setTodaysTestingApprovalPendingCount,
  ] = useState(0);

  useEffect(() => {
    GetTodaysSummaryDataApi();
  }, []);

  const GetTodaysSummaryDataApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    console.log("LoginDetails ===>>> ", LoginDetails);
    setFirstName(LoginDetails?.Name);
    setDesignationName(LoginDetails?.DesignationName);
    setPhoto(LoginDetails?.Photo);
    setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
    };
    console.log("Params =====>>>>>>>>>>", params);
    GetTodaysSummaryDataApiCall(params)
      .then((res) => {
        console.log("res ---->>>>>> ", JSON.stringify(res));
        if (res.IsSuccess) {
          setLoading(false);
          setTodaysInwardCount(res?.TodaysInwardCount);
          setTodaysTestingCount(res?.TodaysTestingCount);
          setTodaysInwardApprovalPendingCount(
            res?.TodaysInwardApprovalPendingCount
          );
          setTodaysTestingApprovalPendingCount(
            res?.TodaysTestingApprovalPendingCount
          );
        } else {
          setLoading(false);
          // setMsgModal(res.Message);
          // setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(error.Message, Toast.LONG);
      });
  };

  const TextWithEllipsis = ({ text }) => {
    return (
      <Text darkColor caption2>
        {text.length > 18 ? text.substring(0, 18) + "" : text}
      </Text>
    );
  };

  return (
    <>
      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>

      <View style={[styles.contain]}>
        <Image
          resizeMode="contain"
          // tintColor={BaseColor.whiteColor}
          style={{ width: 130 }}
          source={Images.PLLOGO}
        ></Image>
        <Pressable
          onPress={() => {
            navigation.navigate("ProfileNavigator");
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
            // width: "44%",
          }}
        >
          <Image
            resizeMode="contain"
            // tintColor={BaseColor.whiteColor}
            style={{
              width: 36,
              height: 36,
              borderRadius: 50,
              right: 6,
            }}
            source={Photo != "" ? { uri: Photo } : Images.ic_avtar}
          ></Image>

          <View>
            <Text darkColor bold style={{}}>
              {FirstName}
            </Text>
            <TextWithEllipsis text={DesignationName} />
          </View>
        </Pressable>
      </View>
      <LinearGradient
        colors={[BaseColor.whiteColor, BaseColor.whiteColor]}
        locations={[0, 1]}
        style={styles.mainContainer}
      >
        <StatusBar hidden />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              bold
              callout
              style={{
                marginBottom: 14,
                marginTop: 8,
                flex: 1,
                color: BaseColor.buttonGradient2,
              }}
            >
              {"Dashboard"}
            </Text>
          </View> */}

          <View style={[styles.container, { marginTop: 12 }]}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <View style={styles.Card}>
                <View style={styles.itemView}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={Images.Page}
                      tintColor={"#f79f04"}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      darkColor
                      textAlign={"center"}
                      caption2
                      bold
                      style={{ fontSize: 12 }}
                    >
                      Today's Inward
                    </Text>
                    <Text
                      textAlign={"center"}
                      darkColor
                      subhead
                      bold
                      style={{
                        fontSize: 15,
                        marginTop: 3,
                        color: BaseColor.buttonGradient2,
                      }}
                    >
                      {TodaysInwardCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ flex: 1, paddingLeft: 5 }}>
              <View style={styles.Card}>
                <View style={styles.itemView}>
                  <View
                    style={[
                      styles.imageContainer,
                      { backgroundColor: "#daf5e6" },
                    ]}
                  >
                    <Image
                      source={Images.TTR}
                      tintColor={"#43c977"}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      textAlign={"center"}
                      darkColor
                      caption2
                      bold
                      style={{ fontSize: 12 }}
                    >
                      Testing | Reports
                    </Text>
                    <Text
                      darkColor
                      subhead
                      bold
                      textAlign={"center"}
                      style={{
                        fontSize: 15,
                        marginTop: 3,
                        color: BaseColor.buttonGradient2,
                      }}
                    >
                      {TodaysTestingCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <View style={styles.Card}>
                <View style={styles.itemView}>
                  <View
                    style={[
                      styles.imageContainer,
                      { backgroundColor: "#d9d9d9" },
                    ]}
                  >
                    <Image
                      source={Images.IAP}
                      tintColor={BaseColor.mainTransp}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      darkColor
                      caption2
                      bold
                      textAlign={"center"}
                      style={{ fontSize: 12 }}
                    >
                      Inward Approval
                    </Text>
                    <Text
                      darkColor
                      subhead
                      bold
                      textAlign={"center"}
                      style={{
                        fontSize: 15,
                        marginTop: 3,
                        color: BaseColor.buttonGradient2,
                      }}
                    >
                      {TodaysInwardApprovalPendingCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, paddingLeft: 5 }}>
              <View style={styles.Card}>
                <View style={styles.itemView}>
                  <View
                    style={[
                      styles.imageContainer,
                      { backgroundColor: "#f7d4d4" },
                    ]}
                  >
                    <Image
                      source={Images.TAP}
                      tintColor={BaseColor.whiteColor}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      darkColor
                      caption2
                      bold
                      textAlign={"center"}
                      style={{ fontSize: 12 }}
                    >
                      Testing Approval
                    </Text>
                    <Text
                      darkColor
                      subhead
                      textAlign={"center"}
                      bold
                      style={{
                        fontSize: 15,
                        marginTop: 3,
                        color: BaseColor.buttonGradient2,
                      }}
                    >
                      {TodaysTestingApprovalPendingCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <View style={[styles.Card, { padding: 10, paddingBottom: 10 }]}>
                <Text
                  bold
                  callout
                  style={{
                    marginBottom: 20,
                    paddingLeft: 5,
                    fontSize: 14,
                    flex: 1,
                    color: BaseColor.darkColor,
                  }}
                >
                  {"Top Categories"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    // justifyContent: "space-around",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("ChartDetails", {
                        ViewType: "Testing",
                      });
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.activityLog}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(42),
                          height: moderateScale(42),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text darkColor caption2>
                      Testing
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("ChartDetails", {
                        ViewType: "TopCustomer",
                      });
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.cc}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(42),
                          height: moderateScale(42),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text darkColor caption2 textAlign={"center"}>
                      {"Top Customer"}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      navigation.navigate("ChartDetails", {
                        ViewType: "TopTests",
                      });
                    }}
                    style={{ alignItems: "center", width: "33.33%" }}
                  >
                    <Image
                      source={Images.chat}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(42),
                          height: moderateScale(42),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text darkColor caption2 textAlign={"center"}>
                      {"Top Tests"}
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 5,
                    marginTop: 5,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("ChartDetails", {
                        ViewType: "TopDepartment",
                      });
                    }}
                    style={{
                      alignItems: "center",
                      width: "33.33%",
                      marginTop: 14,
                    }}
                  >
                    <Image
                      source={Images.Page}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(42),
                          height: moderateScale(42),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text darkColor caption2 textAlign={"center"}>
                      {"Top\nDepartment"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("ChartDetails", {
                        ViewType: "TopMachine",
                      });
                    }}
                    style={{
                      alignItems: "center",
                      width: "33.33%",
                      marginTop: 14,
                    }}
                  >
                    <Image
                      source={Images.TTR}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(42),
                          height: moderateScale(42),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text darkColor caption2 textAlign={"center"}>
                      {"Top\nMachine"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("ChartDetails", {
                        ViewType: "InwardDispatch",
                      });
                    }}
                    style={{
                      alignItems: "center",
                      width: "33.33%",
                      marginTop: 14,
                    }}
                  >
                    <Image
                      source={Images.Page}
                      tintColor={BaseColor.buttonGradient1}
                      style={[
                        styles.cardImage,
                        {
                          width: moderateScale(42),
                          height: moderateScale(42),
                          marginBottom: 8,
                        },
                      ]}
                    />
                    <Text darkColor caption2 textAlign={"center"}>
                      {"Inward /\nDispatch"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </>
  );
};

export default Dashboard;
