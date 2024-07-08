import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Image, Loader, Text, TextInput } from "../../components";
import { GetActivityLogDataApiCall } from "../../redux/services/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale } from "../../config/scaling";
import { BaseColor, Images } from "../../config";
import styles from "../ActivityLog/styles";
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
    <View
      style={{ backgroundColor: BaseColor.whiteColor, flex: 1, padding: 10 }}
    >
      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 0,
          paddingBottom: 10,
          borderBottomColor: BaseColor.blackColor,
        }}
      >
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
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
    </View>
  );
};

export default ActivityLog;
