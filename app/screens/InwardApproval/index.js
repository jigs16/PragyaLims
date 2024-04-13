import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import styles from "./styles";
import { BaseColor, FontWeight, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "../../config/scaling";
import { Button, Header, Image, Loader, Text } from "../../components";
import AlertModal from "../../components/AlertModal";
import { AccordionList } from "accordion-collapse-react-native";

const InwardApproval = ({ navigation }) => {
  useEffect(() => {}, []);

  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [CurrentType, setCurrentType] = useState("InwardInformation");
  const [Remarks, setRemarks] = useState("");

  const sections = [
    {
      title: "Sample Submitted By by to Nirav",
      content: "Content of Section 1",
    },
    {
      title: "Reporting by Email to Jinkal Patel",
      content: "Content of Section 2",
    },
    {
      title: "Billing by Post to Hanshaben Bharatbhai Parmar",
      content: "Content of Section 3",
    },
    {
      title: "Dispatch by Hand to Hand to Chinky Paramar",
      content: "Content of Section 3",
    },
  ];

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
        title={"Inward Approval"}
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

        <View style={{ flexDirection: "row", paddingBottom: 0 }}>
          <Pressable
            onPress={() => {
              setCurrentType("InwardInformation");
            }}
            style={[
              styles.tabView,
              {
                borderBottomWidth: CurrentType == "InwardInformation" ? 2 : 0,
                borderColor:
                  CurrentType == "InwardInformation"
                    ? "#000000"
                    : BaseColor.borderColor,
              },
            ]}
          >
            <Text
              subhead
              bold
              style={{
                color:
                  CurrentType == "InwardInformation"
                    ? "#000000"
                    : BaseColor.borderColor,
              }}
            >
              {"Inward Info"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setCurrentType("MaterialInformation");
            }}
            style={[
              styles.tabView,
              {
                borderBottomWidth: CurrentType == "MaterialInformation" ? 2 : 0,
                borderColor:
                  CurrentType == "MaterialInformation"
                    ? "#000000"
                    : BaseColor.borderColor,
              },
            ]}
          >
            <Text
              subhead
              bold
              style={{
                color:
                  CurrentType == "MaterialInformation"
                    ? "#000000"
                    : BaseColor.borderColor,
              }}
            >
              {"Material Info"}
            </Text>
          </Pressable>
        </View>

        <ScrollView>
          <View style={{ flex: 1, marginBottom: 62, paddingTop: 15 }}>
            {CurrentType == "InwardInformation" && (
              <>
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
                    <Text buttonGradient1 bold style={{marginBottom:2}}>
                      INV/2024/0000007/2023 | 05-Feb-2024
                    </Text>

                    <Text darkColor bold>
                      Customer -{" "}
                      <Text caption1 darkColor>
                        Nirav Savaliya
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Project -{" "}
                      <Text caption1 darkColor>
                        RCC Road Bopal
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Stamp -{" "}
                      <Text caption1 darkColor>
                        Stemp Write Up | Sample Returnable
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      TPI Required :{" "}
                      <Text caption1 darkColor>
                        Yes{" | "}
                      </Text>
                      <Text caption1 buttonGradient2 bold>
                        View TPI
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Letter Ref No :{" "}
                      <Text caption1 darkColor>
                        LRN000713{" | "}
                      </Text>
                      <Text caption1 buttonGradient2 bold>
                        View
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Work Detail :{" "}
                      <Text caption1 darkColor style={{ lineHeight: 18 }}>
                        Test the Material Inward project work details BRTS
                        Project. Test the Material Inward project work details
                        BRTS Project
                      </Text>
                    </Text>
                  </View>
                </View>

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
                    <Text body1 bold buttonGradient1 style={{ marginBottom: 12 }}>
                      Modes
                    </Text>
                    <AccordionList
                      list={sections}
                      initialOpenSections={[0]}
                      header={(header) => (
                        <View
                          style={{
                            padding: 10,
                            borderRadius: 6,
                            marginBottom: 10,
                            flexDirection: "row",
                            borderColor: "#e3e3e3",
                            borderWidth: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <Text darkColor bold style={{ flex: 1 }}>
                            {header.title}
                          </Text>
                          <Image
                            source={Images.DownArrow}
                            style={{ width: 10, height: 10 }}
                          ></Image>
                        </View>
                      )}
                      body={(body) => (
                        <View
                          style={{
                            padding: 10,
                            marginTop: -10,
                            marginBottom: 10,
                            borderBottomLeftRadius: 6,
                            borderBottomRightRadius: 6,
                          }}
                        >
                          {/* <Text>{body.content}</Text> */}
                          <Text caption1 darkColor>
                            {"⦿ Nirav Savaliya"}
                          </Text>
                          <Text caption1 darkColor>
                            {"⦿ RCC Road Bopal"}
                          </Text>
                          <Text caption1 darkColor>
                            {"⦿ South Bopal"}
                          </Text>
                          <Text caption1 darkColor>
                            {"⦿ 9638510527"}
                          </Text>
                          <Text caption1 darkColor>
                            {"⦿ savaliya@gmail.com"}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                </View>

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
                    <Text body1 bold buttonGradient1 style={{ marginBottom: 12 }}>
                      Other Information
                    </Text>

                    <Text darkColor bold>
                      Expected Date -{" "}
                      <Text caption1 darkColor>
                        16-Feb-2024
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Material Taken By -{" "}
                      <Text caption1 darkColor>
                        Chirag Suthar
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Sample Received Via -{" "}
                      <Text caption1 darkColor>
                        Courier
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Reference By :{" "}
                      <Text caption1 darkColor>
                        Ronu
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Delivery Remarks :{" "}
                      <Text caption1 darkColor>
                        Test the Material Inward project work details BRTS
                        Project.
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Received Remarks :{" "}
                      <Text caption1 darkColor>
                        Test the Material Inward project work details BRTS
                        Project.
                      </Text>
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.itemView,
                    {
                      paddingBottom: moderateScale(10),
                      borderRadius: 10,
                      //   backgroundColor: BaseColor.Card,
                      marginBottom: 10,
                    },
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                  >
                    <Text
                      subhead
                      bold
                      buttonGradient1
                      style={{ marginBottom: 0, marginTop: 5 }}
                    >
                      Remarks
                    </Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          height: 100,
                          textAlignVertical: "top",
                          borderColor: BaseColor.darkGraycolor,
                        },
                      ]}
                      onChangeText={(text) => setRemarks(text)}
                      placeholder={"Enter your Remarks"}
                      value={Remarks}
                      returnKeyType="next"
                      multiline
                    />
                  </View>
                </View>
              </>
            )}

            {CurrentType == "MaterialInformation" && (
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
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "flex-end",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text darkColor bold>
                          Inward No -{" "}
                          <Text caption1 darkColor>
                            INV/2024/0000007/2023
                          </Text>
                        </Text>
                        <Text darkColor bold>
                          Inward Date -{" "}
                          <Text caption1 darkColor>
                            05-Feb-2024
                          </Text>
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#ff5e5e",
                            width: 35,
                            height: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 6,
                            marginRight: 7,
                          }}
                        >
                          <Text style={{ color: "#ff5e5e" }}>IA</Text>
                        </View>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#3ac977",
                            width: 35,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 6,
                          }}
                        >
                          <Text style={{ color: "#3ac977" }}>T</Text>
                        </View>
                      </View>
                    </View>

                    <Text darkColor bold>
                      Customer -{" "}
                      <Text caption1 darkColor>
                        Nirav Savaliya
                      </Text>
                    </Text>
                    <Text darkColor bold>
                      Project -{" "}
                      <Text caption1 darkColor>
                        RCC Road Bopal
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ paddingHorizontal: 4, width: "50%" }}>
                <Pressable
                  onPress={() => {
                    //   LoginApiCall();
                  }}
                  style={{
                    borderRadius: 8,
                    height: moderateScale(60),
                    backgroundColor: BaseColor.buttonGradient1,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={Images.check}
                    tintColor={BaseColor.whiteColor}
                    style={{ width: 15, height: 15 }}
                  ></Image>
                  <Text bold caption whiteColor>
                    {" Approved"}
                  </Text>
                </Pressable>
              </View>
              <View style={{ paddingHorizontal: 4, width: "50%" }}>
                <Pressable
                  onPress={() => {
                    //   LoginApiCall();
                  }}
                  style={{
                    borderRadius: 8,
                    height: moderateScale(60),
                    backgroundColor: BaseColor.buttonGradient1,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={Images.reload}
                    tintColor={BaseColor.whiteColor}
                    style={{ width: 15, height: 15 }}
                  ></Image>
                  <Text bold caption whiteColor>
                    {" Rejected & Rectify"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row", marginBottom:10}}>
              <View style={{ paddingHorizontal: 4, width: "50%" }}>
                <Pressable
                  onPress={() => {
                    //   LoginApiCall();
                  }}
                  style={{
                    borderRadius: 8,
                    height: moderateScale(60),
                    backgroundColor: BaseColor.buttonGradient1,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={Images.close}
                    tintColor={BaseColor.whiteColor}
                    style={{ width: 15, height: 15 }}
                  ></Image>
                  <Text bold caption whiteColor>
                    {"  Rejected"}
                  </Text>
                </Pressable>
              </View>
              <View style={{ paddingHorizontal: 4, width: "50%" }}>
                <Pressable
                  onPress={() => {
                    //   LoginApiCall();
                  }}
                  style={{
                    borderRadius: 8,
                    height: moderateScale(60),
                    backgroundColor: BaseColor.danger,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={Images.forbidden}
                    tintColor={BaseColor.whiteColor}
                    style={{ width: 15, height: 15 }}
                  ></Image>
                  <Text bold caption whiteColor>
                    {" Cancel"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default InwardApproval;
