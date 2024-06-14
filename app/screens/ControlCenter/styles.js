import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../config/scaling";
import { BaseColor } from "../../config";

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  container: { paddingHorizontal: 20 },
  event: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    //marginTop: 15,
  },
  event1: {
    width: "100%",
    height: "100%",
    //borderRadius: 10,
    //marginTop: 15,
  },

  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 0,
  },

  cardImage: {
    width: moderateScale(34),
    height: moderateScale(34),
    marginTop: 0,
  },

  cardImage1: {
    width: moderateScale(30),
    height: moderateScale(30),
    marginTop: 0,
    marginRight: 5,
  },

  contain: {
    height: 50,
    flexDirection: "row",
    backgroundColor: BaseColor.Card,
    borderBottomWidth: 2,
    borderBottomColor: BaseColor.HeaderColor,
    paddingLeft: 12,
    justifyContent: "space-between",
  },

  dropdown: {
    width: "100%",
    height: moderateScale(58),
    borderColor: BaseColor.darkGraycolor,
    color: BaseColor.darkGraycolor,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: moderateScale(10),
  },
  placeholderStyle: {
    fontSize: 16,
    color: BaseColor.mainTransp,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: BaseColor.mainTransp,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BaseColor.borderColor,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  Found: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(1150),
  },
});
