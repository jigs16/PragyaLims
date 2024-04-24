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
  GetControlCenterDataApiCall,
  GetCustomerDDLListAJAXApiCall,
  GetCustomerProjectDDLListApiCall,
  GetDDLTestMethodsByCompanyIDApiCall,
  GetDepartmentDropDownListApiCall,
  GetMaterialTypeDDLListByDepartment_ProductGroupApiApiCall,
  GetProcessFormListDDLApiCall,
  GetProcessFormStatusListDDLApiCall,
  ProductGroupDropDownListByDepartmentIDApiCall,
} from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const ControlCenter = ({ navigation }) => {
  useEffect(() => {
    setInwardFromDate("");
    setInwardToDate("");
    GetCustomerDDLListAJAXApi();
    GetProcessFormListDDLApi();
    GetDepartmentDropDownListApi();
    DDLGetTestMasterByCompanyIDApi();
    GetDDLTestMethodsByCompanyIDApi();
    toggleSidebar();
  }, []);

  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [InwardNumber, setInwardNumber] = useState("");
  const [WorkDetails, setWorkDetails] = useState("");
  const [LetterRefNumber, setLetterRefNumber] = useState("");
  const [TcNo, setTcNo] = useState("");
  const [SampleDetail, setSampleDetail] = useState("");
  const [ULRNO, setULRNO] = useState("");
  const [Page, setPage] = useState(1);
  const [IA, setIA] = useState(false);
  const [TA, setTA] = useState(false);

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
    GetControlCenterDataApi();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [ControlCenterData, setControlCenterData] = useState([]);

  const GetControlCenterDataApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setIA(LoginDetails?.Permissions?.InwardApprovalRequired);
    setTA(LoginDetails?.Permissions?.TestingApprovalRequired);
    console.log(
      "InwardApprovalRequired ===>>>",
      LoginDetails.InwardApprovalRequired
    );
    setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      BranchIDEncrypted: LoginDetails?.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
      FromDate: InwardFromDate,
      ToDate: InwardToDate,
      InwardNo: InwardNumber,
      TCNo: TcNo,
      ProjectDetails: "",
      LetterRefNo: LetterRefNumber,
      ProcessFormID: Process,
      Status: Status,
      SampleDetail: SampleDetail,
      ULRNo: ULRNO,
      CustomerIDEncrypted: Customer,
      CustomerProjectIDEncrypted: Project,
      DepartmentIDEncrypted: Department,
      ProductGroupIDEncrypted: MaterialGroup,
      MaterialTypeIDEncrypted: MaterialType,
      TestMasterIDEncrypted: Test,
      TestMethodIDEncrypted: TestMethod,
    };
    console.log("GetControlCenterDataApi Params =====>>>>>>>>>>", params);
    GetControlCenterDataApiCall(params)
      .then((res) => {
        console.log(
          "GetControlCenterDataApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setControlCenterData(res?.controlCenterList);
          toggleSidebar();
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

  const [Project, setProject] = useState("");
  const [isFocus1, setIsFocus1] = useState(false);
  const [ProjectData, setProjectData] = useState([]);

  const GetCustomerProjectDDLListApi = async (CustomerIDEncrypted) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      CustomerIDEncrypt: CustomerIDEncrypted,
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
    };
    console.log("GetCustomerProjectDDLListApi Params =====>>>>>>>>>>", params);
    GetCustomerProjectDDLListApiCall(params)
      .then((res) => {
        console.log(
          "GetCustomerProjectDDLListApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setProjectData(res?.CustomerProjectDDLList);
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

  const [ProcessData, setProcessData] = useState([]);
  const [Process, setProcess] = useState(0);
  const [isFocus2, setIsFocus2] = useState(false);

  const GetProcessFormListDDLApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      BranchIDEncrypted: LoginDetails?.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
      LoginIDEncrypted: LoginDetails?.LoginIDEncrypt,
    };
    console.log("GetProcessFormListDDLApi Params =====>>>>>>>>>>", params);
    GetProcessFormListDDLApiCall(params)
      .then((res) => {
        console.log(
          "GetProcessFormListDDLApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          // setLoading(false);
          setProcessData(res?.ListOfProcessForm);
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

  const [Status, setStatus] = useState("");
  const [selectedStatusList, setSelectedStatusList] = useState([]);
  const [StatusData, setStatusData] = useState([]);
  const [isFocus3, setIsFocus3] = useState(false);

  const GetProcessFormStatusListDDLApi = async (ProcessFormID) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      BranchIDEncrypted: LoginDetails?.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
      LoginIDEncrypted: LoginDetails?.LoginIDEncrypt,
      ProcessFormID: ProcessFormID,
    };
    console.log(
      "GetProcessFormStatusListDDLApi Params =====>>>>>>>>>>",
      params
    );
    GetProcessFormStatusListDDLApiCall(params)
      .then((res) => {
        console.log(
          "GetProcessFormStatusListDDLApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setStatusData(res?.ListOfProcessFormStatus);
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

  const [MaterialGroupData, setMaterialGroupData] = useState([]);
  const [MaterialGroup, setMaterialGroup] = useState("");
  const [isFocus5, setIsFocus5] = useState(false);

  const ProductGroupDropDownListByDepartmentIDApi = async (
    DepartmentIDEncrypted
  ) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
      DepartmentIDEncrypt: DepartmentIDEncrypted,
    };
    console.log(
      "ProductGroupDropDownListByDepartmentIDApi Params =====>>>>>>>>>>",
      params
    );
    ProductGroupDropDownListByDepartmentIDApiCall(params)
      .then((res) => {
        console.log(
          "ProductGroupDropDownListByDepartmentIDApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setMaterialGroupData(res?.ProductGroupDropDownList);
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

  const [MaterialTypeData, setMaterialTypeData] = useState([]);
  const [MaterialType, setMaterialType] = useState("");
  const [isFocus6, setIsFocus6] = useState(false);

  const GetMaterialTypeDDLListByDepartment_ProductGroupApi = async (
    ProductGroupIDEncrypt
  ) => {
    setLoading(true);
    var params = {
      ProductGroupIDEncrypted: ProductGroupIDEncrypt,
      DepartmentIDEncrypt: Department,
    };
    console.log(
      "GetMaterialTypeDDLListByDepartment_ProductGroupApi Params =====>>>>>>>>>>",
      params
    );
    GetMaterialTypeDDLListByDepartment_ProductGroupApiApiCall(params)
      .then((res) => {
        console.log(
          "GetMaterialTypeDDLListByDepartment_ProductGroupApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setMaterialTypeData(res?.MaterialTypeList);
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
          // setLoading(false);
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

  const [TestMethodData, setTestMethodData] = useState([]);
  const [TestMethod, setTestMethod] = useState("");
  const [isFocus8, setIsFocus8] = useState(false);

  const GetDDLTestMethodsByCompanyIDApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails?.CompanyIDEncrypt,
    };
    console.log(
      "GetDDLTestMethodsByCompanyIDApi Params =====>>>>>>>>>>",
      params
    );
    GetDDLTestMethodsByCompanyIDApiCall(params)
      .then((res) => {
        console.log(
          "GetDDLTestMethodsByCompanyIDApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          setTestMethodData(res?.TestMethodList);
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

  const [InwardFromDate, setInwardFromDate] = useState("");
  const [InwardToDate, setInwardToDate] = useState("");

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
        title={"Control Center"}
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
              Filter - Control Center
            </Text>
            <Pressable onPress={toggleSidebar}>
              <Image
                source={Images.closed}
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
              marginBottom: moderateScale(65),
              marginTop: moderateScale(20),
            }}
          >
            <Text darkColor bold style={{ marginTop: moderateScale(5) }}>
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
                GetCustomerProjectDDLListApi(item.CustomerIDEncrypted);
                setIsFocus(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Project"}
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus1 && {}]}
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
                  item={item?.ProjectName}
                  selected={selected}
                />
              )}
              data={ProjectData}
              maxHeight={300}
              labelField="ProjectName"
              valueField="CustomerProjectIDEncrypt"
              placeholder={!isFocus1 ? "Select Project" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Project}
              onFocus={() => setIsFocus1(true)}
              onBlur={() => setIsFocus1(false)}
              onChange={(item) => {
                setProject(item.CustomerProjectIDEncrypt);
                setIsFocus1(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Work Details
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={WorkDetails}
              onChangeText={(text) => setWorkDetails(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search Work Details"}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              Letter Ref No
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={LetterRefNumber}
              onChangeText={(text) => setLetterRefNumber(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search Letter Ref No"}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Process"}
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
                <DropdownSelected
                  item={item?.ProcessFormName}
                  selected={selected}
                />
              )}
              data={ProcessData}
              maxHeight={300}
              labelField="ProcessFormName"
              valueField="ProcessFormID"
              placeholder={!isFocus2 ? "Select Process" : "..."}
              search
              searchPlaceholder={"Search"}
              value={Process}
              onFocus={() => setIsFocus2(true)}
              onBlur={() => setIsFocus2(false)}
              onChange={(item) => {
                setProcess(item.ProcessFormID);
                GetProcessFormStatusListDDLApi(item.ProcessFormID);
                setIsFocus2(false);
              }}
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
                <DropdownSelected
                  item={item?.ProcessFormStatusName}
                  selected={selected}
                />
              )}
              data={StatusData}
              maxHeight={500}
              labelField="ProcessFormStatusName"
              valueField="ProcessFormStatusID"
              placeholder={!isFocus3 ? "Select Status" : "..."}
              search
              searchPlaceholder={"Search"}
              value={selectedStatusList}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              selectedStyle={styles.selectedStyle}
              onChange={(item) => {
                setSelectedStatusList(item);
                const selectedIds = item.join(",");
                setStatus(selectedIds);
                setIsFocus3(false);
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
              ULR No
            </Text>
            <TextInput
              style={{
                marginTop: moderateScale(10),
                borderColor: BaseColor.darkGraycolor,
                color: BaseColor.darkGraycolor,
                height: moderateScale(58),
              }}
              value={ULRNO}
              onChangeText={(text) => setULRNO(text)}
              placeholderTextColor={BaseColor.grayColor}
              inputStyle={{ color: BaseColor.blackColor }}
              iconLeft={Images.ic_search}
              placeholder={"Search ULR No"}
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
              {"Material Group"}
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus5 && {}]}
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
                  item={item?.ProductGroupName}
                  selected={selected}
                />
              )}
              data={MaterialGroupData}
              maxHeight={300}
              labelField="ProductGroupName"
              valueField="ProductGroupIDEncrypt"
              placeholder={!isFocus5 ? "Select Material Group" : "..."}
              search
              searchPlaceholder={"Search"}
              value={MaterialGroup}
              onFocus={() => setIsFocus5(true)}
              onBlur={() => setIsFocus5(false)}
              onChange={(item) => {
                setMaterialGroup(item.ProductGroupIDEncrypt);
                GetMaterialTypeDDLListByDepartment_ProductGroupApi(
                  item.ProductGroupIDEncrypt
                );
                setIsFocus5(false);
              }}
            />

            <Text darkColor bold style={{ marginTop: moderateScale(15) }}>
              {"Material Type"}
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus6 && {}]}
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
                  item={item?.MaterialTypeName}
                  selected={selected}
                />
              )}
              data={MaterialTypeData}
              maxHeight={300}
              labelField="MaterialTypeName"
              valueField="MaterialTypeIDEncrypted"
              placeholder={!isFocus6 ? "Select Material Type" : "..."}
              search
              searchPlaceholder={"Search"}
              value={MaterialType}
              onFocus={() => setIsFocus6(true)}
              onBlur={() => setIsFocus6(false)}
              onChange={(item) => {
                setMaterialType(item.MaterialTypeIDEncrypted);
                setIsFocus6(false);
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
              {"Test Method"}
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus8 && {}]}
              placeholderStyle={[
                styles.placeholderStyle,
                { color: BaseColor.borderColor },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: "#000000" },
              ]}
              renderItem={(item, selected) => (
                <DropdownSelected item={item?.TestMethod} selected={selected} />
              )}
              data={TestMethodData}
              maxHeight={300}
              labelField="TestMethod"
              valueField="TestMethodIDEncrypted"
              placeholder={!isFocus8 ? "Select Test Method" : "..."}
              search
              searchPlaceholder={"Search"}
              value={TestMethod}
              onFocus={() => setIsFocus8(true)}
              onBlur={() => setIsFocus8(false)}
              onChange={(item) => {
                setTestMethod(item.TestMethodIDEncrypted);
                setIsFocus8(false);
              }}
            />

            <Button
              onPress={() => {
                GetControlCenterDataApi();
              }}
              style={{ marginVertical: moderateScale(30), height: 44 }}
              full
            >
              {"Filter"}
            </Button>
          </KeyboardAwareScrollView>
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
          <View style={{ flex: 1, marginBottom: 80 }}>
            {ControlCenterData?.map((item, index) => (
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
                            {item.InwardNo}
                          </Text>
                        </Text>
                        <Text darkColor bold>
                          Inward Date -{" "}
                          <Text caption1 darkColor>
                            {item.InwardDate}
                          </Text>
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        {(item.InwardCurrentStatus === 4 ||
                          item.InwardCurrentStatus > 4) &&
                        IA ? (
                          <Pressable
                            onPress={() => {
                              navigation.navigate("InwardApproval", {
                                InwardIDEncrypted: item.InwardIDEncrypted,
                              });
                            }}
                            style={{
                              borderWidth: 1,
                              borderColor:
                                item.InwardCurrentStatus === 4 ||
                                item.InwardCurrentStatus < 4
                                  ? BaseColor.red
                                  : BaseColor.green,
                              width: 35,
                              height: 25,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 6,
                              marginRight: 7,
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  item.InwardCurrentStatus === 4 ||
                                  item.InwardCurrentStatus < 4
                                    ? BaseColor.red
                                    : BaseColor.green,
                              }}
                            >
                              IA
                            </Text>
                          </Pressable>
                        ) : null}

                        <Pressable
                          onPress={() => {
                            navigation.navigate("Testing", {
                              ListOfInwardMaterials: item.ListOfInwardMaterials,
                            });
                          }}
                          style={{
                            borderWidth: 1,
                            borderColor:
                              item.TestingActionStatus === 1
                                ? BaseColor.red
                                : item.TestingActionStatus === 2
                                ? BaseColor.green
                                : BaseColor.orange,
                            width: 35,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 6,
                          }}
                        >
                          <Text style={{ color:  item.TestingActionStatus === 1
                                ? BaseColor.red
                                : item.TestingActionStatus === 2
                                ? BaseColor.green
                                : BaseColor.orange,}}>T</Text>
                        </Pressable>
                      </View>
                    </View>

                    <Text darkColor bold>
                      Customer -{" "}
                      <Text caption1 darkColor>
                        {item.CustomerName}
                      </Text>
                    </Text>
                    <Text darkColor bold>
                      Project -{" "}
                      <Text caption1 darkColor>
                        {item.ProjectName}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default ControlCenter;
