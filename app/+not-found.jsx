import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.errorText}>404</Text>
        <Text style={styles.errorText}>Page not found</Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="bg-secondary w-40 mt-10 h-10 rounded-full flex items-center justify-center"
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 40,
    
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
