import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { login } from "../../components/service/api";
import { styled } from "nativewind";
import { useGlobalContext } from "../../context1/Globalcontext";
import { Redirect, router } from "expo-router";
import { Loader } from "../../components/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const { loading, setLoading } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const handleLogin = async () => {
    setError("");
    if (email === "" || password === "") {
      setError("Please fill all required fields");
    } else {
      setLoading(true);

      try {
        const response = await login(email.trim(), password.trim());
        if (response.status === 200) {
          await AsyncStorage.setItem("token", response.data.token);
          router.replace("/home");
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setError("");
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setError("");
  };

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  return (
    <View className="flex-1 justify-center px-4">
      <Text className="text-2xl font-bold mb-4">Login</Text>
      {error && <Text className="text-red-500 mb-4">{error}</Text>}
      <TextInput
        className="border p-2 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
      />
      <Text
        className="text-blue-500 mb-1 self-end"
        onPress={() => setShowPassword(!showPassword)}
      >
        {!showPassword ? "Hide Password" : "Show Password"}
      </Text>
      <TextInput
        className="border p-2 mb-4"
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry={showPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        className="text-blue-500 mt-4"
        onPress={() => router.push("/Register")}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
};

export default styled(Login);
