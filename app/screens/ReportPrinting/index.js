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
  GetCustomerDDLListAJAXApiCall,
  GetReportingsListApiCall,
} from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";

const ReportPrinting = ({ navigation }) => {
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [TcNo, setTcNo] = useState("");
  const [InwardNumber, setInwardNumber] = useState("");
  const [Page, setPage] = useState(1);
  const [IA, setIA] = useState(0);
  const [TA, setTA] = useState(0);

  const [isFocus3, setIsFocus3] = useState(false);
  const [Status, setStatus] = useState(-1);
  const [GetReportingsData, setGetReportingsData] = useState([]);
  const [DataFound, setDataFound] = useState(0);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      GetCustomerDDLListAJAXApi();
      GetReportingsListApi();
    }
    toggleSidebar();
  }, [isFocused]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = Dimensions.get("window").width * 0.8;
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

  const StatusOptions = [
    { label: "All", value: -1 },
    { label: "Save", value: 1 },
    { label: "Draft Print", value: 2 },
    { label: "Print", value: 3 },
  ];

  const [isFocus4, setIsFocus4] = useState(false);
  const [UploadScanCopy, setUploadScanCopy] = useState(-1);
  const UploadScanCopyData = [
    { label: "All", value: -1 },
    { label: "Yes", value: 1 },
    { label: "No", value: 2 },
  ];

  const GetReportingsListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setIA(await AsyncStorage.getItem("InwardApprovalRequired"));
    setTA(await AsyncStorage.getItem("TestingApprovalRequired"));

    setLoading(true);
    var params = {
      CurrentPage: Page,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      BranchIDEncrypted: LoginDetails?.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
      TCNo: TcNo,
      InwardNo: InwardNumber,
      FromDate: InwardFromDate,
      ToDate: InwardToDate,
      ReportingStatus: Status,
      UploadScanCopy: UploadScanCopy,
      CustomerIDEncrypted: Customer,
    };
    console.log("GetReportingsListApi Params =====>>>>>>>>>>", params);
    GetReportingsListApiCall(params)
      .then((res) => {
        console.log(
          "GetReportingsListApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setGetReportingsData(res?.List);
          setDataFound(res?.List == "" ? 2 : 1);
          toggleSidebar();
          setLoading(false);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setDataFound(res?.List == "" ? 2 : 1);
          toggleSidebar();
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  // ---------------------Activity Log Sidebar Start---------------------

  const [Customer, setCustomer] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [CustomerData, setCustomerData] = useState([]);

  const GetCustomerDDLListAJAXApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
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
          // setLoading(false);
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

  const downloadFile = (FilePath) => {
    Linking.openURL(FilePath)
      .then(() => {
        console.log(`File ${FilePath} downloaded`);
      })
      .catch((error) => {
        console.error(`Failed to download file ${FilePath}: ${error}`);
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
        title={"Report Printing"}
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
            <Image
              source={Images.ic_filter}
              tintColor={BaseColor.blackColor}
              style={styles.cardImage1}
            />
            <Text headline style={{ flex: 1, color: BaseColor.blackColor }}>
              Filter - Report Printing
            </Text>
            <Pressable onPress={toggleSidebar}>
              <Image
                source={Images.ic_close}
                tintColor={BaseColor.blackColor}
                style={styles.cardImage}
              />
            </Pressable>
          </View>
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            style={{
              marginBottom: moderateScale(160),
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
                setCustomer(item.CustomerIDEncrypted);
                setIsFocus(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Status"}
            </Text>

            <Dropdown
              style={[styles.dropdown, isFocus3 && {}]}
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
              data={StatusOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus3 ? "Select Status" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Status}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              onChange={(item) => {
                setStatus(item.value);
                setIsFocus3(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Upload Scan Copy"}
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus4 && {}]}
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
              data={UploadScanCopyData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus4 ? "Select Scan Copy" : "..."}
              search
              searchPlaceholder={"Search"}
              value={UploadScanCopy}
              onFocus={() => setIsFocus4(true)}
              onBlur={() => setIsFocus4(false)}
              onChange={(item) => {
                setUploadScanCopy(item.value);
                setIsFocus4(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Inward Date
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
          </KeyboardAwareScrollView>

          <Button
            onPress={() => {
              GetReportingsListApi();
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
            {GetReportingsData?.map((item, index) => (
              <Pressable
                onPress={() => {
                  navigation.navigate("InwardApproval", {
                    InwardIDEncrypted: item.InwardIDEncrypted,
                    ViewType: "ViewOnly",
                  });
                }}
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
                          TC No -{" "}
                          <Text caption1 darkColor>
                            {item.TCNo}
                          </Text>
                        </Text>

                        <Text darkColor bold>
                          Inward No -{" "}
                          <Text caption1 darkColor>
                            {item.InwardNo}
                          </Text>
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        {item.ReportingStatusName == "Print" && (
                          <Pressable
                            onPress={() => {
                              setMsgModal("Coming Soon");
                              setAlertModal(true);
                            }}
                          >
                            <Image
                              style={{ width: 22, height: 22, right: 8 }}
                              resizeMode="contain"
                              tintColor={BaseColor.danger}
                              source={Images.ic_Print}
                            ></Image>
                          </Pressable>
                        )}
                        {item.ScanCopyFilePath != "" && (
                          <Pressable
                            onPress={() => {
                              downloadFile(item.ScanCopyFilePath);
                            }}
                          >
                            <Image
                              style={{ width: 22, height: 22 }}
                              resizeMode="contain"
                              tintColor={BaseColor.navyBlue}
                              source={Images.ic_ScanCopy}
                            ></Image>
                          </Pressable>
                        )}
                      </View>
                    </View>

                    <Text darkColor bold>
                      Sample Detail -{" "}
                      <Text caption1 darkColor>
                        {item.SampleDetail}
                      </Text>
                    </Text>
                    <Text darkColor bold>
                      EDD -{" "}
                      <Text caption1 darkColor>
                        {item.EDD}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Status -{" "}
                      <Text caption1 darkColor>
                        {item.ReportingStatusName}
                      </Text>
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
            {DataFound == 2 && (
              <View style={styles.Found}>
                <Image
                  source={Images.ic_DataFound}
                  style={{ width: 125, height: 125, marginBottom: 20 }}
                />

                <Text darkColor headline style={{ fontSize: 18 }}>
                  Oops! No Data Found.
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

export default ReportPrinting;
