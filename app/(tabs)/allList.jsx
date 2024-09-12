import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { searchCustomers } from "../../components/service/api";
import { Loader, Loader2 } from "../../components/loader";
import { router } from "expo-router";
import { serverUrl } from "../../components/helpers";
const AllList = () => {
  const [listOfCustomers, setListOfCustomers] = useState([]);
  const [filter, setFilter] = useState("name");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleFetchData = useCallback(async () => {
    setLoading(true);
    const data = await searchCustomers("");
    setListOfCustomers([...data]);
    setFilter("");
    setLoading(false);
  }, [page, loading]);

  useEffect(() => {
    handleFetchData();
  }, []);
  const renderItem = useMemo(
    () =>
      ({ item }) =>
        (
          <TouchableOpacity
            onPress={() => router.push(`/profiledetails/${item.customer_id}`)}
          >
            <View className="flex flex-row items-center justify-center m-1 bg-backgeound rounded-xl p-4">
              <View className="bg-secondary w-14 h-14 items-center justify-center mr-4 rounded-full">
                <Image
                  source={
                    item.profile_pic
                      ? {
                          uri: `${serverUrl()}/photos/${item.profile_pic}`,
                        }
                      : require("../../assets/icons/Profile1.png")
                  }
                  className={
                    item.profile_pic
                      ? "w-full h-full rounded-full"
                      : "w-10 h-10 rounded-full"
                  }
                />
              </View>
              <View className="self-start">
                <Text className="text-lg font-bold text-accent1">
                  {item.name.length > 13
                    ? item.name.slice(0, 13) + "..."
                    : item.name}
                </Text>
                <Text className="text-accent1 font-light">
                  {item.phone_number}
                </Text>
              </View>
              <Text className="text-accent1 text-base ml-auto place-self-end ">
                {item.customer_id}
              </Text>
            </View>
          </TouchableOpacity>
        ),
    [listOfCustomers]
  );

  const sortedCustomers = useMemo(() => {
    if (filter === "id") {
      return [...listOfCustomers].sort((a, b) => a.customer_id - b.customer_id);
    } else if (filter === "name") {
      return [...listOfCustomers].sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === "date") {
      return [...listOfCustomers].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }
    return listOfCustomers;
  }, [filter,listOfCustomers]);

  if (loading) {
    return <Loader />;
  }
  if (listOfCustomers.length === 0) {
    return (
      <RefreshControl refreshing={loading} onRefresh={handleFetchData}>
        <View className="flex h-screen justify-center items-center w-full">
          <Text className="text-accent1 text-xl text-center pt-36">
            No customers
          </Text>
        </View>
      </RefreshControl>
    );
  }
  const items = [
    { label: "Sort by Id", value: "id" },
    { label: "Sort by name", value: "name" },
    { label: "Sort by Date", value: "date" },
  ];
  return (
    <SafeAreaView className="flex flex-col justify-between items-center w-full pt-6 mb-[60] bg-primary rounded-2xl">
      <View className="flex flex-row justify-between w-full items-center mb-2">
        <Text className="text-lg font-bold text-accent1  ml-4">
          All Customers
        </Text>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="flex mt-2 items-center self-end w-1/2 border-[1px] border-secondary  justify-center  h-12 rounded-xl"
        >
          <Text className="text-lg font-bold text-accent1">
            {filter ? `Sorted by ${filter}` : "Sort by"}
          </Text>
          <Modal
            visible={showModal}
            transparent={true}
            onRequestClose={() => setShowModal(false)}
          >
            <View className="w-full h-full flex items-center justify-center bg-[#000000bb]">
              <View className="h-fit w-fit p-6 bg-accent rounded-xl">
                <Text className="text-center text-base text-secondary opacity-60 m-2">
                  Select item to sort
                </Text>
                {items.map((item) => (
                  <Text
                    key={item.value}
                    onPress={() => {
                      setFilter(item.value);
                      setShowModal(false);
                    }}
                    className="text-lg font-bold w-44 h-10 border-[1px] border-backgeound rounded-xl m-2 p-2 text-center text-primary"
                  >
                    {item.label}
                  </Text>
                ))}
              </View>
            </View>
          </Modal>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedCustomers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        className="w-full h-full"
        refreshControl={<RefreshControl onRefresh={handleFetchData} />}
      />
    </SafeAreaView>
  );
};

export default styled(AllList);
