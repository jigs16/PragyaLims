import React, { useEffect, useState } from "react";
import { View, StatusBar, Pressable, Platform } from "react-native";
import styles from "./styles";
import {
  Button,
  CheckBox,
  Image,
  Loader,
  Text,
  TextInput,
} from "../../components";
import { BaseColor, BaseStyle, Images } from "../../config";
import { moderateScale } from "../../config/scaling";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertModal from "../../components/AlertModal";
import { loginApiCall } from "../../redux/services/ApiService";

const SignIn = ({ navigation }) => {
  const [UserName, setUserName] = useState("krupa_pragya");
  const [Password, setPassword] = useState("Appegic@123");
  const [PasswordSecurity, setPasswordSecurity] = useState(true);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);

  const LoginApiCall = async () => {
    AsyncStorage.clear();
    var FCMToken = await AsyncStorage.getItem("FCMToken");
    if (UserName == "") {
      setMsgModal(t("Enter your username"));
      setAlertModal(true);
    } else if (Password == "") {
      setMsgModal(t("Enter your password"));
      setAlertModal(true);
    } else {
      setLoading(true);

      var params = {
        UserName: UserName,
        Password: Password,
        DeviceType: Platform.OS == "android" ? 1 : Platform.OS == "ios" ? 2 : 1,
        FCMToken: "",
      };
      console.log("params", JSON.stringify(params));
      // setLoginParams(JSON.stringify(params));
      loginApiCall(params)
        .then((res) => {
          console.log("Response Login ", res);
          // setLoginRes(res);
          if (res.IsSuccess) {
            setLoading(false);
            AsyncStorage.setItem("LoginDetails", JSON.stringify(res));
            AsyncStorage.setItem("LoginIDEncrypt", res.LoginIDEncrypt);
            AsyncStorage.setItem("CompanyIDEncrypt", res.CompanyIDEncrypt);
            AsyncStorage.setItem("Token", res.Token);
            AsyncStorage.setItem("TokenExpiryDate", res.TokenExpiryDate);
            AsyncStorage.setItem("RefreshToken", res.RefreshToken);
            AsyncStorage.setItem(
              "RefreshTokenExpiryDate",
              res.RefreshTokenExpiryDate
            );
            AsyncStorage.setItem("IsLogin", "true");
            AsyncStorage.setItem("BranchName", res.BranchName);
            AsyncStorage.setItem(
              "InwardApprovalRequired",
              res.Permissions.InwardApprovalRequired == true ? "1" : "0"
            );
            AsyncStorage.setItem(
              "TestingApprovalRequired",
              res.Permissions.TestingApprovalRequired == true ? "1" : "0"
            );
            navigation.replace("BottomTabNavigator");
          } else {
            setLoading(false);
            setMsgModal(res.Message);
            setAlertModal(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          setMsgModal(error.Message);
          setAlertModal(true);
        });
    }
  };

  // DeviceType = 2 -
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <>
      <StatusBar hidden />
      <Loader loading={loading} />
      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>
      {/* <ImageBackground source={Images.OnBoarding_3} style={[styles.flex1]}> */}
      <View style={styles.container}>
        <Image
          style={{ width: moderateScale(440), height: 100, marginBottom: 0 }}
          resizeMode="contain"
          source={Images.PLLOGO}
        ></Image>

        <Text
          title1
          bold
          darkGraycolor
          textAlign={"center"}
          style={{ lineHeight: 34, fontSize: 26 }}
        >
          {"Login to Your\nAccount"}
        </Text>

        <Text
          callout
          bold
          darkColor
          textAlign={"left"}
          style={{ alignSelf: "flex-start", marginTop: moderateScale(50) }}
        >
          {"Enter your username and password."}
        </Text>

        <TextInput
          style={{
            marginTop: moderateScale(20),
            borderColor: BaseColor.darkGraycolor,
            color: BaseColor.darkGraycolor,
          }}
          value={UserName}
          placeholderTextColor={BaseColor.darkGraycolor}
          onChangeText={(text) => setUserName(text)}
          iconLeft={Images.ic_user}
          placeholder={"Enter your username"}
          // keyboardType={'phone-pad'}
        />

        <TextInput
          style={{
            marginTop: moderateScale(20),
            borderColor: BaseColor.darkGraycolor,
          }}
          value={Password}
          onChangeText={(text) => setPassword(text)}
          iconLeft={Images.ic_pass}
          iconRight={
            PasswordSecurity ? Images.ic_pass_show : Images.ic_hidden_pass
          }
          placeholderTextColor={BaseColor.darkGraycolor}
          placeholder={"Enter your password"}
          secureTextEntry={PasswordSecurity}
          onRightPress={() => {
            setPasswordSecurity(!PasswordSecurity);
          }}
        />
        <CheckBox
          title="Remember me"
          onPress={(isChecked) => setRememberMe(isChecked)}
          style={{ alignSelf: "flex-start", marginTop: 15 }}
        ></CheckBox>

        <Button
          onPress={() => {
            LoginApiCall();
            // navigation.replace('BottomTabNavigator');
          }}
          style={{ marginVertical: moderateScale(30) }}
          full
        >
          {"LOGIN"}
        </Button>

        <Pressable
          onPress={() => {
            // navigation.navigate('ForgotPassword');
          }}
        >
          <Text subhead bold buttonGradient2>
            {"Forgot password?"}
          </Text>
        </Pressable>
      </View>
      {/* </ImageBackground> */}
    </>
  );
};

export default SignIn;
