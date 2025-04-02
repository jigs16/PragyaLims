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
import {
  Button,
  Header,
  Image,
  Loader,
  Text,
  TextInput,
} from "../../components";
import { BarChart, LineChart } from "react-native-chart-kit";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PieChart } from "react-native-gifted-charts";
import {
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
import fonts from "../../config/fonts";

const ChartDetails = ({ navigation, route }) => {
  useEffect(() => {}, []);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
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
    route.params.ViewType == "Testing" && GetTodaysSummaryDataApi();
    route.params.ViewType == "TopCustomer" && GetTopCustomersDataApi();
    route.params.ViewType == "TopTests" && GetTopTestDataApi();
    route.params.ViewType == "TopDepartment" && GetTopDepartmentDataApi();
    route.params.ViewType == "TopMachine" && GetTopMachinesDataApi();
    route.params.ViewType == "InwardDispatch" && "";
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
          setLoading(false);
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
          setTopCustomersDataNull(false);
          setGetTopCustomersData(res.List);
          setLoading(false);
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
          top: 5,
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
          // marginBottom: 10,
          marginTop: 15,
          flex: 1,
        }}
      >
        {GetTopCustomersData?.map(
          (item, index) =>
            !TopCustomersDataNull && (
              <View
                key={index}
                style={{
                  marginRight: 18,
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {CustomerRenderDot(getColor(index))}
                  <Text footnote bold darkColor style={{ fontSize: 14 }}>
                    {item?.CustomerName + "\n"}
                    <Text
                      caption1
                      darkColor
                      style={{ paddingTop: 5, lineHeight: 26, fontSize: 13 }}
                    >
                      {item?.TestingCount + " Testing Count"}
                    </Text>
                  </Text>
                </View>
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
          setLoading(false);
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
          marginTop: 5,
        }}
      />
    );
  };

  const TestsRenderLegendComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          // marginBottom: 10,
          marginTop: 15,
          flex: 1,
        }}
      >
        {GetTopTestData?.map(
          (item, index) =>
            !TopTestDataNull && (
              <View
                key={index}
                style={{
                  // flexDirection: "row",
                  // alignItems: "center",
                  // width: 220,
                  // padding:10,
                  marginRight: 20,
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {TestsRenderDot(getColor(index))}
                  <Text footnote bold darkColor style={{ fontSize: 14 }}>
                    {item?.TestName + "\n"}
                    <Text
                      caption1
                      darkColor
                      style={{ paddingTop: 5, lineHeight: 26 }}
                    >
                      {item?.TestingCount + " Testing Count"}
                    </Text>
                  </Text>
                </View>
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
          setLoading(false);
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
          marginTop: 5,
        }}
      />
    );
  };

  const DepartmentRenderLegendComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          // marginBottom: 10,
          marginTop: 10,
          // marginLeft: 8,
          flex: 1,
        }}
      >
        {GetTopDepartmentData?.map(
          (item, index) =>
            !TopDepartmentDataNull && (
              <View
                key={index}
                style={{
                  marginRight: 18,
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {DepartmentRenderDot(getColor(index))}
                  <Text footnote bold darkColor style={{ fontSize: 14 }}>
                    {item?.DepartmentName + "\n"}
                    <Text
                      caption1
                      darkColor
                      style={{ paddingTop: 5, lineHeight: 26, fontSize: 13 }}
                    >
                      {item?.TestingCount + " Testing Count"}
                    </Text>
                  </Text>
                </View>
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
          setTopMachinesDataNull(false);
          setGetTopMachinesData(res.List);
          setLoading(false);
        } else {
          console.log("Faild  >>>>>>>========");
          setLoading(false);
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
          marginTop:5
        }}
      />
    );
  };

  const MachineRenderLegendComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          marginTop: 15,
          flex: 1,
        }}
      >
        {GetTopMachinesData?.map(
          (item, index) =>
            !TopMachinesDataNull && (
              <View
                key={index}
                style={{
                  marginRight: 20,
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {MachineRenderDot(getColor(index))}
                  <Text footnote bold darkColor style={{ fontSize: 14 }}>
                    {item?.MachineName + "\n"}
                    <Text
                      caption1
                      darkColor
                      style={{ paddingTop: 5, lineHeight: 26 }}
                    >
                      {item?.TestingCount + " Testing Count"}
                    </Text>
                  </Text>
                </View>
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

  const TextWithEllipsis = ({ text }) => {
    return (
      <Text whiteColor caption2>
        {text.length > 18 ? text.substring(0, 18) + "" : text}
      </Text>
    );
  };

  return (
    <>
      <Loader loading={loading} />

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
          route.params.ViewType == "Testing"
            ? "Testing"
            : route.params.ViewType == "TopCustomer"
            ? "Top Customer"
            : route.params.ViewType == "TopDepartment"
            ? "Top Department"
            : route.params.ViewType == "TopTests"
            ? "Top Test"
            : route.params.ViewType == "TopMachine"
            ? "Top Machine"
            : "Inward / Dispatch"
        }
      ></Header>

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>

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
          contentContainerStyle={{paddingTop:10, paddingBottom:10}}
        >
          {route.params.ViewType == "Testing" && (
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
          )}

          {route.params.ViewType == "TopCustomer" && (
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
                          TopCustomerCurrentPeriodType == "Current Year"
                            ? 0
                            : 1,
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
                          TopCustomerCurrentPeriodType == "Current Month"
                            ? 0
                            : 1,
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
                    paddingBottom: 6,
                    borderRadius: 20,
                    backgroundColor: BaseColor.Card,
                    // alignItems: "center",
                  }}
                >
                  <View style={{ alignItems: "center", marginTop: 10 }}>
                    <PieChart
                      data={CustomerPieData}
                      sectionAutoFocus
                      radius={85}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, paddingRight: 15 }}>
                    {CustomerRenderLegendComponent()}
                  </View>
                </View>
              </View>
            </View>
          )}

          {route.params.ViewType == "TopDepartment" && (
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
                    paddingBottom: 6,
                    borderRadius: 20,
                    backgroundColor: BaseColor.Card,
                  }}
                >
                  <View style={{ alignItems: "center", marginTop: 10 }}>
                    <PieChart
                      data={DepartmentPieData}
                      sectionAutoFocus
                      radius={85}
                      donut
                      showGradient
                      innerRadius={30}
                      innerCircleColor={BaseColor.Card}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, paddingRight: 15 }}>
                    {DepartmentRenderLegendComponent()}
                  </View>
                </View>
              </View>
            </View>
          )}

          {route.params.ViewType == "TopTests" && (
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
                    paddingBottom: 6,
                    borderRadius: 20,
                    backgroundColor: BaseColor.Card,
                    // alignItems: "center",
                  }}
                >
                  <View style={{ alignItems: "center", marginTop: 10 }}>
                    <PieChart
                      data={TestsPieData}
                      sectionAutoFocus
                      radius={85}
                      donut
                      showGradient
                      innerRadius={30}
                      innerCircleColor={BaseColor.Card}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, paddingRight: 15 }}>
                    {TestsRenderLegendComponent()}
                  </View>
                </View>
              </View>
            </View>
          )}

          {route.params.ViewType == "TopMachine" && (
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
                          TopMachinesCurrentPeriodType == "Current Year"
                            ? 0
                            : 1,
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
                          TopMachinesCurrentPeriodType == "Current Month"
                            ? 0
                            : 1,
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
                    paddingBottom: 6,
                    borderRadius: 20,
                    backgroundColor: BaseColor.Card,
                    // alignItems: "center",
                  }}
                >
                  <View style={{ alignItems: "center", marginTop: 10 }}>
                    <PieChart
                      data={MachinePieData}
                      sectionAutoFocus
                      radius={85}
                      donut
                      showGradient
                      innerRadius={30}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, paddingRight: 15 }}>
                    {MachineRenderLegendComponent()}
                  </View>
                </View>
              </View>
            </View>
          )}

          {route.params.ViewType == "InwardDispatch" && (
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
          )}

        </KeyboardAwareScrollView>
      </LinearGradient>
    </>
  );
};

export default ChartDetails;
