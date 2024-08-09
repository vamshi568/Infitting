import React, { useState, useRef, useEffect, memo } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { icons } from "../../constants";
import { searchCustomers } from "../../components/service/api";
import { router } from "expo-router";
import { serverUrl } from "../../components/helpers";

const Search = memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const [listOfCustomers, setListOfCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await searchCustomers(searchTerm.toLowerCase());
      setListOfCustomers(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/profiledetails/${item.customer_id}`)}
      >
        <View className="flex flex-row items-center justify-center m-1 bg-backgeound rounded-xl p-4">
          <Image
            source={{ uri: `${serverUrl()}/photos/${item.profile_pic}` }}
            className="w-14 mr-4 h-14 bg-accent1 rounded-full"
          />
          <View className="self-start">
            <Text className="text-lg font-bold text-accent1">
              {item.name.length > 13
                ? item.name.slice(0, 13) + "..."
                : item.name}
            </Text>
            <Text className="text-accent font-light">{item.phone_number}</Text>
          </View>
          <Text className="text-accent1 text-base ml-auto place-self-end ">
            {item.customer_id}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => {
    return (
      <View className="flex flex-col items-center justify-center">
        <Text className="text-xl font-bold text-accent1">
          No Customers Found
        </Text>
        <Text className="text-base font-light text-accent1">
          Try another search term
        </Text>
      </View>
    );
  };

  const renderLoading = () => {
    return <ActivityIndicator size="large" color="accent" />;
  };

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  const onRefresh = () => {
    handleSearch();
  };

  return (
    <SafeAreaView className="flex-1 justify-cent flex flex-col  px-4 bg-primary ">
      <View className=" flex flex-row justify-between items-center w-fit mt-10 p-2 mb-6 bg-backgeound rounded-2xl">
        <TextInput
          ref={searchInputRef}
          placeholder="Search..."
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          value={searchTerm}
          clearButtonMode="always"
          className="p-2 text-lg font-bold text-accent1 placeholder-accent1 rounded-md border-none  h-full w-11/12"
        />
        {searchTerm && (
          <Image
            source={require("../../assets/icons/search1.png")}
            className="w-6 h-6 justify-self-end  pr-3 "
            onPress={handleSearch}
          />
        )}
      </View>

      {loading ? (
        renderLoading()
      ) : (
        <FlatList
          data={listOfCustomers}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyList}
          showsHorizontalScrollIndicator={false}
          refreshControl={<RefreshControl onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
});

export default styled(Search);
