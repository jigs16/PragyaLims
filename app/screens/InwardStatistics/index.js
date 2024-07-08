import React, { useEffect, useState } from "react";
import { Header, Image, Loader, Text } from "../../components";
import { Pressable, StatusBar, View, ScrollView } from "react-native";
import { GetControlCenterInwardStatisticsListApiCall } from "../../redux/services/ApiService";
import AlertModal from "../../components/AlertModal";
import { moderateScale } from "../../config/scaling";
import { BaseColor, Images } from "../../config";
import styles from "../InwardStatistics/styles";
import LinearGradient from "react-native-linear-gradient";

const InwardStatistics = ({ navigation, route }) => {
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [ListOfInwardStatistics, setListOfInwardStatistics] = useState();

  useEffect(() => {
    GetControlCenterInwardStatisticsListApi();
  }, []);
  const GetControlCenterInwardStatisticsListApi = async () => {
    setLoading(true);
    var params = {
      InwardIDEncrypted: route.params.InwardID,
    };
    console.log(
      "GetControlCenterInwardStatisticsListApi Params =====>>>>>>>>>>",
      params
    );
    GetControlCenterInwardStatisticsListApiCall(params)
      .then((res) => {
        if (res.IsSuccess) {
          setLoading(false);
          setListOfInwardStatistics(res.ListOfInwardStatistics);
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

  return (
    <View style={{ backgroundColor: BaseColor.whiteColor, flex: 1 }}>
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
        title={"Inward Statistics"}
      ></Header>
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
        <ScrollView>
          <View style={{ paddingBottom: 70 }}>
            {ListOfInwardStatistics?.map((item, index) => (
              <View
                onPress={() => {
                  navigation.navigate("InwardApproval", {
                    InwardIDEncrypted: item.InwardIDEncrypted,
                    ViewType: "ViewOnly",
                  });
                }}
                style={{
                  padding: moderateScale(10),
                  borderRadius: 10,
                  backgroundColor: BaseColor.Card,
                  marginBottom: 6,
                  marginTop: 6,
                }}
              >
                <Text darkColor bold>
                  {item.InwardNo + " | " + item.TCNo}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <Text darkColor bold style={{ flex: 1 }}>
                    Inward -{" "}
                    {item.IsInwardDone ? (
                      <Text caption1 green>
                        {"Done"}
                      </Text>
                    ) : (
                      <Text caption1 danger>
                        {"Pending"}
                      </Text>
                    )}
                  </Text>

                  <Text darkColor bold>
                    Inward Approved -{" "}
                    {item.IsInwardApproved ? (
                      <Text caption1 green>
                        {"Done"}
                      </Text>
                    ) : (
                      <Text caption1 danger>
                        {"Pending"}
                      </Text>
                    )}
                  </Text>
                </View>

                <Text darkColor bold>
                  Test Details :-
                </Text>
                <View style={{ paddingLeft: 12, marginTop: 5 }}>
                  {item.ListOfTests?.map((item, index) => (
                    <>
                      <View style={{ flexDirection: "row" }}>
                        <Text caption1 darkColor>
                          {"⦿ "}
                        </Text>

                        <Text caption1 darkColor>
                          {item.TestName}{" "}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginBottom: 4 }}>
                        {item.IsTestingDone ? (
                          <Text caption1 green style={{ paddingLeft: 15 }}>
                            {"Testing"}
                          </Text>
                        ) : (
                          <Text caption1 danger>
                            {"Testing"}
                          </Text>
                        )}
                        <Text caption1 darkColor>
                          {"  |  "}
                        </Text>
                        {item.IsTestingApproved ? (
                          <Text caption1 green>
                            {"Approved"}
                          </Text>
                        ) : (
                          <Text caption1 danger>
                            {"Approved"}
                          </Text>
                        )}
                      </View>
                    </>
                  ))}
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text darkColor bold style={{ flex: 1 }}>
                    Dispatch Material -{" "}
                    {item.IsMaterialDispatch ? (
                      <Text caption1 green>
                        {"Done"}
                      </Text>
                    ) : (
                      <Text caption1 danger>
                        {"Pending"}
                      </Text>
                    )}
                  </Text>

                  <Text darkColor bold>
                    Printing -{" "}
                    {item.IsPrintingDone ? (
                      <Text caption1 green>
                        {"Done"}
                      </Text>
                    ) : (
                      <Text caption1 danger>
                        {"Pending"}
                      </Text>
                    )}
                  </Text>
                </View>

                <Text darkColor bold>
                  Dispatch Report -{" "}
                  {item.IsReportDispatchDone ? (
                    <Text caption1 green>
                      Done
                      {item.CourierName != "" && (
                        <Text caption1 darkColor>
                          {" | " + item.CourierName}
                        </Text>
                      )}
                      {item.CourierDispatchNo != "" && (
                        <Text caption1 darkColor>
                          {" | " + item.CourierDispatchNo}
                        </Text>
                      )}
                    </Text>
                  ) : (
                    <Text caption1 danger>
                      Pending
                    </Text>
                  )}
                </Text>

                <Text darkColor bold>
                  Re-Test / Amendment / Rewise :-
                </Text>
                <View style={{ paddingLeft: 12, marginTop: 5 }}>
                  {item.ListOfReTests?.map((item, index) => (
                    <>
                      <View style={{ flexDirection: "row" }}>
                        <Text caption1 darkColor>
                          {"⦿ "}
                        </Text>
                        <Text caption1 darkColor>
                          {item.TestName}

                          <Text caption1 buttonGradient2>
                            {" - Retest on " +
                              item.RetestDate +
                              " by " +
                              item.RetestBy}
                          </Text>
                        </Text>
                      </View>
                    </>
                  ))}
                  {item.ListOfRewise?.map((item, index) => (
                    <>
                      <View style={{ flexDirection: "row" }}>
                        <Text caption1 darkColor>
                          {"⦿ "}
                        </Text>
                        <Text caption1 darkColor>
                          {item.RewiseNo}
                        </Text>
                        <Text caption1 buttonGradient2>
                          {" - Rewise on " +
                            item.RewiseDate +
                            " by " +
                            item.RewiseBy}
                        </Text>
                      </View>
                    </>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default InwardStatistics;
