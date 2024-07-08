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
} from "react-native";
import { Loader, Text, Image } from "../../components";
import { BaseColor, Images } from "../../config";
import { moderateScale } from "../../config/scaling";
import styles from "./styles";
import { withDecay } from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  ChatBoxEmployeeMessageInsertApiCall,
  GetChatBoxListApiCall,
  GetEmployeeDDLListApiCall,
} from "../../redux/services/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertModal from "../../components/AlertModal";
import DropdownSelected from "../../components/DropdownSelected/DropdownSelected";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { launchImageLibrary } from "react-native-image-picker";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const Chat = () => {
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");

  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(50); // Initial height
  const maxLines = 2.5; // Maximum number of lines
  const [selectedCustomer, setSelectedCustomer] = useState("all");

  const [Customer, setCustomer] = useState([]);
  const [SelectedReceiverID, setSelectedReceiverID] = useState("all");
  const [isFocus, setIsFocus] = useState(false);
  const [CustomerData, setCustomerData] = useState([]);

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeeOptionsNotAll, setEmployeeOptionsNotAll] = useState([]);

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

  const [imageUri, setImageUri] = useState("");
  const [FileName, setFileName] = useState("");
  const maxSize = 20 * 1024 * 1024;
  const [fileError, setFileError] = useState(null);

  const handleAttachment = () => {
    const options = {
      mediaType: "photo",
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

  // const handleSend = () => {
  //   if (message.trim()) {
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         id: Date.now().toString(),
  //         text: message,
  //         customer: selectedCustomer,
  //         sender: "me",
  //       },
  //     ]);
  //     setMessage("");
  //   }
  // };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    GetChatBoxListApi();
    GetEmployeeDDLListApi();
  }, []);

  const [Login, setLogin] = useState([]);
  const GetChatBoxListApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
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
          setMessages(res.List);
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
            { EmployeeName: "All", EmployeeIDEncrypted: "-1" },
            ...res?.EmployeeList?.filter(
              (x) => x?.EmployeeIDEncrypted !== LoginDetails?.ReferenceIDEncrypt
            ).map((item) => ({
              EmployeeName: item.EmployeeName + " (" + item.DepartmentName + ")",
              EmployeeIDEncrypted: item.EmployeeIDEncrypted,
              DepartmentName: item?.DepartmentName,
            })),
          ];
          setEmployeeOptions(employeeOptions);
          console.log('====================================');
          console.log(employeeOptions);
          console.log('====================================');

          const employeeOptionsnotall = [
            ...res?.EmployeeList?.filter(
              (x) => x?.EmployeeIDEncrypted !== LoginDetails?.ReferenceIDEncrypt
            ).map((item) => ({
              EmployeeName: item.EmployeeName + " (" + item.DepartmentName + ")",
              EmployeeIDEncrypted: item.EmployeeIDEncrypted,
              DepartmentName: item?.DepartmentName,
            })),
          ];
          setEmployeeOptionsNotAll(employeeOptionsnotall);

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

  
  const ChatBoxEmployeeMessageInsertApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem("LoginDetails"));
    let currentDate = new Date();
    const formattedDate = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");

    if (Customer == "") {
      setMsgModal("Please Select Contact for Send Message");
      setAlertModal(true);
    } else {
      setLoading(true);
      let guid = uuidv4(); // BatchID created
      // setAlertModal(true);
      // setMsgModal(guid);

      const params = new FormData();
      params.append("SenderIDEncrypt", LoginDetails.ReferenceIDEncrypt);
      params.append("ReceiverIDs", SelectedReceiverID);
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
            setLoading(false);
            GetChatBoxListApi();
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

  const [myLoginID, setMyLoginID] = useState("");

  const filteredCustomerData = CustomerData.filter(
    (item) => item.EmployeeIDEncrypted !== myLoginID
  );

  const downloadFile = (ChatFilePath) => {
    Linking.openURL(ChatFilePath)
      .then(() => {
        console.log(`File ${ChatFilePath} downloaded`);
      })
      .catch((error) => {
        console.error(`Failed to download file ${ChatFilePath}: ${error}`);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
      <Loader loading={loading} />

      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}
      ></AlertModal>

      <View style={{ flex: 0.79, paddingHorizontal: 10 }}>
        <FlatList
          ref={flatListRef}
          data={filteredMessages.reverse()} // Reverse to show latest messages at the bottom
          renderItem={({ item }) => (
            <ScrollView>
              <View style={{ alignItems: "flex-end" }}>
                {item.SenderIDEncrypt === Login.ReferenceIDEncrypt && (
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={[
                        styles.messageContainer,
                        item.SenderIDEncrypt === Login.ReferenceIDEncrypt
                          ? styles.sentMessage
                          : styles.receivedMessage,
                        ,
                        { marginRight: 5 },
                      ]}
                    >
                      <Text
                        green
                        bold
                        caption2
                        style={[
                          styles.messageText,
                          {
                            alignSelf:
                              item.SenderIDEncrypt === Login.ReferenceIDEncrypt
                                ? "flex-end"
                                : "flex-start",
                            marginBottom: 4,
                            fontSize: 14,
                          },
                        ]}
                      >
                        {item.IsAll ? "all" : item.ReceiverName}
                        {!item.IsAll && (
                          <Text
                            darkColor
                            bold
                            caption2
                            style={[styles.messageText, { fontSize: 14 }]}
                          >
                            {" (" + item.ReceiverDepartmentName + ")"}
                          </Text>
                        )}
                      </Text>
                      {item.ChatFilePath != "" && (
                        <Pressable
                          onPress={() => {
                            downloadFile(item.ChatFilePath);
                          }}
                          style={{ flexDirection: "row", alignItems: "center" }}
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
                              { fontSize: 11, flex: 1, left: 5 },
                            ]}
                          >
                            {item.ChatFileName}
                          </Text>
                        </Pressable>
                      )}

                      <Text
                        darkColor
                        footnote
                        style={[styles.messageText, { fontSize: 14 }]}
                      >
                        {item.ChatMessage.trim()}
                      </Text>

                      {item.SenderIDEncrypt === Login.ReferenceIDEncrypt ? (
                        <Text
                          fieldColor
                          overline
                          style={[
                            styles.messageText,
                            {
                              alignSelf:
                                item.SenderIDEncrypt ===
                                Login.ReferenceIDEncrypt
                                  ? "flex-end"
                                  : "flex-start",
                              fontSize: 11,
                            },
                          ]}
                        >
                          {item.ChatDate}
                        </Text>
                      ) : (
                        <Text
                          whiteColor
                          overline
                          style={[
                            styles.messageText,
                            {
                              alignSelf:
                                item.SenderIDEncrypt ===
                                Login.ReferenceIDEncrypt
                                  ? "flex-end"
                                  : "flex-start",
                              fontSize: 10,
                            },
                          ]}
                        >
                          {item.ChatDate}
                        </Text>
                      )}
                    </View>
                    <>
                      <Pressable>
                        <Image
                          source={{ uri: item.SenderEmployeePhoto }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                            marginVertical: 5,
                          }}
                        />
                      </Pressable>
                      {/* <Pressable>
                        <Image
                          source={Images.ic_DataFound}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 50,
                            marginVertical: 5,
                          }}
                        />
                      </Pressable> */}
                    </>
                  </View>
                )}
              </View>

              <View>
                {item.SenderIDEncrypt != Login.ReferenceIDEncrypt && (
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Pressable>
                      <Image
                        source={{ uri: item.SenderEmployeePhoto }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          marginRight: 5,
                          marginVertical: 5,
                        }}
                      />
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
                        yellowColor
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
                        {item.SenderName}

                        <Text
                          darkColor
                          bold
                          caption2
                          style={[styles.messageText, { fontSize: 14 }]}
                        >
                          {" (" + item.ReceiverDepartmentName + ")"}
                        </Text>
                      </Text>
                      {item.ChatFilePath != "" && (
                        <Pressable
                          onPress={() => {
                            downloadFile(item.ChatFilePath);
                          }}
                          style={{ flexDirection: "row", alignItems: "center" }}
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
                              { fontSize: 11, flex: 1, left: 5 },
                            ]}
                          >
                            {item.ChatFileName}
                          </Text>
                        </Pressable>
                      )}

                      <Text
                        darkColor
                        footnote
                        style={[styles.messageText, { fontSize: 14 }]}
                      >
                        {item.ChatMessage.trim()}
                      </Text>

                      <Text
                        whiteColor
                        overline
                        style={[
                          styles.messageText,
                          {
                            alignSelf:
                              item.SenderIDEncrypt === Login.ReferenceIDEncrypt
                                ? "flex-end"
                                : "flex-start",
                            fontSize: 10,
                          },
                        ]}
                      >
                        {item.ChatDate}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
          scrollEnabled={true}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          inverted
          onContentSizeChange={() => {
            // if (messages.length > 0) {
            //   flatListRef.current.scrollToEnd({ animated: true });
            // }
          }}
        />
      </View>

      <View style={styles.BottomView}>
        <MultiSelect
          style={[styles.dropdown, isFocus && {}]}
          placeholderStyle={[
            styles.placeholderStyle,
            { color: BaseColor.borderColor },
          ]}
          selectedTextStyle={[{ color: "#000000" }]}
          renderItem={(item, selected) => (
            <DropdownSelected item={item?.EmployeeName} selected={selected} />
          )}
          data={employeeOptions}
          maxHeight={500}
          labelField="EmployeeName"
          valueField="EmployeeIDEncrypted"
          placeholder={!isFocus ? "Select Status" : "..."}
          search
          searchPlaceholder={"Search"}
          value={Customer}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          selectedStyle={styles.selectedStyle}
          onChange={(item) => {
            setCustomer(item);
            const selectedIds = item.join(",");
            setSelectedReceiverID(selectedIds);
            console.log("====================================");
            console.log(item);
            console.log("====================================");
            setIsFocus(false);
          }}
        />
        {FileName != "" && (
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
              source={Images.Page}
              style={{ width: 20, height: 20, top: 8, marginRight: 4 }}
              resizeMode={"contain"}
              tintColor={BaseColor.darkColor}
            />
            <Text darkColor style={{ top: 8 }}>
              {FileName != '' ? FileName : fileError && <Text style={{ color: 'red' }}>{fileError}</Text>}
            </Text>
            <Pressable
              onPress={() => {
                setFileName("");
              }}
            >
              <Image
                source={Images.close}
                style={{ width: 14, height: 14, top: 12, marginLeft: 15 }}
                resizeMode={"contain"}
                tintColor={BaseColor.red}
              />
            </Pressable>
          </View>
        )}
        <View style={{ flexDirection: "row", marginTop: 10 }}>
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
    </View>
  );
};

export default Chat;
