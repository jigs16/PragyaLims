import { Button, Select, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Field, FormikProvider, useFormik } from "formik";

import * as Yup from "yup";
import CustomTextArea from "../../../CustomControls/CustomTextArea";
import {
  delete_Record,
  errorMessage,
  warningMessage,
} from "../CommonFunctions";

import avatar1 from "../../../../../src/images/avatar/1.jpg";
import avatar2 from "../../../../../src/images/avatar/2.jpg";

import ChatMsgBox from "./ChatMsgBox";
import {
  POST_ChatBoxEmployeeMessageDelete,
  POST_ChatBoxEmployeeMessageInsert,
  POST_GetChatBoxList,
  POST_GetEmployeeDDLList,
} from "../../../helpers/url_helper";
import { post, postFormData } from "../../../helpers/api_helper";
import CustomMultiSelect from "../../../CustomControls/CustomMultiSelect";
import { useChatContext } from "../../../../context/ChatContext";

import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { SVGICON } from "../../../constant/theme";
import { v4 as uuidv4 } from "uuid";

const ChatBoxLIMS = ({ onClick, toggle, toggleChatBox }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chat, deleteMessageBatchID } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [openMsg, setOpenMsg] = useState(false);

  const [toggleTab, settoggleTab] = useState(
    window.location.hash.slice(1) ? window.location.hash.slice(1) : "chat"
  );

  const AuthUser = JSON.parse(localStorage.getItem("userDetails"));
  const formsList = AuthUser?.Permissions?.FormList;
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeeOptionsNotAll, setEmployeeOptionsNotAll] = useState([]);

  const [emaployeeNameForChat, setEmaployeeNameForChat] = useState("");
  const [employeeIDForChat, setEmployeeIDForChat] = useState("");
  const chatContainerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSizePerPage, setCurrentSizePerPage] = useState(50);
  const [recordCount, setRecordCount] = useState(0);

  const [toggleDelete, setToggleDelete] = useState(0);

  const [themeMode, setThemeMode] = useState(
    document.querySelector("body").getAttribute("data-theme-version")
  );

  const activeDiv = document.querySelector(".chatbox.active");

  useEffect(() => {
    scrollToBottom();
    getEmployeeDDL();
    getEmployeeDetails(currentPage, currentSizePerPage);

    formik.setFieldValue("EmployeeIDEncrypt", "");
    formik.setFieldValue("TextMessage", "");
    scrollToBottom();
    setThemeMode(
      document.querySelector("body").getAttribute("data-theme-version")
    );
  }, [
    
  ]);

  const fnCallback = () => {
    getEmployeeDetails(currentPage, currentSizePerPage);
  };

  const getEmployeeDDL = async () => {
    setIsLoading(true);
    await post(POST_GetEmployeeDDLList, {
      CompanyIDEncrypted: AuthUser?.CompanyIDEncrypt,
      BranchIDEncrypted: AuthUser?.BranchIDEncrypt,
      UserType: AuthUser?.UserType,
    })
      .then((response) => {
        if (response?.IsSuccess) {
          const employeeOptions = [
            { label: "All", value: "-1" },
            ...response?.EmployeeList?.filter(
              (x) => x?.EmployeeIDEncrypted !== AuthUser?.ReferenceIDEncrypt
            ).map((item) => ({
              label: item.EmployeeName + " (" + item.DepartmentName + ")",
              value: item.EmployeeIDEncrypted,
              DepartmentName: item?.DepartmentName,
            })),
          ];
          setEmployeeOptions(employeeOptions);

          const employeeOptionsnotall = [
            ...response?.EmployeeList?.filter(
              (x) => x?.EmployeeIDEncrypted !== AuthUser?.ReferenceIDEncrypt
            ).map((item) => ({
              label: item.EmployeeName + " (" + item.DepartmentName + ")",
              value: item.EmployeeIDEncrypted,
              DepartmentName: item?.DepartmentName,
            })),
          ];

          setEmployeeOptionsNotAll(employeeOptionsnotall);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const validationSchema = Yup.object().shape({});

  const formik = useFormik({
    validationSchema,
    onSubmit: (values, formikHelpers) =>
      handleValidSubmit(values, formikHelpers),
    initialValues: {
      EmployeeMsgList: [],
      EmployeeIDEncrypt: "",
      btnSubmitType: "",
      TextMessage: "",
      ChatFilekey: "",
      Search: "",
      ChatBoxFile: "",
      ChatFileName: "",
      ChatSendFile: "",
    },
    validateOnBlur: false,
  });

  const {
    setFieldValue,
    values: {
      EmployeeMsgList,
      EmployeeIDEncrypt,
      TextMessage,
      ChatFilekey,
      ChatBoxFile,
      ChatFileName,
      ChatSendFile,
    },
  } = formik;

  const handleValidSubmit = (values) => {
    if (values?.EmployeeIDEncrypt?.length === 0) {
      errorMessage("Please Select Contact for Send Message");
      return false;
    }

    const result = getDateTimeInfoByDate();
    let currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.toLocaleString(
      "default",
      { month: "short" }
    )}-${currentDate.getFullYear()} ${currentDate.toLocaleTimeString("en-US")}`;

    let EmpIdAll = 0;

    if (values?.EmployeeIDEncrypt?.length === 0) {
      errorMessage("Please Select Contact for Send Message");
      return false;
    } else {
      if (EmployeeIDEncrypt?.filter((x) => x?.value == -1)?.length > 0) {
        EmpIdAll = 1;
      }
    }

    if (values?.TextMessage !== "" || ChatFileName !== "") {
      // setIsLoading(true);
      let guid = uuidv4(); // BatchID created

      let formData = new FormData();
      formData.append(
        "SenderIDEncrypt",
        AuthUser?.ReferenceIDEncrypt ? AuthUser?.ReferenceIDEncrypt : "0"
      );
      formData.append(
        "ReceiverIDs",
        EmpIdAll == 1
          ? Array.from(employeeOptionsNotAll, (x) => x.value).join(",")
          : Array.from(values?.EmployeeIDEncrypt, (x) => x.value).join(",")
      );
      formData.append("ChatMessage", values?.TextMessage);
      formData.append("ChatDateTime", formattedDate);
      formData.append("ChatBoxFile", ChatBoxFile);
      formData.append("ChatBoxFilePath", "");
      formData.append("ChatFileName", ChatFileName);
      formData.append("BatchID", guid);
      formData.append("CompanyIDEncrypted", AuthUser?.CompanyIDEncrypt);
      formData.append("BranchIDEncrypted", AuthUser?.BranchIDEncrypt);
      formData.append(
        "CreatedByEncrypt",
        AuthUser?.ReferenceIDEncrypt ? AuthUser?.ReferenceIDEncrypt : "0"
      );
      formData.append("IsAll", EmpIdAll == 1 ? true : false);

      postFormData(POST_ChatBoxEmployeeMessageInsert, formData)
        .then((response) => {
          // setIsLoading(true);
          if (response?.IsSuccess) {
            let MultiEmployeeMsgList = [];
            MultiEmployeeMsgList = values?.EmployeeIDEncrypt?.map((item) => {
              const labelWithoutParentheses = item?.label.split("(")[0].trim();
              const departmentNameFirstFive = item?.DepartmentName?.substring(
                0,
                5
              );
              return {
                ChatBoxIDEncrypt: "",
                SenderIDEncrypt: "",
                ReceiverIDEncrypt: EmpIdAll == 1 ? "" : item?.value,
                ChatMessage: TextMessage,
                ChatFilePath: "",
                ChatFileName: ChatFileName,
                ChatSendFile: ChatSendFile,
                ChatDate: result,
                ChatDateTime: "",
                ChatDateWeek: "",
                IsRead: false,
                ReadDate: "",
                BatchID: guid,
                SenderName: "",
                SenderEmployeePhoto: "",
                ReceiverName: EmpIdAll == 1 ? "All" : labelWithoutParentheses,
                ReceiverEmployeePhoto: "",
                SenderDepartmentName: "",
                ReceiverDepartmentName:
                  item?.DepartmentName?.length > 5
                    ? departmentNameFirstFive + "..."
                    : departmentNameFirstFive,
                IsAll: EmpIdAll == 1 ? true : false,
                SenderNameTitle: "",
                ReceiverNameTitle: "",
                MessageType: ChatFileName ? 3 : 2,
              };
            });

            formik.setFieldValue("EmployeeMsgList", [
              ...EmployeeMsgList,
              ...MultiEmployeeMsgList,
            ]);
            //scrollToBottom();
          } else {
            errorMessage(response?.Message);
          }
          //setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          //setIsLoading(false);
        });

      // formik.setFieldValue("EmployeeMsgList", [
      //   ...EmployeeMsgList,
      //   {
      //     ChatBoxIDEncrypt: "",
      //     SenderIDEncrypt: "",
      //     ReceiverIDEncrypt: "",
      //     ChatMessage: TextMessage,
      //     ChatFilePath: "",
      //     ChatFileName: ChatFileName,
      //     ChatSendFile: ChatSendFile,
      //     ChatDate: result,
      //     ChatDateTime: "",
      //     ChatDateWeek: "",
      //     IsRead: false,
      //     ReadDate: "",
      //     BatchID: "",
      //     SenderName: "",
      //     SenderEmployeePhoto: "",
      //     ReceiverName: EmpIdAll == 1 ? "All" : x?.label,
      //     ReceiverEmployeePhoto: "",
      //     SenderDepartmentName: "",
      //     ReceiverDepartmentName: x?.DepartmentName,
      //     IsAll: EmpIdAll == 1 ? true : false,
      //     SenderNameTitle: "",
      //     ReceiverNameTitle: "",
      //     MessageType: ChatFileName ? 3 : 2,
      //   },
      // ]);

      formik.setFieldValue("EmployeeIDEncrypt", "");
      formik.setFieldValue("TextMessage", "");
      formik.setFieldValue("ChatBoxFile", "");
      formik.setFieldValue("ChatFileName", "");
      formik.setFieldValue("ChatSendFile", "");

      scrollToBottom();
    } else {
      errorMessage("Please enter Message or file");
      return false;
    }
  };

  useEffect(() => {
    if (chat) {
      scrollToBottom();
      if (
        chat?.filter(
          (x) => x?.ReceiverIDEncrypt == AuthUser?.ReferenceIDEncrypt
        )?.length > 0
      ) {
        chat
          ?.filter((x) => x?.ReceiverIDEncrypt == AuthUser?.ReferenceIDEncrypt)
          ?.map((item) => {
            formik.setFieldValue("EmployeeMsgList", [
              ...EmployeeMsgList,
              { ...item, MessageType: item?.MessageType == 2 ? 1 : 4 },
            ]);
          });
      }

      scrollToBottom();
    }
  }, [chat]);

  useEffect(() => {
    if (deleteMessageBatchID) {
      scrollToBottom();

      formik.setFieldValue(
        "EmployeeMsgList",
        EmployeeMsgList?.filter(
          (x) =>
            x?.BatchID != deleteMessageBatchID &&
            x?.ReceiverIDEncrypt == AuthUser?.ReferenceIDEncrypt
        )
      );

      getEmployeeDetails(currentPage, currentSizePerPage);
      scrollToBottom();
    }
  }, [deleteMessageBatchID]);

  useEffect(() => {
    scrollToBottom();
    getEmployeeDDL();
    getEmployeeDetails(currentPage, currentSizePerPage);
    setThemeMode(
      document.querySelector("body").getAttribute("data-theme-version")
    );

    formik.setFieldValue("EmployeeIDEncrypt", "");
    formik.setFieldValue("TextMessage", "");
  }, []);

  const uploadFileChange = (e) => {
    // if (!EmployeeIDEncrypt) {
    //   errorMessage("Please Select Contact for Send Message");
    //   return false;
    // }

    let EmpIdAll = 0;
    if (EmployeeIDEncrypt) {
      if (EmployeeIDEncrypt?.filter((x) => x?.value == -1)?.length > 0) {
        EmpIdAll = 1;
      }
    }

    if (e.target.files[0]) {
      const file = e.target.files[0];

      // Maximum file size in bytes (adjust as needed)
      const maxSize = 20 * 1024 * 1024; // 20 MB

      if (file.size > maxSize) {
        warningMessage("File size exceeds the limit (20 MB)");
        formik.setFieldValue(
          "ChatFilekey",
          Math.random().toString(9).substring(2, 9)
        );
        formik.setFieldValue("EmployeeIDEncrypt", "");
        formik.setFieldValue("TextMessage", "");
        formik.setFieldValue("ChatBoxFile", "");
        formik.setFieldValue("ChatFileName", "");
        formik.setFieldValue("ChatSendFile", "");

        return;
      }

      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase(); // Extract file extension
      let fileExtensionName = fileExtension;

      if (
        fileExtensionName === "png" ||
        fileExtensionName === "gif" ||
        fileExtensionName === "jpeg" ||
        fileExtensionName === "jpg"
      ) {
        fileExtensionName = "image";
      } else if (fileExtensionName === "xls" || fileExtensionName === "xlsx") {
        fileExtensionName = "excel";
      } else if (fileExtension === "pdf") {
        fileExtensionName = "pdf";
      } else if (fileExtension === "txt") {
        fileExtensionName = "text";
      } else if (
        fileExtensionName === "bmp" ||
        fileExtensionName === "ppt" ||
        fileExtensionName === "zip" ||
        fileExtensionName === "rar"
      ) {
        fileExtensionName = fileExtensionName;
      } else if (fileExtensionName === "doc" || fileExtensionName === "docx") {
        fileExtensionName = "word";
      } else {
        // Handle other file types here
        fileExtensionName = "unknown";
      }

      const fileType = file.type;
      const validFileTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "image/png", // Image MIME types
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "application/pdf", // PDF MIME type
        "text/plain", // Text file MIME type
        "image/bmp", // BMP MIME type
        "application/vnd.ms-powerpoint", // PPT MIME type
        "application/zip", // ZIP MIME type
        "application/x-rar-compressed", // RAR MIME type
        "application/msword", // DOC MIME type
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX MIME type
        "audio/mpeg", // MP3
        "audio/wav", // WAV
        "audio/x-ms-wma", // WMA
        "video/mp4", // MP4
        "video/quicktime", // MOV
        "video/x-msvideo", // AVI
        "video/x-matroska", // MKV
      ]; // MIME types for Excel files

      if (!validFileTypes.includes(fileType)) {
        warningMessage("Please select a valid file");
        formik.setFieldValue(
          "ChatFilekey",
          Math.random().toString(9).substring(2, 9)
        );
        formik.setFieldValue("EmployeeIDEncrypt", "");
        formik.setFieldValue("TextMessage", "");
        return;
      } else {
        // alert(file?.name);
        formik.setFieldValue("ChatBoxFile", file);
        formik.setFieldValue("ChatFileName", file?.name);
        formik.setFieldValue("ChatSendFile", URL.createObjectURL(file));

        // let formData = new FormData();
        // formData.append(
        //   "SenderIDEncrypt",
        //   AuthUser?.ReferenceIDEncrypt ? AuthUser?.ReferenceIDEncrypt : "0"
        // );
        // formData.append(
        //   "ReceiverIDs",
        //   EmpIdAll == 1
        //     ? Array.from(employeeOptionsNotAll, (x) => x.value).join(",")
        //     : Array.from(EmployeeIDEncrypt, (x) => x.value).join(",")
        // );
        // formData.append("ChatMessage", "");
        // formData.append("ChatBoxFile", file);
        // formData.append("ChatBoxFilePath", "");
        // formData.append("ChatFileName", file?.name);
        // formData.append("BatchID", "");
        // formData.append("CompanyIDEncrypted", AuthUser?.CompanyIDEncrypt);
        // formData.append("BranchIDEncrypted", AuthUser?.BranchIDEncrypt);
        // formData.append(
        //   "CreatedByEncrypt",
        //   AuthUser?.ReferenceIDEncrypt ? AuthUser?.ReferenceIDEncrypt : "0"
        // );
        // formData.append("IsAll", EmpIdAll == 1 ? true : false);

        // postFormData(POST_ChatBoxEmployeeMessageInsert, formData)
        //   .then((response) => {
        //     setIsLoading(true);
        //     if (response?.IsSuccess) {
        //       //successMessage(response?.Message);
        //       setTimeout(() => {
        //         //navigate("/dashboard");
        //       }, 1000);
        //     } else {
        //       errorMessage(response?.Message);
        //     }
        //     setIsLoading(false);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     setIsLoading(false);
        //   });

        // let currentDate = new Date();
        // const result = getDateTimeInfoByDate();

        // formik.setFieldValue("EmployeeMsgList", [
        //   ...EmployeeMsgList,
        //   {
        //     ChatBoxIDEncrypt: "",
        //     SenderIDEncrypt: "",
        //     ReceiverIDEncrypt: "",
        //     ChatMessage: "",
        //     ChatFilePath: "",
        //     ChatFileName: file?.name,
        //     ChatSendFile: URL.createObjectURL(file),
        //     ChatDate: result,
        //     ChatDateTime: "",
        //     ChatDateWeek: "",
        //     IsRead: false,
        //     ReadDate: "",
        //     BatchID: "",
        //     SenderName: "",
        //     SenderEmployeePhoto: "",
        //     ReceiverName: EmpIdAll == 1 ? "All" : "",
        //     ReceiverEmployeePhoto: "",
        //     SenderDepartmentName: "",
        //     ReceiverDepartmentName: "",
        //     IsAll: EmpIdAll == 1 ? true : false,
        //     SenderNameTitle: "",
        //     ReceiverNameTitle: "",
        //     MessageType: 3,
        //   },
        // ]);

        formik.setFieldValue(
          "ChatFilekey",
          Math.random().toString(9).substring(2, 9)
        );
      }
    }

    // formik.setFieldValue("EmployeeIDEncrypt", "");
    // formik.setFieldValue("TextMessage", "");
    // formik.setFieldValue("IsAll", 0);
    scrollToBottom();
  };

  useEffect(() => {
    // Scroll down when component mounts or when props.messages change
    scrollToBottom();
  }, [TextMessage]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const getEmployeeDetails = (page = 1, sizePerPage = 50) => {
    setThemeMode(
      document.querySelector("body").getAttribute("data-theme-version")
    );
    setIsLoading(true);
    post(POST_GetChatBoxList, {
      EmployeeIDEncrypted: AuthUser?.ReferenceIDEncrypt,
      CompanyIDEncrypted: AuthUser?.CompanyIDEncrypt,
      BranchIDEncrypted: AuthUser?.BranchIDEncrypt,
      CurrentPage: page,
      PageSize: sizePerPage,
      Search: "",
      Sorting: "",
    })
      .then((response) => {
        if (response?.IsSuccess) {
          formik.setFieldValue("EmployeeMsgList", response?.List);
          setRecordCount(response?.TotalRecordCount);
          scrollToBottom();
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    scrollToBottom();
  };

  const dataLoadApiCallOnScroll = async () => {
    setCurrentPage(currentPage + 1);

    post(POST_GetChatBoxList, {
      EmployeeIDEncrypted: AuthUser?.ReferenceIDEncrypt,
      CompanyIDEncrypted: AuthUser?.CompanyIDEncrypt,
      BranchIDEncrypted: AuthUser?.BranchIDEncrypt,
      CurrentPage: currentPage + 1,
      PageSize: currentSizePerPage,
      Search: "",
      Sorting: "",
    })
      .then((response) => {
        if (response?.IsSuccess) {
          formik.setFieldValue("EmployeeMsgList", [
            ...response?.List,
            ...EmployeeMsgList,
          ]);
          setRecordCount(response?.TotalRecordCount);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  function getDateTimeInfoByDate() {
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
  }
  const setRemoveFile = () => {
    formik.setFieldValue("TextMessage", "");
    formik.setFieldValue("ChatBoxFile", "");
    formik.setFieldValue("ChatFileName", "");
    formik.setFieldValue("ChatSendFile", "");
  };

  useEffect(() => {
    if (EmployeeIDEncrypt) {
      if (
        EmployeeIDEncrypt?.filter((x) => x?.value == -1)?.length > 0 &&
        EmployeeIDEncrypt?.length > 1
      ) {
        formik.setFieldValue("EmployeeIDEncrypt", [
          { label: "All", value: "-1" },
        ]);
      }
    }
  }, [EmployeeIDEncrypt]);

  return (
    <Spin
      size="large"
      spinning={isLoading}
      tip={"Loading..."}
      style={{ position: "fixed" }}
    >
      <div className={`chatbox ${toggle === "chatbox" ? "active" : ""}`}>
        <div className="chatbox-close" onClick={() => onClick()}></div>
        <div className="custom-tab-1">
          <ul className="nav nav-tabs">
            <li className="nav-item"></li>
            <li className="nav-item">
              <Link className="nav-link">Chat Messages</Link>
            </li>
            <li className="nav-item"></li>
          </ul>

          <div className="tab-content">
            <div
              className={`tab-pane fade  ${
                toggleTab === "chat" ? "active show" : ""
              }`}
              id="chat"
              role="tabpanel"
            >
              <FormikProvider value={formik}>
                <Form onSubmit={formik.handleSubmit}>
                  <div
                    className={`card mb-sm-3 mb-md-0 contacts_card dlab-chat-user-box ${
                      openMsg ? "d-none" : ""
                    }`}
                  >
                    <div
                      className={`chat-container card-body msg_card_body  dz-scroll  ${
                        openMsg ? "" : ""
                      } `}
                      ref={chatContainerRef}
                      id="DZ_W_Contacts_Body3"
                      style={{
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column-reverse",
                      }}
                    >
                      <InfiniteScroll
                        dataLength={EmployeeMsgList.length}
                        next={dataLoadApiCallOnScroll}
                        hasMore={true}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          perspective: "1px",
                        }}
                        inverse={true} //
                        scrollableTarget="DZ_W_Contacts_Body3"
                      >
                        {EmployeeMsgList?.length > 0
                          ? EmployeeMsgList?.map((item, indx) => (
                              <>
                                {item?.MessageType == 1 ? (
                                  <div
                                    className="d-flex justify-content-start mb-4"
                                    key={indx}
                                  >
                                    <div
                                      className="img_cont_msg"
                                      onClick={() => {
                                        setOpenMsg(true);
                                        setEmaployeeNameForChat(
                                          item?.SenderNameTitle
                                        );
                                        setEmployeeIDForChat(
                                          item?.SenderIDEncrypt
                                        );
                                      }}
                                      title={item?.SenderNameTitle}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <img
                                        src={item?.SenderEmployeePhoto}
                                        className="rounded-circle user_img_msg"
                                        alt=""
                                      />
                                    </div>

                                    <div className="msg_cotainer">
                                      <div
                                        className="d-flex justify-content-start"
                                        style={{
                                          color: "#ffcb52",
                                          fontSize: "11px",
                                        }}
                                        title={item?.SenderNameTitle}
                                      >
                                        {item?.SenderName}
                                        <span
                                          className="msg_time_sendfilebox"
                                          style={{
                                            fontSize: "11px",
                                          }}
                                        >
                                          {item.SenderDepartmentName
                                            ? "(" +
                                              item.SenderDepartmentName +
                                              ")"
                                            : ""}
                                        </span>
                                      </div>
                                      <div
                                        style={{
                                          textAlign: "left",
                                          whiteSpace: "pre-wrap",
                                        }}
                                      >
                                        {item?.ChatMessage}
                                      </div>
                                      <span className="msg_time">
                                        {item?.ChatDate}
                                      </span>
                                    </div>
                                  </div>
                                ) : item?.MessageType == 3 ? (
                                  <div className="d-flex justify-content-end mb-4 ">
                                    <div className="msg_cotainer_send">
                                      <div
                                        className="d-flex justify-content-end"
                                        style={{
                                          color: "#3c9b0d",
                                          fontSize: "11px",
                                        }}
                                        title={item?.ReceiverNameTitle}
                                      >
                                        {item?.IsAll == 1 ? (
                                          item?.ReceiverName
                                        ) : item?.ReceiverName ? (
                                          <>
                                            {item?.ReceiverName}&nbsp;
                                            <span
                                              className="msg_time_sendfilebox"
                                              style={{
                                                fontSize: "11px",
                                              }}
                                            >
                                              ({item.ReceiverDepartmentName})
                                            </span>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                      <Link
                                        to="#"
                                        className=""
                                        title="View File"
                                        style={{ maxWidth: "90%" }}
                                        onClick={() => {
                                          window.open(
                                            item.ChatFilePath
                                              ? item.ChatFilePath
                                              : item.ChatSendFile
                                          );
                                        }}
                                      >
                                        <span>
                                          <i
                                            class="fa fa-file "
                                            aria-hidden="true"
                                            style={{
                                              fontSize: "xxx-large",
                                            }}
                                          ></i>
                                        </span>
                                        <br />
                                        <span
                                          className="msg_time_sendfilebox"
                                          style={{
                                            fontSize: "11px",
                                          }}
                                        >
                                          {item?.ChatFileName}
                                        </span>
                                      </Link>
                                      <div
                                        style={{
                                          textAlign: "left",
                                          whiteSpace: "pre-wrap",
                                        }}
                                      >
                                        {item?.ChatMessage}
                                      </div>
                                      <span className="msg_time_send">
                                        {item?.ChatDate}
                                      </span>
                                    </div>
                                    <div className="img_cont_msg">
                                      <img
                                        src={
                                          item?.SenderEmployeePhoto == ""
                                            ? AuthUser?.Photo
                                            : item?.SenderEmployeePhoto
                                        }
                                        className="rounded-circle user_img_msg"
                                        alt=""
                                      />
                                      <div
                                        className="dropdown"
                                        style={{ textAlign: "center" }}
                                      >
                                        <Link
                                          to={"#"}
                                          data-toggle="dropdown"
                                          aria-expanded="false"
                                          title="Delete Message"
                                          onClick={() => {
                                            delete_Record(
                                              POST_ChatBoxEmployeeMessageDelete,
                                              {
                                                BatchID: item?.BatchID,
                                                EmployeeIDEncrypted:
                                                  item?.ReceiverIDEncrypt
                                                    ? item?.ReceiverIDEncrypt
                                                    : "",
                                                ModifiedByEncrypt:
                                                  AuthUser?.ReferenceIDEncrypt
                                                    ? AuthUser?.ReferenceIDEncrypt
                                                    : "0",
                                              },
                                              setIsLoading,
                                              fnCallback,
                                              "Message"
                                            );
                                            scrollToBottom();
                                          }}
                                        >
                                          {SVGICON.DeleteDanger}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ) : item?.MessageType == 2 ? (
                                  <div className="d-flex justify-content-end mb-4">
                                    <div className="msg_cotainer_send">
                                      <div
                                        className="d-flex justify-content-end"
                                        style={{
                                          color: "#3c9b0d",
                                          fontSize: "11px",
                                        }}
                                        title={item?.ReceiverNameTitle}
                                      >
                                        {item?.IsAll == 1 ? (
                                          item?.ReceiverName
                                        ) : item?.ReceiverName ? (
                                          <>
                                            {item?.ReceiverName}&nbsp;
                                            <span
                                              className="msg_time_sendfilebox"
                                              style={{
                                                fontSize: "11px",
                                              }}
                                            >
                                              ({item.ReceiverDepartmentName})
                                            </span>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                      <div
                                        style={{
                                          textAlign: "left",
                                          whiteSpace: "pre-wrap",
                                        }}
                                      >
                                        {item?.ChatMessage}
                                      </div>
                                      <span className="msg_time_send">
                                        {item?.ChatDate}
                                      </span>
                                    </div>
                                    <div className="img_cont_msg">
                                      <img
                                        src={
                                          item?.SenderEmployeePhoto == ""
                                            ? AuthUser?.Photo
                                            : item?.SenderEmployeePhoto
                                        }
                                        className="rounded-circle user_img_msg"
                                        alt=""
                                      />
                                      <div
                                        className="dropdown"
                                        style={{ textAlign: "center" }}
                                      >
                                        <Link
                                          to={"#"}
                                          data-toggle="dropdown"
                                          aria-expanded="false"
                                          title="Delete Message"
                                          onClick={() => {
                                            delete_Record(
                                              POST_ChatBoxEmployeeMessageDelete,
                                              {
                                                BatchID: item?.BatchID,
                                                EmployeeIDEncrypted:
                                                  item?.ReceiverIDEncrypt
                                                    ? item?.ReceiverIDEncrypt
                                                    : "",
                                                ModifiedByEncrypt:
                                                  AuthUser?.ReferenceIDEncrypt
                                                    ? AuthUser?.ReferenceIDEncrypt
                                                    : "0",
                                              },
                                              setIsLoading,
                                              fnCallback,
                                              "Message"
                                            );
                                            scrollToBottom();
                                          }}
                                        >
                                          {SVGICON.DeleteDanger}
                                        </Link>
                                      </div>
                                    </div>
                                    &nbsp;
                                  </div>
                                ) : item?.MessageType == 4 ? (
                                  <div className="d-flex justify-content-start mb-4">
                                    <div
                                      className="img_cont_msg"
                                      onClick={() => {
                                        setOpenMsg(true);
                                        setEmaployeeNameForChat(
                                          item?.SenderName
                                        );
                                        setEmployeeIDForChat(
                                          item?.SenderIDEncrypt
                                        );
                                      }}
                                    >
                                      <img
                                        src={item?.SenderEmployeePhoto}
                                        className="rounded-circle user_img_msg"
                                        alt=""
                                      />
                                    </div>

                                    <div className="msg_cotainer">
                                      <div
                                        className="d-flex justify-content-start"
                                        style={{
                                          color: "#ffcb52",
                                          fontSize: "11px",
                                        }}
                                        title={item?.SenderNameTitle}
                                      >
                                        {item?.SenderName}&nbsp;
                                        <span
                                          className="msg_time_sendfilebox"
                                          style={{ marginTop: "0.1125rem" }}
                                        >
                                          {item.SenderDepartmentName
                                            ? "(" +
                                              item.SenderDepartmentName +
                                              ")"
                                            : ""}
                                        </span>
                                      </div>
                                      <Link
                                        to="#"
                                        className=""
                                        title="View File"
                                        style={{ maxWidth: "90%" }}
                                        onClick={() => {
                                          window.open(
                                            item.ChatFilePath
                                              ? item.ChatFilePath
                                              : item.ChatSendFile
                                          );
                                        }}
                                      >
                                        <i
                                          class="fa fa-file "
                                          aria-hidden="true"
                                          style={{
                                            fontSize: "xxx-large",
                                          }}
                                        ></i>
                                        <br />
                                        <span className="msg_time_sendfilebox">
                                          {item?.ChatFileName}
                                        </span>
                                        <div
                                          style={{
                                            textAlign: "left",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {item?.ChatMessage}
                                        </div>
                                        <span className="msg_time">
                                          {item?.ChatDate}
                                        </span>
                                      </Link>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>
                            ))
                          : ""}
                      </InfiniteScroll>
                    </div>

                    <div
                      className="card-footer type_msg"
                      style={{
                        position: "sticky",
                        bottom: "0px",
                        // backgroundColor:
                        //   themeMode === "dark" ? "#242424" : "#fff",
                      }}
                    >
                      <div style={{ marginTop: -20 }}>
                        <Field
                          name="EmployeeIDEncrypt"
                          placeholder={"Search Contact...."}
                          options={employeeOptions}
                          component={CustomMultiSelect}
                          isMulti={true}
                          menuPosition="fixed"
                          noMarginBottom={false}
                        />
                      </div>

                      {ChatFileName ? (
                        <>
                          <span>{ChatFileName}</span>&nbsp;
                          <Button
                            type="button"
                            variant=""
                            className="btn-close"
                            onClick={() => setRemoveFile()}
                          ></Button>
                        </>
                      ) : (
                        ""
                      )}
                      <div className="input-group ">
                        <div style={{ width: "90%", paddingRight: 3 }}>
                          <Field
                            name="TextMessage"
                            placeholder={" Type Your Message..."}
                            component={CustomTextArea}
                            rows={4}
                            noMarginBottom={true}
                            style={{ padding: "0.25rem 0.4rem" }}
                          />
                        </div>
                        <div
                          className="input-group-append"
                          style={{
                            width: "10%",
                          }}
                        >
                          <button
                            type="submit"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              formik.setFieldValue("btnSubmitType", 2);
                            }}
                          >
                            <i className="fa fa-location-arrow"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => {
                              document.getElementById("chatFileUpload").click();
                              scrollToBottom();
                            }}
                          >
                            <i class="fa fa-paperclip" aria-hidden="true"></i>
                          </button>
                          <input
                            type="file"
                            id="chatFileUpload"
                            className="d-none"
                            onChange={uploadFileChange}
                            key={ChatFilekey || ""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </FormikProvider>
            </div>
            {openMsg ? (
              <ChatMsgBox
                EmpID={employeeIDForChat}
                avatar1={avatar1}
                avatar2={avatar2}
                openMsg={openMsg}
                EmaployeeNameForChat={emaployeeNameForChat}
                //PerfectScrollbar={PerfectScrollbar}
                offMsg={() => setOpenMsg(false)}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default ChatBoxLIMS;
