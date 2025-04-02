import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  PermissionsAndroid,
  Modal,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { Loader, Text, Image, Button } from "../../components";
import { BaseColor, Images } from "../../config";
import styles from "./styles";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  ChatBoxEmployeeMessageDeleteApiCall,
  ChatBoxEmployeeMessageInsertApiCall,
  GetChatBoxListApiCall,
  GetEmployeeDDLListApiCall,
} from "../../redux/services/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertModal from "../../components/AlertModal";
import { launchImageLibrary } from "react-native-image-picker";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import * as signalR from "@microsoft/signalr";
import "react-native-url-polyfill/auto";
import { useChatContext } from "./ChatProvider";

const Chat = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");

  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(50); // Initial height
  const maxLines = 2.5; // Maximum number of lines
  const [selectedCustomer, setSelectedCustomer] = useState("all");

  const [SelectedReceiverID, setSelectedReceiverID] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const handleContentSizeChange = (event) => {
    const { contentSize } = event.nativeEvent;
    const maxHeight = 50 * maxLines; // Maximum height calculation

    setInputHeight(Math.min(maxHeight, contentSize.height));
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "ios") {
      const photoPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
    } else if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    }
  };

  const [imageUri, setImageUri] = useState(null);
  const [FileName, setFileName] = useState("");
  const maxSize = 20 * 1024 * 1024;
  const [fileError, setFileError] = useState(null);

  const handleAttachment = () => {
    const options = {
      mediaType: "mixed",
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        // const source = response.assets[0].uri;
        // setFileName(response.assets[0].fileName);
        // setImageUri(source);
        // console.log(response.assets[0]);
        const asset = response.assets[0];
        const fileSize = asset.fileSize;
        const source = asset.uri;

        // Check if the file size exceeds the maximum limit
        if (fileSize > maxSize) {
          setFileError("File size exceeds 20 MB");
          setImageUri(null);
          setFileName(null);
          console.log("File size exceeds 20 MB");
        } else {
          setFileName(asset.fileName);
          setImageUri(source);
          setFileError(null);
          console.log(asset);
        }
      }
    });
  };

  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const filteredMessages = messages.filter(
    (msg) => selectedCustomer === "all" || msg.customer === selectedCustomer
  );

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      //flatListRef.current.scrollToEnd({ animated: true });
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [messages]);

  useEffect(() => {
    GetChatBoxListApi();
    GetEmployeeDDLListApi();
  }, []);

  const [Login, setLogin] = useState([]);

  const GetChatBoxListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLoginData(JSON.parse(await AsyncStorage.getItem("LoginDetails")));
    setLogin(LoginDetails);
    console.log(LoginDetails);
    // setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: "",
      Sorting: "",
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      EmployeeIDEncrypted: LoginDetails.ReferenceIDEncrypt,
      SearchText: "",
    };
    console.log("GetActivityLogDataApi Params =====>>>>>>>>>>", params);
    GetChatBoxListApiCall(params)
      .then((res) => {
        console.log(
          "GetActivityLogDataApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setMessage("");
          const keysToKeep = [
            "ChatBoxIDEncrypt",
            "SenderIDEncrypt",
            "ReceiverIDEncrypt",
            "ChatMessage",
            "ChatFilePath",
            "ChatFileName",
            "ChatDate",
            "ChatDateTime",
            "ChatDateWeek",
            "IsRead",
            "ReadDate",
            "BatchID",
            "SenderName",
            "SenderEmployeePhoto",
            "ReceiverName",
            "ReceiverEmployeePhoto",
            "MessageType",
            "IsDelete",
          ];

          const filterMassageList = res.List.map((item) => {
            const filteredItem = {};
            keysToKeep.forEach((key) => {
              if (item?.hasOwnProperty(key)) {
                filteredItem[key] = item[key];
              }
            });
            return filteredItem;
          });
          // setMessages(res.List);
          setMessages(res.List.reverse());
          console.log("filterMassageList ", filterMassageList);

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

  const GetEmployeeDDLListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    setLogin(LoginDetails);
    console.log(LoginDetails);
    // setLoading(true);
    var params = {
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      UserType: 1,
    };
    console.log("GetEmployeeDDLListApi Params =====>>>>>>>>>>", params);
    GetEmployeeDDLListApiCall(params)
      .then((res) => {
        console.log(
          "GetEmployeeDDLListApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          const employeeOptions = [
            ...res?.EmployeeList?.filter(
              (x) => x?.EmployeeIDEncrypted !== LoginDetails?.ReferenceIDEncrypt
            ).map((item) => ({
              EmployeeName:
                item?.EmployeeName + " (" + item?.DepartmentName + ")",
              EmployeeIDEncrypted: item?.EmployeeIDEncrypted,
              DepartmentName: item?.DepartmentName,
            })),
          ];
          setEmployeeOptions(employeeOptions);
          setSelectedReceiverID(
            employeeOptions
              .map((employee) => employee.EmployeeIDEncrypted)
              .join(",")
          );
          console.log("====================================");
          console.log(employeeOptions);
          console.log("====================================");

          // setMyLoginID(LoginDetails.ReferenceIDEncrypt);
          // setCustomerData(res.EmployeeList);
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

  const downloadFile = (ChatFilePath) => {
    Linking.openURL(ChatFilePath)
      .then(() => {
        console.log(`File ${ChatFilePath} downloaded`);
      })
      .catch((error) => {
        console.error(`Failed to download file ${ChatFilePath}: ${error}`);
      });
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartments1, setSelectedDepartments1] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);

  const [checkedItems, setCheckedItems] = useState({});

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCheckboxChange = (departmentName) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [departmentName]: !prevState[departmentName],
    }));
  };

  const AllhandleCheckboxChange = () => {
    if (isSelected) {
      setSelection(false);
    } else {
      setSelection(true);
      setSelectedDepartments([]);
      setSelectedDepartments1([]);
      setSelectedContact([]);
    }
  };

  const handleSubmit = () => {
    const selected = Object.keys(checkedItems).filter(
      (dep) => checkedItems[dep]
    );
    console.log("checkedItems ", checkedItems);
    const selectedEmployeeIDEncrypted = employeeOptions
      .filter((employee) => checkedItems[employee.EmployeeName])
      .map((employee) => employee.EmployeeIDEncrypted);

    console.log("selected ", selected);
    console.log("selectedEmployeeIDEncrypted ", selectedEmployeeIDEncrypted);

    setSelectedDepartments(selected);
    setSelectedDepartments1(selectedEmployeeIDEncrypted);
    setSelectedContact(
      employeeOptions.filter((employee) => checkedItems[employee.EmployeeName])
    );
    setModalVisible(false);
  };

  const getDateTimeInfoByDate = () => {
    // Create Date objects for comparison
    const currentDate = new Date();
    const inputDate = new Date();

    // Function to format time in hh:mm:ss format
    const formatTime = (inputDate) => {
      const timeString = inputDate.toLocaleTimeString();
      const formattedTime = timeString.replace(/:\d+ /, " "); // Remove seconds
      return formattedTime.padStart(8, "0");
    };

    if (inputDate.toDateString() === currentDate.toDateString()) {
      return "Today | " + formatTime(inputDate);
    }
  };
  const result = getDateTimeInfoByDate();

  const ChatBoxEmployeeMessageInsertApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    let currentDate = new Date();
    const formattedDate = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");

    if (selectedDepartments1 == "" && !isSelected) {
      setMsgModal("Please Select Contact for Send Message");
      setAlertModal(true);
    } else {
      setLoading(true);
      let guid = uuidv4();

      const params = new FormData();
      params.append("SenderIDEncrypt", LoginDetails.ReferenceIDEncrypt);
      params.append(
        "ReceiverIDs",
        isSelected ? SelectedReceiverID : selectedDepartments1.join(", ")
      );
      params.append("ChatMessage", message);
      params.append("ChatDateTime", formattedDate);
      params.append("ChatBoxFile", imageUri);
      params.append("ChatBoxFilePath", "");
      params.append("ChatFileName", FileName);
      params.append("BatchID", guid);
      params.append("IsAll", false);
      params.append("CompanyIDEncrypted", LoginDetails.CompanyIDEncrypt);
      params.append("BranchIDEncrypted", LoginDetails.BranchIDEncrypt);
      params.append("CreatedByEncrypt", LoginDetails.ReferenceIDEncrypt);

      console.log("Params", JSON.stringify(params));

      ChatBoxEmployeeMessageInsertApiCall(params, "true")
        .then((res) => {
          console.log("Response Complaint Insert", res);
          if (res.IsSuccess) {
            console.log("====================================");
            console.log("Success");
            console.log("====================================");
            let MultiEmployeeMsgList = [];
            MultiEmployeeMsgList = selectedContact?.map((item) => {
              const labelWithoutParentheses =
                item?.EmployeeName.split("(")[0]?.trim();
              const departmentNameFirstFive = item?.DepartmentName?.substring(
                0,
                5
              );
              return {
                ChatBoxIDEncrypt: "",
                SenderIDEncrypt: "",
                ReceiverIDEncrypt: isSelected ? "" : item?.EmployeeIDEncrypted,
                ChatMessage: message,
                ChatFilePath: "",
                ChatFileName: FileName,
                ChatSendFile: imageUri,
                ChatDate: result,
                ChatDateTime: "",
                ChatDateWeek: "",
                IsRead: false,
                ReadDate: "",
                BatchID: guid,
                SenderName: "",
                SenderEmployeePhoto: "",
                ReceiverName: isSelected ? "All" : labelWithoutParentheses,
                ReceiverEmployeePhoto: "",
                SenderDepartmentName: "",
                ReceiverDepartmentName:
                  item?.DepartmentName?.length > 5
                    ? departmentNameFirstFive + "..."
                    : departmentNameFirstFive,
                IsAll: isSelected ? true : false,
                SenderNameTitle: "",
                ReceiverNameTitle: "",
                MessageType: FileName ? 3 : 2,
              };
            });
            let newList = [...MultiEmployeeMsgList, ...messages];
            setMessages(newList);
            console.log("messages Final ", messages);
            setLoading(false);
          } else {
            setLoading(false);
            setMsgModal(res.Massage);
            setAlertModal(true);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  //ChatBoxEmployeeMessageDeleteApi
  const ChatBoxEmployeeMessageDeleteApi = async (item) => {
    setLoading(true);
    var params = {
      BatchID: item?.BatchID,
      EmployeeIDEncrypted: item?.ReceiverIDEncrypt
        ? item?.ReceiverIDEncrypt
        : "",
      ModifiedByEncrypt: LoginData?.ReferenceIDEncrypt,
    };
    console.log(
      "ChatBoxEmployeeMessageDeleteApi Params =====>>>>>>>>>>",
      params
    );
    ChatBoxEmployeeMessageDeleteApiCall(params)
      .then((res) => {
        console.log(
          "ChatBoxEmployeeMessageDeleteApi res ---->>>>>> ",
          JSON.stringify(res)
        );
        if (res.IsSuccess) {
          setLoading(false);
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

  const { chat, deleteMessageBatchID } = useChatContext();
  const [LoginData, setLoginData] = useState([]);

  useEffect(() => {
    if (chat) {
      console.log("Wow chat", chat);
      console.log("Wow...", LoginData?.ReferenceIDEncrypt);
      if (
        chat?.filter(
          (x) => x?.ReceiverIDEncrypt == LoginData?.ReferenceIDEncrypt
        )?.length > 0
      ) {
        console.log("abcd");
        chat
          ?.filter((x) => x?.ReceiverIDEncrypt == LoginData?.ReferenceIDEncrypt)
          ?.map((item) => {
            setMessages([
              { ...item, MessageType: item?.MessageType == 2 ? 1 : 4 },
              ...messages,
            ]);
          });
      }
    }
  }, [chat]);

  useEffect(() => {
    if (deleteMessageBatchID) {
      deleteMessageBatchID?.filter((x) =>
          x?.BatchID != deleteMessageBatchID &&
          x?.ReceiverIDEncrypt == LoginData?.ReferenceIDEncrypt
      );

      setMessages(...messages);
    }
  }, [deleteMessageBatchID]);

  return (
    <View style={{ flex: 1, backgroundColor: BaseColor.bg }}>
      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={Images.ic_back}
            style={{ width: 25, height: 25, resizeMode: "cover" }}
            tintColor={BaseColor.darkColor}
          />
        </TouchableOpacity>
        <Image
          source={{
            uri: "http://124.123.122.224:814/Resources/DefaultImages/DefaultUserPhoto.jpg",
          }}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {selectedDepartments == "" && !isSelected
              ? "Select Contact Person"
              : isSelected == true
              ? "All"
              : selectedDepartments.join(", ")}
          </Text>
          <Text style={styles.status}>Online</Text>
        </View>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 10, paddingBottom: 5 }}>
        <FlatList
          ref={flatListRef}
          data={filteredMessages} // Reverse to show latest messages at the bottom
          renderItem={({ item }) => (
            <View style={{ paddingTop: 2 }}>
              {item?.MessageType == 2 || item?.MessageType == 3 ? (
                <View style={{ alignItems: "flex-end" }}>
                  {/* {item?.SenderIDEncrypt === Login.ReferenceIDEncrypt && ( */}
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={[
                        styles.messageContainer,
                        item?.SenderIDEncrypt === Login.ReferenceIDEncrypt
                          ? styles.sentMessage
                          : styles.receivedMessage,
                        ,
                        { marginRight: 5 },
                      ]}
                    >
                      <Text
                        darkColor
                        bold
                        caption2
                        style={[
                          styles.messageText,
                          {
                            alignSelf:
                              item?.SenderIDEncrypt === Login.ReferenceIDEncrypt
                                ? "flex-end"
                                : "flex-start",
                            marginBottom: 4,
                            fontSize: 14,
                          },
                        ]}
                      >
                        {item?.IsAll
                          ? "all"
                          : item?.ReceiverName +
                            " (" +
                            item?.ReceiverDepartmentName +
                            ")"}
                      </Text>

                      {item?.ChatFilePath != "" && (
                        <Pressable
                          onPress={() => {
                            downloadFile(item?.ChatFilePath);
                          }}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Image
                            source={Images.ic_download}
                            tintColor={BaseColor.darkColor}
                            style={{ width: 32, height: 32, marginBottom: 5 }}
                          />
                          <Text
                            darkColor
                            footnote
                            style={[
                              styles.messageText,
                              { fontSize: 11, left: 5 },
                            ]}
                          >
                            {item?.ChatFileName}
                          </Text>
                        </Pressable>
                      )}

                      <Text
                        darkColor
                        footnote
                        style={[styles.messageText, { fontSize: 14 }]}
                      >
                        {item?.ChatMessage.trim()}
                      </Text>

                      <Text
                        fieldColor
                        overline
                        style={[
                          styles.messageText,
                          {
                            alignSelf:
                              item?.SenderIDEncrypt === Login.ReferenceIDEncrypt
                                ? "flex-end"
                                : "flex-start",
                            fontSize: 11,
                          },
                        ]}
                      >
                        {item?.ChatDate}
                      </Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                      <Pressable>
                        {item?.SenderEmployeePhoto != "" ? (
                          <Image
                            source={{ uri: item?.SenderEmployeePhoto }}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              marginVertical: 5,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              marginVertical: 5,
                              backgroundColor: BaseColor.darkGraycolor,
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              body1
                              bold
                              whiteColor
                              style={{ fontSize: 14, letterSpacing: 2 }}
                              textAlign={"center"}
                            >
                              {item?.ReceiverName.substring(0, 2).toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          ChatBoxEmployeeMessageDeleteApi(item);
                        }}
                      >
                        <Image
                          source={Images.delete}
                          tintColor={BaseColor.danger}
                          style={{
                            width: 20,
                            height: 20,
                            // borderRadius: 50,
                            marginVertical: 3,
                          }}
                        />
                      </Pressable>
                    </View>
                  </View>
                  {/* )} */}
                </View>
              ) : item?.MessageType == 1 ? (
                <View>
                  {/* {item?.SenderIDEncrypt != Login.ReferenceIDEncrypt && ( */}
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Pressable>
                      {item?.SenderEmployeePhoto != "" ? (
                        <Image
                          source={{ uri: item?.SenderEmployeePhoto }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                            marginRight: 5,
                            marginVertical: 5,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                            marginRight: 5,
                            marginVertical: 5,
                            backgroundColor: BaseColor.darkGraycolor,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            body1
                            bold
                            whiteColor
                            style={{ fontSize: 14, letterSpacing: 2 }}
                          >
                            {item?.SenderName?.substring(0, 2)?.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                    <View
                      style={[
                        styles.messageContainer,
                        styles.receivedMessage,
                        ,
                        { marginRight: 5 },
                      ]}
                    >
                      <Text
                        darkColor
                        bold
                        caption2
                        style={[
                          styles.messageText,
                          {
                            alignSelf: "flex-start",
                            marginBottom: 4,
                            fontSize: 14,
                          },
                        ]}
                      >
                        {item?.SenderName}
                      </Text>
                      {item?.ChatFilePath != "" && (
                        <Pressable
                          onPress={() => {
                            downloadFile(item?.ChatFilePath);
                          }}
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={Images.ic_download}
                            tintColor={BaseColor.darkColor}
                            style={{ width: 32, height: 32, marginBottom: 5 }}
                          />
                          <Text
                            darkColor
                            footnote
                            style={[
                              styles.messageText,
                              { fontSize: 11, left: 5 },
                            ]}
                          >
                            {item?.ChatFileName}
                          </Text>
                        </Pressable>
                      )}

                      <Text
                        darkColor
                        footnote
                        style={[styles.messageText, { fontSize: 14 }]}
                      >
                        {item?.ChatMessage.trim()}
                      </Text>

                      <Text
                        fieldColor
                        overline
                        style={[
                          styles.messageText,
                          {
                            alignSelf:
                              item?.SenderIDEncrypt === Login.ReferenceIDEncrypt
                                ? "flex-end"
                                : "flex-start",
                            fontSize: 10,
                          },
                        ]}
                      >
                        {item?.ChatDate}
                      </Text>
                    </View>
                  </View>
                  {/* )} */}
                </View>
              ) : (
                item?.MessageType == 4 && (
                  <View>
                    {/* {item?.SenderIDEncrypt != Login.ReferenceIDEncrypt && ( */}
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <Pressable>
                        {item?.SenderEmployeePhoto != "" ? (
                          <Image
                            source={{ uri: item?.SenderEmployeePhoto }}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              marginRight: 5,
                              marginVertical: 5,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              marginRight: 5,
                              marginVertical: 5,
                              backgroundColor: BaseColor.darkGraycolor,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              body1
                              bold
                              whiteColor
                              style={{ fontSize: 14, letterSpacing: 2 }}
                            >
                              {item?.SenderNameTitle.substring(
                                0,
                                2
                              ).toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                      <View
                        style={[
                          styles.messageContainer,
                          styles.receivedMessage,
                          ,
                          { marginRight: 5 },
                        ]}
                      >
                        <Text
                          darkColor
                          bold
                          caption2
                          style={[
                            styles.messageText,
                            {
                              alignSelf: "flex-start",
                              marginBottom: 4,
                              fontSize: 14,
                            },
                          ]}
                        >
                          {item?.SenderNameTitle}
                        </Text>
                        {item?.ChatFilePath != "" && (
                          <Pressable
                            onPress={() => {
                              downloadFile(item?.ChatFilePath);
                            }}
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={Images.ic_download}
                              tintColor={BaseColor.darkColor}
                              style={{ width: 32, height: 32, marginBottom: 5 }}
                            />
                            <Text
                              darkColor
                              footnote
                              style={[
                                styles.messageText,
                                { fontSize: 11, left: 5 },
                              ]}
                            >
                              {item?.ChatFileName}
                            </Text>
                          </Pressable>
                        )}

                        <Text
                          darkColor
                          footnote
                          style={[styles.messageText, { fontSize: 14 }]}
                        >
                          {item?.ChatMessage.trim()}
                        </Text>

                        <Text
                          fieldColor
                          overline
                          style={[
                            styles.messageText,
                            {
                              alignSelf:
                                item?.SenderIDEncrypt ===
                                Login.ReferenceIDEncrypt
                                  ? "flex-end"
                                  : "flex-start",
                              fontSize: 10,
                            },
                          ]}
                        >
                          {item?.ChatDate}
                        </Text>
                      </View>
                    </View>
                    {/* )} */}
                  </View>
                )
              )}
            </View>
          )}
          keyExtractor={(item) => item?.id}
          style={styles.messagesList}
          inverted
          // onContentSizeChange={() => {
          //   // if (messages.length > 0) {
          //   //   flatListRef.current.scrollToEnd({ animated: true });
          //   // }
          // }}
        />
        <View style={{ height: 120 }}></View>
      </View>

      <View style={styles.BottomView}>
        {FileName != "" && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={Images.Page}
              style={{ width: 20, height: 20, top: 8, marginRight: 4 }}
              resizeMode={"contain"}
              tintColor={BaseColor.darkColor}
            />
            <Text darkColor style={{ top: 8, flex: 1 }}>
              {FileName != ""
                ? FileName
                : fileError && (
                    <Text style={{ color: "red" }}>{fileError}</Text>
                  )}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: "row", marginTop: 1 }}>
          <View style={[styles.inputContainer, { height: inputHeight }]}>
            <TextInput
              style={styles.input}
              multiline
              value={message}
              onChangeText={setMessage}
              onContentSizeChange={handleContentSizeChange}
              placeholder="Type your message..."
            />
            <TouchableOpacity
              onPress={openModal}
              style={[styles.sendButton, { right: 8 }]}
            >
              <Icon name="user" size={20} color={BaseColor.grayColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAttachment}
              style={styles.sendButton}
            >
              <Icon name="paperclip" size={20} color={BaseColor.grayColor} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              ChatBoxEmployeeMessageInsertApi();
            }}
            style={[styles.sendButton1]}
          >
            <Icons
              name="send-circle"
              size={40}
              color={BaseColor.buttonGradient2}
              // color={message.length > 0 ? BaseColor.buttonGradient2 : "gray"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Pressable
          style={styles.modalView}
          onPress={() => {
            closeModal();
          }}
        >
          <Pressable
            onPress={() => {
              setModalVisible(true);
            }}
            style={styles.modalContent}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <Text darkColor style={styles.modalTitle}>
                Select Contact
              </Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Image
                  style={styles.modalCheckImg}
                  resizeMode="contain"
                  source={Images.ic_close}
                ></Image>
              </Pressable>
            </View>
            <ScrollView style={styles.scrollView}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isSelected}
                  onValueChange={() => {
                    AllhandleCheckboxChange();
                  }}
                  style={styles.checkbox}
                />
                <Text darkColor style={styles.checkboxLabel}>
                  {"All"}
                </Text>
              </View>
              {employeeOptions.map((employeeOptions, index) => (
                <View key={index} style={styles.checkboxContainer}>
                  <CheckBox
                    value={checkedItems[employeeOptions.EmployeeName] || false}
                    onValueChange={() =>
                      handleCheckboxChange(employeeOptions.EmployeeName)
                    }
                    disabled={isSelected ? true : false}
                  />
                  <Pressable
                    onPress={() => {
                      handleCheckboxChange(employeeOptions.EmployeeName);
                    }}
                  >
                    <Text darkColor style={styles.checkboxLabel}>
                      {employeeOptions.EmployeeName}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Chat;
