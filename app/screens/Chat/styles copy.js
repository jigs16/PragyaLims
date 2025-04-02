import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../config/scaling";
import { BaseColor } from "../../config";

export default StyleSheet.create({
  BottomView: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    position: "absolute",
    bottom: 68,
    width: "100%",
    // flex: 1,
    backgroundColor: BaseColor.whiteColor,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    // width:'90%',
    flex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    alignSelf: "flex-end", // Aligns the icon to the end of the row
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    bottom: 10,
  },
  sendButton1: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    width: "10%",
    left: 3,
    bottom: 0,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 40,
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 2.5,
    maxHeight: 200, // Optional: limit the height of the dropdown
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d4f4bf",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: BaseColor.whiteColor,
  },
  messageText: {
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
    marginBottom: 0,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#fafafa",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedItemsContainer: {
    marginTop: 20,
    width: "100%",
  },
  selectedItem: {
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    backgroundColor: BaseColor.whiteColor,
    borderRadius: 14,
    position: "absolute",
    elevation: 5,
    width: "92%",
    padding: moderateScale(20),
    paddingBottom: moderateScale(5),
    // alignItems: 'center',
    justifyContent: "center",
    alignSelf: "center",
    maxHeight: verticalScale(1255),
  },
  modalCheckImg: {
    width: moderateScale(24),
    height: moderateScale(24),
    // marginBottom: moderateScale(20),
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
    height: 60,
  },
  backButton: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    color: BaseColor.darkColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  status: {
    color: BaseColor.darkGraycolor,
    fontSize: 12,
  },
  moreButton: {
    marginLeft: "auto",
  },
});
