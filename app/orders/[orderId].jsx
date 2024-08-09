import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  addOrder,
  getCustomer,
  sendDataToServer,
  updateCustomer,
} from "../../components/service/api";
import { AddOrder, FullImageShow, serverUrl } from "../../components/helpers";
import { Loader2 } from "../../components/loader";
import { scheduleNotification } from "../../components/hooks/useAuth";

const Order = () => {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [orderId1, setOrderId] = useState(orderId !== 'new' ? orderId : null);
  const [loading, setLoading] = useState(true);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [type, setType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fullPhoto, setFullPhoto] = useState(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    if (orderId && orderId !== 'new') {
      const res = await getCustomer(orderId);
      setLoading(false);
      if (res) {
        setCustomer(res);
        setPhoto(res.profile_pic);
        setOrderId(orderId);
      }
    }
    setLoading(false);
  }, [orderId]);

  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    if (orderId1) {
      const res = await getCustomer(orderId1);
      if (res) {
        setCustomer(res);
        setPhoto(res.profile_pic);
      } else {
        Alert.alert("Error", `Customer with ID: ${orderId1} not found`);
      }
    }
    setLoading(false);
  }, [orderId1]);

  

  const uploadImage = useCallback(async (image) => {
    if (!image) return;
    const formData = new FormData();
    formData.append("photo", {
      uri: image,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await sendDataToServer(formData);
      return response;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const sendingOrders = await Promise.all(
        orderList.map(async (order) => {
          let photoUrl = '';
          if (order.photo) {
            photoUrl = await uploadImage(order.photo);
          }
          const addingOrder = {
            customer_id: orderId1,
            delivery_date: order.delivery_date,
            additional_details: order.items.join(','),
            photos: photoUrl,
            type_cloth: order.type,
          };
          const res = await addOrder(addingOrder);
          await updateCustomer(orderId1, { orders: res.data._id });
          scheduleNotification({deliveryDate:order.delivery_date,name:customer?.name,type:order.type,_id:res.data._id});
          return true;
        })
      );

      if (sendingOrders.every((res) => res)) {
        router.back();
      } else {
        Alert.alert('Error', 'Failed to save order');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save order');
    }
    finally {
      setLoading(false);
    }
  }, [orderList, orderId1, uploadImage]);

  const handleFullScreenImage = useCallback(() => {
    setFullPhoto(`${serverUrl()}/photos/${photo}`);
    setShowFullScreenImage(true);
  }, [photo]);

  const handleCloseFullScreenImage = useCallback(() => {
    setShowFullScreenImage(false);
  }, []);

  const deleteItem = useCallback((itemIndex) => {
    setOrderList((prevOrder) => {
      const newOrder = [...prevOrder];
      newOrder.splice(itemIndex, 1);
      return newOrder;
    });
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return <Loader2 msm="Loading" />;
  }

  return (
    <ScrollView className="flex-1 bg-primary ">
      <View className="flex flex-row items-center justify-evenly px-4  text-accent1">
        <View className="flex flex-row justify-center items-center mt-6">
          {!photo && (
            <Image
              source={{
                uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
              }}
              className="w-20 h-20 bg-secondary rounded-full"
            />
          )}
          {photo && (
            <>
              <TouchableOpacity onPress={handleFullScreenImage}>
                <View className="w-auto h-auto bg-secondary rounded-full flex justify-center items-center">
                  <Image
                    source={{ uri: `${serverUrl()}/photos/${photo}` }}
                    className="w-20 rounded-full h-20"
                  />
                </View>
              </TouchableOpacity>
              <FullImageShow
                photo={fullPhoto}
                handleCloseFullScreenImage={handleCloseFullScreenImage}
                showFullScreenImage={showFullScreenImage}
              />
            </>
          )}
        </View>
        <View className="flex flex-col items-center gap-y-2 mt-6 w-1/2">
          <View className="flex flex-row items-cente justify-end w-full">
            <Text className="text-lg font-bold text-accent1 mr-2">ID:</Text>
            {orderId === "new" ? (
              <TextInput
                value={orderId1}
                onChangeText={setOrderId}
                keyboardType="numeric"
                placeholder="Enter ID"
                className="text-base  text-accent1 placeholder-accent1 border-[1px] w-2/3 text-center p-1 px-2 rounded-lg border-accent1"
                placeholderTextColor={"grey"}
                onBlur={fetchCustomer}
              />
            ) : (
              <TextInput
                value={orderId}
                editable={false}
                className="text-base  text-accent1 placeholder-accent1 border-[1px] w-2/3 text-center p-1 px-2 rounded-lg border-accent1"
              />
            )}
          </View>
          {customer && (
            <>
              <View className="flex flex-row items-cente justify-end w-full ">
                <Text className="text-base font-bold text-accent mr-2">
                  Name:
                </Text>
                <TextInput
                  value={customer?.name}
                  editable={false}
                  className="text-base   placeholder-accent  w-1/2 "
                />
              </View>
              <View className="flex flex-row items-cente justify-end w-full">
                <Text className="text-base font-bold text-accent mr-2">
                  Phone:
                </Text>
                <TextInput
                  value={customer?.phone_number}
                  editable={false}
                  className="text-base   placeholder-accent  w-1/2 "
                />
              </View>
            </>
          )}
        </View>
      </View>
      <View className="w-full  border-[1px] border-accent mt-4"></View>
      <View className="flex flex-row items-center justify-evenly px-4  text-accent1 mt-4">
        <TouchableOpacity
          onPress={() => {
            if (orderId1) {
              setType("Shirt");
              setShowModal(true);
            } else {
              Alert.alert("Error", "Please enter customer ID first");
            }
          }}
          className="bg-secondary px-4 self-center h-10  rounded-lg justify-center items-center flex"
        >
          <Image
            source={require("../../assets/images/shirt1.png")}
            className="h-8 w-8 absolute opacity-90"
          />
          <Text className="text-center text-accent1 font-bold text-base">
            Add Shirt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (orderId1) {
              setType("Pants");
              setShowModal(true);
            } else {
              Alert.alert("Error", "Please enter customer ID first");
            }
          }}
          className="bg-secondary px-4 self-center h-10  rounded-lg justify-center items-center flex"
        >
          <Image
            source={require("../../assets/images/pants.png")}
            className="h-8 w-8 absolute"
          />
          <Text className="text-center text-accent1 font-bold text-base">
            Add Pants
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (orderId1) {
            setType("Others");
            setShowModal(true);
          } else {
            Alert.alert("Error", "Please enter customer ID first");
          }
        }}
        className="bg-secondary px-4 self-center h-10 mt-7 rounded-lg justify-center items-center flex"
      >
        <Text className="text-center text-accent1 font-bold text-base">
          Add Others
        </Text>
      </TouchableOpacity>
      {type && (
        <Modal
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
          animationType="slide"
        >
          <AddOrder
            Order={type}
            setOrderList={setOrderList}
            setShowModal={setShowModal}
            orderList={orderList}
          />
        </Modal>
      )}
      <View className="w-full  border-[1px] border-accent mt-4"></View>
      {orderList.length !== 0 && (
        <View className="flex flex-col items-center gap-y-2 mt-2">
          <Text className="text-center text-accent1 text-xl font-bold">
            Order Summary
          </Text>
          <View className="flex flex-col w-full gap-y-2 mb-4">
            {orderList.map((value, index) => (
              <View
                key={index}
                className="flex flex-col border-[1px] w-full border-accent rounded-lg px-4 py-2"
              >
                <View className="flex flex-row justify-evenly w-full items-center">
                  <Text className="text-base font-bold text-accent1">
                    {value.type}
                  </Text>
                  <Text className="text-base font-bold text-accent1">
                    {new Date(value.delivery_date).toLocaleDateString()}
                  </Text>
                </View>
                <View className="flex flex-row mt-4 justify-center">
                  {value.photo && (
                    <TouchableOpacity
                      onPress={() => {
                        setFullPhoto(value.photo);
                        setShowFullScreenImage(true);
                      }}
                    >
                      <Image
                        source={{ uri: value.photo }}
                        className="w-20 self-center h-20 rounded-full"
                      />
                    </TouchableOpacity>
                  )}
                  {value.items.length > 0 && (
                    <View className="flex flex-col items-center w-fit px-4 py-2">
                      {value.items.map((item, itemIndex) => (
                        <Text key={itemIndex} className="text-base text-accent">
                                  {item.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}

                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => deleteItem(index)}
                  className="absolute right-3 top-2"
                >
                  <Image
                    source={require("../../assets/icons/delete.png")}
                    className="w-7 h-7 "
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View className="flex flex-col gap-y-2 mb-4">
            <Text className="text-center text-accent1 text-xl font-bold">
              Total Shirt:{" "}
              {orderList.filter((item) => item.type === "Shirt").length}
            </Text>
            <Text className="text-center text-accent1 text-xl font-bold">
              Total Pants:{" "}
              {orderList.filter((item) => item.type === "Pants").length}
            </Text>
            <Text className="text-center text-accent1 text-xl font-bold">
              Total Others:{" "}
              {orderList.filter((item) => item.type === "Others").length}
            </Text>
          </View>
          <View className="flex flex-row justify-evenly w-full fixed bottom-3 left-0">
            <TouchableOpacity className="bg-transparent px-4 h-14 w-2/5 border-2 border-secondary rounded-full justify-center items-center flex">
              <Text className="text-accent1 text-xl">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="bg-secondary px-4 h-14 w-2/5 rounded-full justify-center items-center flex"
            >
              <Text className="text-accent1 text-xl">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Order;
