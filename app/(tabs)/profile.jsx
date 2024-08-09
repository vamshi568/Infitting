import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { deleveredList, getProfile } from "../../components/service/api";
import { Loader2 } from "../../components/loader";
import { Profile1 } from "../../components/helpers";

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const customer = await getProfile();
      const recentList = await deleveredList();
      setData({ ...customer, recently: [...recentList] });
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader2 />;
  }
  const onRefresh = () => {
    fetchData();
  };

  
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          className="flex-1 bg-white mt-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        >
          <Profile1 data={data} />
        </ScrollView>
      </SafeAreaView>
    );
  }
  
export default Profile;
