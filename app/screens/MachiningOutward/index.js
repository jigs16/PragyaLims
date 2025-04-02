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
  GetMachiningOutwardGetPassPrintDownloadApiCall,
  GetMachiningOutwardListApiCall,
  GetVendorsDDLListApiCall,
} from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";

const MachiningOutward = ({ navigation }) => {
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [TcNo, setTcNo] = useState("");
  const [OutwardNumber, setOutwardNumber] = useState("");
  const [Page, setPage] = useState(1);
  const [IA, setIA] = useState(0);
  const [TA, setTA] = useState(0);

  const [isFocus3, setIsFocus3] = useState(false);
  const [Status, setStatus] = useState([]);
  const [SelectedReceiverID, setSelectedReceiverID] = useState("");
  const [GetReportingsData, setGetReportingsData] = useState([]);
  const [DataFound, setDataFound] = useState(0);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      GetVendorsDDLListApi();
      GetMachiningOutwardListApi();
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
    { label: "Pending", value: 1 },
    { label: "Partial Done", value: 2 },
    { label: "Done", value: 3 },
  ];

  const GetMachiningOutwardListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setIA(await AsyncStorage.getItem("InwardApprovalRequired"));
    // setTA(await AsyncStorage.getItem("TestingApprovalRequired"));

    setLoading(true);
    var params = {
      CurrentPage: Page,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      CompanyIDEncrypt: LoginDetails?.CompanyIDEncrypt,
      BranchIDEncrypt: LoginDetails?.BranchIDEncrypt,
      VendorIDEncrypted: Vendor,
      Status: SelectedReceiverID,
      OutwardInwardStatus: 0,
      OutwardFromDate: OutwardFromDate,
      OutwardToDate: OutwardToDate,
      MachiningOutwardNo: OutwardNumber,
      TCNos: TcNo,
    };
    console.log("GetMachiningOutwardListApi Params =====>>>>>>>>>>", params);
    GetMachiningOutwardListApiCall(params)
      .then((res) => {
        console.log(
          "GetMachiningOutwardListApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setGetReportingsData(res?.MachiningOutwards);
          setDataFound(res?.MachiningOutwards == "" ? 2 : 1);
          toggleSidebar();
          setLoading(false);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setDataFound(res?.MachiningOutwards == "" ? 2 : 1);
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

  const [Vendor, setVendor] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [VendorData, setVendorData] = useState([]);

  const GetVendorsDDLListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
    };
    console.log("GetVendorDDLListAJAXApi Params =====>>>>>>>>>>", params);
    GetVendorsDDLListApiCall(params)
      .then((res) => {
        console.log(
          "GetVendorDDLListAJAXApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          // setLoading(false);
          setVendorData(res?.VendorsList);
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

  const [OutwardFromDate, setOutwardFromDate] = useState(getCurrentDate());
  const [OutwardToDate, setOutwardToDate] = useState(getCurrentDate());

  const [isFromDatePickerVisible, setIsFromDatePickerVisible] = useState(false);

  const _showFromDatePickerStart = () => {
    setIsFromDatePickerVisible(true);
  };

  const [StartDate, setStartDate] = useState("");
  const [OutwardStartFrom, setOutwardStartFrom] = useState(new Date());
  const [OutwardStartTo, setOutwardStartTo] = useState(new Date());

  const onChangeFromDate = (date) => {
    _hideFromDatePickerStart();
    // console.log("sfsdf", date);
    let temp = moment(date).format("DD-MMM-YYYY");
    // console.log("temp", temp);
    setOutwardStartFrom(moment(date).format("YYYY-MM-DD"));
    setStartDate(moment(date).format("YYYY-MM-DD"));
    setOutwardFromDate(temp);
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
    setOutwardStartTo(moment(date).format("YYYY-MM-DD"));
    setOutwardToDate(temp);
  };

  const _hideToDatePickerStart = () => {
    setIsToDatePickerVisible(false);
  };

  const GetMachiningOutwardGetPassPrintDownloadApi = async (
    MachiningOutwardIDEncrypt
  ) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      MachiningOutwardIDEncrypt: MachiningOutwardIDEncrypt,
      CompanyIDEncrypt: LoginDetails?.CompanyIDEncrypt,
      BranchIDEncrypt: LoginDetails?.BranchIDEncrypt,
    };
    console.log(
      "GetSampleRequestFormDetailDownloadApi Params =====>>>>>>>>>>",
      params
    );
    GetMachiningOutwardGetPassPrintDownloadApiCall(params)
      .then((res) => {
        if (res.IsSuccess) {
          setLoading(false);
          downloadFile(res.FilePath);
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

  //
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
        title={"Machining Outward"}
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
              Filter - Machining Outward
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
              Outward Date
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
                        OutwardFromDate == ""
                          ? BaseColor.darkGraycolor
                          : BaseColor.blackColor,
                    }}
                  >
                    {OutwardFromDate == "" ? "From Date" : OutwardFromDate}
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
                        OutwardToDate == ""
                          ? BaseColor.darkGraycolor
                          : BaseColor.blackColor,
                    }}
                  >
                    {OutwardToDate == "" ? "To Date" : OutwardToDate}
                  </Text>
                  <Image
                    source={Images.scheduleIcon}
                    style={{ height: 16, width: 18 }}
                  ></Image>
                </Pressable>
              </View>
            </View>

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Outward Number
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={OutwardNumber}
              onChangeText={(text) => setOutwardNumber(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search Outward Number"}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Vendor"}
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
                <DropdownSelected item={item?.VendorName} selected={selected} />
              )}
              data={VendorData}
              maxHeight={300}
              labelField="VendorName"
              valueField="VendorIDEncrypt"
              placeholder={!isFocus ? "Select Vendor" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Vendor}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setVendor(item?.VendorIDEncrypt);
                setIsFocus(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
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
              {"Status"}
            </Text>

            <MultiSelect
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
              maxHeight={500}
              labelField="label"
              valueField="value"
              placeholder={!isFocus3 ? "Select Status" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Status}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              selectedStyle={styles.selectedStyle}
              onChange={(item) => {
                setStatus(item);
                const selectedIds = item?.join(",");
                setSelectedReceiverID(selectedIds);
                setIsFocus3(false);
              }}
            />

            {/* <Dropdown
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
                const selectedIds = item?.join(",");
                setStatus(selectedIds);
                console.log('====================================');
                console.log(selectedIds);
                console.log('====================================');
                setIsFocus3(false);
              }}
            /> */}
          </KeyboardAwareScrollView>

          <Button
            onPress={() => {
              GetMachiningOutwardListApi();
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
          date={new Date(moment(OutwardStartFrom).format())}
          onConfirm={onChangeFromDate}
          onCancel={_hideFromDatePickerStart}
          maximumDate={new Date()}
        />

        <DateTimePickerModal
          isVisible={isToDatePickerVisible}
          mode="date"
          date={new Date(moment(OutwardStartTo).format())}
          onConfirm={onChangeToDate}
          onCancel={_hideToDatePickerStart}
          minimumDate={new Date(OutwardStartFrom)}
          maximumDate={new Date()}
        />

        <ScrollView>
          <View style={{ flex: 1, marginBottom: 65 }}>
            {GetReportingsData?.map((item, index) => (
              <Pressable
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
                          {item?.VendorName}
                        </Text>

                        <Text footnote darkColor style={{ marginTop: 4 }}>
                          {item?.MachiningOutwardNo + " | " + item?.OutwardDate}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Pressable
                          onPress={() => {
                            navigation.navigate("MachiningOutwardDetails", {
                              Details: item,
                            });
                          }}
                        >
                          <Image
                            style={{ width: 22, height: 22, right: 8 }}
                            resizeMode="contain"
                            tintColor={BaseColor.darkColor}
                            source={Images.cc}
                          ></Image>
                        </Pressable>

                        <Pressable
                          onPress={() => {
                            GetMachiningOutwardGetPassPrintDownloadApi(
                              item?.MachiningOutwardIDEncrypt
                            );
                          }}
                        >
                          <Image
                            style={{ width: 26, height: 26, top: -3 }}
                            resizeMode="contain"
                            tintColor={BaseColor.darkColor}
                            source={Images.ic_download}
                          ></Image>
                        </Pressable>
                      </View>
                    </View>

                    <Text darkColor bold>
                      Expected Date -{" "}
                      <Text footnote darkColor>
                        {item?.ExpectedDate}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Status -{" "}
                      <Text footnote darkColor>
                        {item?.OutwardStatusName}
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

export default MachiningOutward;
