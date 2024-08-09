import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Alert,
  BackHandler,
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  Switch,
  Linking,
} from "react-native";
import {
  getCustomer,
  getMeasurement,
  createCustomer,
  createMeasurement,
  searchCustomers,
  sendDataToServer,
  updateCustomer,
  editShop,
  updateOrder,
} from "./service/api";

import { Link, router } from "expo-router";
import { Loader2, Loader3 } from "./loader";
import * as ImagePicker from "expo-image-picker";
import { icons } from "../constants";

import DatePicker from "@react-native-community/datetimepicker";

// export function serverUrl() {
//   return "http://192.168.1.17:5000/api";
// }
export function serverUrl() {
  return "https://infitting-server.onrender.com/api";
}
export function listOfshirts() {
  return [
    "Length",
    "Shoulder",
    "Chest",
    "Stomach",
    "Bottom",
    "Upper Front",
    "Middle Front",
    "Lower Front",
    "Back Middle",
    "Back Bottom",
    "Sleeve Placket",
    "Cuff",
    "Cuff Length",
    "Sleeve",
    "Elbow",
    "Collar",
  ];
}
export function listOfpants() {
  return [
    "Leg Length",
    "Kamar",
    "Belt",
    "Seat",
    "Thigh",
    "Knee",
    "Leg Bottom",
    "Kisthak",
    "Front Crotch",
  ];
}
export function listOfshirtdetails() {
  return [
    "Sleeveless",
    "V-Shaped Shoulders",
    "Double Buttons on Sleeves",
    "Chinese Collar",
    "Cuffed Sleeves",
    "Detachable Lapels",
    "Ruffles and Bows",
    "Pocketed Front",
    "Cuffed Front",
    "Cuffed Back",
    "Pockets",
    "Adjustable Closures",
    "Pleated or Piped Edges",
    "Ribbed or Crew Neck",
    "Tie Collar",
    "Cutaway Collar",
    "Shawl Collar",
    "French Collar",
    "Peplum",
    "Hood",
    "Open Front",
    "Cape Collar",
    "Gore-Tex",
    "Camo",
    "Lace",
    "Pleated",
  ];
}
export function listOfpantdetails() {
  return [
    "Cropped Legs",
    "Flared Legs",
    "Skinny Legs",
    "Bootcut Legs",
    "Bell Bottoms",
    "Cargo Pants",
    "Chinos",
    "Culottes",
    "Dress Pants",
    "Flared Pants",
    "Jogger Pants",
    "Skinny Jeans",
    "Sweatpants",
    "Tapered Legs",
    "Wide Legs",
  ];
}

export function RenderItem({ item }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/details/${item._id}`)}
      className="flex flex-row items-center justify-between w-full my-1 bg-backgeound rounded-xl px-6 py-2 "
    >
      <Image
        source={{ uri: `${serverUrl()}/photos/${item.photos}` }}
        className="w-14 mr-4 h-14 bg-white rounded-full"
      />
      <View className="flex flex-row justify-between">
        <View>
          <Text className="text-black text-lg font-bold">
            {item.type_cloth}
          </Text>
          <Text className="text-black font-light">
            {item.status === "Completed"
              ? `Completed Date: ${new Date(
                  item.updated_at
                ).toLocaleDateString()}`
              : `Delivered Date: ${new Date(
                  item.updated_at
                ).toLocaleDateString()}`}
          </Text>
        </View>
        <View className="">
          {item.status === "Completed" ? (
            <Text className="text-green-700 text-base  font-bold">Ready</Text>
          ) : (
            <Text className="text-green-700 text-base font-bold">
              {item.status}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function Measurements({
  measurements,
  setMeasurements: setParentMeasurements,
  listOfitems,
  typeOf,
}) {
  const [name1, setName] = useState("");
  const [value, setValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [listOfitems1, setListOfItems] = useState(listOfitems);
  const inputRefs = useRef([]);
  const handleChange = (name, text, index) => {
    if (setParentMeasurements) {
      setParentMeasurements((prev) => ({
        ...prev,
        [typeOf]: {
          ...prev?.[typeOf],
          [name.replace(/\s/g, "_").toLowerCase()]: Number(text),
        },
      }));
    }
  };
  const handleEnter = (index) => {
    if (index < listOfitems1.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  useEffect(() => {
    if (name1) {
      setListOfItems((prev) => [...prev, name1]);
      setName("");
      setValue("");
    } else {
      setListOfItems((prev) => [...prev]);
    }
  }, [measurements]);

  return (
    <View className="flex flex-row flex-wrap justify-center items-end h-fit w-full gap-y-5 mb-3">
      {listOfitems1.map((name, index) => (
        <View key={name} className="flex  flex-col w-16  items-center mr-1">
          <Text className="text-accent text-center text-sm">
            {name
              .replace(/_/g, " ")
              .replace(/\b\w/g, (match) => match.toUpperCase())}
          </Text>
          {icons[name.replace(/\s/g, "").replace(/_/g, "").toLowerCase()] && (
            <Image
              source={
                icons[name.replace(/\s/g, "").replace(/_/g, "").toLowerCase()]
              }
              className="h-16 w-full "
            />
          )}
          <TextInput
            ref={(el) => (inputRefs.current[index] = el)}
            keyboardType="numeric"
            defaultValue={
              measurements[
                name.replace(/\s/g, "_").toLowerCase()
              ]?.toString() || ""
            }
            editable={Boolean(setParentMeasurements)}
            onChangeText={(text) => handleChange(name, text)}
            onSubmitEditing={(e) => {
              handleEnter(index);
            }}
            blurOnSubmit={index === listOfitems1.length - 1}
            className="text-lg  font-bold text-accent1 mt-2 border-[1px] px-2 rounded-md border-accent text-center h-12 min-w-[48px] w-fit"
          />
        </View>
      ))}
      {typeOf && (
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="bg-accent rounded-lg flex  items-center justify-center  h-12 w-14 p-2"
        >
          <Text className="text-primary text-center font-bold">Add Item</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent={false}
      >
        <View className="w-full h-full flex justify-center bg-[#00000080] items-center self-center ">
          <View className="flex flex-col w-10/12 h-1/2 blur-xl rounded-2xl bg-secondary justify-center px-8 items-center">
            <Text className="text-accent text-center text-xl font-bold flex-2">
              Add New Item
            </Text>
            <TextInput
              className="text-lg  font-bold text-accent1 mt-2 border-[1px] px-2 rounded-md border-accent text-center h-12 w-full"
              placeholder="Name"
              onChangeText={(name1) => setName(name1)}
            />
            <TextInput
              keyboardType="numeric"
              className="text-lg font-bold  text-accent1 mt-2 border-[1px] px-2 rounded-md border-accent text-center h-12 w-full"
              placeholder="Value"
              onChangeText={(value) => setValue(value)}
            />
            <TouchableOpacity
              className="bg-blue-600 mt-4 rounded-lg flex  items-center justify-center h-10 w-16 "
              onPress={() => {
                if (name1) {
                  setParentMeasurements((prev) => ({
                    ...prev,
                    [typeOf]: {
                      ...prev?.[typeOf],
                      [name1.replace(/\s/g, "_").toLowerCase()]: Number(value),
                    },
                  }));
                  setShowModal(false);
                }
                setShowModal(false);
              }}
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function MeasurementHistory({ listOfitems }) {
  return (
    <>
      <ScrollView className="flex flex-col bg-primary  p-4 pt-2 gap-y-3">
        {listOfitems.map((measurement) => (
          <View
            key={measurement._id}
            className="border border-accent rounded-md p-4"
          >
            <Text className="text-base text-right text-accent1">
              Edited Date:
              {new Date(measurement.date_taken).toLocaleDateString()}
            </Text>
            <Text className="text-base text-right text-accent1">
              Time: {new Date(measurement.date_taken).toLocaleTimeString()}
            </Text>
            {Object.keys(measurement.shirt_measurements).length > 0 && (
              <>
                <Text className="text-xl font-bold mt-4 mb-1 text-center underline text-accent1">
                  Shirt Measurements
                </Text>
                <View className="flex flex-row justify-center flex-wrap gap-y-1">
                  {Object.entries(measurement.shirt_measurements).map(
                    ([key, value]) => (
                      <Text key={key} className="text-sm text-accent">
                        {`${key}: `}
                        <Text className="text-accent1 font-bold text-base">
                          {value}
                        </Text>
                        ,
                      </Text>
                    )
                  )}
                </View>
              </>
            )}
            {Object.keys(measurement.pants_measurements).length > 0 && (
              <>
                <Text className="text-xl text-center mt-4 mb-1 font-bold underline text-accent1">
                  Pants Measurements
                </Text>
                <View className="flex flex-row justify-center flex-wrap gap-y-1">
                  {Object.entries(measurement.pants_measurements).map(
                    ([key, value]) => (
                      <Text key={key} className="text-sm text-accent">
                        {`${key}: `}
                        <Text className="text-accent1 font-bold text-base">
                          {value}
                        </Text>
                        ,
                      </Text>
                    )
                  )}
                </View>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

export function CreateProfile({ create, profileId }) {
  const [customer_id, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [otherDetails, setOther] = useState(null);
  const [measurements, setMeasurements] = useState({
    shirt_measurements: {},
    pants_measurements: {},
  });
  const [measurements1, setMeasurements1] = useState(false);
  const [shirt, setShirt] = useState(false);
  const [pants, setPants] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModal] = useState(false);
  const [response1, setResponse] = useState({});
  const [loadingId, setLoadingId] = useState(false);
  useEffect(() => {
    if (!create) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    const response = await getCustomer(profileId);
    if (response) {
      setCustomerId(response.customer_id.toString());
      setName(response.name);
      setPhoneNumber(response.phone_number);
      setOther(response.other_details);
      setImage(
        response.profile_pic
          ? `${serverUrl()}/photos/${response.profile_pic}`
          : ""
      );
      setMeasurements1(false);
      setShirt(false);
      setPants(false);
      setResponse(response);
    }
  };

  const handleSubmit = async () => {
    if (!customer_id || !name || !phone_number) {
      Alert.alert("Required Fields", "Please fill all required details");
      return;
    }
    try {
      setLoading(true);
      const profile_pic = await uploadImage();
      if (create) {
        const customerResponse = await createCustomer({
          customer_id,
          name,
          phone_number,
          profile_pic: profile_pic,
          other_details: otherDetails,
        });
        await createMeasurement(customer_id, measurements);
        if (customerResponse) {
          console.log("Profile created successfully");
          Alert.alert(
            "Success",
            "Profile created successfully",
            [{ text: "OK", onPress: () => router.replace("/home") }],
            { cancelable: false }
          );
          handleReset();
        } else {
          console.error("Failed to create profile");
        }
      } else {
        const updatedFields = {};
        if (name !== response1.name) {
          updatedFields.name = name;
        }
        if (phone_number !== response1.phone_number) {
          updatedFields.phone_number = phone_number;
        }
        if (otherDetails !== response1.other_details) {
          updatedFields.other_details = otherDetails;
        }
        if (profile_pic !== response1.profile_pic) {
          updatedFields.profile_pic = profile_pic;
        }
        if (Object.keys(updatedFields).length > 0) {
          const customerData = { ...updatedFields };
          const updateCustomer1 = await updateCustomer(profileId, customerData);
          if (updateCustomer1) {
            console.log("Profile updated successfully");
            Alert.alert(
              "Success",
              "Profile updated successfully",
              [{ text: "OK", onPress: () => router.back() }],
              { cancelable: false }
            );
            handleReset();
          } else {
            console.error("Failed to update profile");
          }
        } else {
          Alert.alert("Error", "No changes made");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchId = async () => {
    setLoadingId(true);
    if (!customer_id) {
      Alert.alert("Error", "Please enter a customer ID");
      return;
    }
    try {
      const response = await searchCustomers(customer_id);
      if (response.length !== 0) {
        Alert.alert("Error", "Customer ID already exists");
        setCustomerId("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(false);
    }
  };

  const uploadImage = async () => {
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
  };

  const handleReset = () => {
    setCustomerId("");
    setName("");
    setPhoneNumber("");
    setMeasurements({ shirt_measurements: {}, pants_measurements: {} });
    setMeasurements1(false);
    setShirt(false);
    setPants(false);
    setImage(null);
    setOther(null);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center px-4 bg-primary text-accent1">
        <Loader3 msm="Creating Profile" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center px-4 bg-primary relative text-accent1">
      {loadingId && (
        <ActivityIndicator
          size="large"
          color="#DBE2EF"
          className="center h-full w-screen z-10 absolute bg-black/60"
          animating={loadingId}
        />
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleReset} />
        }
      >
        {create && (
          <Text className="text-2xl font-bold mt-12 text-accent1 text-center">
            Create Profile
          </Text>
        )}
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="flex justify-end align-middle items-center mt-4 w-full relative"
        >
          {image ? (
            <View className="border-2 border-white h-28 w-28 rounded-full">
              <Image
                source={{ uri: image }}
                className="z-10 h-full w-full rounded-full"
              />
            </View>
          ) : (
            <View className="border-2 flex justify-center bg-secondary border-accent h-28 w-28 rounded-full">
              <Image
                source={require("../assets/icons/Profile1.png")}
                className="z-14 h-14 w-10 self-center "
              />
            </View>
          )}
          <Text>
            <ImagePickerComponent
              onImageSelected={(uri) => setImage(uri)}
              Show={showModel}
              setShow={(show) => setShowModal(show)}
            />
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row justify-between mb-3 items-center">
          <Text className="text-accent1 text-base">Customer ID</Text>
          <TextInput
            keyboardType="numeric"
            required
            value={customer_id}
            onChangeText={setCustomerId}
            className={`text-lg font-bold ${
              create
                ? "placeholder-accent1 border-accent1"
                : "placeholder-accent border-accent"
            } border-[1px] rounded-md h-full w-2/3 p-1 pl-2`}
            onBlur={create ? searchId : null}
            editable={create && !loadingId}
          />
        </View>

        <View className="flex flex-row justify-between mb-3 items-center">
          <Text className="text-accent1 text-base">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="text-lg font-bold text-accent1 placeholder-accent1 border-[1px] rounded-md border-accent1 h-full w-2/3 p-1 pl-2"
            editable={!loadingId}
          />
        </View>
        <View className="flex flex-row justify-between mb-3 items-center">
          <Text className="text-accent1 text-base">Phone Number</Text>
          <TextInput
            keyboardType="numeric"
            value={phone_number}
            onChangeText={setPhoneNumber}
            className="text-lg font-bold text-accent1 placeholder-accent1 border-[1px] rounded-md border-accent1 h-full w-2/3 p-1 pl-2"
            editable={!loadingId}
          />
        </View>
        <View className="flex flex-row justify-between mb-3 items-center">
          <Text className="text-accent1 text-base">Other Details</Text>
          <TextInput
            value={otherDetails}
            onChangeText={setOther}
            className="text-lg font-bold text-accent1 placeholder-accent1 border-[1px] rounded-md border-accent1 h-full w-2/3 p-1 pl-2"
            editable={!loadingId}
          />
        </View>
        {!measurements1 && create ? (
          <View className="w-8/12 mb-4 mt-4 self-center">
            <Button
              title="Add Measurement"
              onPress={() => setMeasurements1(true)}
              color="#526D82"
              disabled={loadingId}
            />
          </View>
        ) : (
          create && (
            <>
              <View className="mb-1 w-full mt-4 h-auto self-center">
                <TouchableOpacity
                  className="bg-accent w-6/12 self-center h-10 mb-3 mt-3 rounded-lg justify-center items-center flex"
                  onPress={() => setShirt(!shirt)}
                  disabled={loadingId}
                >
                  <Image
                    source={require("../assets/images/shirt1.png")}
                    className="h-8 w-8 absolute opacity-10"
                  />
                  <Text className="text-center text-black font-bold text-base">
                    Shirt
                  </Text>
                </TouchableOpacity>
                {shirt && (
                  <View className="border-[1px] rounded-2xl border-accent1">
                    <Measurements
                      measurements={measurements.shirt_measurements}
                      setMeasurements={setMeasurements}
                      listOfitems={listOfshirts()}
                      typeOf={"shirt_measurements"}
                    />
                  </View>
                )}
              </View>
              <View className="mb-4 w-full self-center">
                <TouchableOpacity
                  className="bg-accent w-6/12 self-center mb-3 mt-3 h-10 rounded-lg flex-row justify-center items-center flex"
                  onPress={() => setPants(!pants)}
                  disabled={loadingId}
                >
                  <Image
                    source={require("../assets/images/pants.png")}
                    className="h-8 w-8 absolute opacity-10"
                  />
                  <Text className="text-center text-black font-bold text-base">
                    Pant
                  </Text>
                </TouchableOpacity>
                {pants && (
                  <View className="border-[1px] rounded-2xl border-accent1">
                    <Measurements
                      measurements={measurements.pants_measurements}
                      setMeasurements={setMeasurements}
                      listOfitems={
                        create
                          ? listOfpants()
                          : Object.keys(measurements.pants_measurements)
                      }
                      typeOf={"pants_measurements"}
                    />
                  </View>
                )}
              </View>
            </>
          )
        )}
        <View className="mb-5">
          <Button
            title={`${create ? "Create" : "Update"} Profile`}
            onPress={handleSubmit}
            disabled={loadingId}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export const AddOrder = ({ Order, setOrderList, setShowModal, edit, data }) => {
  const allAdditional = {
    collar: [
      "wide_collar",
      "regular_collar",
      "round_collar",
      "chinese_collar_no_button",
      "chinese_collar",
    ],
    pocket: [
      "pocket1",
      "pocket2",
      "pocket3",
      "pocket4",
      "pocket5",
      "pocket6",
      "pocket7",
    ],
    pleat: ["box_pleat", "no_pleat", "single_side_pleat", "double_side_pleat"],
    placket: ["front_placket", "covered_placket", "placket_french_front"],
    shoulder: [
      "normal_shoulder",
      "plate_shoulder",
      "split_shoulder",
      "v_shaped_shoulder",
    ],
    pants_pocket: [
      "one_pocket_with_button",
      "two_pockets_with_button",
      "two_pockets_with_flap",
      "two_pockets_with_zip",
      "no_pockets",
      "pocket_with_zip",
      "pocket_with_flap",
    ],
    iron: ["straigth_iron", "side_iron"],
  };
  const initialDate = data?.delivery_date
    ? new Date(data.delivery_date)
    : new Date(23, 11, 2022);
  const [photo, setPhoto] = useState(
    data?.photos[0] ? `${serverUrl()}/photos/${data.photos[0]}` : null
  );
  const [type, setType] = useState("");
  const [items, setItems] = useState(() => {
    const list = {};
    if (data?.additional_details) {
      const additionalDetails = data.additional_details.split(",");
      Object.entries(allAdditional).forEach(([key, value]) => {
        const item = additionalDetails.find((item) => value.includes(item));
        if (item) {
          list[key] = item;
        }
      });
    }
    if (Object.keys(list).length !== 0 ) {
      const additionalDetails = data.additional_details.split(",");
      const value = Object.values(list);
      additionalDetails.find((item) => {
        if (!value.includes(item)) {
          setType(item);
        }
      });
    }
    return list;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [showDate, setshowDate] = useState(data?.delivery_date ? true : false);
  const [show, setShowmodel] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isUrgent, setIsUrgent] = useState(
    data?.isUrgent ? data.isUrgent : false
  );

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleSave = () => {
    if (date.getTime() === initialDate.getTime()) {
      Alert.alert("Error", "Please select a delivery date");
      return;
    }
    if (!photo) {
      Alert.alert("Error", "Please select a photo");
      return;
    }
    const newOrder = {
      type: Order,
      items: [...Object.values(items), type !== "" && type].filter(Boolean),
      photo: photo,
      delivery_date: date,
      isUrgent: isUrgent,
    };
    setItems({});
    setPhoto(null);
    setType("");
    setOrderList((prevOrderList) => [...prevOrderList, newOrder]);
    setShowModal(false);
    setIsUrgent(false);
  };

  const handleFullScreenImage = () => {
    if (photo) {
      setShowFullScreenImage(true);
    }
  };

  const handleCloseFullScreenImage = () => {
    setShowFullScreenImage(false);
  };

  const listOfInfo = (list, arg) => {
    return list.map((item) => (
      <TouchableOpacity
        key={item}
        className={`flex flex-row border-2 ${
          items[arg] === item ? "border-accent" : "border-primary"
        }`}
        onPress={() => setItems({ ...items, [arg]: item })}
      >
        <Image className="w-24 h-24" source={shirt[item]} />
      </TouchableOpacity>
    ));
  };
  const handleChange = async () => {
    setIsLoading(true);
    let changePhoto;
    try {
      if (photo !== `${serverUrl()}/photos/${data.photos[0]}`) {
        const formData = new FormData();
        formData.append("photo", {
          uri: photo,
          name: "photo.jpg",
          type: "image/jpeg",
        });
        changePhoto = await sendDataToServer(formData);
      }
      const changedOrder = {
        additional_details: [...Object.values(items), type !== "" && type]
          .filter(Boolean)
          .join(","),
        photos: changePhoto,
        delivery_date: date !== data.delivery_date ? date : undefined,
        isUrgent: isUrgent,
      };
      const res = await updateOrder(data._id, changedOrder);
      if (res.status === 200) {
        Alert.alert("Success", "Order updated successfully", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      {isLoading && (
        <ActivityIndicator
          size={"large"}
          color={"white"}
          className="self-center w-screen h-screen bg-[#000000a8] absolute  z-10"
        />
      )}
      <View className="mb-4 w-full self-center">
        <Text className="text-xl text-secondary font-bold text-center">
          About {Order}
        </Text>

        {!photo && (
          <>
            <View
              className="bg-accent mb-3 self-center border-2 border-primary h-20 w-20 rounded-full flex-row justify-center items-center flex"
              disabled={isLoading}
            >
              {Order == "Shirt" ? (
                <>
                  <Image
                    source={require(`../assets/images/shirt1.png`)}
                    className="h-10 w-10 "
                  />
                </>
              ) : Order == "Pants" ? (
                <Image
                  source={require(`../assets/images/pants.png`)}
                  className="h-10 w-10 "
                />
              ) : null}
            </View>
          </>
        )}

        {photo && (
          <>
          <View className='flex w-full justify-center items-center'>

            <TouchableOpacity onPress={handleFullScreenImage} className="w-20  h-20 bg-secondary mb-3 rounded-full ">
                <Image
                  source={{ uri: photo }}
                  className="w-full rounded-full h-full"
                  />
            </TouchableOpacity>
                  </View>

            <Modal
              visible={showFullScreenImage}
              transparent={true}
              onRequestClose={handleCloseFullScreenImage}
              animationType="slide"
            >
              <FullImageShow
                photo={photo}
                handleCloseFullScreenImage={handleCloseFullScreenImage}
              />
            </Modal>
          </>
        )}

        <Text className="text-center  text-accent text-base">
          <ImagePickerComponent
            onImageSelected={(image) => setPhoto(image)}
            Show={show}
            setShow={(show) => setShowmodel(show)}
            showText={false}
            />
        </Text>
      </View>

      {Order !== "Others" && (
        <ScrollView
          className={`flex-col flex-wrap gap-3 min-h-fit max-h-[60vh] `}
        >
          {Order === "Shirt" ? (
            <View>
              <Text>Types of Collars</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {listOfInfo(
                  [
                    "wide_collar",
                    "regular_collar",
                    "round_collar",
                    "chinese_collar_no_button",
                    "chinese_collar",
                  ],
                  "collar"
                )}
              </View>
              <Text>Types of Cuff</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {listOfInfo(["angle_cuff", "box_cuff", "round_cuff"], "cuff")}
              </View>
              <Text>Types of Pockets</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {listOfInfo(
                  [
                    "pocket1",
                    "pocket2",
                    "pocket3",
                    "pocket4",
                    "pocket5",
                    "pocket6",
                    "pocket7",
                  ],
                  "pocket"
                )}
              </View>
              <Text>Types of Pleat</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {listOfInfo(
                  [
                    "box_pleat",
                    "no_pleat",
                    "single_side_pleat",
                    "double_side_pleat",
                  ],
                  "pleat"
                )}
              </View>
              <Text>Types of Cuff</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {listOfInfo(
                  ["front_placket", "covered_placket", "placket_french_front"],
                  "placket"
                )}
              </View>
              <Text>Types of Shoulder</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {listOfInfo(
                  [
                    "normal_shoulder",
                    "plate_shoulder",
                    "split_shoulder",
                    "v_shaped_shoulder",
                  ],
                  "shoulder"
                )}
              </View>
            </View>
          ) : Order === "Pants" ? (
            <View>
              <Text>Types of Back Pocket</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {listOfInfo(
                  [
                    "one_pocket_with_button",
                    "two_pockets_with_button",
                    "two_pockets_with_flap",
                    "two_pockets_with_zip",
                    "no_pockets",
                    "pocket_with_zip",
                    "pocket_with_flap",
                  ],
                  "pants_pocket"
                )}
              </View>
              <Text>Types of Iron</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {listOfInfo(["straigth_iron", "side_iron"], "iron")}
              </View>
            </View>
          ) : null}
        </ScrollView>
      )}
      <View className="flex flex-row items-center  mt-4 mb-4 pr-3">
        <Text className="text-lg font-bold">Other: </Text>
        <TextInput
          value={type}
          onChangeText={(value) => setType(value)}
          className="text-lg font-bold text-secondary placeholder-secondary border-[1px] px-2 rounded-md border-accent text-center w-[90%]"
          placeholder="Type"
          textAlignVertical="center"
          multiline={true}
        />
      </View>
      <View className=" mt-4 mb-4 pr-3">
        <View className="flex flex-row">
          <Text className="text-lg font-bold">Delivery Date: </Text>
          <Pressable
            onPress={() => setShowCalendar(true)}
            className="border-2 rounded-xl bg-secondary px-2 py-1"
          >
            {!showDate ? (
              <Text className="text-md p-2  text-accent  font-bold rounded-full px-2">
                Select Date
              </Text>
            ) : (
              <Text className="text-lg text-accent font-semibold">
                {date.toLocaleDateString()}, {daysOfWeek[date.getDay()]}
              </Text>
            )}
          </Pressable>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Text className="text-lg  font-bold">Urgent: </Text>
          <Switch
            value={isUrgent}
            onValueChange={(value) => setIsUrgent(value)}
          />
        </View>
        <Modal
          transparent={true}
          visible={showCalendar}
          onRequestClose={() => setShowCalendar(false)}
        >
          <DatePicker
            mode="date"
            value={date ? new Date(date) : null}
            onChange={(selectedDate) => {
              setShowCalendar(false);
              const selectedDate1 = new Date(
                selectedDate.nativeEvent.timestamp
              );
              setDate(selectedDate1);
              setshowDate(true);
            }}
            display="calendar"
            minimumDate={new Date()}
          />
        </Modal>
      </View>
      {edit ? (
        <Button title="Change" onPress={handleChange} disabled={isLoading} />
      ) : (
        <Button title="Save" onPress={handleSave} disabled={isLoading} />
      )}
      {/* {Object.keys(items)
        .filter((key) => items[key])
        .map((key) => (
          <Text key={key}>{key}</Text>
        ))} */}
      {Object.values(items).map((item) => (
        <Text key={item}>
          {item.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </Text>
      ))}
    </SafeAreaView>
  );
};

export const FullImageShow = ({
  photo,
  handleCloseFullScreenImage,
  showFullScreenImage,
}) => {
  return (
    <Modal
      visible={showFullScreenImage}
      transparent={true}
      onRequestClose={handleCloseFullScreenImage}
      animationType="slide"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={handleCloseFullScreenImage}
        className="bg-black/70 flex h-full flex-col"
      >
        <View className=" self-start">
          <Image source={icons.leftArrow} className="mt-4 ml-4" />
        </View>
        {photo && (
          <Image
            source={{ uri: photo }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </Modal>
  );
};

export const ImagePickerComponent = ({
  onImageSelected,
  Show,
  setShow,
  showText,
}) => {
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(Show);

  useEffect(() => {
    setShowModal(Show);
  }, [Show]);

  const pickImageFromGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: showText ? [16, 8] : [3, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        onImageSelected(uri);
      }
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
    setShow(false);
  };

  const pickImageFromCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: showText ? [16, 8] : [3, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        onImageSelected(uri);
      }
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
    setShow(false);
  };

  return (
    <View className="flex-1 items-center justify-center">
      {!showText && (
        <Text
          className="text-md font-bold mb-4 mt-2 text-blue-500"
          onPress={() => setShowModal(true)}
        >
          {image ? "Change Image" : "Select Image"}
        </Text>
      )}
      <Modal
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
          setShow(false);
        }}
        animationType="slide"
      >
        <TouchableOpacity
          onPressIn={() => {
            setShowModal(false);
            setShow(false);
          }}
          className="flex-1 justify-end items-center -z-20 bg-black/70 "
        >
          <View className="bg-white w-full p-4 rounded-t-3xl">
            <Text className="text-lg font-bold mb-4 text-center">
              Select an option
            </Text>
            <View className="flex flex-row justify-around">
              <TouchableOpacity
                onPress={pickImageFromGallery}
                className="w-1/2 p-4 rounded-lg  flex items-center "
              >
                <Image
                  className="h-20 w-20"
                  source={require("../assets/icons/gallery.png")}
                />
                <Text className="text-accent text-center">
                  Choose from Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickImageFromCamera}
                className="w-1/2 p-4 rounded-lg flex items-center "
              >
                <Image
                  className="h-20 w-20"
                  source={require("../assets/icons/camera.png")}
                />

                <Text className="text-accent text-center">Take a Photo</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setShow(false);
              }}
              className="bg-transparent border-2 border-accent1 p-4 rounded-xl mt-2"
            >
              <Text className="text-accent1 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const Profile1 = ({ data }) => {
  const [fullPhoto, setFullPhoto] = useState(null);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [darkmode, setDarkmode] = useState(false);

  const handleCloseFullScreenImage = useCallback(() => {
    setShowFullScreenImage(false);
  }, []);

  return (
    <>
      <View className="flex justify-end align-middle items-center  w-full  relative ">
        <View className="flex flex-row justify-between items-center w-full px-4 py-3 border-b-4 border-[#00000020]">
          <Text className="text-2xl font-bold">{data.user[0].shopName}</Text>
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Image
              source={require("../assets/icons/Menu.png")}
              className="w-7 h-7 "
            />
          </TouchableOpacity>
          <Modal
            visible={visible}
            onRequestClose={() => setVisible(false)}
            transparent
          >
            <TouchableOpacity
              onPressIn={() => setVisible(false)}
              className="w-full h-full z-0"
            >
              <View className="z-10 absolute top-10 right-3 w-52 h-40 bg-backgeound rounded-xl">
                <View className="flex flex-row items-center justify-center pt-2">
                  <Text className="text-accent1 font-bold text-xl pr-2">
                    Settings
                  </Text>
                  <Image
                    className="w-5 h-5"
                    source={require("../assets/icons/Vector (1).png")}
                  />
                </View>
                <View className=" flex flex-row items-center px-6 mt-4">
                  <Image
                    className="w-5 mr-1 h-5"
                    source={require("../assets/icons/Vector.png")}
                  />
                  <Text className="text-accent1  font-bold">Dark Mode</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDarkmode(!darkmode);
                    }}
                  >
                    {darkmode ? (
                      <>
                        <Image
                          className="w-10 ml-6 h-5"
                          source={require("../assets/icons/Clip path group (1).png")}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          className="w-10 ml-6 h-5"
                          source={require("../assets/icons/Clip path group.png")}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    AsyncStorage.removeItem("token");
                    AsyncStorage.removeItem("userId")
                      .then(() => router.replace("/"))
                      .catch((error) => console.error(error));
                  }}
                  className="flex flex-row items-center px-6 mt-4"
                >
                  <Image
                    className="w-5 h-5 mr-1"
                    source={require("../assets/icons/Logout.png")}
                  />
                  <Text className="text-accent1 font-bold">Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        <View className="w-screen h-36  flex flex-row justify-center border-b-2 border-accent1  relative items-center">
          <TouchableOpacity
            onPressIn={() => {
              setShowFullScreenImage(true);
              setFullPhoto(`${serverUrl()}/photos/${data.user[0].shopPhoto}`);
            }}
            className="w-full h-full"
          >
            <Image
              source={{
                uri: `${serverUrl()}/photos/${data.user[0].shopPhoto}`,
              }}
              className="w-full h-full"
            />
          </TouchableOpacity>
          <FullImageShow
            photo={fullPhoto}
            handleCloseFullScreenImage={handleCloseFullScreenImage}
            showFullScreenImage={showFullScreenImage}
          />
          <TouchableOpacity
            className="absolute -bottom-8 bg-white  right-50 w-20 h-20 rounded-full border-4"
            onPressIn={() => {
              setShowFullScreenImage(true);
              setFullPhoto(
                `${serverUrl()}/photos/${data.user[0].profilePhoto}`
              );
            }}
          >
            <Image
              source={{
                uri: `${serverUrl()}/photos/${data.user[0].profilePhoto}`,
              }}
              className="w-full h-full rounded-full"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-screen flex flex-row mt-10 justify-around">
        <View className="flex flex-col items-center w-28">
          <Text className="text-lg font-bold text-accent">
            {data.totalCustomers}
          </Text>
          <Text className="text-lg font-bold text-accent1 opacity-50">
            Customers
          </Text>
        </View>
        <View className="flex flex-col items-center w-28">
          <Text className="text-lg font-bold text-accent">
            {data.totalOrders}
          </Text>
          <Text className="text-lg font-bold text-accent1 opacity-50">
            Orders
          </Text>
        </View>
        <View className="flex flex-col items-center w-28">
          <Text className="text-lg font-bold text-accent">
            {data.totalPendingOrders}
          </Text>
          <Text className="text-lg font-bold text-accent1 opacity-50">
            Pending
          </Text>
        </View>
      </View>
      <View className="rounded-xl bg-backgeound p-5 gap-1 mt-1 mx-3">
        <View className="flex flex-row items-center ">
          <Text className="text-lg font-bold mr-2 text-accent1 text-center underline decoration-accent1 ml-6 ">
            {data.user[0].name}
          </Text>
          <Link href="editShop/editShop" className="w-5 h-5">
            <Image
              source={require("../assets/icons/Icon.png")}
              className="w-4 h-4"
            />
          </Link>
        </View>
        <View className="flex flex-row items-center ">
          <Image
            source={require("../assets/icons/mail.png")}
            className="w-4 h-4 mr-2"
          />
          <Text className="text-base font-bold text-accent text-center  ">
            {data.user[0].email}
          </Text>
        </View>
        <View className="flex flex-row items-center ">
          <Image
            source={require("../assets/icons/phone.png")}
            className="w-4 h-4 mr-2"
          />
          <Text className="text-base font-bold text-accent text-center  ">
            {data.user[0].phoneNumber}
          </Text>
        </View>
        <View className="flex flex-row pr-4">
          <Image
            source={require("../assets/icons/location_on.png")}
            className="w-4 h-4 mt-2 mr-2"
          />
          <Text className="text-base font-bold text-accent ">
            {data.user[0].shopAddress}
          </Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-lg font-bold text-accent1 ">About Us</Text>
        <Text>{data.user[0].aboutUs}</Text>
      </View>
      <View className="px-4 flex gap-2 flex-col">
        <Text className="text-lg font-bold text-accent1 mb-3">
          Recently Completed
        </Text>
        {data.recently.length > 0 ? (
          data.recently.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-full bg-backgeound p-4 rounded-xl flex flex-row justify-around items-center"
              onPress={() => router.push(`/details/${item._id}`)}
            >
              <Image
                source={{ uri: `${serverUrl()}/photos/${item.photos[0]}` }}
                className="w-10 mr-4 h-10 rounded-full"
              />
              <View className="">
                <Text className="text-lg font-bold text-accent1 ">
                  {item.customerName}
                </Text>
                <Text className="text-sm font-bold text-accent1 ">
                  {new Date(item.updated_at).toLocaleDateString()}
                </Text>
              </View>
              <Text className="text-lg font-bold flex-1 text-right text-accent1 ">
                {item.customer_id}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-lg font-bold text-accent1 ">No Orders</Text>
        )}
      </View>
    </>
  );
};

export const AddShop = ({ data }) => {
  const [state, setState] = useState({
    address: "",
    perName: "",
    showMap: false,
    image: null,
    showModel: false,
    showModel1: false,
    image1: null,
    name: "",
    contact: "",
    about: "",
    loading: false,
  });

  useEffect(() => {
    if (data) {
      setState({
        address: data.shopAddress || "",
        image: data.shopPhoto
          ? `${serverUrl()}/photos/${data.shopPhoto}`
          : null,
        image1: data.profilePhoto
          ? `${serverUrl()}/photos/${data.profilePhoto}`
          : null,
        name: data.shopName || "",
        perName: data.name || "",
        contact: data.phoneNumber || "",
        about: data.aboutUs || "",
        loading: false,
        showModel: false,
        showModel1: false,
      });
    }
  }, [data]);
  const isSameImage = (image1, image2) => {
    return image1 === `${serverUrl()}/photos/${image2}`;
  };

  const handleAddShop = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const { image, image1, name, contact, about, address, perName } = state;
      if (
        !name.trim() ||
        !contact.trim() ||
        !about.trim() ||
        !address.trim() ||
        !perName.trim()
      ) {
        Alert.alert("Error", "Please fill all the fields", [
          {
            text: "OK",
          },
        ]);
        setState((prevState) => ({ ...prevState, loading: false }));

        return;
      }
      const proUri =
        image && !isSameImage(image, data.shopPhoto)
          ? await sendDataToServer(imageToFormData(image))
          : null;
      const proUri1 =
        image1 && !isSameImage(image1, data.profilePhoto)
          ? await sendDataToServer(imageToFormData(image1))
          : null;
      const reQdata = JSON.stringify({
        shopName: name,
        name: perName,
        shopAddress: address,
        phoneNumber: contact,
        aboutUs: about,
        ...(proUri && { shopPhoto: proUri }),
        ...(proUri1 && { profilePhoto: proUri1 }),
      });
      await editShop(reQdata);
      setState((prevState) => ({ ...prevState, loading: false }));
      Alert.alert("Success", "Shop details updated successfully", [
        {
          text: "OK",
          onPress: () => router.push("/home"),
        },
      ]);
    } catch (error) {
      console.error(error);
      setState((prevState) => ({ ...prevState, loading: false }));
      Alert.alert("Error occurred while updating", error.message, [
        {
          text: "OK",
        },
      ]);
    }
  }, [state]);

  const imageToFormData = useCallback((image) => {
    const formData = new FormData();
    formData.append("photo", {
      uri: image,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    return formData;
  }, []);

  return (
    <View className="flex flex-col items-center bg-primary">
      {state.loading ? (
        <ActivityIndicator
          size="large"
          animating={state.loading}
          color="blue"
          className="w-screen h-screen"
        />
      ) : (
        <>
          <TouchableOpacity
            className="w-screen h-40 mb-16 flex flex-row justify-center border-b-2 relative items-center"
            onPress={() =>
              setState((prevState) => ({ ...prevState, showModel: true }))
            }
          >
            {state.image ? (
              <Image source={{ uri: state.image }} className="w-full h-full" />
            ) : (
              <View className="flex flex-col items-center justify-center">
                <Text className="text-lg font-bold text-accent1 mb-2">
                  Add shop photo
                </Text>
                <Image source={icons.plus} className="w-14 h-14" />
              </View>
            )}
            <Text className="bg-transparent hidden text-transparent">
              <ImagePickerComponent
                onImageSelected={(uri) =>
                  setState((prevState) => ({ ...prevState, image: uri }))
                }
                Show={state.showModel}
                setShow={(show) =>
                  setState((prevState) => ({ ...prevState, showModel: show }))
                }
                showText={true}
              />
            </Text>
            <TouchableOpacity
              className="absolute -bottom-20 flex justify-center items-center bg-transparent p-[10] right-50"
              onPress={() =>
                setState((prevState) => ({ ...prevState, showModel1: true }))
              }
            >
              {state.image1 ? (
                <View className="w-20 h-20 rounded-full border-4">
                  <Image
                    source={{ uri: state.image1 }}
                    className="w-full h-full rounded-full"
                  />
                </View>
              ) : (
                <View className="w-20 h-20 flex justify-center items-center bg-white rounded-full border-4">
                  <Image
                    source={require("../assets/icons/profile.png")}
                    className="w-1/2 h-1/2"
                  />
                </View>
              )}
              <Text>
                <ImagePickerComponent
                  onImageSelected={(uri) =>
                    setState((prevState) => ({ ...prevState, image1: uri }))
                  }
                  Show={state.showModel1}
                  setShow={(show) =>
                    setState((prevState) => ({
                      ...prevState,
                      showModel1: show,
                    }))
                  }
                />
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-bold text-accent1">Name of Shop</Text>
            <TextInput
              className="text-lg font-light text-accent1 border-b-[1px] mb-3 border-accent1 w-80 h-8"
              placeholder="Enter Shop Name"
              value={state.name}
              onChangeText={(text) =>
                setState((prevState) => ({ ...prevState, name: text }))
              }
            />
          </View>
          <View>
            <Text className="text-lg font-bold text-accent1">Name</Text>
            <TextInput
              className="text-lg font-light text-accent1 border-b-[1px] mb-3 border-accent1 w-80 h-8"
              placeholder="Enter Shop Name"
              value={state.perName}
              onChangeText={(text) =>
                setState((prevState) => ({ ...prevState, perName: text }))
              }
            />
          </View>
          <View>
            <Text className="text-lg font-bold text-accent1">Shop Address</Text>
            <View className="flex flex-row items-center">
              <TextInput
                className="text-lg font-light text-accent1 border-b-[1px] mb-3 border-accent1 w-72"
                placeholder="Enter Shop Address"
                value={state.address}
                multiline
                onChangeText={(text) =>
                  setState((prevState) => ({ ...prevState, address: text }))
                }
              />
              {/* <TouchableOpacity
                onPress={() =>
                  setState((prevState) => ({ ...prevState, showMap: true }))
                }
                className="h-8 w-8 rounded-xl justify-center items-center flex-row"
              >
                <Image
                  source={require("../assets/icons/location_on.png")}
                  className="w-8 h-8"
                />
              </TouchableOpacity> */}
            </View>
            {/* {state.showMap && (
              <View className="w-80">
                <AddressPicker
                  setAddress={(address) =>
                    setState((prevState) => ({ ...prevState, address }))
                  }
                  showMap={() =>
                    setState((prevState) => ({ ...prevState, showMap: false }))
                  }
                />
              </View>
            )} */}
          </View>
          <View>
            <Text className="text-lg font-bold text-accent1">Shop Contact</Text>
            <TextInput
              className="text-lg font-light text-accent1 border-b-[1px] mb-3 border-accent1 w-80 h-8"
              placeholder="Enter Shop Contact"
              value={state.contact}
              onChangeText={(text) =>
                setState((prevState) => ({ ...prevState, contact: text }))
              }
            />
          </View>
          <View>
            <Text className="text-lg font-bold text-accent1">About Shop</Text>
            <TextInput
              multiline={true}
              className="text-lg font-light text-accent1 border-b-[1px] mb-3 border-accent1 w-80"
              placeholder="Enter About Shop"
              value={state.about}
              onChangeText={(text) =>
                setState((prevState) => ({ ...prevState, about: text }))
              }
            />
          </View>
          <Button
            title="Add Shop"
            onPress={handleAddShop}
            loading={state.loading}
            className="mb-4"
          />
        </>
      )}
    </View>
  );
};

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { shirt } from "@/constants/images";

export const AddressPicker = ({ setAddress, showMap }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddressState] = useState("");
  const [coordinate, setCoord] = useState("");
  const [region, setRegion] = useState({
    latitude: 17.5018,
    longitude: 78.52,
    latitudeDelta: 2,
    longitudeDelta: 2,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        });
        let result = await Location.reverseGeocodeAsync(location.coords);
        setAddressState(result[0].formattedAddress);

        setCoord(result.coords);
      } catch (e) {
        try{

        let location = await Location.getLastKnownPositionAsync({});
        if (location) {
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 2,
            longitudeDelta: 2,
          });
          
        }
      }catch(e){
        console.log(e)
      }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectLocation = () => {
    setAddress(address);
    showMap(false);
  };
  const handleMapPress = async (e) => {
    setLoading(true);
    try {
      const coords = e.nativeEvent.coordinate;
      setLocation(e.nativeEvent.coordinate);
      let result = await Location.reverseGeocodeAsync(coords);
      setAddressState(result[0].formattedAddress);
      setCoord(coords);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full">
      <View>
        <MapView
          className="h-40 w-full"
          showsMyLocationButton={true}
          showsUserLocation={true}
          onPress={handleMapPress}
          initialRegion={region}
        >
          {location && (
            <Marker
              draggable
              coordinate={location}
              onDragEnd={handleMapPress}
            />
          )}
        </MapView>
        {!loading ? (
          <View className="w-full py-4">
            <Text className="">Selected Location: {address}</Text>
            <Button title="Use this address" onPress={handleSelectLocation} />
          </View>
        ) : (
          <View className="flex justify-center items-center w-full h-40">
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
      </View>
    </View>
  );
};



export const sendSMS = async (number, message) => {
    const url = `sms:${number}?body=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Error',
        'No SMS app found.',
        [
          { text: 'Close' },
        ],
        { cancelable: false },
      );
    }
    return true;
  }
    
