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
import { Loader, Text, Image, Button, CheckBox } from "../../components";
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
import { launchImageLibrary } from "react-native-image-picker";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import MultiSelect from "../../components/MultiSelect";

const Chat = ({ navigation }) => {
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
              EmployeeName:
                item?.EmployeeName + " (" + item?.DepartmentName + ")",
              EmployeeIDEncrypted: item?.EmployeeIDEncrypted,
              DepartmentName: item?.DepartmentName,
            })),
          ];
          setEmployeeOptions(employeeOptions);
          console.log("====================================");
          console.log(employeeOptions);
          console.log("====================================");

          const employeeOptionsnotall = [
            ...res?.EmployeeList?.filter(
              (x) => x?.EmployeeIDEncrypted !== LoginDetails?.ReferenceIDEncrypt
            ).map((item) => ({
              EmployeeName:
                item?.EmployeeName + " (" + item?.DepartmentName + ")",
              EmployeeIDEncrypted: item?.EmployeeIDEncrypted,
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
    (item) => item?.EmployeeIDEncrypted !== myLoginID
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

  useEffect(() => {
    if (!isModalVisible) {
      setSelectedItems({});
      console.log("Modal closed, reset selectedItems to:", {});
    }
  }, [isModalVisible]);

  const handleCheckBoxPress = (value, isChecked) => {};

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsName, setSelectedItemsName] = useState([]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

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
          <Text style={styles.name}>{selectedItemsName != '' ? selectedItemsName : 'Bharat Patel'}</Text>
          <Text style={styles.status}>Online</Text>
        </View>
        {/* <TouchableOpacity style={styles.moreButton}>
          <Icon name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity> */}
      </View>
      <View style={{ flex: 0.83, paddingHorizontal: 10, paddingBottom: 5 }}>
        <FlatList
          ref={flatListRef}
          data={filteredMessages.reverse()} // Reverse to show latest messages at the bottom
          renderItem={({ item }) => (
            <ScrollView style={{paddingTop: 2}}>
              <View style={{ alignItems: "flex-end" }}>
                {item?.SenderIDEncrypt === Login.ReferenceIDEncrypt && (
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
                        {item?.IsAll ? "all" : item?.ReceiverName}
                        {!item?.IsAll && (
                          <Text
                            darkColor
                            bold
                            caption2
                            style={[styles.messageText, { fontSize: 14 }]}
                          >
                            {" (" + item?.ReceiverDepartmentName + ")"}
                          </Text>
                        )}
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
                      <Pressable>
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
                )}
              </View>

              <View>
                {item?.SenderIDEncrypt != Login.ReferenceIDEncrypt && (
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
                            {item?.SenderName.substring(0, 2).toUpperCase()}
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

                        <Text
                          darkColor
                          bold
                          caption2
                          style={[styles.messageText, { fontSize: 14 }]}
                        >
                          {" (" + item?.ReceiverDepartmentName + ")"}
                        </Text>
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
                              item?.SenderIDEncrypt === Login?.ReferenceIDEncrypt
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
                )}
              </View>
            </ScrollView>
          )}
          scrollEnabled={true}
          keyExtractor={(item) => item?.id}
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
            {/* <Pressable
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
            </Pressable> */}
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
            <TouchableOpacity onPress={toggleModal} style={[styles.sendButton, {right:8}]}>
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
        // animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 15,
                }}
              >
                <Text darkColor callout bold style={{ flex: 1 }}>
                  {"Select Customer"}
                </Text>
                <Pressable
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <Image
                    style={styles.modalCheckImg}
                    resizeMode="contain"
                    source={Images.ic_close}
                  ></Image>
                </Pressable>
              </View>
              <ScrollView>
                {employeeOptions.map((item, index) => (
                  <CheckBox
                    key={index}
                    label={item?.EmployeeName}
                    onPress={(isChecked) => {
                      // handleCheckBoxPress(item?.EmployeeIDEncrypted, isChecked)
                      setSelectedItems((prevState) => {
                        const updatedSelectedItems = {
                          ...prevState,
                          [item?.EmployeeIDEncrypted]: isChecked,
                        };
                        console.log(
                          "Updated selectedItems:",
                          updatedSelectedItems
                        );

                        const selectedValues = Object.keys(updatedSelectedItems)
                          .filter((key) => updatedSelectedItems[key])
                          .join(", ");

                        console.log("Selected values:", selectedValues);

                        return updatedSelectedItems;
                      });

                      setSelectedItemsName((prevState) => {
                        const updatedSelectedItems = {
                          ...prevState,
                          [item?.EmployeeName]: isChecked,
                        };
                        console.log(
                          "Updated selectedItems:",
                          updatedSelectedItems
                        );

                        const selectedValues = Object.keys(updatedSelectedItems)
                          .filter((key) => updatedSelectedItems[key])
                          .join(", ");

                        console.log("Selected Label:", selectedValues);

                        return updatedSelectedItems;
                      });
                    }}
                  />
                ))}
                <Pressable onPress={() => setIsModalVisible(false)}>
                  <Text
                    green
                    callout
                    bold
                    style={{
                      // flex: 1,
                      alignSelf: "flex-end",
                      right: 10,
                      marginVertical: 8,
                    }}
                  >
                    {"Submit"}
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.modalContent}>
          <MultiSelect options={options} />
        </View>
      </Modal> */}
    </View>
  );
};

export default Chat;
