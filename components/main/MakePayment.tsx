import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export default function MakePayment() {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [method, setMethod] = useState<"card" | "upi" | "bank_transfer">(
    "card"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || !receiver) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      Alert.alert("Error", "You are not logged in.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        Constants.expoConfig?.extra?.BASE_URL + "payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            receiver,
            method,
            userId: user?.id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Payment Successful", "Your payment has been made.");
        setAmount("");
        setReceiver("");
      } else {
        Alert.alert("Payment Failed", data.message || "An error occurred.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Payment Failed", "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Payment</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Receiver"
        value={receiver}
        onChangeText={setReceiver}
      />
      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            method === "card" && styles.selectedMethod,
          ]}
          onPress={() => setMethod("card")}
        >
          <Text style={styles.methodButtonText}>Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.methodButton,
            method === "upi" && styles.selectedMethod,
          ]}
          onPress={() => setMethod("upi")}
        >
          <Text style={styles.methodButtonText}>UPI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.methodButton,
            method === "bank_transfer" && styles.selectedMethod,
          ]}
          onPress={() => setMethod("bank_transfer")}
        >
          <Text style={styles.methodButtonText}>Bank Transfer</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "dodgerblue",
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  methodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  methodButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedMethod: {
    backgroundColor: "dodgerblue",
    borderColor: "dodgerblue",
  },
  methodButtonText: {
    fontWeight: "bold",
  },
});
