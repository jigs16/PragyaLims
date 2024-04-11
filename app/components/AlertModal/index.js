import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Modal, Pressable, StyleSheet, View, useColorScheme } from "react-native";
import Text from "../Text";
import { BaseColor, BaseStyle, Images } from "../../config";
import { moderateScale, verticalScale } from "../../config/scaling";
import { BookModal, Button, TextInput } from "..";
import GridList from "../GridList";

const AlertModal = (props) => {
  const {
    showAlertModal,
    setShowAlertModal,
    onRequestClose,
    title = "",
    message = "",
    Data,
    logoutPress = '',
    logout,
    okayPress = '',
  } = props;
  const { t } = useTranslation();
  const isDarkMode = useColorScheme();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showAlertModal}
      onRequestClose={onRequestClose}
    >
      <View style={{ flex: 1, backgroundColor: isDarkMode === 'dark' ? '#8a8a8ecc' : '#00000080'}}>
        <View style={styles.centeredView}>
        <View style={[styles.modalView, {backgroundColor:isDarkMode === 'dark' ? '#191919' : '#ffffff'}]}>
            {title != "" && (
              <Text
                title2
                textAlign={"center"}
                style={{marginBottom: moderateScale(20), color:isDarkMode === 'dark' ? '#ccc' : '#000000'}}
              >
                {title}
              </Text>
            )}
            {message != "" && (
              <Text callout textAlign={"center"} style={{color:isDarkMode === 'dark' ? '#ccc' : '#000000'}}>
                {message}
              </Text>
            )}

            {logout ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  outline
                  style={{
                    marginTop: moderateScale(30),
                    height: verticalScale(70),
                    width: "50%",
                    alignSelf: "center",
                    marginRight: 5,
                  }}
                  onPress={() => {
                    setShowAlertModal(false);
                  }}
                >
                  {t("Cancel")}
                </Button>

                <Button
                  full
                  style={[styles.btnView, { marginLeft: 5,backgroundColor:isDarkMode === 'dark' ? '#7d7878' : '#000000'}]}
                  onPress={logoutPress}
                >
                  {t("Okay")}
                </Button>
              </View>
            ) : okayPress == '' ? (
              <Button
                full
                style={[styles.btnView, {marginLeft: 5, backgroundColor:isDarkMode === 'dark' ? '#7d7878' : '#000000'}]}
                onPress={() => {
                  setShowAlertModal(false);
                }}>
                {t('Okay')}
              </Button>
            ) : (
              <Button
                full
                style={[styles.btnView, {marginLeft: 5, backgroundColor:isDarkMode === 'dark' ? '#7d7878' : '#000000'}]}
                onPress={() => {
                  okayPress();
                }}>
                {t('Okay')}
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default AlertModal;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    margin: moderateScale(40),
  },
  modalView: {
    //margin: 0,

    backgroundColor: BaseColor.AlertModal,
    borderRadius: moderateScale(20),
    //   position: 'absolute',
    //alignItems: "center",
    //shadowColor: "#000",
    // shadowOffset: {
    //     width: 0,
    //     height: 2
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 5,
    width: "100%",
    padding: moderateScale(30),
  },

  btnView: {
    marginTop: moderateScale(30),
    backgroundColor: BaseColor.modelBtn1,
    height: verticalScale(70),
    width: "50%",
    alignSelf: "center",
  },
});
