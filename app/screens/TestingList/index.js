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
  GetDepartmentDropDownListApiCall,
  GetLabFormDetailDownloadApiCall,
  GetSampleRequestFormDetailDownloadApiCall,
  GetTestingListApiCall,
} from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const TestingList = ({ navigation }) => {
  useEffect(() => {
    GetDepartmentDropDownListApi();
    DDLGetTestMasterByCompanyIDApi();
    toggleSidebar();
  }, []);

  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [InwardNumber, setInwardNumber] = useState("");
  const [TcNo, setTcNo] = useState("");
  const [ULRNO, setULRNO] = useState("");
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

  useEffect(() => {
    GetTestingListApi();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [TestingListData, setTestingListData] = useState([]);
  const [DataFound, setDataFound] = useState(0);

  const GetTestingListApi = async () => {
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
      TestingStatus: Status,
      TPIRequired: TPIRequired,
      DepartmentIDEncrypted: Department,
      TestMasterIDEncrypted: Test,
      FromDate: InwardFromDate,
      ToDate: InwardToDate,
      EmployeeIDEncrypted: LoginDetails.ReferenceIDEncrypt,
    };
    console.log("GetTestingListDataApi Params =====>>>>>>>>>>", params);
    GetTestingListApiCall(params)
      .then((res) => {
        console.log(
          "GetTestingListDataApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setTestingListData(res?.List);
          setDataFound(res?.List == "" ? 2 : 1);
          toggleSidebar();
          setLoading(false);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setDataFound(res?.List == "" ? 2 : 1);
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

  const [DepartmentData, setDepartmentData] = useState([]);
  const [Department, setDepartment] = useState("");
  const [isFocus4, setIsFocus4] = useState(false);

  const GetDepartmentDropDownListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
    };
    console.log("GetDepartmentDropDownListApi Params =====>>>>>>>>>>", params);
    GetDepartmentDropDownListApiCall(params)
      .then((res) => {
        console.log(
          "GetDepartmentDropDownListApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          // setLoading(false);
          setDepartmentData(res?.List);
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

  const GetSampleRequestFormDetailDownloadApi = async (InwardIDEncrypted) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      InwardIDEncrypted: InwardIDEncrypted,
      PrintedByEncrypted: LoginDetails.ReferenceIDEncrypt,
    };
    console.log(
      "GetSampleRequestFormDetailDownloadApi Params =====>>>>>>>>>>",
      params
    );
    GetSampleRequestFormDetailDownloadApiCall(params)
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

  const GetLabFormDetailDownloadApi = async (InwardIDEncrypted) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      InwardIDEncrypted: InwardIDEncrypted,
      PrintedByEncrypted: LoginDetails.ReferenceIDEncrypt,
    };
    console.log(
      "GetSampleRequestFormDetailDownloadApi Params =====>>>>>>>>>>",
      params
    );
    GetLabFormDetailDownloadApiCall(params)
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

  const downloadFile = (FilePath) => {
    Linking.openURL(FilePath)
      .then(() => {
        console.log(`File ${FilePath} downloaded`);
      })
      .catch((error) => {
        console.error(`Failed to download file ${FilePath}: ${error}`);
      });
  };

  const [isFocus2, setIsFocus2] = useState(false);
  const [TPIRequired, setTPIRequired] = useState(-1);
  const TPIRequiredData = [
    { label: "All", value: -1 },
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const [isFocus3, setIsFocus3] = useState(false);
  const [Status, setStatus] = useState("1,2,3");
  const [selectedStatusList, setSelectedStatusList] = useState([1, 2, 3]);
  const TestingStatusData = [
    { label: "Pending", value: 1 },
    { label: "Draft Save", value: 2 },
    { label: "Unapproved", value: 3 },
    { label: "Approved", value: 4 },
    { label: "Rewise & Rectify", value: 5 },
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
        title={"Testing"}
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
              Filter - Testing
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
              Test Status
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
              data={TestingStatusData}
              maxHeight={500}
              labelField="label"
              valueField="value"
              placeholder={!isFocus3 ? "Select Status" : "..."}
              search
              searchPlaceholder={"Search"}
              value={selectedStatusList}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              selectedStyle={styles.selectedStyle}
              onChange={(item) => {
                setSelectedStatusList(item);
                console.log("====================================");
                console.log(item);
                console.log("====================================");
                const selectedIds = item.join(",");
                setStatus(selectedIds);
                console.log("===============selectedIds=====================");
                console.log(selectedIds);
                console.log("====================================");
                setIsFocus3(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              TPI Required
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
              data={TPIRequiredData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus2 ? "Select Scan Copy" : "..."}
              //   search
              //   searchPlaceholder={"Search"}
              value={TPIRequired}
              onFocus={() => setIsFocus2(true)}
              onBlur={() => setIsFocus2(false)}
              onChange={(item) => {
                setTPIRequired(item.value);
                setIsFocus2(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Department"}
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
                <DropdownSelected
                  item={item?.DepartmentName}
                  selected={selected}
                />
              )}
              data={DepartmentData}
              maxHeight={300}
              labelField="DepartmentName"
              valueField="DepartmentIDEncrypted"
              placeholder={!isFocus4 ? "Select Department" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Department}
              onFocus={() => setIsFocus4(true)}
              onBlur={() => setIsFocus4(false)}
              onChange={(item) => {
                setDepartment(item.DepartmentIDEncrypted);
                ProductGroupDropDownListByDepartmentIDApi(
                  item.DepartmentIDEncrypted
                );
                setIsFocus4(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Test"}
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus7 && {}]}
              placeholderStyle={[
                styles.placeholderStyle,
                { color: BaseColor.borderColor },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: "#000000" },
              ]}
              renderItem={(item, selected) => (
                <DropdownSelected item={item?.TestName} selected={selected} />
              )}
              data={TestData}
              maxHeight={300}
              labelField="TestName"
              valueField="TestMasterIDEncrypted"
              placeholder={!isFocus7 ? "Select Test" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Test}
              onFocus={() => setIsFocus7(true)}
              onBlur={() => setIsFocus7(false)}
              onChange={(item) => {
                setTest(item.TestMasterIDEncrypted);
                setIsFocus7(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Testing Date
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
              GetTestingListApi();
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
            {TestingListData?.map((item, index) => (
              <Pressable
                onPress={() => {
                  navigation.navigate("InwardApproval", {
                    InwardIDEncrypted: item.InwardIDEncrypted,
                    ViewType: "ViewOnly",
                  });
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
                        {item.TCNo}
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
                        {/* {item.InwardCurrentStatus == 1 ? (
                          <Text darkColor bold>
                            Draft Saved
                          </Text>
                        ) : ( */}
                          <Text darkColor bold>
                            {item.InwardNo}
                          </Text>
                        {/* )} */}
                      </View>
                    </View>

                    <Text darkColor bold>
                    Sample Detail -{" "}
                      <Text caption1 darkColor>
                        {item.SampleDetail}
                      </Text>
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                    <Text darkColor bold>
                      TPI Required -{" "}
                      <Text caption1 darkColor>
                        {item.IsTPIRequired == 'false' ? 'No' : 'Yes'}
                      </Text>
                    </Text>
                    <Text darkColor bold>
                      EDD -{" "}
                      <Text caption1 darkColor>
                        {item.EDD}
                      </Text>
                    </Text>
                    </View>
                  </View>
                  <View style={{}}>
                    {/* {TA == 1 && item.TestingActionStatus > 1 && ( */}
                      <Pressable
                        onPress={() => {
                          navigation.navigate("TestingApproval", {
                            InwardMaterialIDEncrypted:
                              item.InwardMaterialIDEncrypted,
                          });
                        }}
                        style={{
                          borderWidth: 1,
                          borderColor:
                            item.TestingActionStatus === 1
                              ? BaseColor.green // BaseColor.red
                              : item.TestingActionStatus === 2
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
                              item.TestingActionStatus === 1
                                ? BaseColor.green //BaseColor.red
                                : item.TestingActionStatus === 2
                                ? BaseColor.green
                                : BaseColor.green, // BaseColor.orange
                          }}
                        >
                          T
                        </Text>
                      </Pressable>
                    {/* )} */}
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

export default TestingList;
