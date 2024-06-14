import React, { useEffect, useState, useTransition } from "react";
import { View, StatusBar } from "react-native";
import styles from "./styles";
import { Icon, SafeAreaView, Text, TextInput } from "../../components";
import Header from "../../components/Header";
import { BaseColor } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";

const Splash = ({ navigation }) => {
  useEffect(() => {
    const setData = async () => {
      try {
        const isLogin = await AsyncStorage.getItem("IsLogin");
        console.log("isLogin ===>>>", isLogin);
        setTimeout(
          function () {
            if (isLogin == "true") {
              navigation.replace("BottomTabNavigator");
            } else {
              navigation.replace("AuthNavigator");
            }
          }.bind(this),
          3000
        );
        // setTimeout(
        //   function () {
        //     navigation.replace('AuthNavigator');
        //   }.bind(this),
        //   3000,
        // );
      } catch (e) {
        alert(e);
      }
    };
    setData();
  }, []);

  return (
    <LinearGradient
      colors={[BaseColor.whiteColor, BaseColor.whiteColor]}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar hidden />

      <FastImage
        style={{ width: "100%", height: "15%" }}
        source={require("../../assets/images/logoIcon.png")}
        resizeMode={"contain"}
        onLoad={async () => {
          const isLogin = await AsyncStorage.getItem("IsLogin");
          console.log("isLogin ===>>>", isLogin);
          setTimeout(() => {
            if (isLogin === "true") {
              navigation.replace("BottomTabNavigator");
            } else {
              navigation.replace("AuthNavigator");
            }
          }, 3000); // 3-second delay
        }}
      ></FastImage>
    </LinearGradient>
  );
};

export default Splash;
