import {
  View,
  Text,
  Image,
  Linking,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  FullImageShow,
  MeasurementHistory,
  Measurements,
  MyComponent,
  RenderItem,
  listOfpants,
  listOfshirts,
  serverUrl,
} from "../../components/helpers";
import {
  createMeasurement,
  deleteCustomer,
  getCustomer,
  getMeasurement,
} from "../../components/service/api";
import { icons } from "../../constants";
import { Loader2 } from "../../components/loader";

const CustomerProfile = () => {
  const { profile_id } = useLocalSearchParams();
  const [shirt, setShirt] = useState(false);
  const [pants, setPants] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [editing, setEdit] = useState(false);
  const [data, setData] = useState({
    _id: "6662917cfb87491acbc30209",
    customer_id: 65,
    name: "James Bond",
    phone_number: "98234567894",
    profile_pic: "1717735803680-photo.jpg",
    orders: [],
    measurements: [{ $oid: "6662917cfb87491acbc30207" }],
    other_details: "Relative of someone",
    __v: { $numberInt: "0" },
  });
  const [orders, setOrders] = useState([
    {
      _id: "665f40399fe5002280e42602",
      delivery_date: "1717977600000",
      photos: "photo2.png",
      type_cloth: "Cotton",
      status: "In Progress",
      updated_at: { $date: { $numberLong: "1717518393371" } },
    },
    {
      _id: "665f40399fe5002280e42605",
      delivery_date: "1717977600000",
      photos: "photo2.png",
      type_cloth: "Cotton",
      status: "In Progress",
      updated_at: { $date: { $numberLong: "1717518393371" } },
    },
  ]);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [photo, setPhoto] = useState("");

  const [measurementsData, setMeasurementsData] = useState({
    shirt_measurements: {},
    pants_measurements: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const result = await getCustomer(profile_id);
    if (result.measurements.length > 0) {
      const measurements = await getMeasurement(result.measurements[0]._id);
      setMeasurementsData({
        pants_measurements: { ...measurements.pants_measurements } || {},
        shirt_measurements: { ...measurements.shirt_measurements } || {},
      });
    }
    setOrders(
      [...result.orders].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      )
    );
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/details/${item._id}`)}
        className="flex self-center items-center m-4  "
      >
        <Image
          source={{ uri: `${serverUrl()}/photos/${item.photos}` }}
          className="w-12 mb-1 h-12 bg-accent rounded-full"
        />
        <Text className="text-md font-bold text-accent">{item.type_cloth}</Text>
      </TouchableOpacity>
    );
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCustomer(profile_id);
      console.log("deleted", profile_id);
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  function renderOrderList(orderList) {
    const filteredOrderList = orderList.filter(
      (order) => order.status === "Completed" || order.status === "Delivered"
    );
    if (filteredOrderList.length === 0) {
      return (
        <Text className="text-md font-bold text-accent">
          No Completed Orders
        </Text>
      );
    }
    return filteredOrderList.map((order) => {
      return <RenderItem key={order._id} item={order} />;
    });
  }
  if (loading) {
    return (
      <>
        <Loader2 msm="Fetching Profile" />
      </>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-primary ">
      <TouchableOpacity
        className=" w-16 h-16 bg-[#ffffff] justify-center rounded-full bottom-5 right-5 z-10 absolute"
        onPress={() => router.push(`/orders/${profile_id}`)}
      >
        <Image
          source={icons.plus}
          className="w-[65px] h-16 self-center rounded-full"
        />

        <Text className="text-primary text-center left-[15px] font-bold text-sm absolute ">
          New Order
        </Text>
      </TouchableOpacity>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        <View>
          <View className="flex flex-row items-center justify-around mt-4 h-fit">
            <TouchableOpacity
              onPress={() => {
                setShowFullScreenImage(true);
                setPhoto(`${serverUrl()}/photos/${data.profile_pic}`);
              }}
              className=" border-2  border-white bg-secondary rounded-full"
            >
              <Image
                source={{
                  uri: `${serverUrl()}/photos/${data.profile_pic}`,
                }}
                className="w-24 h-24 rounded-full "
              />
            </TouchableOpacity>
            <FullImageShow
              photo={photo}
              showFullScreenImage={showFullScreenImage}
              handleCloseFullScreenImage={() => setShowFullScreenImage(false)}
            />
            <View className="flex w-1/2 justify-center flex-col items-center">
              <Text className="text-2xl mb-1 text-center font-bold text-accent1">
                {data.name}
              </Text>
              <Text className="text-xl mb-1 text-center font-semibold text-accent1">
                ID: {data.customer_id}
              </Text>

              <TouchableOpacity
                className="flex flex-row items-center"
                onPress={() => Linking.openURL(`tel:${data.phone_number}`)}
              >
                <Text className="text-base text-center  text-accent font-semibold">
                  {data.phone_number}
                </Text>
                <Image
                  className="w-4 h-4 ml-1 mt-[-3]"
                  source={require("../../assets/icons/phone.png")}
                />
              </TouchableOpacity>
              {data.other_details && (
                <Text className="text-base text-center mb-3 text-accent1 font-light">
                  {data.other_details}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => router.push(`/profileEdit/${profile_id}`)}
              >
                <Text className="text-base font-bold underline text-accent mt-2 ">
                  Edit Profile
                </Text>

              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-col items-center justify-center mt-6 mb-5 bg-backgeound rounded-xl w-11/12 self-center pt-2">
            <Text className="text-xl font-bold text-accent1">Orders</Text>
            <FlatList
              data={orders
                .filter((order) => order.status === "Pending")
                .sort(
                  (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                )}
              keyExtractor={(item) => item._id}
              horizontal
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View className="flex flex-col items-center mb-3">
                  <Text className="text-lg text-center text-accent ">
                    No Orders Found,
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push(`/orders/${profile_id}`)}
                  >
                    <Text className="text-accent text-lg"> Create Order</Text>
                    <Image
                      source={icons.plus}
                      className="w-8 h-8 self-center rounded-full"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "white",
              opacity: 0.7,
              width: "100%",
            }}
          />
          <View>
            {Object.keys(measurementsData.shirt_measurements).length > 0 ||
            Object.keys(measurementsData.pants_measurements).length > 0 ? (
              <View className="flex justify-around mt-4 items-center flex-row">
                <Text className="text-xl font-bold text-accent1 text-center mb-2">
                  Measurement
                </Text>

                <View className="text-base font-medium italic text-[#4285F4] mb-2">
                  <View className="flex flex-row">
                    <Text
                      onPress={() => {
                        setShowModal(true);
                        setEdit(true);
                      }}
                      className="text-base font-bold underline text-accent mr-4"
                    >
                      Edit
                    </Text>
                    <Text
                      onPress={() => {
                        setHistoryVisible(true);
                      }}
                      className="text-base font-bold underline text-accent "
                    >
                      Veiw History
                    </Text>
                  </View>

                  <Modal
                    visible={historyVisible}
                    onRequestClose={() => setHistoryVisible(false)}
                    animationType="slide"
                    className="flex flex-col items-center "
                  >
                    <View className="p-4 flex flex-row align-center pb-5  justify-between">
                      <TouchableOpacity
                        onPress={() => setHistoryVisible(false)}
                        className="w-5 h-4 "
                      >
                        <Image className="" source={icons.leftArrow} />
                      </TouchableOpacity>
                      <Text className="text-xl font-bold flex-1 text-accent1  text-center ">
                        Measurement History
                      </Text>
                    </View>

                    <MeasurementHistory listOfitems={data.measurements} />
                  </Modal>
                </View>
              </View>
            ) : (
              <>
                <Text className="text-xl font-bold text-accent1 text-center mb-2">
                  Measurement
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(true);
                  }}
                  className="text-base self-center font-medium italic h-16 text-center text-[#4285F4] mb-2 "
                >
                  <Image className="w-8 h-8 self-center" source={icons.plus} />
                  <Text className="text-base font-bold underline text-accent mb-2">
                    Add Measurements
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {Object.keys(measurementsData.shirt_measurements).length > 0 && (
              <View className="mb-1 w-11/12 mt-2 h-auto self-center">
                <Text className="text-base font-bold text-accent1 text-center mb-2">
                  Shirt
                </Text>
                <View className="border-[1px] border-accent1 rounded-3xl">
                  <Measurements
                    measurements={measurementsData.shirt_measurements}
                    listOfitems={Object.keys(
                      measurementsData.shirt_measurements
                    )}
                  />
                </View>
              </View>
            )}
            {Object.keys(measurementsData.pants_measurements).length > 0 && (
              <View className="mb-6 w-11/12 mt-2 h-auto self-center ">
                <Text className="text-base font-bold text-accent1 text-center mb-2">
                  Pants
                </Text>
                <View className="border-[1px] border-accent1 rounded-3xl">
                  <Measurements
                    measurements={measurementsData.pants_measurements}
                    listOfitems={Object.keys(
                      measurementsData.pants_measurements
                    )}
                  />
                </View>
              </View>
            )}
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "white",
              opacity: 0.7,
              width: "100%",
            }}
          />
          <View className="flex flex-col items-center mb-3">
            <Text className="text-xl font-bold mt-3 items-center text-accent1 text-center mb-2">
              ORDERS HISTORY
            </Text>
            <View className="w-11/12">{renderOrderList(orders)}</View>
          </View>
          <Button className="w-11/12 self-center" onPress={handleDelete} title="Delete Profile"/>
        </View>
      </ScrollView>
      <Modal
        visible={showModal}
        animationType="none"
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent={false}
      >
        {editing ? (
          <Text className="text-accent bg-primary py-3 text-center text-xl font-bold flex-2">
            Edit Measurements
          </Text>
        ) : (
          <Text className="text-accent bg-primary py-3 text-center text-xl font-bold flex-2">
            Add New Item
          </Text>
        )}
        <ScrollView
          className="w-full h-full bg-primary flex "
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <View className="flex flex-col w-full h-1/2  justify-center px-8 items-center">
            <TouchableOpacity
              className="bg-secondary w-6/12 self-center h-10 mb-6 rounded-lg justify-center  items-center flex"
              onPress={() => setShirt(!shirt)}
            >
              <Image
                source={require("../../assets/images/shirt1.png")}
                className="h-8 w-8 absolute opacity-30"
              />

              <Text className="text-center text-accent1 font-bold text-base">
                Shirt
              </Text>
            </TouchableOpacity>

            {shirt && (
              <Measurements
                // listOfitems={
                //   Object.keys(measurementsData.shirt_measurements).length == 0
                //     ? listOfshirts()
                //     : Object.keys(measurementsData.shirt_measurements)
                // }
               listOfitems={listOfshirts()}
                measurements={measurementsData.shirt_measurements}
                setMeasurements={setMeasurementsData}
                typeOf={"shirt_measurements"}
              />
            )}
            <TouchableOpacity
              className="bg-secondary w-6/12 self-center mb-6 h-10 rounded-lg flex-row justify-center items-center  flex"
              onPress={() => setPants(!pants)}
            >
              <Image
                source={require("../../assets/images/pants.png")}
                className="h-8 w-8 absolute opacity-30"
              />
              <Text className="text-center text-accent1 font-bold text-base">
                Pant
              </Text>
            </TouchableOpacity>
            {pants && (
              <Measurements
                listOfitems={
                  Object.keys(measurementsData.pants_measurements).length == 0
                    ? listOfpants()
                    : Object.keys(measurementsData.pants_measurements)
                }
                measurements={measurementsData.pants_measurements}
                setMeasurements={setMeasurementsData}
                typeOf={"pants_measurements"}
              />
            )}
            <View className="flex flex-row gap-x-4">
              <TouchableOpacity
                className="bg-transparent mt-4 rounded-2xl flex border-[1px] border-accent1  items-center justify-center h-12 w-1/2 "
                onPress={() => {
                  setShowModal(false);
                }}
              >
                <Text className="text-accent1">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-accent1 mt-4 rounded-2xl flex  items-center justify-center h-12 w-1/2 "
                onPress={async () => {
                  if (
                    Object.keys(measurementsData.shirt_measurements).length ===
                      0 &&
                    Object.keys(measurementsData.pants_measurements).length ===
                      0
                  ) {
                    setShowModal(false);
                    return;
                  }
                  const response = await createMeasurement(
                    profile_id,
                    measurementsData
                  );
                  if (response) {
                    fetchData();
                  }
                  setShowModal(false);
                }}
              >
                {editing ? (
                  <Text className="text-primary">Edit</Text>
                ) : (
                  <Text className="text-primary">Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>

    </SafeAreaView>
  );
};

export default CustomerProfile;
