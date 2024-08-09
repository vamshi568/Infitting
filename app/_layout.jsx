import React from "react";
import { Stack } from "expo-router";
import GlobalProvider from "../context1/Globalcontext"
import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import { MyComponent } from "@/components/helpers";

const AppLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "ImperialScript": require("../assets/fonts/ImperialScript.ttf"),
    "JimNightshade": require("../assets/fonts/JimNightshade.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; 
  }
  return (

    
    <GlobalProvider>
    <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false,animation:"slide_from_left", }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="details/[id]" options={{ headerShown: true ,headerTitle:"Order Details",headerTitleAlign:"center",headerBackgroundColor:"#27374D" }} />
            <Stack.Screen
              name="profiledetails/[profile_id]"
              options={{
                headerShown: true,
                headerTitle: "Profile",
                headerTitleAlign: "center",
                headerBackgroundColor: "#27374D",
                
              }}
            />
            <Stack.Screen name="profileEdit/[profile_id]" options={{ headerShown: true,headerTitle:"Edit Profile",headerTitleAlign:"center",headerBackgroundColor:"#27374D" }} />
            <Stack.Screen name="orders/[orderId]" options={{ headerShown: true,headerTitle:"Add Order",headerTitleAlign:"center",headerBackgroundColor:"#27374D", }} />
            <Stack.Screen name="editShop/editShop" options={{ headerShown: true,headerTitle:"Edit Shop",headerTitleAlign:"center",headerBackgroundColor:"#27374D", }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }}/>        
      </Stack>
            
      </GlobalProvider>
  );
};

export default AppLayout;
