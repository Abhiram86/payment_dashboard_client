import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface Payment {
  id: number;
  amount: number;
  receiver: string;
  status: string;
  method: "card" | "upi" | "bank_transfer";
  createdAt: string;
}

export default function PaymentDetails() {
  const { id } = useLocalSearchParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(id);

  useEffect(() => {
    if (!id) return;

    const fetchPaymentDetails = async () => {
      const token = await SecureStore.getItemAsync("token");
      try {
        const response = await fetch(
          `http://172.16.141.104:8080/payments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setPayment(data);
        } else {
          Alert.alert(
            "Error",
            data.message || "Failed to fetch payment details."
          );
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (!payment) {
    return (
      <View style={styles.container}>
        <Text>Payment not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>${payment.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Receiver:</Text>
        <Text style={styles.value}>{payment.receiver}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Method:</Text>
        <Text style={styles.value}>{payment.method}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{payment.status}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {new Date(payment.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
  },
});
