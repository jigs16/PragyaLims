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
import { Button, Header, Image, Loader, Text } from "../../components";
import AlertModal from "../../components/AlertModal";
import { AccordionList } from "accordion-collapse-react-native";
import {
  GetInwardApprovalDetailByIDApiCall,
  InwardApprovalUpdateStatusApiCall,
} from "../../redux/services/ApiService";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InwardApproval = ({ navigation, route }) => {
  useEffect(() => {
    GetInwardApprovalDetailByIDApi();
  }, []);

  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [CurrentType, setCurrentType] = useState("InwardInformation");
  const [Remarks, setRemarks] = useState("");
  const [InwardApprovalDetail, setInwardApprovalDetail] = useState([]);
  const [ModesSections, setModesSections] = useState([]);
  const [ListOfMaterialInfo, setListOfMaterialInfo] = useState([]);
  const [ListOfMaterialTests, setListOfMaterialTests] = useState([]);
  const [ListOfMachiningDetails, setListOfMachiningDetails] = useState([]);
  const [ListOfInwardTPI, setListOfInwardTPI] = useState([]);
  const [ListOfInwardLetterRefImages, setListOfInwardLetterRefImages] =
    useState([]);
  const [ListOfInwardApprovalHist, setListOfInwardApprovalHist] = useState([]);
  const [ApprovalHistory_ModalVisible, setApprovalHistory_ModalVisible] =
    useState(false);
  const [TPI_ModalVisible, setTPI_ModalVisible] = useState(false);
  const [LetterRefImages_ModalVisible, setLetterRefImages_ModalVisible] =
    useState(false);
  const [ListOfMaterialImages, setListOfMaterialImages] = useState([]);
  const [
    ListOfMaterialImages_ModalVisible,
    setListOfMaterialImages_ModalVisible,
  ] = useState(false);

  const [
    ListOfMachiningDetails_ModalVisible,
    setListOfMachiningDetails_ModalVisible,
  ] = useState(false);
  //
  const [InwardApprovalRequired, setInwardApprovalRequired] = useState("");

  const GetInwardApprovalDetailByIDApi = async () => {
    setInwardApprovalRequired(
      await AsyncStorage.getItem("InwardApprovalRequired")
    );

    setLoading(true);
    var params = {
      CurrentPage: 1,
      InwardIDEncrypted: route.params.InwardIDEncrypted,
    };
    console.log(
      "GetInwardApprovalDetailByIDApi Params =====>>>>>>>>>>",
      params
    );
    GetInwardApprovalDetailByIDApiCall(params)
      .then((res) => {
        console.log(
          "GetInwardApprovalDetailByIDApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setInwardApprovalDetail(res);
          setModesSections(res?.ListOfModeDetail);
          setListOfMaterialInfo(res?.ListOfMaterialInfo);
          setListOfInwardTPI(res?.ListOfInwardTPI);
          setListOfInwardLetterRefImages(res?.ListOfInwardLetterRefImages);
          setListOfInwardApprovalHist(res?.ListOfInwardApprovalHist);
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

  const InwardApprovalUpdateStatusApi = async (id) => {
    setLoading(true);
    var params = {
      InwardIDEncrypt: route.params.InwardIDEncrypted,
      InwardCurrentStatus: id, // Approved = 5, Rewise & Rectify = 6, Rejected = 7
      StatusRemarks: Remarks,
      ModifiedByEncrypted: "",
    };
    console.log("InwardApprovalUpdateStatusApi Params =====>>>>>>>>>>", params);
    InwardApprovalUpdateStatusApiCall(params)
      .then((res) => {
        console.log(
          "InwardApprovalUpdateStatusApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          Toast.show("Record Saved Successfully.", Toast.LONG);
          navigation.goBack();
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
    const isExpanded = expandedId === item?.InwardMaterialIDEncrypted;

    return (
      <TouchableOpacity
        onPress={() =>
          toggleItem(
            item?.InwardMaterialIDEncrypted,
            item?.ListOfMaterialTests,
            item?.ListOfMachiningDetails,
            item?.ListOfMaterialImages
          )
        }
      >
        <View style={{}}>
          <View
            style={{
              padding: 10,
              borderRadius: 6,
              marginBottom: 10,
              flexDirection: "row",
              borderColor: BaseColor.buttonGradient2,
              backgroundColor:
                expandedId == item?.InwardMaterialIDEncrypted
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
                    expandedId == item?.InwardMaterialIDEncrypted
                      ? BaseColor.whiteColor
                      : BaseColor.buttonGradient2,
                }}
              >
                {"TC NO : "}
              </Text>

              <Text
                buttonGradient2
                footnote
                style={{
                  top: 1,
                  color:
                    expandedId == item?.InwardMaterialIDEncrypted
                      ? BaseColor.whiteColor
                      : BaseColor.buttonGradient2,
                }}
              >
                {item?.TCNo}
              </Text>
            </View>
            <Image
              source={Images.DownArrow}
              tintColor={
                expandedId == item?.InwardMaterialIDEncrypted
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
              <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                {"⦿ Material : "}
                <Text subhead darkColor style={{ fontSize: 14 }}>
                  {item?.ProductGroupName}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                {"⦿ Material Type : "}{" "}
                <Text subhead darkColor style={{ fontSize: 14 }}>
                  {item?.MaterialType}
                </Text>
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  subhead
                  bold
                  darkColor
                  style={{ fontSize: 14.5, flex: 1 }}
                >
                  {"⦿ Size : "}{" "}
                  <Text subhead darkColor style={{ fontSize: 14 }}>
                    {item?.Size}
                  </Text>
                </Text>

                <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                  {"⦿ Condition : "}{" "}
                  <Text subhead darkColor style={{ fontSize: 14 }}>
                    {item?.Condition}
                  </Text>
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  onPress={() => {
                    setListOfMaterialImages_ModalVisible(true);
                  }}
                  style={{ flex: 1 }}
                >
                  <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                    {"⦿ Images : "}{" "}
                    <Text subhead buttonGradient2 style={{ fontSize: 14 }}>
                      {"View"}
                    </Text>
                  </Text>
                </Pressable>
                <View style={{ flexDirection: "row" }}>
                  <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                    {"⦿ Machining : "}{" "}
                  </Text>
                  {item?.IsMachining == true ? (
                    <Pressable
                      onPress={() => {
                        setListOfMachiningDetails_ModalVisible(true);
                      }}
                    >
                      <Text subhead buttonGradient2 style={{ fontSize: 14.5 }}>
                        {"Yes"}
                      </Text>
                    </Pressable>
                  ) : (
                    <Text subhead darkColor style={{ fontSize: 14 }}>
                      {"No"}
                    </Text>
                  )}
                </View>
              </View>

              <Text
                subhead
                bold
                darkColor
                style={{ fontSize: 14.5, marginBottom: 10 }}
              >
                {"⦿ Sample Detail : "}{" "}
                <Text subhead darkColor style={{ fontSize: 14 }}>
                  {item?.SampleDetail}
                </Text>
              </Text>

              <FlatList
                data={ListOfMaterialTests}
                renderItem={renderItem1}
                keyExtractor={(item) => item?.TestMasterIDEncrypted}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const toggleItem = (
    id,
    ListOfMaterialTests,
    ListOfMachiningDetails,
    ListOfMaterialImages
  ) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setListOfMaterialTests(ListOfMaterialTests);
      setListOfMachiningDetails(ListOfMachiningDetails);
      setListOfMaterialImages(ListOfMaterialImages);
    }
  };

  const [expandedId1, setExpandedId1] = useState(null);

  const renderItem1 = ({ item }) => {
    const isExpanded1 = expandedId1 === item?.TestMasterIDEncrypted;

    return (
      <TouchableOpacity
        onPress={() => toggleItem1(item?.TestMasterIDEncrypted)}
      >
        <View style={{}}>
          <View
            style={{
              padding: 10,
              borderRadius: 6,
              marginBottom: 10,
              flexDirection: "row",
              borderColor: BaseColor.blackColor,
              backgroundColor:
                expandedId1 == item?.TestMasterIDEncrypted
                  ? BaseColor.blackColor
                  : "#00000025",
              borderWidth: 1,
              alignItems: "center",
            }}
          >
            <Text
              buttonGradient2
              bold
              style={{
                flex: 2,
                color:
                  expandedId1 == item?.TestMasterIDEncrypted
                    ? BaseColor.whiteColor
                    : BaseColor.blackColor,
              }}
            >
              {item?.TestName}
            </Text>
            <Image
              source={Images.DownArrow}
              tintColor={
                expandedId1 == item?.TestMasterIDEncrypted
                  ? BaseColor.whiteColor
                  : BaseColor.blackColor
              }
              style={{ width: 10, height: 10 }}
            ></Image>
          </View>
          {isExpanded1 && (
            <View
              style={{
                padding: 10,
                paddingRight: 10,
                marginTop: -10,
                marginBottom: 10,
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              }}
            >
              <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                {"⦿ Department : "}
                <Text subhead darkColor style={{ fontSize: 14 }}>
                  {item?.DepartmentName}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                {"⦿ Test Method : "}{" "}
                <Text subhead darkColor style={{ fontSize: 14 }}>
                  {item?.TestMethod}
                </Text>
              </Text>

              <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                {"⦿ Ref. Standard : "}{" "}
                <Text subhead darkColor style={{ fontSize: 14 }}>
                  {item?.ReferenceStandard}
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
                  style={{ fontSize: 14.5, flex: 1 }}
                >
                  {"⦿ Test Count : "}{" "}
                  <Text subhead darkColor style={{ fontSize: 14 }}>
                    {item?.TestCount}
                  </Text>
                </Text>

                <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                  {"⦿ Billing Qty : "}{" "}
                  <Text subhead darkColor style={{ fontSize: 14 }}>
                    {item?.BillingQty}
                  </Text>
                </Text>
              </View>

              <Text subhead bold darkColor style={{ fontSize: 14.5 }}>
                {"⦿ Test Note : "}{" "}
                <Text subhead darkColor style={{ fontSize: 14 }}>
                  {item?.TestNote}
                </Text>
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
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
        title={
          route.params.ViewType == "ApprovalOnly"
            ? "Inward Approval"
            : "Inward Details"
        }
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
                {ListOfInwardApprovalHist.length > 0 ? (
                  <View
                    style={{
                      marginBottom: 12,
                      alignSelf: "flex-end",
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        setApprovalHistory_ModalVisible(true);
                      }}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={Images.ic_transaction_history}
                        tintColor={BaseColor.buttonGradient2}
                        resizeMode="contain"
                        style={{ width: 20, height: 20, marginRight: 8 }}
                      ></Image>

                      <Text buttonGradient2 subhead bold>
                        Approval History
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
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
                    <Text buttonGradient2 bold style={{ marginBottom: 2 }}>
                      {InwardApprovalDetail.InwardNo} |{" "}
                      {InwardApprovalDetail.InwardDate}
                    </Text>

                    <Text darkColor bold>
                      Customer -{" "}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.CustomerName}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Project -{" "}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.ProjectName}
                      </Text>
                    </Text>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text darkColor bold>
                        Stamp -{" "}
                      </Text>
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.StempWriteup}{" "}
                      </Text>
                      {InwardApprovalDetail.StampImageFilePath != "" && (
                        <Pressable
                          onPress={() => {
                            downloadFile(
                              InwardApprovalDetail.StampImageFilePath
                            );
                          }}
                        >
                          <Image
                            source={Images.ic_download}
                            tintColor={BaseColor.buttonGradient2}
                            resizeMode="contain"
                            style={{ width: 20, height: 20, marginRight: 5 }}
                          ></Image>
                        </Pressable>
                      )}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.IsMaterialReturnable == true
                          ? "| Sample Returnable"
                          : ""}
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text darkColor bold>
                        TPI Required :{" "}
                        <Text caption1 darkColor>
                          {InwardApprovalDetail.IsTPIRequired == true
                            ? "Yes"
                            : "No"}
                          {ListOfInwardTPI?.length > 0 && " | "}
                        </Text>
                      </Text>
                      {ListOfInwardTPI?.length > 0 && (
                        <Pressable
                          onPress={() => {
                            setTPI_ModalVisible(true);
                          }}
                        >
                          <Text caption1 buttonGradient2 bold>
                            View TPI
                          </Text>
                        </Pressable>
                      )}
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text darkColor bold>
                        Letter Ref No :{" "}
                        <Text caption1 darkColor>
                          {InwardApprovalDetail.LetterRefNo}
                          {ListOfInwardLetterRefImages?.length > 0 && " | "}
                        </Text>
                      </Text>
                      {ListOfInwardLetterRefImages?.length > 0 && (
                        <Pressable
                          onPress={() => {
                            setLetterRefImages_ModalVisible(true);
                          }}
                        >
                          <Text caption1 buttonGradient2 bold>
                            View LR No
                          </Text>
                        </Pressable>
                      )}
                    </View>
                    <Text darkColor bold>
                      Work Detail :{" "}
                      <Text caption1 darkColor style={{ lineHeight: 18 }}>
                        {InwardApprovalDetail.ProjectDetails}
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
                    <Text
                      body1
                      bold
                      buttonGradient2
                      style={{ marginBottom: 12 }}
                    >
                      Modes
                    </Text>
                    <AccordionList
                      list={ModesSections}
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
                            {header.ModeDetailName}
                            {header.ModeTypeName == "Email" && " by "}
                            {header.ModeTypeName == "Hand to Hand" && " by "}
                            {header.ModeTypeName == "Courier" && " by "}
                            {header.ModeTypeName == "Post" && " by "}
                            {header.ModeTypeName}
                            {header.ModeTypeName == "Email" && " to "}
                            {header.ModeTypeName == "Hand to Hand" && " to "}
                            {header.ModeTypeName == "Post" && " to "}
                            {header.ModeTypeName == "Courier" && " to "}{" "}
                            {header.ContactPerson}
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
                          {body.CustomerName != "" && (
                            <Text caption1 darkColor>
                              {"⦿ " + body.CustomerName}
                            </Text>
                          )}
                          {body.ProjectName != "" && (
                            <Text caption1 darkColor>
                              {"⦿ " + body.ProjectName}
                            </Text>
                          )}
                          {body.Address != "" && (
                            <Text caption1 darkColor>
                              {"⦿ " + body.Address}
                            </Text>
                          )}
                          {body.ContactPersonMobileNo != "" && (
                            <Text caption1 darkColor>
                              {"⦿ " + body.ContactPersonMobileNo}
                            </Text>
                          )}
                          {body.ContactPersonEmailID != "" && (
                            <Text caption1 darkColor>
                              {"⦿ " + body.ContactPersonEmailID}
                            </Text>
                          )}
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
                    <Text
                      body1
                      bold
                      buttonGradient2
                      style={{ marginBottom: 12 }}
                    >
                      Other Information
                    </Text>

                    <Text darkColor bold>
                      Expected Date :{" "}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.ExpectedDateOfDelivery}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Material Taken By :{" "}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.MaterialTakenByUserName}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Sample Received Via :{" "}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.MaterialReceiveVia}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Reference By :{" "}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.ReferenceByName}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Delivery Remarks :{" "}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.EDDRemarks}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Received Remarks :{" "}
                      <Text caption1 darkColor>
                        {InwardApprovalDetail.ReceiveRemarks}
                      </Text>
                    </Text>
                  </View>
                </View>
                {route.params.ViewType == "ApprovalOnly" && (
                  <View>
                    {InwardApprovalRequired == 1 && (
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
                        {InwardApprovalDetail.InwardRewiseAndRectifyActionStatus &&
                          InwardApprovalDetail.InwardCurrentStatus != 5 && (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  paddingTop: 0,
                                  paddingBottom: 0,
                                  marginBottom: 10,
                                }}
                              >
                                <Text
                                  subhead
                                  bold
                                  buttonGradient2
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

                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: "row",
                                  padding: 10,
                                  paddingBottom: 5,
                                  paddingTop: 5,
                                }}
                              >
                                <View
                                  style={{ paddingHorizontal: 4, width: "50%" }}
                                >
                                  <Pressable
                                    onPress={() => {
                                      InwardApprovalUpdateStatusApi(5);
                                    }}
                                    style={{
                                      borderRadius: 8,
                                      height: moderateScale(60),
                                      backgroundColor:
                                        BaseColor.buttonGradient2,
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
                                <View
                                  style={{ paddingHorizontal: 4, width: "50%" }}
                                >
                                  <Pressable
                                    onPress={() => {
                                      InwardApprovalUpdateStatusApi(6);
                                    }}
                                    style={{
                                      borderRadius: 8,
                                      height: moderateScale(60),
                                      backgroundColor:
                                        BaseColor.buttonGradient2,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexDirection: "row",
                                      // marginBottom: 10,
                                    }}
                                  >
                                    <Image
                                      source={Images.reload}
                                      tintColor={BaseColor.whiteColor}
                                      style={{ width: 15, height: 15 }}
                                    ></Image>
                                    <Text bold footnote whiteColor>
                                      {" Rewise & Rectify"}
                                    </Text>
                                  </Pressable>
                                </View>
                              </View>
                            </>
                          )}
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            padding: 10,
                            marginBottom: 0,
                            paddingBottom: 0,
                            paddingTop: 5,
                          }}
                        >
                          {InwardApprovalDetail.InwardCurrentStatus != 5 && (
                            <View
                              style={{ paddingHorizontal: 4, width: "50%" }}
                            >
                              <Pressable
                                onPress={() => {
                                  InwardApprovalUpdateStatusApi(7);
                                }}
                                style={{
                                  borderRadius: 8,
                                  height: moderateScale(60),
                                  backgroundColor: BaseColor.buttonGradient2,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexDirection: "row",
                                  marginBottom: 5,
                                }}
                              >
                                <Image
                                  source={Images.ic_close}
                                  tintColor={BaseColor.whiteColor}
                                  style={{ width: 15, height: 15 }}
                                ></Image>
                                <Text bold footnote whiteColor>
                                  {"  Rejected"}
                                </Text>
                              </Pressable>
                            </View>
                          )}

                          <View style={{ paddingHorizontal: 4, width: "50%" }}>
                            <Pressable
                              onPress={() => {
                                navigation.goBack();
                              }}
                              style={{
                                borderRadius: 8,
                                height: moderateScale(60),
                                backgroundColor: BaseColor.danger,
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "row",
                                marginBottom: 5,
                              }}
                            >
                              <Image
                                source={Images.forbidden}
                                tintColor={BaseColor.whiteColor}
                                style={{ width: 15, height: 15 }}
                              ></Image>
                              <Text bold footnote whiteColor>
                                {" Cancel"}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                )}
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
                    padding: 10,
                  },
                ]}
              >
                <FlatList
                  data={ListOfMaterialInfo}
                  renderItem={renderItem}
                  keyExtractor={(item) => item?.InwardMaterialIDEncrypted}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>

      <Modal
        // animationType="slide"
        transparent={true}
        visible={TPI_ModalVisible}
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
                  {"Inward TPI"}
                </Text>
                <Pressable
                  onPress={() => {
                    setTPI_ModalVisible(false);
                  }}
                >
                  <Image
                    style={styles.modalCheckImg}
                    resizeMode="contain"
                    source={Images.ic_close}
                  ></Image>
                </Pressable>
              </View>
              <ScrollView>
                {ListOfInwardTPI?.map((item, index) => (
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: BaseColor.grayColor,
                      paddingTop: 15,
                      paddingBottom: 15,
                    }}
                  >
                    <Text darkColor subhead bold>
                      {"⦿ TPI - "}
                      <Text semibold darkColor>
                        {item.TPI}
                      </Text>
                    </Text>

                    <Text darkColor subhead bold>
                      {"⦿ Contact Person - "}
                      <Text semibold darkColor>
                        {item.ContactPerson}
                      </Text>
                    </Text>

                    <Text darkColor subhead bold>
                      {"⦿ Expected Date - "}
                      <Text semibold darkColor>
                        {item.TPIExpectedDate}
                      </Text>
                    </Text>
                  </View>
                ))}
                {ListOfInwardTPI == "" && (
                  <Text darkColor style={{ marginBottom: 10 }}>
                    No Data Found !
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        // animationType="slide"
        transparent={true}
        visible={LetterRefImages_ModalVisible}
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
                  {"Letter Ref Doc"}
                </Text>
                <Pressable
                  onPress={() => {
                    setLetterRefImages_ModalVisible(false);
                  }}
                >
                  <Image
                    style={styles.modalCheckImg}
                    resizeMode="contain"
                    source={Images.ic_close}
                  ></Image>
                </Pressable>
              </View>
              <ScrollView>
                {ListOfInwardLetterRefImages?.map((item, index) => (
                  <Pressable
                    onPress={() => downloadFile(item.LetterRefImageFilePath)}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: BaseColor.grayColor,
                      paddingTop: 12,
                      paddingBottom: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={Images.ic_download}
                      tintColor={BaseColor.darkColor}
                      resizeMode="contain"
                      style={{ width: 28, height: 28, top: 0, marginRight: 5 }}
                    ></Image>

                    <Text semibold darkColor style={{ flex: 1 }}>
                      {" "}
                      {item.LetterRefImageFileName}
                    </Text>
                  </Pressable>
                ))}

                {ListOfInwardLetterRefImages == "" && (
                  <Text darkColor style={{ marginBottom: 10 }}>
                    No Data Found !
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        // animationType="slide"
        transparent={true}
        visible={ListOfMaterialImages_ModalVisible}
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
                  {"Images - Material Information"}
                </Text>
                <Pressable
                  onPress={() => {
                    setListOfMaterialImages_ModalVisible(false);
                  }}
                >
                  <Image
                    style={styles.modalCheckImg}
                    resizeMode="contain"
                    source={Images.ic_close}
                  ></Image>
                </Pressable>
              </View>
              <ScrollView>
                {ListOfMaterialImages?.map((item, index) => (
                  <Pressable
                    onPress={() => downloadFile(item.MaterialPhotoFilePath)}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: BaseColor.grayColor,
                      paddingTop: 12,
                      paddingBottom: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={Images.ic_download}
                      tintColor={BaseColor.darkColor}
                      resizeMode="contain"
                      style={{ width: 25, height: 25, top: 1, marginRight: 20 }}
                    ></Image>

                    <Image
                      source={{ uri: item.MaterialPhotoFilePath }}
                      // tintColor={BaseColor.darkColor}
                      resizeMode="contain"
                      style={{
                        width: 80,
                        height: 80,
                        marginRight: 5,
                        borderRadius: 12,
                      }}
                    ></Image>
                  </Pressable>
                ))}

                {ListOfMaterialImages == "" && (
                  <Text darkColor style={{ marginBottom: 10 }}>
                    No Data Found !
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

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
                  {"Inward Approval History"}
                </Text>
                <Pressable
                  onPress={() => {
                    setApprovalHistory_ModalVisible(false);
                  }}
                >
                  <Image
                    style={styles.modalCheckImg}
                    resizeMode="contain"
                    source={Images.ic_close}
                  ></Image>
                </Pressable>
              </View>
              <ScrollView>
                {ListOfInwardApprovalHist?.map((item, index) => (
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: BaseColor.grayColor,
                      paddingTop: 15,
                      paddingBottom: 15,
                    }}
                  >
                    <Text darkColor subhead bold>
                      {"⦿ Status - "}
                      <Text semibold darkColor>
                        {item.InwardStatus}
                      </Text>
                    </Text>

                    <Text darkColor subhead bold>
                      {"⦿ Created By - "}
                      <Text semibold darkColor>
                        {item.CreatedByName}
                      </Text>
                    </Text>

                    <Text darkColor subhead bold>
                      {"⦿ Created Date - "}
                      <Text semibold darkColor>
                        {item.CreatedOn}
                      </Text>
                    </Text>

                    {item.StatusRemarks != "" && (
                      <Text darkColor subhead bold>
                        {"⦿ Status Remarks - "}
                        <Text semibold darkColor>
                          {item.StatusRemarks}
                        </Text>
                      </Text>
                    )}
                  </View>
                ))}

                {ListOfInwardApprovalHist == "" && (
                  <Text darkColor style={{ marginBottom: 10 }}>
                    No Data Found !
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        // animationType="slide"
        transparent={true}
        visible={ListOfMachiningDetails_ModalVisible}
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
                  {"Machining Details"}
                </Text>
                <Pressable
                  onPress={() => {
                    setListOfMachiningDetails_ModalVisible(false);
                  }}
                >
                  <Image
                    style={styles.modalCheckImg}
                    resizeMode="contain"
                    source={Images.ic_close}
                  ></Image>
                </Pressable>
              </View>
              <ScrollView>
                {ListOfMachiningDetails?.map((item, index) => (
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: BaseColor.grayColor,
                      paddingTop: 15,
                      paddingBottom: 15,
                    }}
                  >
                    <Text darkColor subhead bold>
                      {"⦿ Process Name - "}
                      <Text semibold darkColor>
                        {item.ProcessName}
                      </Text>
                    </Text>

                    <Text darkColor subhead bold>
                      {"⦿ Process Note - "}
                      <Text semibold darkColor>
                        {item.MachiningNote}
                      </Text>
                    </Text>

                    <Text darkColor subhead bold>
                      {"⦿ Qty - "}
                      <Text semibold darkColor>
                        {item.Qty}
                      </Text>
                    </Text>

                    <View style={{ flexDirection: "row" }}>
                      <Text darkColor subhead bold style={{ flex: 1 }}>
                        {"⦿ Length - "}
                        <Text semibold darkColor>
                          {item.Length}
                        </Text>
                      </Text>

                      <Text darkColor subhead bold>
                        {"⦿ Thickness - "}
                        <Text semibold darkColor>
                          {item.Thickness}
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))}
                {ListOfMachiningDetails == "" && (
                  <Text darkColor style={{ marginBottom: 10 }}>
                    No Data Found !
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default InwardApproval;
