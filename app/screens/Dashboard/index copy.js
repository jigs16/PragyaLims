import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  StyleSheet,
  Pressable,
  FlatList,
  Animated,
} from "react-native";
import styles from "./styles";
import { BaseColor, Images } from "../../config";
import LinearGradient from "react-native-linear-gradient";
import { Button, Image, Loader, Text, TextInput } from "../../components";
import { BarChart, LineChart } from "react-native-chart-kit";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PieChart } from "react-native-gifted-charts";
import {
  GetActivityLogDataApiCall,
  GetTodaysSummaryDataApiCall,
  GetTopCustomersDataApiCall,
  GetTopDepartmentDataApiCall,
  GetTopMachinesDataApiCall,
  GetTopTestDataApiCall,
} from "../../redux/services/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertModal from "../../components/AlertModal";
import { moderateScale } from "../../config/scaling";
import Toast from "react-native-simple-toast";

const Dashboard = ({ navigation }) => {
  useEffect(() => {}, []);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [Photo, setPhoto] = useState(null);
  const [DesignationName, setDesignationName] = useState("");
  const [TodaysInwardCount, setTodaysInwardCount] = useState(0);
  const [TodaysTestingCount, setTodaysTestingCount] = useState(0);
  const [
    TodaysInwardApprovalPendingCount,
    setTodaysInwardApprovalPendingCount,
  ] = useState(0);
  const [
    TodaysTestingApprovalPendingCount,
    setTodaysTestingApprovalPendingCount,
  ] = useState(0);

  useEffect(() => {
    GetTodaysSummaryDataApi();
    GetTopCustomersDataApi();
    GetTopDepartmentDataApi();
    GetTopTestDataApi();
    GetTopMachinesDataApi();
    GetActivityLogDataApi();
  }, []);

  const getColor = (index) => {
    const predefinedColors = [
      "#5470c6",
      "#91cc75",
      "#f9c858",
      "#ee6665",
      "#73c0de",
      "#3ba272",
      "#f68452",
      "#9a60b4",
      "#ea7ccc",
      "#b0b0eb",
      "#fac79a",
      "#f7999c",
      "#5dbca4",
      "#b668e3",
      "#009efa",
      "#fce992",
      "#9ad6d4",
    ];
    if (index < predefinedColors.length) {
      return predefinedColors[index];
    } else {
      return getRandomColor();
    }
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const GetTodaysSummaryDataApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    console.log("LoginDetails ===>>> ", LoginDetails);
    setFirstName(LoginDetails?.Name);
    setDesignationName(LoginDetails?.DesignationName);
    setPhoto(LoginDetails?.Photo);
    setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
    };
    console.log("Params =====>>>>>>>>>>", params);
    GetTodaysSummaryDataApiCall(params)
      .then((res) => {
        console.log("res ---->>>>>> ", JSON.stringify(res));
        if (res.IsSuccess) {
          // setLoading(false);
          setTodaysInwardCount(res?.TodaysInwardCount);
          setTodaysTestingCount(res?.TodaysTestingCount);
          setTodaysInwardApprovalPendingCount(
            res?.TodaysInwardApprovalPendingCount
          );
          setTodaysTestingApprovalPendingCount(
            res?.TodaysTestingApprovalPendingCount
          );
          const newData = res.TestingMonthWiseData.map(
            (item) => item?.TestingCount
          );
          setChartData((prevChartData) => ({
            ...prevChartData,
            datasets: [{ data: newData }],
          }));
        } else {
          setLoading(false);
          // setMsgModal(res.Message);
          // setAlertModal(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(error.Message, Toast.LONG);
      });
  };

  // ---------------------Testing Start---------------------

  const chartConfig = {
    backgroundColor: BaseColor.Card,
    backgroundGradientFrom: BaseColor.Card,
    backgroundGradientTo: BaseColor.Card,
    decimalPlaces: 0,
    yAxisLabel: (index) => (index === 0 ? "" : "0.00"),
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 0,
    },
    barPercentage: 0.6, // Adjust the bar width
    categoryPercentage: 0, // Adjust the label width
  };

  const graphStyle = StyleSheet.create({
    marginVertical: 8,
    margin: 0,
    left: -26,
  });

  const [chartData, setChartData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
  });

  // ---------------------Testing End---------------------

  // ---------------------Top Customer Chart start---------------------

  const [TopCustomersDataNull, setTopCustomersDataNull] = useState(false);
  const [GetTopCustomersData, setGetTopCustomersData] = useState([]);
  const [TopCustomerCurrentPeriodType, setTopCustomerCurrentPeriodType] =
    useState("Current Year");

  const GetTopCustomersDataApi = async (TopCustomerCurrentPeriodType1) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      PeriodType:
        TopCustomerCurrentPeriodType1 == "Current Year"
          ? 1
          : TopCustomerCurrentPeriodType1 == "Current Month"
          ? 2
          : TopCustomerCurrentPeriodType1 == "Previous Month"
          ? 3
          : 1,
    };
    console.log("GetTopCustomersDataApi Params =====>>>>>>>>>>", params);
    GetTopCustomersDataApiCall(params)
      .then((res) => {
        console.log("res ---->>>>>> ", JSON.stringify(res));
        if (res.IsSuccess) {
          // setLoading(false);
          setTopCustomersDataNull(false);
          setGetTopCustomersData(res.List);
          console.log("res List---->>>>>> ", res.List);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          // Toast.show(res.Message, Toast.LONG);
          setGetTopCustomersData([
            {
              CustomerName: "",
              SrNo: 1,
              TestingCount: 1,
            },
          ]);
          setTopCustomersDataNull(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(error.Message, Toast.LONG);
      });
  };

  const CustomerRenderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const CustomerRenderLegendComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 10,
          flex: 1,
        }}
      >
        {GetTopCustomersData?.map(
          (item, index) =>
            !TopCustomersDataNull && (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: 220,
                  marginRight: 20,
                  marginBottom: 6,
                }}
              >
                {CustomerRenderDot(getColor(index))}
                <Text caption1 darkColor style={{ flex: 1 }}>
                  {item?.CustomerName +
                    "\n" +
                    item?.TestingCount +
                    " Testing Count"}
                </Text>
              </View>
            )
        )}
      </View>
    );
  };

  const CustomerPieData = GetTopCustomersData.map((item, index) => ({
    value: item?.TestingCount,
    color: getColor(index),
    gradientCenterColor: getColor(index),
  }));

  // ---------------------Top Customer Chart start End---------------------

  // ---------------------Top Tests Chart start---------------------

  const [TopTestDataNull, setTopTestDataNull] = useState(false);
  const [GetTopTestData, setGetTopTestData] = useState([]);
  const [TopTestCurrentPeriodType, setTopTestCurrentPeriodType] =
    useState("Current Year");

  const GetTopTestDataApi = async (TopTestCurrentPeriodType1) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      PeriodType:
        TopTestCurrentPeriodType1 == "Current Year"
          ? 1
          : TopTestCurrentPeriodType1 == "Current Month"
          ? 2
          : TopTestCurrentPeriodType1 == "Previous Month"
          ? 3
          : 1,
    };
    console.log("GetTopTestDataApi Params =====>>>>>>>>>>", params);
    GetTopTestDataApiCall(params)
      .then((res) => {
        console.log("GetTopTestDataApi res ---->>>>>> ", JSON.stringify(res));
        if (res.IsSuccess) {
          // setLoading(false);
          setTopTestDataNull(false);
          setGetTopTestData(res.List);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          // Toast.show(res.Message, Toast.LONG);
          setGetTopTestData([
            {
              SrNo: 1,
              TestName: "",
              TestingCount: 1,
            },
          ]);
          setTopTestDataNull(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(error.Message, Toast.LONG);
        // setMsgModal(error.message);
        // setAlertModal(true);
      });
  };

  const TestsRenderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const TestsRenderLegendComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 10,
          flex: 1,
        }}
      >
        {/* {GetTopTestData?.map((item, index) => ( */}
        {GetTopTestData?.map(
          (item, index) =>
            !TopTestDataNull && (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: 220,
                  marginRight: 20,
                  marginBottom: 6,
                }}
              >
                {TestsRenderDot(getColor(index))}
                <Text caption1 darkColor style={{ flex: 1 }}>
                  {item?.TestName + "\n" + item?.TestingCount + " Testing Count"}
                </Text>
              </View>
            )
        )}
      </View>
    );
  };

  const TestsPieData = GetTopTestData.map((item, index) => ({
    value: item?.TestingCount,
    color: getColor(index),
    gradientCenterColor: getColor(index),
  }));

  // ---------------------Top Tests Chart start End---------------------

  // ---------------------Top Department Chart start---------------------

  const [TopDepartmentDataNull, setTopDepartmentDataNull] = useState(false);
  const [GetTopDepartmentData, setGetTopDepartmentData] = useState([]);
  const [TopDepartmentCurrentPeriodType, setTopDepartmentCurrentPeriodType] =
    useState("Current Year");

  const GetTopDepartmentDataApi = async (TopDepartmentCurrentPeriodType1) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      PeriodType:
        TopDepartmentCurrentPeriodType1 == "Current Year"
          ? 1
          : TopDepartmentCurrentPeriodType1 == "Current Month"
          ? 2
          : TopDepartmentCurrentPeriodType1 == "Previous Month"
          ? 3
          : 1,
    };
    console.log("GetTopDepartmentDataApi Params =====>>>>>>>>>>", params);
    GetTopDepartmentDataApiCall(params)
      .then((res) => {
        console.log("res ---->>>>>> ", JSON.stringify(res));
        if (res.IsSuccess) {
          // setLoading(false);
          setTopDepartmentDataNull(false);
          setGetTopDepartmentData(res.List);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          // Toast.show(res.Message, Toast.LONG);
          setGetTopDepartmentData([
            {
              SrNo: 1,
              DepartmentName: "",
              TestingCount: 1,
            },
          ]);
          setTopDepartmentDataNull(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(error.Message, Toast.LONG);
        // setMsgModal(error.message);
        // setAlertModal(true);
      });
  };

  const DepartmentRenderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const DepartmentRenderLegendComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 8,
          flex: 1,
        }}
      >
        {GetTopDepartmentData?.map(
          (item, index) =>
            !TopDepartmentDataNull && (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: 220,
                  marginRight: 20,
                  marginBottom: 6,
                }}
              >
                {DepartmentRenderDot(getColor(index))}
                <Text caption1 darkColor style={{ flex: 1 }}>
                  {item?.DepartmentName +
                    "\n" +
                    item?.TestingCount +
                    " Testing Count"}
                </Text>
              </View>
            )
        )}
      </View>
    );
  };

  const DepartmentPieData = GetTopDepartmentData.map((item, index) => ({
    value: item?.TestingCount,
    color: getColor(index),
    gradientCenterColor: getColor(index),
  }));

  // ---------------------Top Department Chart End---------------------

  // ---------------------Top Machine Chart start---------------------

  const [TopMachinesDataNull, setTopMachinesDataNull] = useState(false);
  const [GetTopMachinesData, setGetTopMachinesData] = useState([]);
  const [TopMachinesCurrentPeriodType, setTopMachinesCurrentPeriodType] =
    useState("Current Year");

  const GetTopMachinesDataApi = async (TopMachinesCurrentPeriodType1) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      PeriodType:
        TopMachinesCurrentPeriodType1 == "Current Year"
          ? 1
          : TopMachinesCurrentPeriodType1 == "Current Month"
          ? 2
          : TopMachinesCurrentPeriodType1 == "Previous Month"
          ? 3
          : 1,
    };
    console.log("GetTopMachinesDataApi Params =====>>>>>>>>>>", params);
    GetTopMachinesDataApiCall(params)
      .then((res) => {
        console.log(
          "GetTopMachinesDataApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          // setLoading(false);
          setTopMachinesDataNull(false);
          setGetTopMachinesData(res.List);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          // Toast.show(res.Message, Toast.LONG);
          setGetTopMachinesData([
            {
              SrNo: 1,
              DepartmentName: "",
              TestingCount: 1,
            },
          ]);
          setTopMachinesDataNull(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(error.Message, Toast.LONG);
      });
  };

  const MachineRenderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const MachineRenderLegendComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 2,
          flex: 1,
        }}
      >
        {GetTopMachinesData?.map(
          (item, index) =>
            !TopMachinesDataNull && (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: 220,
                  marginRight: 20,
                  marginBottom: 6,
                }}
              >
                {MachineRenderDot(getColor(index))}
                <Text caption1 darkColor style={{ flex: 1 }}>
                  {item?.MachineName +
                    "\n" +
                    item?.TestingCount +
                    " Testing Count"}
                </Text>
              </View>
            )
        )}
      </View>
    );
  };

  const MachinePieData = GetTopMachinesData.map((item, index) => ({
    value: item?.TestingCount,
    color: getColor(index),
    gradientCenterColor: getColor(index),
    focused: true,
  }));

  // ---------------------Top Machine Chart start End---------------------

  // ---------------------Inward / Dispatch Chart start---------------------

  const data1 = {
    labels: [
      " 01/03 ",
      " 02/03 ",
      " 03/03 ",
      " 04/03 ",
      " 05/03 ",
      " 06/03 ",
      " 07/03 ",
      " 08/03 ",
      " 09/03 ",
    ],
    datasets: [
      {
        data: [0, 3, 7, 5, 2, 6, 7, 9, 5],
        color: (opacity = 1) => `rgba(71, 121, 227, ${opacity})`, // income
        strokeWidth: 2, // optional
      },
      {
        data: [1, 4, 3, 4, 7, 3, 5, 4, 5],
        color: (opacity = 1) => `rgba(224,102,102, ${opacity})`, // savings
        strokeWidth: 2, // optional
      },
    ],
  };

  const chartConfig1 = {
    backgroundColor: BaseColor.Card,
    backgroundGradientFrom: BaseColor.Card,
    backgroundGradientTo: BaseColor.Card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  // ---------------------Inward / Dispatch Chart End---------------------

  // ---------------------Activity Log Sidebar Start---------------------

  const [ActivityLogData, setActivityLogData] = useState([]);
  const [search, setSearch] = useState("");
  const [Page, setPage] = useState(1);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const GetActivityLogDataApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      EmployeeIDEncrypted: LoginDetails.ReferenceIDEncrypt,
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      SearchText: "",
    };
    console.log("GetActivityLogDataApi Params =====>>>>>>>>>>", params);
    GetActivityLogDataApiCall(params)
      .then((res) => {
        console.log(
          "GetActivityLogDataApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setActivityLogData(res.List);
          setLoading(false);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
          // Toast.show(res.Message, Toast.LONG);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(error.Message, Toast.LONG);
      });
  };

  const ActivityLogListData = search
    ? ActivityLogData.filter(
        (x) =>
          x.Header?.toLowerCase().includes(search?.toLowerCase()) ||
          x.Line1?.toLowerCase().includes(search?.toLowerCase()) ||
          x.Line2?.toLowerCase().includes(search?.toLowerCase()) ||
          x.ActivityLogDate?.toLowerCase().includes(search?.toLowerCase())
      )
    : ActivityLogData;

  const RenderItemActivityLog = ({ item, index }) => (
    <>
      <View
        style={{
          backgroundColor: BaseColor.Card,
          padding: 10,
          marginBottom: 10,
          borderRadius: 10,
          flexDirection: "row",
        }}
      >
        <Image
          source={{ uri: item?.EmployeePhoto }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            marginRight: 10,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text body2 bold buttonGradient1>
            {item?.Header}
          </Text>
          <Text caption1 style={{ marginTop: 5, color: "#000" }}>
            {item?.Line1}
          </Text>
          <Text caption1 darkColor>
            {item?.Line2}
          </Text>
          <Text caption1 grayColor>
            {item?.ActivityLogDate}
          </Text>
        </View>
      </View>
    </>
  );

  // ---------------------Activity Log Sidebar End---------------------

  const TextWithEllipsis = ({ text }) => {
    return (
      <Text darkColor caption2>
        {text.length > 18 ? text.substring(0, 18) + "" : text}
      </Text>
    );
  };

  return (
    <>
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
              Activity Log
            </Text>
          </View>
          <TextInput
            style={{
              marginTop: moderateScale(5),
              borderColor: BaseColor.darkGraycolor,
              color: BaseColor.darkGraycolor,
              height: moderateScale(62),
            }}
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholderTextColor={BaseColor.grayColor}
            inputStyle={{ color: BaseColor.blackColor }}
            iconLeft={Images.ic_search}
            placeholder={"Search"}
          />
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            style={{
              marginBottom: moderateScale(80),
              marginTop: moderateScale(20),
            }}
          >
            <>
              <FlatList
                onEndReachedThreshold={0.1}
                onEndReached={() => setPage(Page + 1)}
                data={ActivityLogListData}
                renderItem={RenderItemActivityLog}
              />
            </>
          </KeyboardAwareScrollView>
        </Animated.View>
      )}

      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>
      <View style={[styles.contain]}>
        <Image
          resizeMode="contain"
          style={{ width: 130 }}
          source={Images.PLLOGO}
        ></Image>
        <Pressable
          onPress={() => {
            navigation.navigate("ProfileNavigator");
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
            // width: "44%",
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 36,
              height: 36,
              borderRadius: 50,
              right: 6,
            }}
            source={Photo != "" ? { uri: Photo } : Images.ic_avtar}
          ></Image>

          <View>
            <Text darkColor bold style={{}}>
              {FirstName}
            </Text>
            <TextWithEllipsis text={DesignationName} />
          </View>
        </Pressable>
      </View>
      <LinearGradient
        colors={[BaseColor.bg, BaseColor.bg]}
        locations={[0, 1]}
        style={styles.mainContainer}
      >
        <StatusBar hidden />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              bold
              callout
              style={{
                marginBottom: 14,
                marginTop: 8,
                flex: 1,
                color: BaseColor.buttonGradient2,
              }}
            >
              {"Dashboard"}
            </Text>
            <Pressable onPress={toggleSidebar}>
              <Image source={Images.activityLog1} style={styles.cardImage} />
            </Pressable>
          </View>
          <View style={styles.container}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <View style={styles.Card}>
                <View style={styles.itemView}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={Images.Page}
                      tintColor={"#f79f04"}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      darkColor
                      textAlign={"center"}
                      caption2
                      bold
                      style={{ fontSize: 13 }}
                    >
                      Today's Inward
                    </Text>
                    <Text
                      textAlign={"center"}
                      darkColor
                      subhead
                      bold
                      style={{
                        fontSize: 15,
                        marginTop: 3,
                        color: BaseColor.buttonGradient2,
                      }}
                    >
                      {TodaysInwardCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, paddingLeft: 5 }}>
              <View style={styles.Card}>
                <View style={styles.itemView}>
                  <View
                    style={[
                      styles.imageContainer,
                      { backgroundColor: "#daf5e6" },
                    ]}
                  >
                    <Image
                      source={Images.TTR}
                      tintColor={"#43c977"}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      textAlign={"center"}
                      darkColor
                      caption2
                      bold
                      style={{ fontSize: 13 }}
                    >
                      Testing | Reports
                    </Text>
                    <Text
                      darkColor
                      subhead
                      bold
                      textAlign={"center"}
                      style={{
                        fontSize: 15,
                        marginTop: 3,
                        color: BaseColor.buttonGradient2,
                      }}
                    >
                      {TodaysTestingCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <View style={styles.Card}>
                <View style={styles.itemView}>
                  <View
                    style={[
                      styles.imageContainer,
                      { backgroundColor: "#d9d9d9" },
                    ]}
                  >
                    <Image
                      source={Images.IAP}
                      tintColor={BaseColor.mainTransp}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      darkColor
                      caption2
                      bold
                      textAlign={"center"}
                      style={{ fontSize: 13 }}
                    >
                      Inward Approval
                    </Text>
                    <Text
                      darkColor
                      subhead
                      bold
                      textAlign={"center"}
                      style={{
                        fontSize: 15,
                        marginTop: 3,
                        color: BaseColor.buttonGradient2,
                      }}
                    >
                      {TodaysInwardApprovalPendingCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, paddingLeft: 5 }}>
              <View style={styles.Card}>
                <View style={styles.itemView}>
                  <View
                    style={[
                      styles.imageContainer,
                      { backgroundColor: "#f7d4d4" },
                    ]}
                  >
                    <Image
                      source={Images.TAP}
                      tintColor={BaseColor.whiteColor}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      darkColor
                      caption2
                      bold
                      textAlign={"center"}
                      style={{ fontSize: 13 }}
                    >
                      Testing Approval
                    </Text>
                    <Text
                      darkColor
                      subhead
                      textAlign={"center"}
                      bold
                      style={{
                        fontSize: 15,
                        marginTop: 3,
                        color: BaseColor.buttonGradient2,
                      }}
                    >
                      {TodaysTestingApprovalPendingCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Button
              onPress={() => navigation.openDrawer()}
              title="Open Drawer"
            />
          </View> */}

          <View style={styles.container1}>
            <View style={styles.Card}>
              <Text
                darkColor
                caption2
                bold
                style={{ paddingLeft: 12, paddingTop: 12, fontSize: 14 }}
              >
                Testing
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  style={graphStyle}
                  data={chartData}
                  width={470}
                  height={210}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  contentInset={{ left: 30, right: 30 }}
                />
              </ScrollView>
            </View>
          </View>

          <View style={styles.container1}>
            <View style={styles.Card}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  darkColor
                  caption2
                  bold
                  style={{ paddingLeft: 12, fontSize: 14, flex: 1 }}
                >
                  Top Customer
                </Text>
                <View
                  style={{ flexDirection: "row", paddingTop: 12, right: 6 }}
                >
                  <Pressable
                    onPress={() => {
                      setTopCustomerCurrentPeriodType("Current Year");
                      GetTopCustomersDataApi("Current Year");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopCustomerCurrentPeriodType == "Current Year" ? 0 : 1,
                      backgroundColor:
                        TopCustomerCurrentPeriodType == "Current Year"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopCustomerCurrentPeriodType == "Current Year"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      CY
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopCustomerCurrentPeriodType("Current Month");
                      GetTopCustomersDataApi("Current Month");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopCustomerCurrentPeriodType == "Current Month" ? 0 : 1,
                      backgroundColor:
                        TopCustomerCurrentPeriodType == "Current Month"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopCustomerCurrentPeriodType == "Current Month"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      CM
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopCustomerCurrentPeriodType("Previous Month");
                      GetTopCustomersDataApi("Previous Month");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopCustomerCurrentPeriodType == "Previous Month"
                          ? 0
                          : 1,
                      backgroundColor:
                        TopCustomerCurrentPeriodType == "Previous Month"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopCustomerCurrentPeriodType == "Previous Month"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      PM
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View
                style={{
                  marginTop: 6,
                  marginBottom: 5,
                  paddingLeft: 1,
                  paddingBottom: 6,
                  borderRadius: 20,
                  backgroundColor: BaseColor.Card,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <PieChart data={CustomerPieData} sectionAutoFocus radius={60} />
                {CustomerRenderLegendComponent()}
              </View>
            </View>
          </View>

          <View style={styles.container1}>
            <View style={styles.Card}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  darkColor
                  caption2
                  bold
                  style={{ paddingLeft: 12, fontSize: 14, flex: 1 }}
                >
                  Top Department
                </Text>
                <View
                  style={{ flexDirection: "row", paddingTop: 12, right: 6 }}
                >
                  <Pressable
                    onPress={() => {
                      setTopDepartmentCurrentPeriodType("Current Year");
                      GetTopDepartmentDataApi("Current Year");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopDepartmentCurrentPeriodType == "Current Year"
                          ? 0
                          : 1,
                      backgroundColor:
                        TopDepartmentCurrentPeriodType == "Current Year"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopDepartmentCurrentPeriodType == "Current Year"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      CY
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopDepartmentCurrentPeriodType("Current Month");
                      GetTopDepartmentDataApi("Current Month");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopDepartmentCurrentPeriodType == "Current Month"
                          ? 0
                          : 1,
                      backgroundColor:
                        TopDepartmentCurrentPeriodType == "Current Month"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopDepartmentCurrentPeriodType == "Current Month"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      CM
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopDepartmentCurrentPeriodType("Previous Month");
                      GetTopDepartmentDataApi("Previous Month");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopDepartmentCurrentPeriodType == "Previous Month"
                          ? 0
                          : 1,
                      backgroundColor:
                        TopDepartmentCurrentPeriodType == "Previous Month"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopDepartmentCurrentPeriodType == "Previous Month"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      PM
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View
                style={{
                  marginTop: 6,
                  marginBottom: 5,
                  paddingLeft: 5,
                  paddingBottom: 6,
                  borderRadius: 20,
                  backgroundColor: BaseColor.Card,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {DepartmentRenderLegendComponent()}
                <PieChart
                  data={DepartmentPieData}
                  sectionAutoFocus
                  radius={60}
                  donut
                  showGradient
                  innerRadius={30}
                  innerCircleColor={BaseColor.Card}
                />
              </View>
            </View>
          </View>

          <View style={styles.container1}>
            <View style={styles.Card}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  darkColor
                  caption2
                  bold
                  style={{ paddingLeft: 12, fontSize: 14, flex: 1 }}
                >
                  Top Test
                </Text>
                <View
                  style={{ flexDirection: "row", paddingTop: 12, right: 6 }}
                >
                  <Pressable
                    onPress={() => {
                      setTopTestCurrentPeriodType("Current Year");
                      GetTopTestDataApi("Current Year");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopTestCurrentPeriodType == "Current Year" ? 0 : 1,
                      backgroundColor:
                        TopTestCurrentPeriodType == "Current Year"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopTestCurrentPeriodType == "Current Year"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      CY
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopTestCurrentPeriodType("Current Month");
                      GetTopTestDataApi("Current Month");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopTestCurrentPeriodType == "Current Month" ? 0 : 1,
                      backgroundColor:
                        TopTestCurrentPeriodType == "Current Month"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopTestCurrentPeriodType == "Current Month"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      CM
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopTestCurrentPeriodType("Previous Month");
                      GetTopTestDataApi("Previous Month");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopTestCurrentPeriodType == "Previous Month" ? 0 : 1,
                      backgroundColor:
                        TopTestCurrentPeriodType == "Previous Month"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopTestCurrentPeriodType == "Previous Month"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      PM
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View
                style={{
                  marginTop: 6,
                  marginBottom: 5,
                  paddingLeft: 3,
                  paddingBottom: 6,
                  borderRadius: 20,
                  backgroundColor: BaseColor.Card,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <PieChart
                  data={TestsPieData}
                  sectionAutoFocus
                  radius={60}
                  donut
                  showGradient
                  innerRadius={30}
                  innerCircleColor={BaseColor.Card}
                  // centerLabelComponent={() => {
                  //   return (
                  //     <View
                  //       style={{
                  //         justifyContent: "center",
                  //         alignItems: "center",
                  //       }}
                  //     >
                  //       <Text
                  //         style={{
                  //           fontSize: 22,
                  //           color: "#000",
                  //           fontWeight: "bold",
                  //         }}
                  //       >
                  //         10
                  //       </Text>
                  //       <Text style={{ fontSize: 14, color: "#000" }}>
                  //         Band Test
                  //       </Text>
                  //     </View>
                  //   );
                  // }}
                />
                {TestsRenderLegendComponent()}
              </View>
            </View>
          </View>

          <View style={styles.container1}>
            <View style={styles.Card}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  darkColor
                  caption2
                  bold
                  style={{ paddingLeft: 12, fontSize: 14, flex: 1 }}
                >
                  Top Machine
                </Text>
                <View
                  style={{ flexDirection: "row", paddingTop: 12, right: 6 }}
                >
                  <Pressable
                    onPress={() => {
                      setTopMachinesCurrentPeriodType("Current Year");
                      GetTopMachinesDataApi("Current Year");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopMachinesCurrentPeriodType == "Current Year" ? 0 : 1,
                      backgroundColor:
                        TopMachinesCurrentPeriodType == "Current Year"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopMachinesCurrentPeriodType == "Current Year"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      CY
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopMachinesCurrentPeriodType("Current Month");
                      GetTopMachinesDataApi("Current Month");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopMachinesCurrentPeriodType == "Current Month" ? 0 : 1,
                      backgroundColor:
                        TopMachinesCurrentPeriodType == "Current Month"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopMachinesCurrentPeriodType == "Current Month"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      CM
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopMachinesCurrentPeriodType("Previous Month");
                      GetTopMachinesDataApi("Previous Month");
                    }}
                    style={{
                      height: 30,
                      width: 45,
                      marginRight: 5,
                      borderRadius: 5,
                      borderWidth:
                        TopMachinesCurrentPeriodType == "Previous Month"
                          ? 0
                          : 1,
                      backgroundColor:
                        TopMachinesCurrentPeriodType == "Previous Month"
                          ? BaseColor.buttonGradient2
                          : BaseColor.Card,
                      borderColor: BaseColor.buttonGradient2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      darkColor
                      bold
                      style={{
                        color:
                          TopMachinesCurrentPeriodType == "Previous Month"
                            ? BaseColor.whiteColor
                            : BaseColor.blackColor,
                      }}
                    >
                      PM
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View
                style={{
                  marginTop: 6,
                  marginBottom: 5,
                  paddingLeft: 10,
                  paddingRight: 8,
                  paddingBottom: 10,
                  borderRadius: 20,
                  backgroundColor: BaseColor.Card,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {MachineRenderLegendComponent()}
                <PieChart
                  data={MachinePieData}
                  sectionAutoFocus
                  radius={60}
                  donut
                  showGradient
                  innerRadius={30}
                />
              </View>
            </View>
          </View>

          <View style={styles.container1}>
            <View style={styles.Card}>
              <Text
                darkColor
                caption2
                bold
                style={{
                  paddingLeft: 12,
                  paddingTop: 12,
                  paddingBottom: 15,
                  fontSize: 14,
                }}
              >
                Inward / Dispatch
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 15 }}
              >
                <LineChart
                  data={data1}
                  style={graphStyle}
                  width={"600"}
                  height={220}
                  chartConfig={chartConfig1}
                  bezier={true}
                  withShadow
                />
              </ScrollView>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </>
  );
};

export default Dashboard;
