import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { Link, Redirect, router, useFocusEffect } from "expo-router";
import { icons } from "../../constants";
import { completedList, incompletedList } from "../../components/service/api";
import { serverUrl } from "../../components/helpers";
import { Loader4 } from "@/components/loader";
import {scheduleNotification} from "../../components/hooks/useAuth";
const Home = () => {
  const [completedItems, setCompletedItems] = useState([]);
  const [incompletedItems, setIncompletedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    setCompletedItems([]);
    setIncompletedItems([]);
    const completedData = await completedList();
    const incompletedData = await incompletedList();
    if (completedData && completedData.length > 0) {
      setCompletedItems(
        completedData.map((item) => ({
          ...item,
          id: item._id,
          photo: item.photos[0] ? item.photos[0] : null,
          status: item.status,
          daysleft: 0,
          customerName: item.customerName,
          itemType: item.type_cloth,
        }))
      );
    }
    if (incompletedData && incompletedData.length > 0) {
      setIncompletedItems(
        incompletedData.map((item) => ({
          ...item,
          id: item._id,
          photo: item.photos[0] ? item.photos[0] : null,
          status: item.status,
          daysleft: item.daysLeft,
          customerName: item.customerName,
          itemType: item.type_cloth,
        }))
      );
    }
    setIsLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    // scheduleNotification({deliveryDate: new Date(),name:'check',type:'shirt',_id:'66b4b250ee609545d1663f4a',})
  };

  const handleSearchPress = () => {
    router.push("/search", { focus: true });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/details/${item.id}`)}
      className={`h-full`}
    >
      <View className="flex items-center w-24">
        <View
          className={` ${
            item.isUrgent && "border-4 border-red-700"
          } w-16 mb-3 h-16 bg-accent rounded-full `}
        >
          <Image
            source={{ uri: `${serverUrl()}/photos/${item.photo}` }}
            className="w-full rounded-full h-full"
          />
        </View>
        <View className="items-center">
          <Text className="text-md font-bold text-accent1">
            {item.customerName.length > 13
              ? item.customerName.slice(0, 13) + "..."
              : item.customerName}
          </Text>
          <Text className="text-accent">{item.itemType}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItem1 = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => router.push(`/details/${item.id}`)}
    >
      <View className="flex flex-row items-center justify-center m-1 bg-backgeound rounded-xl p-4">
        <View
          className={`w-14 mr-4 h-14 bg-accent1 rounded-full ${
            item.isUrgent && "border-4  border-red-700"
          }`}
        >
          <Image
            source={{ uri: `${serverUrl()}/photos/${item.photo}` }}
            className="w-full rounded-full h-full"
          />
        </View>
        <View className="self-start">
          <Text className="text-lg font-bold text-accent1">
            {item.customerName.length > 13
              ? item.customerName.slice(0, 13) + "..."
              : item.customerName}
          </Text>
          <Text className="text-accent font-light">
            {item.itemType} -{" "}
            <Text
              className={`${
                item.daysleft > 0 ? "text-green-700" : "text-red-800"
              }`}
            >
              {item.status}
            </Text>
          </Text>
        </View>
        <Text
          className={`text-accent text-base ml-auto place-self-end ${
            item.daysleft > 0 ? "text-green-700" : "text-red-800"
          }`}
        >
          {Math.abs(item.daysleft)}
          {item.daysleft > 0 ? ` days Left` : " days ago"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => {
    return (
      <Text className="text-base font-thin my-10 text-center text-accent1">
        No Order Currently
      </Text>
    );
  };

  if (isLoading) {

    return <Loader4 />;
  }

  return (
    <SafeAreaView className="flex-1 w-screen pt-10 bg-primary">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className=" w-full"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <View className="flex flex-row justify-between w-full items-center p-2 px-3 ">
          <View className="flex flex-row items-center">
            <Image
              className="w-16 h-12 "
              source={require("../../assets/infitting4.png")}
            />
            <Text className="text-3xl font-semibold text-accent1 font-[JimNightshade]">
              Infitting
            </Text>
          </View>
          <TouchableOpacity onPress={handleSearchPress} >
            <Image
              className="w-5 h-6"
              source={require("../../assets/icons/bell.png")}
            />
          </TouchableOpacity>
        </View>
        <View className="h-0.5 bg-backgeound mb-4 w-screen"></View>

        <View className="bg-backgeound rounded-3xl p-4">
            <TouchableOpacity
              className="flex flex-row items-center"
              onPress={() => setShowModal(!showModal)}
            >
            <Text className="text-2xl font-bold text-accent1">
              Completed List{" "}
            </Text>
              <Image
                source={require("../../assets/icons/arrow_drop_down.png")}
              />
            </TouchableOpacity>
          <Modal
            visible={showModal}
            transparent={true}
            onRequestClose={() => setShowModal(false)}
          >
            <TouchableOpacity
              onPressIn={() => setShowModal(false)}
              className="flex z-0 justify-center items-center h-screen bg-[#00000080]"
            >
              <View className=" bg-backgeound h-1/2 rounded-3xl z-10">
                <FlatList
                  className="p-6 "
                  data={completedItems}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  renderItem={renderItem}
                />
              </View>
            </TouchableOpacity>
          </Modal>
          <FlatList
            className="mt-6"
            data={completedItems}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyList}
            showsHorizontalScrollIndicator={false}
            alwaysBounceVertical={true}
          />
        </View>

        <Text className="text-2xl font-bold ml-4 text-accent1 mt-4 mb-4">
          In progress List
        </Text>
        {incompletedItems.length > 0
          ? incompletedItems.map((item) => renderItem1(item))
          : renderEmptyList()}
      </ScrollView>
      <TouchableOpacity
        className="w-16 h-16 bg-[#ffffff] justify-center rounded-full bottom-5 right-5 z-10 absolute"
        onPress={() => router.push(`/orders/new`)}
      >
        <Image
          source={icons.plus}
          className="w-[65px] h-16 self-center rounded-full"
        />
        <Text className="text-primary text-center left-[15px] font-bold text-sm absolute">
          New Order
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default styled(Home);
