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

      <SafeAreaView style={{ flex: 1 }}>
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
                  navigation.navigate("ReportPrinting");
                }}
                style={styles.itemView}
              >
                <Image style={styles.itemImg} source={Images.ic_help} />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Report Printing"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  source={Images.ic_right_arrow_new}
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
                  source={Images.ic_privacy_policy}
                />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Report Dispatch"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  source={Images.ic_right_arrow_new}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate("MaterialDispatch");
                }}
                style={styles.itemView}
              >
                <Image style={styles.itemImg} source={Images.ic_logout1} />
                <Text body2 darkColor style={{ flex: 1 }}>
                  {"Material Dispatch"}
                </Text>
                <Image
                  style={styles.rightArrow}
                  source={Images.ic_right_arrow_new}
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
