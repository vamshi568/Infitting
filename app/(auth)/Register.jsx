import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { register } from "../../components/service/api";
import { styled } from "nativewind";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleRegister = async () => {
    setLoading(true);
    if (name === "" || email === "" || password === "") {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    try {
      const response = await register(name, email, password);
      if (response.status === 200) {
        await AsyncStorage.setItem("token", response.data.token);
        router.push("/editShop/editShop");
      } else {
        setError(response.data.message);
      } 
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError("");
  }, [name, email, password]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center  px-4">
        <Text className="text-2xl font-bold mb-4">Register</Text>
        {loading && (
          <ActivityIndicator
            className="absolute  w-screen h-screen bg-[#0000004c]"
            size="large"
            color="blue"
          />
        )}
        <Text className="text-red-500 mb-4">{error}</Text>
        <TextInput
          className="border p-2 mb-4"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="border p-2 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Text
          className="text-blue-500  mb-1 self-end"
          onPress={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? "Hide Password" : "Show Password"}
        </Text>
        <TextInput
          className="border p-2 mb-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={showPassword}
        />
        <Button title="Register" onPress={handleRegister} disabled={loading} />
        <Text
          className="text-blue-500 mt-4"
          onPress={() => router.push("/Login")}
        >
          Already have an account? Login
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default styled(Register);
