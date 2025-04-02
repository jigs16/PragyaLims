import React from "react";
import { ActivityIndicator, Modal, View,Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import styles from "./styles";

const Loader = (props) => {
  const {
    loading,
    color,
    useCircularProgress = false,
    tintColor,
    backgroundColor = "#FFFFFF",
    size = 120,
    width = 15,
    fill = 0,
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={() => {
        console.log("close modal");
      }}
    >
      <View style={styles.modalBackground}>
          {useCircularProgress ? (
            <AnimatedCircularProgress
              size={size}
              width={width}
              fill={fill}
              tintColor={tintColor}
              onAnimationComplete={() => console.log("onAnimationComplete")}
              backgroundColor={backgroundColor}
            >
              {(fill) => <Text style={{color:'white',fontSize:20}}>{fill + "%"}</Text>}
            </AnimatedCircularProgress>
          ) : (
            <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={loading} size="large" color={color} />
            </View>
          )}
      </View>
    </Modal>
  );
};

export default Loader;
