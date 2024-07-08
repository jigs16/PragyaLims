import React, { useEffect, useState } from "react";
import { View, StatusBar, Pressable, ScrollView } from "react-native";
import styles from "./styles";
import { Image, Loader, SafeAreaView, Text } from "../../components";
import Header from "../../components/Header";
import { BaseColor, Images } from "../../config";
import { moderateScale } from "../../config/scaling";

const Operation = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);
  return (
    <>
      <Loader loading={loading} />

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
            title={"Operation"}
          ></Header>
          <View style={{ flex: 1, marginBottom: moderateScale(90) }}>
            <ScrollView
              contentContainerStyle={styles.paddingScrollView}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <Pressable
                onPress={() => {
                  navigation.navigate("TestingList");
                }}
                style={styles.itemView}
              >
                <Image
                  style={styles.itemImg}
                  source={Images.OT_Testing}
                  tintColor={BaseColor.buttonGradient2}
                  resizeMode={"contain"}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Testing"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  tintColor={BaseColor.buttonGradient2}
                  source={Images.listRightArrow}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate("ReportPrinting");
                }}
                style={styles.itemView}
              >
                <Image
                  style={styles.itemImg}
                  source={Images.OT_ReportPrinting}
                  tintColor={BaseColor.buttonGradient2}
                  resizeMode={"contain"}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Report Printing"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  tintColor={BaseColor.buttonGradient2}
                  source={Images.listRightArrow}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate("ReportDispatch");
                }}
                style={styles.itemView}
              >
                <Image
                  style={styles.itemImg}
                  source={Images.OT_DispatchReport}
                  tintColor={BaseColor.buttonGradient2}
                  resizeMode={"contain"}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Dispatch Report"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  tintColor={BaseColor.buttonGradient2}
                  source={Images.listRightArrow}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate("MaterialDispatch");
                }}
                style={styles.itemView}
              >
                <Image
                  style={styles.itemImg}
                  source={Images.OT_DispatchMaterial}
                  tintColor={BaseColor.buttonGradient2}
                  resizeMode={"contain"}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Dispatch Material"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  tintColor={BaseColor.buttonGradient2}
                  source={Images.listRightArrow}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  // navigation.navigate("");
                }}
                style={styles.itemView}
              >
                <Image
                  style={styles.itemImg}
                  source={Images.OT_UplodeScanCopy}
                  tintColor={BaseColor.buttonGradient2}
                  resizeMode={"contain"}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Upload Scan Copy"}
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

export default Operation;
