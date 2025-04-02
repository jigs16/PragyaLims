import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  Pressable,
} from "react-native";
import styles from "./styles";
import { BaseColor, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import {
  Button,
  Header,
  Image,
  Loader,
  Text,
  TextInput,
} from "../../components";
import { moderateScale, verticalScale } from "../../config/scaling";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";
import DropdownSelected from "../../components/DropdownSelected/DropdownSelected";
import {
  GetCustomerDDLListAJAXApiCall,
  GetCustomerProjectDDLListApiCall,
  GetDepartmentDropDownListApiCall,
  GetProcessStatusReportExportApiCall,
  GetReportDispatchMaterialExportApiCall,
  GetReportDispatchReportExportApiCall,
  GetReportPendingTestingExportApiCall,
  InwardRegisterReportExportApiCall,
} from "../../redux/services/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertModal from "../../components/AlertModal";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";
import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-simple-toast";
import moment from "moment";

const MISDetails = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");

  const [TCNo, setTCNo] = useState("");
  const [InwardNo, setInwardNo] = useState("");
  const [LetterRef, setLetterRef] = useState("");
  const [WorkDetail, setWorkDetail] = useState("");
  const [DispatchNo, setDispatchNo] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const requestPermissions = async () => {
    try {
      const readPermission = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      const writePermission = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      );
      console.log("checking or requesting permissions");
      if (readPermission !== RESULTS.GRANTED) {
        await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        console.log("readPermission ===>>>", readPermission);
      }

      if (writePermission !== RESULTS.GRANTED) {
        await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        console.log("writePermission ===>>>", writePermission);
      }
    } catch (error) {
      console.error("Error checking or requesting permissions:", error);
    }
  };

  useEffect(() => {
    requestPermissions();
    GetCustomerDDLListAJAXApi();
    GetCustomerProjectDDLListApi();
    GetDepartmentDropDownListApi();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  useEffect(() => {}, []);

  const checkPermission = async (FilePath) => {
    if (Platform.OS === "ios") {
      actualDownload(FilePath);
    } else {
      downloadFileAndroid(FilePath);
    }
  };

  const actualDownload = async (urlDownloadLink) => {
    //showToast("I am ios")
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == "ios" ? dirs.DocumentDir : dirs.DownloadDir;
    const str = urlDownloadLink;

    const index = str.lastIndexOf(".");
    console.log(index); // 👉️ 4

    const before = str.slice(0, index);
    console.log(before); // 👉️ "3.14"

    const extension = str.slice(index + 1);

    console.log(extension);
    const fileName = before + "." + extension;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: fileName,
      path: `${dirs.DocumentDir}/` + fileName,
      // title: "pdfInfo.pdf",
      // path: `${dirToSave}/${pdfInfo.pdf}`,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: extension,
      },
      android: configfb,
    });

    console.log("The file saved to 23233", configfb, dirs);

    RNFetchBlob.config(configOptions)
      .fetch("GET", urlDownloadLink, {})
      .then((res) => {
        if (Platform.OS === "ios") {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, "base64");
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        //setisdownloaded(false)
        if (Platform.OS == "android") {
          //showSnackbar('File downloaded');
        }
        console.log("The file saved to ", res);
      })
      .catch((e) => {
        console.log("The file saved to ERROR", e.message);
      });
  };

  const downloadFileAndroid = async (urlDownloadLink) => {
    try {
      const readPermission = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      if (readPermission === RESULTS.GRANTED) {
        console.log("Storage permissions already granted");
        actualDownloadAndroid(urlDownloadLink);
      } else {
        console.log("readPermission11 ===>>>", readPermission);
        console.log("Storage permissions not granted, requesting...");
        const readPermissionRequest = request(
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        );
        // const writePermissionRequest = request(
        //   PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        // );
        const [readResult] = await Promise.all([
          readPermissionRequest,
          // writePermissionRequest,
        ]);

        if (readResult === RESULTS.GRANTED) {
          console.log("Storage permissions granted");
          actualDownloadAndroid(urlDownloadLink);
        } else {
          console.log("Storage permissions denied");
          // Display an alert to the user
          Alert.alert(
            "Permission Denied",
            "Please allow access to storage in order to download files.",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        }
      }
    } catch (error) {
      console.error("Error checking or requesting permissions:", error);
    }
  };

  //actualDownloadAndroid(urlDownloadLink);

  const actualDownloadAndroid = (urlDownloadLink) => {
    const { dirs } = RNFetchBlob.fs;

    var str1 = urlDownloadLink;
    var n = str1.lastIndexOf("/");
    var result = str1.substring(n + 1);
    console.log("result name " + result);

    const str = urlDownloadLink;

    const index = str.lastIndexOf(".");
    console.log(index); // 👉️ 4

    const before = str.slice(0, index);
    console.log(before); // 👉️ "3.14"

    const extension = str.slice(index + 1);

    console.log(extension);
    const fileName = before + "." + extension;
    console.log("fileName " + fileName);
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: result,
        path: `${dirs.DownloadDir}/` + result,
      },
    })
      .fetch("GET", urlDownloadLink, {})
      .then((res) => {
        console.log("The file saved to ", res.path());
        Toast.show(
          route.params.screenType + " " + "Report Download Successfully.",
          Toast.LONG
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

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

  const [DepartmentData, setDepartmentData] = useState([]);
  const [Department, setDepartment] = useState("");
  const [isFocus4, setIsFocus4] = useState(false);

  const GetDepartmentDropDownListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoading(true);
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
          setLoading(false);
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

  // -------------------------Inward Register Api Call Start-------------------------

  const InwardRegisterReportExportApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    console.log("LoginDetails ===>>> ", LoginDetails);
    setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      FromDate: FromDate,
      ToDate: ToDate,
      InwardCurrentStatus: "",
      CustomerIDEncrypted: Customer,
      ProjectIDEncrypted: Project,
      TCNo: TCNo,
      CreatedByEncrypted: LoginDetails.ReferenceIDEncrypt,
    };
    console.log("Params =====>>>>>>>>>>", params);
    InwardRegisterReportExportApiCall(params)
      .then((res) => {
        console.log(
          "Response Inward Register Report excel download",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          if (res.FilePath != "") {
            checkPermission(res.FilePath);
          }
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  // -------------------------Inward Register Api Call End-------------------------

  // -------------------------Process Status Api Call Start-------------------------

  const GetProcessStatusReportExportApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    console.log("LoginDetails ===>>> ", LoginDetails);
    setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      FromDate: FromDate,
      ToDate: ToDate,
      CustomerIDEncrypted: Customer,
      ProjectIDEncrypted: Project,
      DepartmentIDEncrypted: Department,
      TCNo: TCNo,
      InwardNo: InwardNo,
      ProjectDetails: WorkDetail,
      LetterRefNo: LetterRef,
      CreatedByEncrypted: LoginDetails.ReferenceIDEncrypt,
    };
    console.log("Params =====>>>>>>>>>>", params);
    GetProcessStatusReportExportApiCall(params)
      .then((res) => {
        console.log(
          "Response Process Status Report excel download",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          if (res.FilePath != "") {
            checkPermission(res.FilePath);
          }
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  // -------------------------Process Status Api Call End-------------------------

  // -------------------------Dispatch Report Api Call Start-------------------------

  const GetReportDispatchReportExportApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    console.log("LoginDetails ===>>> ", LoginDetails);
    setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      CustomerIDEncrypted: Customer,
      FromDate: FromDate,
      ToDate: ToDate,
      TCNo: TCNo,
      DispatchNo: DispatchNo,
      CreatedByEncrypted: LoginDetails.ReferenceIDEncrypt,
    };
    console.log("Params =====>>>>>>>>>>", params);
    GetReportDispatchReportExportApiCall(params)
      .then((res) => {
        console.log(
          "Response Dispatch Report Report excel download",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          if (res.FilePath != "") {
            checkPermission(res.FilePath);
          }
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  // -------------------------Dispatch Report Api Call End-------------------------

  // -------------------------Dispatch Material Api Call Start-------------------------

  const GetReportDispatchMaterialExportApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    console.log("LoginDetails ===>>> ", LoginDetails);
    setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      CustomerIDEncrypted: Customer,
      FromDate: FromDate,
      ToDate: ToDate,
      TCNo: TCNo,
      DispatchNo: DispatchNo,
      CreatedByEncrypted: LoginDetails.ReferenceIDEncrypt,
    };
    console.log("Params =====>>>>>>>>>>", params);
    GetReportDispatchMaterialExportApiCall(params)
      .then((res) => {
        console.log(
          "Response Dispatch Material Report excel download",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          if (res.FilePath != "") {
            checkPermission(res.FilePath);
          }
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  // -------------------------Dispatch Material Api Call End-------------------------

  // -------------------------Pending Testing Api Call Start-------------------------

  const GetReportPendingTestingExportApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    console.log("LoginDetails ===>>> ", LoginDetails);
    setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      CustomerIDEncrypted: Customer,
      FromDate: FromDate,
      ToDate: ToDate,
      TCNo: TCNo,
      InwardNo: InwardNo,
      CreatedByEncrypted: LoginDetails.ReferenceIDEncrypt,
    };
    console.log("Params =====>>>>>>>>>>", params);
    GetReportPendingTestingExportApiCall(params)
      .then((res) => {
        console.log(
          "Response Pending Testing Report excel download",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
          if (res.FilePath != "") {
            checkPermission(res.FilePath);
          }
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          setMsgModal(res.Message);
          setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  // -------------------------Pending Testing Api Call End-------------------------

  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");

  const [isFromDatePickerVisible, setIsFromDatePickerVisible] = useState(false);

  const _showFromDatePickerStart = () => {
    setIsFromDatePickerVisible(true);
  };

  const [StartDate, setStartDate] = useState("");
  const [StartFrom, setStartFrom] = useState(new Date());
  const [StartTo, setStartTo] = useState(new Date());

  const onChangeFromDate = (date) => {
    _hideFromDatePickerStart();
    // console.log("sfsdf", date);
    let temp = moment(date).format("DD-MMM-YYYY");
    // console.log("temp", temp);
    setStartFrom(moment(date).format("YYYY-MM-DD"));
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
    setStartTo(moment(date).format("YYYY-MM-DD"));
    setToDate(temp);
  };

  const _hideToDatePickerStart = () => {
    setIsToDatePickerVisible(false);
  };

  return (
    <>
      <DateTimePickerModal
        isVisible={isFromDatePickerVisible}
        mode="date"
        date={new Date(moment(StartFrom).format())}
        onConfirm={onChangeFromDate}
        onCancel={_hideFromDatePickerStart}
        maximumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={isToDatePickerVisible}
        mode="date"
        date={new Date(moment(StartTo).format())}
        onConfirm={onChangeToDate}
        onCancel={_hideToDatePickerStart}
        minimumDate={new Date(StartFrom)}
        maximumDate={new Date()}
      />

      <Loader loading={loading} />
      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>

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
        title={route.params.screenType}
      />
      <LinearGradient
        colors={[BaseColor.whiteColor, BaseColor.whiteColor]}
        locations={[0, 1]}
        style={styles.mainContainer}
      >
        <StatusBar hidden />
        <ScrollView>
          {route.params.screenType === "Inward Register" && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(5) }}
              >
                {"From Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showFromDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"To Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showToDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"TC No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={TCNo}
                onChangeText={(text) => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your TC No"}
              />

              <Text darkColor bold style={{ marginTop: moderateScale(18) }}>
                {"Customer"}
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { marginTop: moderateScale(12) },
                ]}
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
                  GetCustomerProjectDDLListApi(item?.CustomerIDEncrypted);
                  setIsFocus(false);
                }}
              />

              <Text darkColor bold style={{ marginTop: moderateScale(18) }}>
                {"Project"}
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus1 && { marginTop: moderateScale(12) },
                ]}
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
                  setProject(item?.CustomerProjectIDEncrypt);
                  setIsFocus1(false);
                }}
              />

              <Button
                icon
                onPress={() => {
                  InwardRegisterReportExportApi();
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}
              >
                {"Download"}
              </Button>
            </View>
          )}

          {route.params.screenType === "Process Status" && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(5) }}
              >
                {"From Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showFromDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"To Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showToDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text darkColor bold style={{ marginTop: moderateScale(18) }}>
                {"Customer"}
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { marginTop: moderateScale(12) },
                ]}
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
                  GetCustomerProjectDDLListApi(item?.CustomerIDEncrypted);
                  setIsFocus(false);
                }}
              />

              <Text darkColor bold style={{ marginTop: moderateScale(18) }}>
                {"Project"}
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus1 && { marginTop: moderateScale(12) },
                ]}
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
                  setProject(item?.CustomerProjectIDEncrypt);
                  setIsFocus1(false);
                }}
              />

              <Text darkColor bold style={{ marginTop: moderateScale(18) }}>
                {"Department"}
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus4 && { marginTop: moderateScale(12) },
                ]}
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
                  setDepartment(item?.DepartmentIDEncrypted);
                  setIsFocus4(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"TC No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={TCNo}
                onChangeText={(text) => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your TC No"}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"Inward No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={InwardNo}
                onChangeText={(text) => setInwardNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your inward no"}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"Letter Ref No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={LetterRef}
                onChangeText={(text) => setLetterRef(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your letter ref no"}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"Work Detail"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={WorkDetail}
                onChangeText={(text) => setWorkDetail(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your Work Detail"}
              />

              <Button
                icon
                onPress={() => {
                  GetProcessStatusReportExportApi();
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}
              >
                {"Download"}
              </Button>
            </View>
          )}

          {route.params.screenType === "Dispatch Report" && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(5) }}
              >
                {"From Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showFromDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"To Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showToDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text darkColor bold style={{ marginTop: moderateScale(18) }}>
                {"Customer"}
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { marginTop: moderateScale(12) },
                ]}
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
                  // GetCustomerProjectDDLListApi(item?.CustomerIDEncrypted);
                  setIsFocus(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"TC No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={TCNo}
                onChangeText={(text) => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your TC No"}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"Dispatch No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={DispatchNo}
                onChangeText={(text) => setDispatchNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your dispatch no"}
              />

              <Button
                icon
                onPress={() => {
                  GetReportDispatchReportExportApi();
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}
              >
                {"Download"}
              </Button>
            </View>
          )}

          {route.params.screenType === "Dispatch Material" && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(5) }}
              >
                {"From Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showFromDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"To Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showToDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text darkColor bold style={{ marginTop: moderateScale(18) }}>
                {"Customer"}
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { marginTop: moderateScale(12) },
                ]}
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
                  // GetCustomerProjectDDLListApi(item?.CustomerIDEncrypted);
                  setIsFocus(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"TC No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={TCNo}
                onChangeText={(text) => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your TC No"}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"Dispatch No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={DispatchNo}
                onChangeText={(text) => setDispatchNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your dispatch no"}
              />

              <Button
                icon
                onPress={() => {
                  GetReportDispatchMaterialExportApi();
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}
              >
                {"Download"}
              </Button>
            </View>
          )}

          {route.params.screenType === "Pending Testing" && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(5) }}
              >
                {"From Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showFromDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"To Date"}
              </Text>
              <Pressable
                onPress={() => {
                  _showToDatePickerStart();
                }}
                style={[styles.textInput]}
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

              <Text darkColor bold style={{ marginTop: moderateScale(18) }}>
                {"Customer"}
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { marginTop: moderateScale(12) },
                ]}
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
                  // GetCustomerProjectDDLListApi(item?.CustomerIDEncrypted);
                  setIsFocus(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"Inward No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={InwardNo}
                onChangeText={(text) => setInwardNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your inward no"}
              />
              <Text
                subhead
                bold
                darkColor
                style={{ marginTop: moderateScale(18) }}
              >
                {"TC No"}
              </Text>
              <TextInput
                style={{ marginTop: moderateScale(12) }}
                value={TCNo}
                onChangeText={(text) => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={"Enter your TC No"}
              />

              <Button
                icon
                onPress={() => {
                  GetReportPendingTestingExportApi();
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}
              >
                {"Download"}
              </Button>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default MISDetails;
