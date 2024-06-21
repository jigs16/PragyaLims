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
  GetCourierDDLListApiCall,
  GetCustomerDDLListAJAXApiCall,
  GetReportDispatchListApiCall,
  GetReportDispatchPrintByIDApiCall,
  GetReportDispatchPrintLabelApiCall,
} from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";

const ReportDispatch = ({ navigation }) => {
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [TcNo, setTcNo] = useState("");
  const [InwardNumber, setInwardNumber] = useState("");
  const [DispatchNumber, setDispatchNumber] = useState("");
  const [DeliveredTo, setDeliveredTo] = useState("");
  const [Page, setPage] = useState(1);

  const [isFocus3, setIsFocus3] = useState(false);

  const [GetReportingsData, setGetReportingsData] = useState([]);
  const [DataFound, setDataFound] = useState(0);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      GetReportDispatchListApi();
      GetCustomerDDLListAJAXApi();
      GetCourierDDLListApi();
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

  const GetReportDispatchListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      BranchIDEncrypt: LoginDetails?.BranchIDEncrypt,
      CompanyIDEncrypt: LoginDetails?.CompanyIDEncrypt,
      CourierIDEncrypted: Courier,
      CurrentPage: Page,
      CustomerIDEncrypted: Customer,
      DeliveredTo: DeliveredTo,
      InwardNo: InwardNumber,
      PageSize: 10000,
      ReportDispatchDateFrom: FromDate,
      ReportDispatchDateTo: ToDate,
      ReportDispatchNo: DispatchNumber,
      Search: "",
      Sorting: "",
      TCNo: TcNo,
    };
    console.log("GetReportDispatchListApi Params =====>>>>>>>>>>", params);
    GetReportDispatchListApiCall(params)
      .then((res) => {
        console.log(
          "GetReportDispatchListApi res ---->>>>>> ",
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
  const [CourierData, setCourierData] = useState([]);
  const [Courier, setCourier] = useState("");
  //Courier

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

  const GetCourierDDLListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      BranchIDEncrypted: LoginDetails?.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
    };
    console.log("GetCourierDDLListApi Params =====>>>>>>>>>>", params);
    GetCourierDDLListApiCall(params)
      .then((res) => {
        if (res.IsSuccess) {
          setCourierData(res?.List);
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

  //GetCourierDDLListApiCall
  const GetReportDispatchPrintByIDApi = async (ReportDispatchIDEncrypt) => {
    setLoading(true);
    var params = {
      ReportDispatchIDEncrypt: ReportDispatchIDEncrypt,
    };
    console.log("GetCustomerDDLListAJAXApi Params =====>>>>>>>>>>", params);
    GetReportDispatchPrintByIDApiCall(params)
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
  const [htmlContent, setHtmlContent] = useState("");
  const GetReportDispatchPrintLabelApi = async (ReportDispatchIDEncrypt) => {
    setLoading(true);
    var params = {
      ReportDispatchIDEncrypt: ReportDispatchIDEncrypt,
    };
    console.log(
      "GetReportDispatchPrintLabelApi Params =====>>>>>>>>>>",
      params
    );
    GetReportDispatchPrintLabelApiCall(params)
      .then((res) => {
        if (res.IsSuccess) {
          setLoading(false);
          //   setCustomerData(res?.CustomerDDLList);
          //   downloadFile(res.FilePath);
          setHtmlContent(res.HTMLContents);
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

  const downloadFile = (FilePath) => {
    Linking.openURL(FilePath)
      .then(() => {
        console.log(`File ${FilePath} downloaded`);
      })
      .catch((error) => {
        console.error(`Failed to download file ${FilePath}: ${error}`);
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

  const [FromDate, setFromDate] = useState(getCurrentDate());
  const [ToDate, setToDate] = useState(getCurrentDate());

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
    setFromDate(temp);
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
    setToDate(temp);
  };

  const _hideToDatePickerStart = () => {
    setIsToDatePickerVisible(false);
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
        title={"Report Dispatch"}
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
              Filter - Report Dispatch
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
              Dispatch Date
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
                        FromDate == ""
                          ? BaseColor.darkGraycolor
                          : BaseColor.blackColor,
                    }}
                  >
                    {FromDate == "" ? "From Date" : FromDate}
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
                        ToDate == ""
                          ? BaseColor.darkGraycolor
                          : BaseColor.blackColor,
                    }}
                  >
                    {ToDate == "" ? "To Date" : ToDate}
                  </Text>
                  <Image
                    source={Images.scheduleIcon}
                    style={{ height: 16, width: 18 }}
                  ></Image>
                </Pressable>
              </View>
            </View>

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Dispatch Number
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={DispatchNumber}
              onChangeText={(text) => setDispatchNumber(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search Dispatch Number"}
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
              Delivered To
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={DeliveredTo}
              onChangeText={(text) => setDeliveredTo(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search TC No"}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Courier"}
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
                <DropdownSelected
                  item={item?.CourierName}
                  selected={selected}
                />
              )}
              data={CourierData}
              maxHeight={300}
              labelField="CourierName"
              valueField="CourierIDEncrypted"
              placeholder={!isFocus3 ? "Select Courier" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Courier}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              onChange={(item) => {
                setCourier(item.CourierIDEncrypted);
                setIsFocus3(false);
              }}
            />
          </KeyboardAwareScrollView>

          <Button
            onPress={() => {
              GetReportDispatchListApi();
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
                          Dispatch No -{" "}
                          <Text caption1 darkColor>
                            {item.ReportDispatchNo}
                          </Text>
                        </Text>

                        <Text darkColor bold>
                          Dispatch Date -{" "}
                          <Text caption1 darkColor>
                            {item.ReportDispatchDate}
                          </Text>
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Pressable
                          onPress={() => {
                            GetReportDispatchPrintByIDApi(
                              item.ReportDispatchIDEncrypt
                            );
                          }}
                        >
                          <Image
                            style={{ width: 20, height: 20, right: 8 }}
                            resizeMode="contain"
                            tintColor={BaseColor.buttonGradient2}
                            source={Images.ic_Print}
                          ></Image>
                        </Pressable>

                        {/* <Pressable
                          onPress={() => {
                            GetReportDispatchPrintLabelApi(
                              item.ReportDispatchIDEncrypt
                            );
                          }}
                        >
                          <Image
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                            tintColor={BaseColor.buttonGradient2}
                            source={Images.ic_PrintLabel}
                          ></Image>
                        </Pressable> */}
                      </View>
                    </View>

                    <Text darkColor bold>
                      Customer Name -{" "}
                      <Text caption1 darkColor>
                        {item.CustomerName}
                      </Text>
                    </Text>
                    <Text darkColor bold>
                      Inward No -{" "}
                      <Text caption1 darkColor>
                        {item.InwardNo}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Delivered To -{" "}
                      <Text caption1 darkColor>
                        {item.ProjectName + " - " + item.ReportingTo}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Delivered By -{" "}
                      <Text caption1 darkColor>
                        {item.DeliveredBy}
                      </Text>
                    </Text>

                    <Text darkColor bold>
                      Courier -{" "}
                      <Text caption1 darkColor>
                        {item.CourierName}
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

export default ReportDispatch;
