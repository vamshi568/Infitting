import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styled } from "nativewind";
import { orderDetails, updateOrder } from "../../components/service/api";
import { Loader2, Loader3 } from "../../components/loader";
import { AddOrder, FullImageShow, handleSendSMS, sendDirect, sendSMS, serverUrl } from "../../components/helpers";
import { shirt } from "../../constants/images";
function Details() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [data, setData] = React.useState({
    customer_id: 0,
    order_date: new Date(),
    delivery_date: new Date(),
    additional_details: "",
    photos: [],
    type_cloth: "",
    status: "Pending",
    updated_at: new Date(),
  });
  const [photo, setPhoto] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async (id) => {
      setLoading(true);
      const result = await orderDetails({ id });
      const { __v, ...rest } = result;
      setData(rest);
      setLoading(false);
    };
    fetchData(id);
  }, [id]);

  const remainingDays = () => {
    return (
      <Text
        className={`text-accent text-base ml-auto place-self-end ${
          data.daysLeft > 0 ? "text-green-700" : "text-red-800"
        }`}
      >
        {Math.abs(data.daysLeft)}
        {data.daysLeft > 0 ? ` days Left` : " days ago"}
      </Text>
    );
  };

  const listOfInfo = (list) => {
    return list.map((item) => (

        shirt[item] ? (
          <View key={item} className='w-24 h-24 border-[1px]'>

          <Image  className="w-full h-full" source={shirt[item]} />
          </View>
        ) : (
          <View className="w-24 h-24  bg-primary border-[1px] flex justify-center items-center">

          <Text key={item} className="text-center  text-accent1 text-base ">{item}</Text>
          </View>
        )
    ));
  };
  if (loading) {
    return <Loader2 msm={"Loading order"} />;
  }
  return (
    <>
      <SafeAreaView className="flex-1 justify-center align-middle bg-primary">
        <ScrollView>
          <View className="flex justify-end align-middle items-center  h-44 w-full  relative ">
            <TouchableOpacity
              onPress={() => {
                setShowFullScreenImage(true);
                setPhoto(`${serverUrl()}/photos/${data.photos[0]}`);
              }}
              className="w-full h-40 top-0 absolute"
            >
              <Image
                source={{ uri: `${serverUrl()}/photos/${data.photos[0]}` }}
                className="w-full h-40 top-0 absolute"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowFullScreenImage(true);
                setPhoto(`${serverUrl()}/photos/${data.profile_pic}`);
              }}
            >
              <View className=" h-24 w-24 mb-[-40px] border-2  border-white bg-secondary rounded-full">
                <Image
                  source={{ uri: `${serverUrl()}/photos/${data.profile_pic}` }}
                  className="w-full h-full rounded-full"
                />
              </View>
            </TouchableOpacity>
            <FullImageShow
              photo={photo}
              showFullScreenImage={showFullScreenImage}
              handleCloseFullScreenImage={() => setShowFullScreenImage(false)}
            />
          </View>
          <View className="mt-12 flex items-center ">
            <Text className="text-lg mb-3 text-center text-[#34A853]">
              {data.status === "Completed"
                ? "Completed"
                : data.status === "Delivered"
                ? "Delivered"
                : remainingDays()}
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/profiledetails/${data.customer_id}`)}
            >
              <Text className="text-2xl text-center text-accent1">
                {data.customerName} 
                
              </Text>
            </TouchableOpacity>
            <Text className="text-xl text-center text-accent1">
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
            <View className="w-10/12 mt-6">
              <Text className="text-2xl text-center text-accent1">
              {data.isUrgent ? "Urgent Order: " : ""}{data.type_cloth}
              <TouchableOpacity onPress={()=>setShowModal(true)}>

              <Image className="w-4 h-4 ml-1 mt-[-3]" source={require("../../assets/icons/Icon.png")}/>
              </TouchableOpacity>
              </Text>
              <View className=" flex flex-row justify-between ">
                <Text className="text-lg text-center text-accent1 font-light">
                  Ordered Date
                </Text>
                <Text className="text-lg text-center text-accent1 font-light">
                  {new Date(data.order_date).toDateString()}
                </Text>
              </View>
              {data.status !== "Completed" && data.status !== "Delivered" ? (
                <View className=" flex flex-row justify-between ">
                  <Text
                    className={`text-lg text-center ${
                      data.daysLeft > 0 ? "text-green-700" : "text-red-800"
                    } font-light`}
                  >
                    Delivery Date
                  </Text>
                  <Text
                    className={`text-lg text-center ${
                      data.daysLeft > 0 ? "text-green-700" : "text-red-800"
                    } font-light`}
                  >
                    {new Date(data.delivery_date).toDateString()}
                  </Text>
                </View>
              ) : (
                <>
                  <View className=" flex flex-row justify-between ">
                    <Text
                      className={`text-lg text-center text-green-700 font-light`}
                    >
                      Completed Date
                    </Text>
                    <Text
                      className={`text-lg text-center text-green-700 font-light`}
                    >
                      {new Date(data.updated_at).toDateString()}
                    </Text>
                  </View>
                  <View className=" flex flex-row justify-between ">
                    <Text
                      className={`text-lg text-center text-green-700 font-light`}
                    >
                      Delivery Date
                    </Text>
                    <Text
                      className={`text-lg text-center text-green-700 font-light`}
                    >
                      {new Date(data.delivery_date).toDateString()}
                    </Text>
                  </View>
                </>
              )}
            </View>
            {data.additional_details && (
              <View className="w-11/12  mt-6">
                <Text className="text-2xl font-bold mb-2 text-accent1 ">
                  Additional Details
                </Text>
                
                <View className='flex items-center justify-center flex-row flex-wrap gap-1'>
                {listOfInfo(data.additional_details.split(",").map((item)=>item.trim()))}
                  </View>
              </View>
            )}
            <View>
              {data.status !== "Completed" && data.status !== "Delivered"? (
                <TouchableOpacity
                  onPress={async () => {
                    await updateOrder(data._id, { status: "Completed" });
                    await sendSMS(data.phone_number,`Dear customer, we are happy to inform you that your ${data.type_cloth} order has been completed. \n you can check the order image here ${serverUrl()}/photos/${data.photos[0]}`);
                    router.back();
                  }}
                  className=" mt-6 bg-accent rounded-3xl py-3 px-6 mb-3"
                >
                  <Text className="text-white">Completed</Text>
                </TouchableOpacity>
              ):data.status !== "Delivered"&&<>
              <TouchableOpacity
                  onPress={async () => {
                    await updateOrder(data._id, { status: "Delivered" });
                    await sendSMS(data.phone_number,`Your ${data.type_cloth} Order Delivered \n you can check the order image here${serverUrl()}/photos/${data.photos[0]}`);
                    router.back();
                  }}
                  className=" mt-6 bg-accent rounded-3xl py-3 px-6 mb-3"
                >
                  <Text className="text-white">Delivered</Text>
                </TouchableOpacity>
              </>}
            </View>
          </View>
          <Modal
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
          animationType="slide"
        >
          <AddOrder
            Order={data.type_cloth}
            setShowModal={setShowModal}
            edit={true}
            data={data}
          />
        </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default styled(Details);


