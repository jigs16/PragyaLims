import React, { useEffect, useState } from "react";
import { View, StatusBar, ScrollView, Pressable } from "react-native";
import styles from "./styles";
import { BaseColor, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "../../config/scaling";
import { Header, Image, Text } from "../../components";

const MIS = ({ navigation }) => {
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
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              tintColor={BaseColor.blackColor}
              source={Images.ic_back}
            ></Image>
          );
        }}
        title={"MIS"}
      ></Header>
      <LinearGradient
        colors={[BaseColor.bg, BaseColor.bg]}
        locations={[0, 1]}
        style={styles.mainContainer}
      >
        <StatusBar hidden />
        <ScrollView>
          <View style={styles.container}>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => {
                  navigation.navigate("MISDetails", {
                    screenType: "Inward Register",
                  });
                }}
                style={{ width: "50%", paddingHorizontal: 6}}
              >
                <View style={styles.Card}>
                  <View style={styles.itemView}>
                    <Image
                      source={Images.InwardRegisterr}
                      style={styles.cardImage}
                    />
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        darkColor
                        footnote
                        bold
                        style={{ marginBottom: 5, flex: 1, fontSize: 14 }}
                      >
                        Inward Register
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate("MISDetails", {
                    screenType: "Process Status",
                  });
                }}
                style={{ width: "50%", paddingHorizontal: 6 }}
              >
                <View style={styles.Card}>
                  <View style={styles.itemView}>
                    <Image
                      source={Images.ProcessStatuss}
                      style={styles.cardImage}
                    />
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        darkColor
                        footnote
                        bold
                        style={{ marginBottom: 5, flex: 1, fontSize: 14 }}
                      >
                        Process Status
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => {
                  navigation.navigate("MISDetails", {
                    screenType: "Dispatch Report",
                  });
                }}
                style={{ width: "50%", paddingHorizontal: 6 }}
              >
                <View style={styles.Card}>
                  <View style={styles.itemView}>
                    <Image
                      source={Images.OT_DispatchReport}
                      style={styles.cardImage}
                    />
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        darkColor
                        footnote
                        bold
                        style={{ marginBottom: 5, flex: 1, fontSize: 14 }}
                      >
                        Dispatch Report
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate("MISDetails", {
                    screenType: "Dispatch Material",
                  });
                }}
                style={{ width: "50%", paddingHorizontal: 6 }}
              >
                <View style={styles.Card}>
                  <View style={styles.itemView}>
                    <Image
                      source={Images.OT_DispatchMaterial}
                      style={styles.cardImage}
                    />
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        darkColor
                        footnote
                        bold
                        style={{ marginBottom: 5, flex: 1, fontSize: 14 }}
                      >
                        Dispatch Material
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => {
                  navigation.navigate("MISDetails", {
                    screenType: "Pending Testing",
                  });
                }}
                style={{ width: "50%", paddingHorizontal: 6 }}
              >
                <View style={styles.Card}>
                  <View style={styles.itemView}>
                    <Image
                      source={Images.OT_Testing}
                      style={styles.cardImage}
                    />
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        darkColor
                        footnote
                        bold
                        style={{ marginBottom: 5, flex: 1, fontSize: 14 }}
                      >
                        Pending Testing
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default MIS;
