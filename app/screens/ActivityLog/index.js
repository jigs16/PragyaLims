import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  Pressable,
  FlatList,
  ScrollView,
  ImageBackground,
  Platform,
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
import { GetActivityLogDataApiCall } from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";

const ActivityLog = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [search, setSearch] = useState("");
  const [Page, setPage] = useState(1);
  const [ActivityLogData, setActivityLogData] = useState([]);

  useEffect(() => {
    GetActivityLogDataApi();
  }, []);

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
          source={{ uri: item.EmployeePhoto }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            marginRight: 10,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text body2 bold buttonGradient1>
            {item.Header}
          </Text>
          <Text caption1 style={{ marginTop: 5, color: "#000" }}>
            {item.Line1}
          </Text>
          <Text caption1 darkColor>
            {item.Line2}
          </Text>
          <Text caption1 grayColor>
            {item.ActivityLogDate}
          </Text>
        </View>
      </View>
    </>
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
            title={"Activity Log"}
          ></Header>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              marginBottom: moderateScale(90),
            }}
          >
            <TextInput
              style={{
                marginTop: moderateScale(15),
                marginBottom: moderateScale(15),
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
            <ScrollView
              contentContainerStyle={{
                paddingBottom: moderateScale(5),
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <FlatList
                onEndReachedThreshold={0.1}
                onEndReached={() => setPage(Page + 1)}
                data={ActivityLogListData}
                renderItem={RenderItemActivityLog}
              />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ActivityLog;
