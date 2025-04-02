import React, { useEffect, useState } from "react";
import { Header, Image, Loader, Text } from "../../components";
import { Pressable, StatusBar, View, ScrollView } from "react-native";
import AlertModal from "../../components/AlertModal";
import { moderateScale } from "../../config/scaling";
import { BaseColor, Images } from "../../config";
import styles from "../InwardStatistics/styles";
import LinearGradient from "react-native-linear-gradient";

const InwardContactPersons = ({ navigation, route }) => {
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  // const [ListOfContactPersons, setListOfContactPersons] = useState();
  const { ListOfContactPersons } = route.params;

  return (
    <View style={{ backgroundColor: BaseColor.bg, flex: 1 }}>
      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>

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
        title={"Contact Persons"}
      ></Header>
      <LinearGradient
        colors={[BaseColor.bg, BaseColor.bg]}
        locations={[0, 1]}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingVertical: 12,
          paddingBottom: 0,
        }}
      >
        <StatusBar hidden />
        <ScrollView>
          <View style={{ paddingBottom: 70 }}>
            {ListOfContactPersons?.map((item, index) => (
              <View
                onPress={() => {
                  navigation.navigate("InwardApproval", {
                    InwardIDEncrypted: item?.InwardIDEncrypted,
                    ViewType: "ViewOnly",
                  });
                }}
                style={{
                  padding: moderateScale(10),
                  borderRadius: 10,
                  backgroundColor: BaseColor.Card,
                  marginBottom: 6,
                  marginTop: 6,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Image
                    source={Images.ic_user1}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                    resizeMode={"contain"}
                    tintColor={BaseColor.darkColor}
                  />
                  <Text darkColor callout bold>
                    {item?.ContactPerson}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Image
                    source={Images.Dasignation}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                    resizeMode={"contain"}
                    tintColor={BaseColor.darkColor}
                  />
                  <Text darkColor footnote>
                    {item?.Designation}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Image
                    source={Images.EmailID}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                    resizeMode={"contain"}
                    tintColor={BaseColor.darkColor}
                  />
                  <Text darkColor footnote>
                    {item?.EmailID}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={Images.PhoneNo}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                    resizeMode={"contain"}
                    tintColor={BaseColor.darkColor}
                  />
                  <Text darkColor footnote>
                    {item?.MobileNo}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default InwardContactPersons;
