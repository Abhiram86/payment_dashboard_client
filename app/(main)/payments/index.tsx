import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useUser } from "../../../context/UserContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "../../../components/main/FilterModal";
import Constants from "expo-constants";

interface Payment {
  id: number;
  amount: number;
  receiver: string;
  status: "pending" | "success" | "failed";
  method: "card" | "upi" | "bank_transfer";
}

export default function PaymentsScreen() {
  const { logout } = useUser();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [methodFilter, setMethodFilter] = useState<string | null>(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isMethodModalVisible, setIsMethodModalVisible] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        try {
          let url = `${Constants.expoConfig?.extra?.BASE_URL}payments`;
          const params = new URLSearchParams();
          if (statusFilter) {
            params.append("status", statusFilter);
          }
          if (methodFilter) {
            params.append("method", methodFilter);
          }
          const queryString = params.toString();
          if (queryString) {
            url += `?${queryString}`;
          }
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setPayments(data);
        } catch (error) {
          console.error("Failed to fetch payments:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [reload, statusFilter, methodFilter]);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={styles.title}>Payments</Text>
          <TouchableOpacity onPress={() => setReload(!reload)}>
            <Ionicons name="reload" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Amount</Text>
          <Text style={styles.tableHeaderText}>Receiver</Text>
          <TouchableOpacity
            style={styles.tableHeaderTouchable}
            onPress={() => setIsStatusModalVisible(true)}
          >
            <Text style={styles.tableHeaderText}>
              Status{" "}
              {statusFilter && (
                <Ionicons name="filter" size={16} color="white" />
              )}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tableHeaderTouchable}
            onPress={() => setIsMethodModalVisible(true)}
          >
            <Text style={styles.tableHeaderText}>
              Method{" "}
              {methodFilter && (
                <Ionicons name="filter" size={16} color="white" />
              )}
            </Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <Text style={{ textAlign: "center", padding: 16 }}>Loading ....</Text>
        ) : (
          <FlatList
            data={payments}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => router.push(`/(main)/payments/${item.id}`)}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
              >
                <Text style={styles.tableCell}>{item.amount}</Text>
                <Text numberOfLines={1} style={styles.tableCell}>
                  {item.receiver}
                </Text>
                <Text numberOfLines={1} style={styles.tableCell}>
                  {item.status}
                </Text>
                <Text numberOfLines={1} style={styles.tableCell}>
                  {item.method}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", padding: 16 }}>
                No payments found.
              </Text>
            }
            ListFooterComponentStyle={{ marginBottom: 200 }}
          />
        )}
      </View>
      <FilterModal
        visible={isStatusModalVisible}
        title="Filter by Status"
        options={["Pending", "Success", "Failed"]}
        onSelect={setStatusFilter}
        onClose={() => setIsStatusModalVisible(false)}
      />
      <FilterModal
        visible={isMethodModalVisible}
        title="Filter by Method"
        options={["Card", "UPI", "Bank Transfer"]}
        onSelect={setMethodFilter}
        onClose={() => setIsMethodModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f4f7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "red",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#242424",
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    flex: 1,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableHeaderTouchable: {
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#f0f4f7",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    overflow: "hidden",
  },
});
