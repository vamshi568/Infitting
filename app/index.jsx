import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { Animated } from "react-native";
import { icons } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";



const Appbla = () => {
  const [animation, setAnimation] = useState(true);
  const [isSlideUp, setIsSlideUp] = useState(false);
  const slideUpAnim = useState(new Animated.Value(0))[0];
  const [token, setToken] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const notification=async()=>{
    await Notifications.requestPermissionsAsync({android: {allowAlert: true, allowBadge: true, allowSound: true, allowAnnouncements: true}});
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }


  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setToken(token);
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  useEffect(() => {
    checkForUpdates();
    notification()
    setIsSlideUp(true);
    getToken();
  }, []);
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data.url;
        router.navigate(url);
      }
    );

    return () => subscription.remove();
  }, []);

  const handleSlideUp = async () => {
    setIsSlideUp(!isSlideUp);

    await Animated.timing(slideUpAnim, {
      toValue: isSlideUp ? 5 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    router.push("/Login");
  };

  const slideUpStyle = {
    transform: [
      {
        translateY: slideUpAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
    ],
  };

  if (animation) {
    return (
      <SafeAreaView className=" flex items-center  flex-1 justify-center">
        <LottieView
          source={require("../assets/small.json")}
          className="h-1/2 w-full mt-36 "
          autoPlay
          loop={false}
          duration={6000}
          onAnimationFinish={() => setAnimation(false)}
        />
      </SafeAreaView>
    );
  }
  if (token) {
    return <Redirect href={"/home"} />;
  }
  return (
    <>
      <SafeAreaView className=" flex  flex-1 ">
        <Animated.View style={[slideUpStyle]} className=" h-[80vh] w-full">
          <LinearGradient
            colors={["#526D82", "#27374D"]}
            className=" flex flex-col justify-center px-8 h-[100%] rounded-b-full"
          >
            <View className="flex items-center flex-row">
              <Text
                style={{ fontFamily: "ImperialScript" }}
                className="text-[50px]  text-[#DFB66D] "
              >
                Snip{" "}
              </Text>
            </View>
            <View className="flex items-center flex-row ">
              <Text
                style={{ fontFamily: "ImperialScript" }}
                className="text-[48px] text-[#DFB66D] "
              >
                Stitch{" "}
              </Text>
            </View>
            <View className="flex items-center flex-row ">
              <Text
                style={{ fontFamily: "ImperialScript" }}
                className="text-[48px] text-[#DFB66D] "
              >
                Succeed{" "}
              </Text>
            </View>
            <Text className="text-[35px] font-[JimNightshade] text-[#FFFFFF] mt-4 text-center">
              Track your Tailoring Tasks!
            </Text>
              <TouchableOpacity
                className=" absolute -bottom-9 left-[50%] "
                onPress={handleSlideUp}
              >
                <Image source={icons.button} />
              </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default Appbla;

