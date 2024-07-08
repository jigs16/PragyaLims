import { StyleSheet } from "react-native";
import { moderateScale } from "../../config/scaling";
import { BaseColor } from "../../config";

export default StyleSheet.create({
  BottomView: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    position: "absolute",
    bottom: 68,
    width: "100%",
    // flex: 1,
    backgroundColor:BaseColor.whiteColor
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
    paddingHorizontal: 10,
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
    paddingHorizontal:15,
    paddingVertical:2.5,
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
    backgroundColor: "#E1E1E1",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: BaseColor.buttonGradient2,
  },
  messageText: {
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});
