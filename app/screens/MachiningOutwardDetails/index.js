import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  Pressable,
  FlatList,
  ScrollView,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import {
  Icon,
  Image,
  Loader,
  MovieGrid,
  SafeAreaView,
  Text,
  TextInput,
} from "../../components";
import Header from "../../components/Header";
import { BaseColor, Images } from "../../config";
import { moderateScale } from "../../config/scaling";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetMachiningOutwardInwardDetailByIDApiCall } from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";
import fonts from "../../config/fonts";

const MachiningOutwardDetails = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [search, setSearch] = useState("");
  const [Page, setPage] = useState(1);
  const [ActivityLogData, setActivityLogData] = useState([]);
  const [MachiningOutwardDetails, setMachiningOutwardDetails] = useState([]);
  //
  useEffect(() => {
    GetMachiningOutwardInwardDetailByIDApi(
      route.params.Details.MachiningOutwardIDEncrypt
    );
  }, []);

  const GetMachiningOutwardInwardDetailByIDApi = async (
    MachiningOutwardIDEncrypt
  ) => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    // setLoading(true);
    var params = {
      MachiningOutwardIDEncrypt: MachiningOutwardIDEncrypt,
      CompanyIDEncrypt: LoginDetails.CompanyIDEncrypt,
      BranchIDEncrypt: LoginDetails.BranchIDEncrypt,
      ViewType: 2,
    };
    console.log("GetActivityLogDataApi Params =====>>>>>>>>>>", params);
    GetMachiningOutwardInwardDetailByIDApiCall(params)
      .then((res) => {
        console.log(
          "GetActivityLogDataApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setActivityLogData(res);
          setMachiningOutwardDetails(res.MachiningOutwardDetails);
          setExpandedItemId(
            res.MachiningOutwardDetails[0].MachiningConfigurationIDEncrypt
          );
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

  const [expandedItemId, setExpandedItemId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedItemId((prevId) => (prevId === id ? null : id));
  };

  const renderItem = ({ item }) => (
    <View style={{}}>
      <TouchableOpacity
        style={[
          styles.header,
          {
            marginTop: 10,
            padding: 10,
            borderRadius: 6,
            marginBottom: 5,
            flexDirection: "row",
            borderColor: BaseColor.grayColor,
            backgroundColor: BaseColor.buttonGradient2,
            borderWidth: 1,
            alignItems: "center",
          },
        ]}
        onPress={() => toggleExpand(item.MachiningConfigurationIDEncrypt)}
      >
        <Text whiteColor bold callout style={{ flex: 1, fontSize: 16 }}>
          {item.ProcessName}
        </Text>
        <Text whiteColor>
          {expandedItemId === item.MachiningConfigurationIDEncrypt ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>
      {expandedItemId === item.MachiningConfigurationIDEncrypt && (
        <View
          style={{
            padding: 5,
            paddingRight: 10,
            marginBottom: 10,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          <Text subhead bold darkColor style={{ fontSize: 14 }}>
            {"Process : "}{" "}
            <Text subhead darkColor style={{ fontSize: 13 }}>
              {item.ProcessName}
            </Text>
          </Text>

          <Text subhead bold darkColor style={{ fontSize: 14 }}>
            {"TC No : "}{" "}
            <Text subhead darkColor style={{ fontSize: 13 }}>
              {item.TCNo}
            </Text>
          </Text>
          <Text subhead bold darkColor style={{ fontSize: 14 }}>
            {"Note : "}{" "}
            <Text subhead darkColor style={{ fontSize: 13 }}>
              {item.MachiningNote}
            </Text>
          </Text>

          <View style={{ flexDirection: "row" }}>
            <Text subhead bold darkColor style={{ fontSize: 14, flex: 1 }}>
              {"Length : "}{" "}
              <Text subhead darkColor style={{ fontSize: 13 }}>
                {item.Length}
              </Text>
            </Text>

            <Text subhead bold darkColor style={{ fontSize: 14 }}>
              {"Qty : "}{" "}
              <Text subhead darkColor style={{ fontSize: 13 }}>
                {item.Qty}
              </Text>
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text subhead bold darkColor style={{ fontSize: 14, flex: 1 }}>
              {"Thickness : "}{" "}
              <Text subhead darkColor style={{ fontSize: 13 }}>
                {item.Thickness}
              </Text>
            </Text>

            <Text subhead bold darkColor style={{ fontSize: 14 }}>
              {"Status : "}{" "}
              <Text subhead darkColor style={{ fontSize: 13 }}>
                {item.OutwardStatusName}
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <>
      {/* <SafeAreaView
        style={{flex: 0, backgroundColor: BaseColor.backgroundGradient1}}
      /> */}
      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>
      <SafeAreaView style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
        <View
          style={{
            flex: 1,
          }}
        >
          <StatusBar hidden />
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
            title={"Machining Outward Details"}
          ></Header>

          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              marginBottom: moderateScale(90),
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: moderateScale(5),
                paddingTop: moderateScale(12),
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  backgroundColor: BaseColor.Card,
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text body1 bold buttonGradient2 style={{ fontSize: 16 }}>
                    {ActivityLogData.VendorName}
                  </Text>
                  <Text caption1 style={{ marginTop: 5, color: "#000" }}>
                    {ActivityLogData.MachiningOutwardNo +
                      " | " +
                      ActivityLogData.OutwardDate}
                  </Text>
                  <Text darkColor bold>
                    Expected Date -{" "}
                    <Text footnote darkColor>
                      {ActivityLogData.ExpectedDate}
                    </Text>
                  </Text>

                  <Text darkColor bold>
                    Remarks -{" "}
                    <Text footnote darkColor>
                      {ActivityLogData.OutwardRemarks}
                    </Text>
                  </Text>
                  
                  {ActivityLogData.InwardRemarks != "" && (
                    <Text darkColor bold>
                      Inward Remarks -{" "}
                      <Text footnote darkColor>
                        {ActivityLogData.InwardRemarks}
                      </Text>
                    </Text>
                  )}
                </View>
              </View>

              <View
                style={{
                  backgroundColor: BaseColor.Card,
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                  //   flexDirection: "row",
                }}
              >
                <Text darkColor bold body style={{ marginBottom: 10 }}>
                  TC Details
                </Text>

                <FlatList
                  data={MachiningOutwardDetails}
                  keyExtractor={(item) => item.MachiningConfigurationIDEncrypt}
                  renderItem={renderItem}
                  contentContainerStyle={styles.list}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default MachiningOutwardDetails;
