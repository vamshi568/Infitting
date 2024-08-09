// components/loader/Loader.jsx
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import { images } from '../constants';
export const Loader = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View  className='flex-1 items-center justify-center bg-primary'>
      <Animated.Image
        source={require('../assets/images/loading_icon.png')}
        style={[styles.loaderImage, { transform: [{ rotate }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  
  loaderImage: {
    width: 100, 
    height: 100, 
  },
});

export const Loader2 = ({msm}) => {
  return (
    <View className="flex items-center justify-center bg-primary h-full">
      <LottieView
        source={require("../assets/Sew.json")}
        style={{ width: 200, height: 200 }}
        autoPlay
        loop
      />
      <Text className="text-accent1 text-xl">{msm}</Text>
    </View>
  );
  
}
export const Loader3 = ({msm}) => {
  return (
    <View className="flex flex-col items-center justify-center bg-primary h-full">
      <LottieView
        source={require("../assets/small.json")}
        style={{ width: 400, height: 400 }}
        autoPlay
        loop
        duration={5000}
        
      />
      <Text className="text-accent1 text-xl">{msm || 'Loading...'}</Text>
    </View>
  );
  
}



export const Loader4=()=>{

  return (
    <SafeAreaView className=" flex items-center bg-white flex-1 justify-center">
      <Image className="w-28 h-28 " source={require("../assets/images/shirt.gif")}/>
    </SafeAreaView>
  )
}