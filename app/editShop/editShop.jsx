import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { AddShop } from "../../components/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../../components/service/api";

const EditShop = () => {
  const [profile, setProfile] = useState(null);

  
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await getProfile()
        setProfile(response.user[0]);
      }
    };
    useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white">
      <AddShop data={profile} />
    </ScrollView>
  );
};

export default EditShop;
