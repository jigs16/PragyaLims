import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";
import styles from "./styles";
import { BaseColor, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, verticalScale } from "../../config/scaling";
import {
  Button,
  Header,
  Image,
  Loader,
  Text,
  TextInput,
} from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import DropdownSelected from "../../components/DropdownSelected/DropdownSelected";
import {
  DDLGetTestMasterByCompanyIDApiApiCall,
  GetCustomerDDLListAJAXApiCall,
  GetUploadScanCopiesListApiCall,
} from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const UploadScancopy = ({ navigation }) => {
  useEffect(() => {
    GetUploadScanCopiesListApi();
    GetCustomerDDLListAJAXApi();
    DDLGetTestMasterByCompanyIDApi();
    toggleSidebar();
  }, []);

  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [InwardNumber, setInwardNumber] = useState("");
  const [TcNo, setTcNo] = useState("");
  const [SampleDetail, setSampleDetail] = useState("");
  const [ScanBarcode, setScanBarcode] = useState("");

  const [IA, setIA] = useState(0);
  const [TA, setTA] = useState(0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = Dimensions.get("window").width * 0.8; // Adjust the width as needed
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSidebarOpen ? 1 : 0,
      duration: 500, // Slower animation duration
      useNativeDriver: false,
    }).start();
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [ListOfUploadScanCopies, setListOfUploadScanCopies] = useState([]);
  const [DataFound, setDataFound] = useState(0);

  const GetUploadScanCopiesListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setIA(await AsyncStorage.getItem("InwardApprovalRequired"));
    setTA(await AsyncStorage.getItem("TestingApprovalRequired"));
    console.log(
      "InwardApprovalRequired ===>>>",
      await AsyncStorage.getItem("InwardApprovalRequired")
    );
    setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      BranchIDEncrypted: LoginDetails?.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
      TCNo: TcNo,
      InwardNo: InwardNumber,
      FromDate: InwardFromDate,
      ToDate: InwardToDate,
      SampleDetail: SampleDetail,
      ScanBarcode: ScanBarcode,
      MailSent: MailSent,
      CustomerIDEncrypted: Customer,
    };
    console.log("GetListOfUploadScanCopiesApi Params =====>>>>>>>>>>", params);
    GetUploadScanCopiesListApiCall(params)
      .then((res) => {
        console.log(
          "GetListOfUploadScanCopiesApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setListOfUploadScanCopies(res?.ListOfUploadScanCopies);
          setDataFound(res?.ListOfUploadScanCopies == "" ? 2 : 1);
          toggleSidebar();
          setLoading(false);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setDataFound(res?.ListOfUploadScanCopies == "" ? 2 : 1);
          // setMsgModal(res?.Message);
          // setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.Message);
        setAlertModal(true);
      });
  };

  // ---------------------Activity Log Sidebar Start---------------------

  const [TestData, setTestData] = useState([]);
  const [Test, setTest] = useState("");
  const [isFocus7, setIsFocus7] = useState(false);

  const DDLGetTestMasterByCompanyIDApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
    };
    console.log(
      "DDLGetTestMasterByCompanyIDApi Params =====>>>>>>>>>>",
      params
    );
    DDLGetTestMasterByCompanyIDApiApiCall(params)
      .then((res) => {
        console.log(
          "DDLGetTestMasterByCompanyIDApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setTestData(res?.List);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res?.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.Message);
        setAlertModal(true);
      });
  };

  // ---------------------Activity Log Sidebar End---------------------

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [InwardFromDate, setInwardFromDate] = useState(getCurrentDate());
  const [InwardToDate, setInwardToDate] = useState(getCurrentDate());

  const [isFromDatePickerVisible, setIsFromDatePickerVisible] = useState(false);

  const _showFromDatePickerStart = () => {
    setIsFromDatePickerVisible(true);
  };

  const [StartDate, setStartDate] = useState("");
  const [InwardStartFrom, setInwardStartFrom] = useState(new Date());
  const [InwardStartTo, setInwardStartTo] = useState(new Date());

  const onChangeFromDate = (date) => {
    _hideFromDatePickerStart();
    // console.log("sfsdf", date);
    let temp = moment(date).format("DD-MMM-YYYY");
    // console.log("temp", temp);
    setInwardStartFrom(moment(date).format("YYYY-MM-DD"));
    setStartDate(moment(date).format("YYYY-MM-DD"));
    setInwardFromDate(temp);
  };

  const _hideFromDatePickerStart = () => {
    setIsFromDatePickerVisible(false);
  };

  const [isToDatePickerVisible, setIsToDatePickerVisible] = useState(false);

  const _showToDatePickerStart = () => {
    setIsToDatePickerVisible(true);
  };

  const onChangeToDate = (date) => {
    _hideToDatePickerStart();
    // console.log("sfsdf", date);
    let temp = moment(date).format("DD-MMM-YYYY");
    // console.log("temp", temp);
    setInwardStartTo(moment(date).format("YYYY-MM-DD"));
    setInwardToDate(temp);
  };

  const _hideToDatePickerStart = () => {
    setIsToDatePickerVisible(false);
  };

  const [isFocus2, setIsFocus2] = useState(false);
  const [MailSent, setMailSent] = useState(-1);
  const MailSentData = [
    { label: "All", value: -1 },
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const [Customer, setCustomer] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [CustomerData, setCustomerData] = useState([]);

  const GetCustomerDDLListAJAXApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
      TPIFlag: -1,
      SearchValue: "",
    };
    console.log("GetCustomerDDLListAJAXApi Params =====>>>>>>>>>>", params);
    GetCustomerDDLListAJAXApiCall(params)
      .then((res) => {
        console.log(
          "GetCustomerDDLListAJAXApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setCustomerData(res?.CustomerDDLList);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res?.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.Message);
        setAlertModal(true);
      });
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
        title={"Upload Scan Copy"}
        onPressRight={toggleSidebar}
        renderRight={() => {
          return (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              tintColor={BaseColor.blackColor}
              source={Images.ic_filter}
            ></Image>
          );
        }}
      ></Header>

      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>

      {isSidebarOpen && (
        <Pressable onPress={toggleSidebar} style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.8],
                }),
              },
            ]}
          />
        </Pressable>
      )}
      {isSidebarOpen && (
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-sidebarWidth, 0],
                  }),
                },
              ],
              zIndex: 1,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 0,
              paddingBottom: 10,
              borderBottomColor: BaseColor.blackColor,
            }}
          >
            <Pressable onPress={toggleSidebar}>
              <Image
                source={Images.ic_back}
                tintColor={BaseColor.blackColor}
                style={styles.cardImage1}
              />
            </Pressable>
            <Text headline style={{ flex: 1, color: BaseColor.blackColor }}>
              Filter - Upload Scan Copy
            </Text>
          </View>
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            style={{
              marginBottom: moderateScale(170),
              marginTop: moderateScale(20),
            }}
          >
            <Text darkColor bold style={{ marginTop: moderateScale(5) }}>
              TC No
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={TcNo}
              onChangeText={(text) => setTcNo(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search TC No"}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Inward Number
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={InwardNumber}
              onChangeText={(text) => setInwardNumber(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search Inward Number"}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              From Date - To Date
            </Text>

            <View style={{ flexDirection: "row", flex: 1 }}>
              <View style={{ paddingRight: 5, width: "50%" }}>
                <Pressable
                  onPress={() => {
                    _showFromDatePickerStart();
                  }}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: "white",
                      borderRadius: 10,
                      height: verticalScale(80),
                      paddingHorizontal: 12,
                      marginTop: moderateScale(10),
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        InwardFromDate == ""
                          ? BaseColor.darkGraycolor
                          : BaseColor.blackColor,
                    }}
                  >
                    {InwardFromDate == "" ? "From Date" : InwardFromDate}
                  </Text>
                  <Image
                    source={Images.scheduleIcon}
                    style={{ height: 16, width: 18 }}
                  ></Image>
                </Pressable>
              </View>
              <View style={{ paddingRight: 5, width: "50%" }}>
                <Pressable
                  onPress={() => {
                    _showToDatePickerStart();
                  }}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: "white",
                      borderRadius: 10,
                      height: verticalScale(80),
                      paddingHorizontal: 12,
                      marginTop: moderateScale(10),
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        InwardToDate == ""
                          ? BaseColor.darkGraycolor
                          : BaseColor.blackColor,
                    }}
                  >
                    {InwardToDate == "" ? "To Date" : InwardToDate}
                  </Text>
                  <Image
                    source={Images.scheduleIcon}
                    style={{ height: 16, width: 18 }}
                  ></Image>
                </Pressable>
              </View>
            </View>

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Sample Detail
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={SampleDetail}
              onChangeText={(text) => setSampleDetail(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search Sample Detail"}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Customer"}
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus && {}]}
              placeholderStyle={[
                styles.placeholderStyle,
                { color: BaseColor.borderColor },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: "#000000" },
              ]}
              renderItem={(item, selected) => (
                <DropdownSelected
                  item={item?.CustomerName}
                  selected={selected}
                />
              )}
              data={CustomerData}
              maxHeight={300}
              labelField="CustomerName"
              valueField="CustomerIDEncrypted"
              placeholder={!isFocus ? "Select Customer" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Customer}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setCustomer(item?.CustomerIDEncrypted);
                setIsFocus(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Scan Barcode
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={SampleDetail}
              onChangeText={(text) => setScanBarcode(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search Scan Barcode"}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Mail Sent
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus2 && {}]}
              placeholderStyle={[
                styles.placeholderStyle,
                { color: BaseColor.borderColor },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: "#000000" },
              ]}
              renderItem={(item, selected) => (
                <DropdownSelected item={item?.label} selected={selected} />
              )}
              data={MailSentData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus2 ? "Select Mail Sent" : "..."}
              //   search
              //   searchPlaceholder={"Search"}
              value={MailSent}
              onFocus={() => setIsFocus2(true)}
              onBlur={() => setIsFocus2(false)}
              onChange={(item) => {
                setMailSent(item?.value);
                setIsFocus2(false);
              }}
            />
          </KeyboardAwareScrollView>

          <Button
            onPress={() => {
              GetUploadScanCopiesListApi();
            }}
            style={{
              marginVertical: moderateScale(30),
              height: 44,
              position: "absolute",
              bottom: moderateScale(74),
              alignSelf: "center",
              borderRadius: 10,
            }}
            full
          >
            {"Filter"}
          </Button>
        </Animated.View>
      )}

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

        <DateTimePickerModal
          isVisible={isFromDatePickerVisible}
          mode="date"
          date={new Date(moment(InwardStartFrom).format())}
          onConfirm={onChangeFromDate}
          onCancel={_hideFromDatePickerStart}
          maximumDate={new Date()}
        />

        <DateTimePickerModal
          isVisible={isToDatePickerVisible}
          mode="date"
          date={new Date(moment(InwardStartTo).format())}
          onConfirm={onChangeToDate}
          onCancel={_hideToDatePickerStart}
          minimumDate={new Date(InwardStartFrom)}
          maximumDate={new Date()}
        />

        <ScrollView>
          <View style={{ flex: 1, marginBottom: 65 }}>
            {ListOfUploadScanCopies?.map((item, index) => (
              <Pressable
                onPress={() => {
                  // navigation.navigate("InwardApproval", {
                  //   InwardIDEncrypted: item?.InwardIDEncrypted,
                  //   ViewType: "ViewOnly",
                  // });
                }}
                style={{
                  paddingBottom: moderateScale(10),
                  borderRadius: 10,
                  backgroundColor: BaseColor.Card,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    // alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text darkColor bold>
                      TC No -{" "}
                      <Text caption1 darkColor>
                        {item?.TCNo}
                      </Text>
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "flex-end",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text darkColor bold>
                          {item?.InwardNo}
                        </Text>
                        {/* )} */}
                      </View>
                    </View>

                    <Text darkColor bold>
                      Customer -{" "}
                      <Text caption1 darkColor>
                        {item?.CustomerName}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Test -{" "}
                      <Text caption1 darkColor>
                        {item?.TestName}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                    Uploaded By -{" "}
                      <Text caption1 darkColor>
                        {item?.CreatedBy +' | '+ item?.CreatedOnDate}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Sample Detail -{" "}
                      <Text caption1 darkColor>
                        {item?.SampleDetail}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Mail Send -{" "}
                      <Text caption1 darkColor>
                        {item?.IsMailSend == false ? "No" : "Yes"}
                      </Text>
                    </Text>
                  </View>
                  {/* <View style={{}}>
                    <Pressable
                      // onPress={() => {
                      //   navigation.navigate("TestingApproval", {
                      //     InwardMaterialIDEncrypted:
                      //       item?.InwardMaterialIDEncrypted,
                      //   });
                      // }}
                      style={{
                        borderWidth: 1,
                        borderColor:
                          item?.TestingActionStatus === 1
                            ? BaseColor.green // BaseColor.red
                            : item?.TestingActionStatus === 2
                            ? BaseColor.green //BaseColor.green
                            : BaseColor.green, //BaseColor.orange,
                        width: 35,
                        height: 24,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            item?.TestingActionStatus === 1
                              ? BaseColor.green //BaseColor.red
                              : item?.TestingActionStatus === 2
                              ? BaseColor.green
                              : BaseColor.green, // BaseColor.orange
                        }}
                      >
                        T
                      </Text>
                    </Pressable>
                  </View> */}
                </View>
              </Pressable>
            ))}
            {DataFound == 2 && (
              <View style={styles.Found}>
                <Image
                  source={Images.ic_DataFound}
                  style={{ width: 165, height: 165, marginBottom: 10 }}
                />

                <Text darkColor headline style={{ fontSize: 18 }}>
                  No Data Found !
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    darkColor
                    subhead
                    style={{ marginTop: 10, fontSize: 14 }}
                  >
                    Please Change the filter{" "}
                  </Text>
                  <Pressable onPress={toggleSidebar}>
                    <Text
                      subhead
                      buttonGradient1
                      bold
                      style={{
                        marginTop: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: BaseColor.buttonGradient1,
                        paddingBottom: 2,
                        marginTop: 10,
                      }}
                    >
                      Click here
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default UploadScancopy;
