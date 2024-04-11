import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';

export default function NextButton({percentage, scrollto}) {
  const size = 86;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumFerence = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  const animation = toValue => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener(
      value => {
        const strokeDashoffset =
          circumFerence - (circumFerence * value.value) / 100;
        if (progressRef?.current) {
          progressRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [percentage],
    );

    return () => {
      progressAnimation.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* <Svg width={size} height={size}>
        <G rotation="-90" origin={center}>
          <Circle
            stroke="#E6E6E6"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke="#24BCD8"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumFerence}
            ref={progressRef}
          />
        </G>
      </Svg> */}
      <TouchableOpacity onPress={scrollto} style={[styles.button]}>
        {/* <LinearGradient
          colors={['rgba(64,216,244,0.25)', 'rgba(75, 247, 226, 0.85)']}
          style={[styles.button, styles.shadowProp]}
          {...deg(124)}>
          <IC_Next_Button />
        </LinearGradient> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 21,
  },
  button: {
    position: 'absolute',
    backgroundColor: '#40D8F4',
    borderRadius: 60/2,
    width: 60,
    height: 60,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#FFFFFF',
      shadowOpacity: 0.7,
      shadowRadius: 30,
      shadowOffset: {
        height: 0,
        width: 0,
      },
     
      elevation: 30,
  },
});
