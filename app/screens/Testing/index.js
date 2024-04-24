import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Linking,
  Switch,
} from "react-native";
import styles from "./styles";
import { BaseColor, FontWeight, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "../../config/scaling";
import { Button, Header, Image, Loader, Text } from "../../components";
import AlertModal from "../../components/AlertModal";
import { AccordionList } from "accordion-collapse-react-native";
import {
  GetInwardApprovalDetailByIDApiCall,
  GetTestingsApprovalDetailByIDApiCall,
  InwardApprovalUpdateStatusApiCall,
} from "../../redux/services/ApiService";
import Toast from "react-native-simple-toast";

const Testing = ({ navigation, route }) => {
  useEffect(() => {
    // GetInwardApprovalDetailByIDApi();
  }, []);

  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [ListOfMaterialTests, setListOfMaterialTests] = useState(
    route.params.ListOfInwardMaterials
  );

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
        title={"Testing"}
      ></Header>

      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>

      <LinearGradient
        colors={[BaseColor.whiteColor, BaseColor.whiteColor]}
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
          <View style={{ flex: 1, marginBottom: 62, paddingTop: 0 }}>
            {ListOfMaterialTests?.map((item, index) => (
              <View
                style={[
                  styles.itemView,
                  {
                    paddingBottom: moderateScale(10),
                    borderRadius: 10,
                    backgroundColor: BaseColor.Card,
                    marginBottom: 10,
                  },
                ]}
              >
                <View style={{ flex: 1, padding: 10, paddingBottom: 4 }}>
                  <Pressable
                    // onPress={() => {
                    //   navigation.navigate("TestingApproval", {
                    //     InwardMaterialIDEncrypted:
                    //       item.InwardMaterialIDEncrypted,
                    //   });
                    // }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row",alignItems: "center", }}>
                      <Image
                        source={Images.check}
                        tintColor={BaseColor.grayColor}
                        resizeMode="contain"
                        style={{ width: 18, height: 18, marginRight: 8 }}
                      ></Image>

                      <Text darkColor bold>
                        TC No -{" "}
                        <Text footnote darkColor>
                          {item.TCNo}
                        </Text>
                      </Text>
                    </View>
                    <Pressable
                    onPress={() => {
                      navigation.navigate("TestingApproval", {
                        InwardMaterialIDEncrypted:
                          item.InwardMaterialIDEncrypted,
                      });
                    }}>
                    <Image
                      source={Images.DownArrow}
                      tintColor={BaseColor.darkColor}
                      style={{ width: 12, height: 12 }}
                    ></Image>
                    </Pressable>
                  </Pressable>

                  <Text darkColor bold style={{ marginBottom: 6 }}>
                    {item.InwardNo} | {item.TCDate}
                  </Text>

                  <Text darkColor bold>
                    Sample Detail :{" "}
                    <Text footnote darkColor style={{}}>
                      {item.SampleDetail}
                    </Text>
                  </Text>

                  {/* <Text darkColor bold>
                  TPI Required -{" "}
                  <Text caption1 darkColor>
                    Yes
                  </Text>
                </Text>

                <Text darkColor bold>
                  EDD -{" "}
                  <Text caption1 darkColor>
                    16-Feb-2024
                  </Text>
                </Text> */}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default Testing;
