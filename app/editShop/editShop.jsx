import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AddShop } from "../../components/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../../components/service/api";

const EditShop = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const response = await getProfile();
      setProfile(response.user[0]);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white">
      {loading ? (
        <View className="h-screen flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <AddShop data={profile} />
      )}
    </ScrollView>
  );
};

export default EditShop;
