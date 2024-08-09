import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Animated } from "react-native";
import { icons } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { serverUrl } from "../components/helpers";
import { Alert } from "react-native";
import * as Updates from "expo-updates";
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

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  const maxRetryCount = 3;

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

  const checkingServer = async () => {
    try {
      const response = await fetch(`${serverUrl}/customers/search?search=`);
      if (response.status === 200) {
        console.log("connected to server");
      } else if (retryCount < maxRetryCount) {
        setRetryCount(retryCount + 1);
        setTimeout(() => checkingServer(), 2000);
      } else {
        Alert.alert(
          "Error",
          "Server is not responding. Please try again later."
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    checkForUpdates();
    checkingServer();
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
        <Animated.View style={[slideUpStyle]} className=" h-[60vh] w-full">
          <LinearGradient
            colors={["#526D82", "#27374D"]}
            className=" flex flex-col justify-center px-8 h-[100%] "
          >
            <View className="flex items-center flex-row">
              <Text
                style={{ fontFamily: "ImperialScript" }}
                className="text-[50px]  text-[#DFB66D] "
              >
                Snip{" "}
              </Text>
              {/* <FontAwesome5 name="cut" size={20} color="#DFB66D" /> */}
            </View>
            <View className="flex items-center flex-row ">
              <Text
                style={{ fontFamily: "ImperialScript" }}
                className="text-[48px] text-[#DFB66D] "
              >
                Stitch{" "}
              </Text>
              <FontAwesome5 name="" size={48} color="#00FFFF" />
            </View>
            <View className="flex items-center flex-row ">
              <Text
                style={{ fontFamily: "ImperialScript" }}
                className="text-[48px] text-[#DFB66D] "
              >
                Succeed{" "}
              </Text>
              {/* <FontAwesome5 name="check-circle" size={20} color="#DFB66D77" /> */}
            </View>
            <Text className="text-[35px] font-[JimNightshade] text-[#FFFFFF] mt-4 text-center">
              Track your Tailoring Tasks!
            </Text>
            <View className="w-0 h-0 bg-transparent absolute  top-[64vw] border-solid border-t-[50vw] border-l-[50vw] border-r-[50vw] border-b-[50vw]  border-[#27374D] border-t-transparent border-l-transparent rotate-45 ">
              <TouchableOpacity
                className="absolute rotate-[-45deg] top-20 left-[78px]"
                onPress={handleSlideUp}
              >
                <Image source={icons.button} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default Appbla;
