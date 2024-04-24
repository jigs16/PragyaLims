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
} from "react-native";
import styles from "./styles";
import { BaseColor, FontWeight, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "../../config/scaling";
import { Header, Image, Loader, Text } from "../../components";
import AlertModal from "../../components/AlertModal";
import {
  TestingsApprovalInsertApiCall,
  GetTestingsApprovalDetailByIDApiCall,
} from "../../redux/services/ApiService";
import Toast from "react-native-simple-toast";

const TestingApproval = ({ navigation, route }) => {
  useEffect(() => {
    GetTestingsApprovalDetailByIDApi();
  }, []);

  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [Remarks, setRemarks] = useState("");
  const [InwardApprovalDetail, setInwardApprovalDetail] = useState([]);
  const [ListOfMaterialInfo, setListOfMaterialInfo] = useState([]);
  const [ListOfMaterialTests, setListOfMaterialTests] = useState([]);
  const [ApprovalHistory_ModalVisible, setApprovalHistory_ModalVisible] =
    useState(false);

  const GetTestingsApprovalDetailByIDApi = async () => {
    setLoading(true);
    var params = {
      InwardMaterialIDEncrypted: route.params.InwardMaterialIDEncrypted,
    };
    console.log(
      "GetTestingsApprovalDetailByIDApi Params =====>>>>>>>>>>",
      params
    );
    GetTestingsApprovalDetailByIDApiCall(params)
      .then((res) => {
        console.log(
          "GetTestingsApprovalDetailByIDApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setInwardApprovalDetail(res);
          setListOfMaterialInfo(res?.ListOfMaterialTests);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res?.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  const TestingsApprovalInsertApi = async (
    TestingApprovalType,
    TestingStatus,
    TestingIDEncrypt
  ) => {
    setLoading(true);
    var params = {
      TestingIDEncrypted: TestingApprovalType == 2 ? "" : TestingIDEncrypt,
      InwardMaterialIDEncrypted: InwardApprovalDetail?.InwardMaterialIDEncrypt,
      StatusRemarks: Remarks,
      TestingApprovalType: TestingApprovalType,
      TestingStatus: TestingStatus,
      CreatedByEncrypted: "",
    };
    console.log("TestingsApprovalInsertApi Params =====>>>>>>>>>>", params);
    TestingsApprovalInsertApiCall(params)
      .then((res) => {
        console.log(
          "TestingsApprovalInsertApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          Toast.show("Record Saved Successfully.", Toast.LONG);
          GetTestingsApprovalDetailByIDApi();
          // navigation.goBack();
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res?.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  const downloadFile = (url, fileName) => {
    Linking.openURL(url)
      .then(() => {
        console.log(`File ${fileName} downloaded`);
      })
      .catch((error) => {
        console.error(`Failed to download file ${fileName}: ${error}`);
      });
  };

  const [expandedId, setExpandedId] = useState(null);

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item?.TestingIDEncrypt;
    const isExpanded1 = expandedId1 === item?.TestingIDEncrypt;
    return (
      <TouchableOpacity onPress={() => toggleItem(item?.TestingIDEncrypt)}>
        <View style={{}}>
          <View
            style={{
              padding: 10,
              borderRadius: 6,
              marginBottom: 10,
              flexDirection: "row",
              borderColor: BaseColor.buttonGradient2,
              backgroundColor:
                expandedId == item?.TestingIDEncrypt
                  ? BaseColor.buttonGradient2
                  : "#eaf6f5",
              borderWidth: 1,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                bold
                style={{
                  color:
                    expandedId == item?.TestingIDEncrypt
                      ? BaseColor.whiteColor
                      : BaseColor.buttonGradient2,
                }}
              >
                {item.TestName}
              </Text>
            </View>
            <Image
              source={Images.DownArrow}
              tintColor={
                expandedId == item?.TestingIDEncrypt
                  ? BaseColor.whiteColor
                  : BaseColor.buttonGradient2
              }
              style={{ width: 10, height: 10 }}
            ></Image>
          </View>
          {isExpanded && (
            <View
              style={{
                padding: 10,
                paddingRight: 10,
                marginTop: -10,
                marginBottom: 0,
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              }}
            >
              <Text subhead bold darkColor style={{ fontSize: 14 }}>
                {"Test Name : "}
                <Text subhead darkColor style={{ fontSize: 13 }}>
                  {item?.TestName}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14 }}>
                {"Department : "}{" "}
                <Text subhead darkColor style={{ fontSize: 13 }}>
                  {item?.DepartmentName}
                </Text>
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text subhead bold darkColor style={{ fontSize: 14, flex: 1 }}>
                  {"Test Date : "}{" "}
                  <Text subhead darkColor style={{ fontSize: 13 }}>
                    {item.TestingDate}
                  </Text>
                </Text>

                <Text subhead bold darkColor style={{ fontSize: 14 }}>
                  {"Qty : "}{" "}
                  <Text subhead darkColor style={{ fontSize: 13 }}>
                    {item.TestCount}
                  </Text>
                </Text>
              </View>

              <Text subhead bold darkColor style={{ fontSize: 14, flex: 1 }}>
                {"Test Method : "}{" "}
                <Text subhead darkColor style={{ fontSize: 13 }}>
                  {item.TestMethod}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14 }}>
                {"Machine : "}{" "}
                <Text subhead darkColor style={{ fontSize: 13 }}>
                  {item.MachineName}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14 }}>
                {"Reference Standard : "}{" "}
                <Text subhead darkColor style={{ fontSize: 13 }}>
                  {item.ReferenceStandard}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14 }}>
                {"Tested By : "}{" "}
                <Text subhead darkColor style={{ fontSize: 13 }}>
                  {item.TestedBy}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14 }}>
                {"Result : "}{" "}
                <Text subhead darkColor style={{ fontSize: 13 }}>
                  {item.Result}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14 }}>
                {"Remarks : "}{" "}
                <Text subhead darkColor style={{ fontSize: 13 }}>
                  {item.Remarks}
                </Text>
              </Text>
              {item.TestingStatusName === "Approved" ||
                (item.TestingStatusName === "Reject & Rectify" && (
                  <>
                    <Text subhead bold darkColor style={{ fontSize: 14 }}>
                      {"Testing Status : "}{" "}
                      <Text subhead darkColor style={{ fontSize: 13 }}>
                        {item.TestingStatusName}
                      </Text>
                    </Text>

                    <Text subhead bold darkColor style={{ fontSize: 14 }}>
                      {"Approval Note : "}{" "}
                      <Text subhead darkColor style={{ fontSize: 13 }}>
                        {item.ApprovalNote}
                      </Text>
                    </Text>
                  </>
                ))}

              <TouchableOpacity
                onPress={() => {
                  toggleItem1(item?.TestingIDEncrypt), setRemarks("");
                }}
              >
                <View style={{}}>
                  <View
                    style={{
                      marginTop: 10,
                      padding: 10,
                      borderRadius: 6,
                      marginBottom: 10,
                      flexDirection: "row",
                      borderColor: BaseColor.buttonGradient2,
                      backgroundColor:
                        expandedId1 == item?.TestingIDEncrypt
                          ? BaseColor.buttonGradient2
                          : "#eaf6f5",
                      borderWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      buttonGradient1
                      bold
                      style={{
                        flex: 2,
                        color:
                          expandedId1 == item?.TestingIDEncrypt
                            ? BaseColor.whiteColor
                            : BaseColor.buttonGradient2,
                      }}
                    >
                      {"Testing Parameters"}
                    </Text>
                    <Image
                      source={Images.DownArrow}
                      tintColor={
                        expandedId1 == item?.TestingIDEncrypt
                          ? BaseColor.whiteColor
                          : BaseColor.buttonGradient2
                      }
                      style={{ width: 10, height: 10 }}
                    ></Image>
                  </View>
                  {isExpanded1 && (
                    <View
                      style={{
                        padding: 5,
                        paddingRight: 10,
                        // paddingLeft: 5,
                        marginTop: -10,
                        marginBottom: 10,
                        borderBottomLeftRadius: 6,
                        borderBottomRightRadius: 6,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 5,
                          marginBottom: 5,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          subhead
                          bold
                          buttonGradient2
                          style={{ fontSize: 15, paddingTop: 5, flex: 1 }}
                        >
                          {"Group"}
                          {" : "}
                          <Text subhead bold darkColor style={{ fontSize: 15 }}>
                            {item?.ReferenceSubGroup}
                          </Text>
                          {"  "}
                        </Text>

                        <Text
                          subhead
                          bold
                          buttonGradient2
                          style={{ fontSize: 15, paddingTop: 5 }}
                        >
                          {"Merge Same Value"}
                          {" : "}
                          <Text subhead bold darkColor style={{ fontSize: 15 }}>
                            {item?.MergeSameValue == true ? "Yes" : "No"}
                          </Text>
                          {"  "}
                        </Text>
                      </View>

                      <Text
                        subhead
                        bold
                        buttonGradient2
                        style={{ fontSize: 15, paddingTop: 5 }}
                      >
                        {"Parameter"}
                        {" : "}
                        <Text subhead bold darkColor style={{ fontSize: 15 }}>
                          {item?.ParameterWith == 1
                            ? "None"
                            : item?.ParameterWith == 2
                            ? "Print Min/Max"
                            : "Print Requirement"}
                        </Text>
                        {"  "}
                      </Text>

                      <View
                        style={{
                          borderTopWidth: 1,
                          borderTopColor: BaseColor.grayColor,
                          marginBottom: 15,
                          marginTop: 15,
                        }}
                      ></View>

                      <Text
                        subhead
                        bold
                        buttonGradient2
                        style={{ fontSize: 15, marginBottom: 6 }}
                      >
                        {"Normal Range"}
                        {"  "}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={Images.Normal}
                            tintColor={BaseColor.green}
                            resizeMode="contain"
                            style={{ width: 14, height: 14, marginRight: 8 }}
                          ></Image>

                          <Text darkColor bold>
                            Valid{" "}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={Images.Normal}
                            tintColor={BaseColor.red}
                            resizeMode="contain"
                            style={{ width: 14, height: 14, marginRight: 8 }}
                          ></Image>

                          <Text darkColor bold>
                            Invalid{" "}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={Images.Normal}
                            tintColor={BaseColor.orange}
                            resizeMode="contain"
                            style={{ width: 14, height: 14, marginRight: 8 }}
                          ></Image>

                          <Text darkColor bold>
                            Unidentified{" "}
                          </Text>
                        </View>
                      </View>

                      <Text
                        subhead
                        bold
                        buttonGradient2
                        style={{ fontSize: 15, marginBottom: 6 }}
                      >
                        {"NABL Range"}
                        {"  "}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 5,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={Images.NABL}
                            tintColor={BaseColor.green}
                            resizeMode="contain"
                            style={{ width: 14, height: 14, marginRight: 8 }}
                          ></Image>

                          <Text darkColor bold>
                            Valid{" "}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={Images.NABL}
                            tintColor={BaseColor.red}
                            resizeMode="contain"
                            style={{ width: 14, height: 14, marginRight: 8 }}
                          ></Image>

                          <Text darkColor bold>
                            Invalid{" "}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={Images.NABL}
                            tintColor={BaseColor.orange}
                            resizeMode="contain"
                            style={{ width: 14, height: 14, marginRight: 8 }}
                          ></Image>

                          <Text darkColor bold>
                            Unidentified{" "}
                          </Text>
                        </View>
                      </View>
                      {item.ListOfParameter?.map((item, index) => (
                        <>
                          <View
                            style={{
                              borderTopWidth: 1,
                              borderTopColor: BaseColor.grayColor,
                              marginBottom: 15,
                              marginTop: 15,
                            }}
                          ></View>

                          <Text subhead bold darkColor style={{ fontSize: 14 }}>
                            {"Name : "}{" "}
                            <Text subhead darkColor style={{ fontSize: 13 }}>
                              {item.ParameterName}
                              {item.DisplayCode.length > 0 && "  -  "}
                              {item.DisplayCode}
                            </Text>
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              subhead
                              bold
                              darkColor
                              style={{ fontSize: 14, flex: 1 }}
                            >
                              {"Min : "}{" "}
                              <Text subhead darkColor style={{ fontSize: 13 }}>
                                {item.MinValue}
                              </Text>
                            </Text>

                            <Text
                              subhead
                              bold
                              darkColor
                              style={{ fontSize: 14, flex: 1 }}
                            >
                              {"Max : "}{" "}
                              <Text subhead darkColor style={{ fontSize: 13 }}>
                                {item.MaxValue}
                              </Text>
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              subhead
                              bold
                              darkColor
                              style={{ fontSize: 14, flex: 1 }}
                            >
                              {"Range : "}{" "}
                              <Text subhead darkColor style={{ fontSize: 13 }}>
                                {item.RangeValue}
                              </Text>
                            </Text>

                            <Text
                              subhead
                              bold
                              darkColor
                              style={{ fontSize: 14, flex: 1 }}
                            >
                              {"NABL : "}{" "}
                              <Text subhead darkColor style={{ fontSize: 13 }}>
                                {item.IsNABLParameter == true ? "Yes" : "No"}
                              </Text>
                            </Text>
                          </View>
                          {item.ListOfTestingResult?.map((item, index) => (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                subhead
                                bold
                                darkColor
                                style={{ fontSize: 14, top: 2 }}
                              >
                                {"Value " + (index + 1) + " : "}{" "}
                                <Text
                                  subhead
                                  darkColor
                                  style={{ fontSize: 13 }}
                                >
                                  {item.ResultValue}{" "}
                                </Text>
                              </Text>
                              <>
                                <Image
                                  source={Images.Normal}
                                  tintColor={
                                    item.ConsiderResult == -1
                                      ? BaseColor.orange
                                      : item.ConsiderResult == 0
                                      ? BaseColor.red
                                      : BaseColor.green
                                  }
                                  resizeMode="contain"
                                  style={{
                                    width: 14,
                                    height: 14,
                                    marginRight: 3,
                                  }}
                                ></Image>
                                <Image
                                  source={Images.NABL}
                                  tintColor={
                                    item.ConsiderNABLResult == -1
                                      ? BaseColor.orange
                                      : item.ConsiderNABLResult == 0
                                      ? BaseColor.red
                                      : BaseColor.green
                                  }
                                  resizeMode="contain"
                                  style={{
                                    width: 14,
                                    height: 14,
                                    marginRight: 3,
                                  }}
                                ></Image>
                              </>
                            </View>
                          ))}
                        </>
                      ))}

                      <View
                        style={{
                          flex: 1,
                          padding: 0,
                          paddingTop: 15,
                          paddingBottom: 0,
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          subhead
                          bold
                          buttonGradient1
                          style={{ marginBottom: 0, marginTop: 5 }}
                        >
                          Approval Note
                        </Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            {
                              //   height: 100,
                              //   textAlignVertical: "top",
                              borderColor: BaseColor.darkGraycolor,
                            },
                          ]}
                          onChangeText={(text) => setRemarks(text)}
                          placeholder={"Enter Approval Note ..."}
                          value={Remarks}
                          returnKeyType="next"
                          multiline
                        />
                      </View>
                      {/* {InwardApprovalDetail.InwardCurrentStatus != 5 && ( */}
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          padding: 0,
                          paddingBottom: 5,
                          paddingTop: 5,
                        }}
                      >
                        <View style={{ paddingHorizontal: 4, width: "50%" }}>
                          <Pressable
                            onPress={() => {
                              TestingsApprovalInsertApi(
                                1,
                                4,
                                item.TestingIDEncrypt
                              );
                            }}
                            style={{
                              borderRadius: 8,
                              height: moderateScale(60),
                              backgroundColor: BaseColor.buttonGradient2,
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              // marginBottom: 10,
                            }}
                          >
                            {/* <Image
                              source={Images.check}
                              tintColor={BaseColor.whiteColor}
                              style={{ width: 15, height: 15 }}
                            ></Image> */}
                            <Text
                              bold
                              footnote
                              whiteColor
                              style={{ flex: 1, textAlign: "center" }}
                            >
                              {" Approved"}
                            </Text>
                          </Pressable>
                        </View>
                        <View style={{ paddingHorizontal: 4, width: "50%" }}>
                          <Pressable
                            onPress={() => {
                              TestingsApprovalInsertApi(
                                1,
                                5,
                                item.TestingIDEncrypt
                              );
                            }}
                            style={{
                              borderRadius: 8,
                              height: moderateScale(60),
                              backgroundColor: BaseColor.buttonGradient2,
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              // marginBottom: 10,
                            }}
                          >
                            {/* <Image
                              source={Images.reload}
                              tintColor={BaseColor.whiteColor}
                              style={{ width: 15, height: 15 }}
                            ></Image> */}
                            <Text
                              bold
                              footnote
                              whiteColor
                              style={{ flex: 1, textAlign: "center" }}
                            >
                              {" Rejected & Rectify"}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const toggleItem = (id, ListOfMaterialTests) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setListOfMaterialTests(ListOfMaterialTests);
    }
  };

  const [expandedId1, setExpandedId1] = useState(null);

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const toggleItem1 = (id) => {
    if (expandedId1 === id) {
      setExpandedId1(null);
    } else {
      setExpandedId1(id);
    }
  };

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
        title={"Testing Approval"}
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
                  onPress={() => {
                    setApprovalHistory_ModalVisible(true);
                    setRemarks('');
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Image
                    source={Images.check}
                    tintColor={BaseColor.buttonGradient2}
                    resizeMode="contain"
                    style={{ width: 18, height: 18, marginRight: 8 }}
                  ></Image>

                  <Text darkColor bold>
                    TC No -{" "}
                    <Text caption1 darkColor>
                      {InwardApprovalDetail.TCNo}
                    </Text>
                  </Text>
                </Pressable>
                <Text darkColor bold style={{ marginBottom: 2 }}>
                  {InwardApprovalDetail.InwardNo} |{" "}
                  {InwardApprovalDetail.InwardDate}
                </Text>

                <Text darkColor bold>
                  EDD -{" "}
                  <Text caption1 darkColor>
                    {InwardApprovalDetail.ExpectedDateOfDelivery}
                  </Text>
                </Text>

                <Text darkColor bold>
                  Material Group -{" "}
                  <Text caption1 darkColor>
                    {InwardApprovalDetail.MaterialGroupName}
                  </Text>
                </Text>

                <Text darkColor bold>
                  Material Type -{" "}
                  <Text caption1 darkColor>
                    {InwardApprovalDetail.MaterialType}
                  </Text>
                </Text>

                <Text darkColor bold>
                  Sample Detail :{" "}
                  <Text caption1 darkColor style={{ lineHeight: 18 }}>
                    {InwardApprovalDetail.SampleDetail}
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
                  Test Information
                </Text>
                <FlatList
                  data={ListOfMaterialInfo}
                  renderItem={renderItem}
                  keyExtractor={(item) => item?.TestingIDEncrypt}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      <Modal
        // animationType="slide"
        transparent={true}
        visible={ApprovalHistory_ModalVisible}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 15,
                }}
              >
                <Text darkColor callout bold style={{ flex: 1 }}>
                  {"Approve All"}
                </Text>
                <Pressable
                  onPress={() => {
                    setApprovalHistory_ModalVisible(false);
                  }}
                >
                  <Image
                    style={styles.modalCheckImg}
                    resizeMode="contain"
                    source={Images.closed}
                  ></Image>
                </Pressable>
              </View>
              <ScrollView>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: BaseColor.grayColor,
                    paddingTop: 15,
                    paddingBottom: 15,
                  }}
                >
                  <Text darkColor subhead bold style={{ marginBottom: 6 }}>
                    {"Instruction: - "}
                  </Text>
                  <Text semibold darkColor style={{ marginBottom: 10 }}>
                    {
                      "⦿ Selected TC included all test should be approve / reject & rectify. \n\n⦿ Approval note should be apply to all test of selected TC. \n\n⦿ Only Unapproved Test should be approve / reject & rectify. Pending or Draft test status remains as it is."
                    }
                  </Text>
                  {/* {ListOfMaterialTests?.TestingStatusName === "Unapproved" || ListOfMaterialTests?.TestingStatusName === 'Reject & Rectify' && (
                    <> */}
                  <View
                    style={{
                      flex: 1,
                      padding: 0,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      subhead
                      bold
                      buttonGradient1
                      style={{ marginBottom: 2, marginTop: 5 }}
                    >
                      Approval Note
                    </Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          //   height: 100,
                          //   textAlignVertical: "top",
                          borderColor: BaseColor.darkGraycolor,
                        },
                      ]}
                      onChangeText={(text) => setRemarks(text)}
                      placeholder={"Enter Approval Note ..."}
                      value={Remarks}
                      returnKeyType="next"
                      multiline
                    />
                  </View>
                  {/* {InwardApprovalDetail.InwardCurrentStatus != 5 && ( */}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      padding: 0,
                      paddingBottom: 5,
                      paddingTop: 5,
                    }}
                  >
                    <View style={{ paddingHorizontal: 4, width: "50%" }}>
                      <Pressable
                        onPress={() => {
                          TestingsApprovalInsertApi(2, 4);
                        }}
                        style={{
                          borderRadius: 8,
                          height: moderateScale(60),
                          backgroundColor: BaseColor.buttonGradient2,
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          // marginBottom: 10,
                        }}
                      >
                        <Image
                          source={Images.check}
                          tintColor={BaseColor.whiteColor}
                          style={{ width: 15, height: 15 }}
                        ></Image>
                        <Text bold footnote whiteColor>
                          {" Approved"}
                        </Text>
                      </Pressable>
                    </View>
                    <View style={{ paddingHorizontal: 4, width: "50%" }}>
                      <Pressable
                        onPress={() => {
                          TestingsApprovalInsertApi(2, 5);
                        }}
                        style={{
                          borderRadius: 8,
                          height: moderateScale(60),
                          backgroundColor: BaseColor.buttonGradient2,
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Image
                          source={Images.reload}
                          tintColor={BaseColor.whiteColor}
                          style={{ width: 15, height: 15 }}
                        ></Image>
                        <Text bold footnote whiteColor>
                          {" Rejected & Rectify"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  {/* </>
                  )} */}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TestingApproval;
