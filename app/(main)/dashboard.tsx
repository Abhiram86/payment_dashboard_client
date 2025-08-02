import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { PieChart, BarChart, ProgressChart } from "react-native-chart-kit";
import { useUser } from "../../context/UserContext";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const { user } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        try {
          const response = await fetch(
            Constants.expoConfig?.extra?.BASE_URL + "payments/stats",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
  }, [user, reload]);

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text>No stats available.</Text>
      </View>
    );
  }

  const countsData = [
    {
      name: "Success",
      population: stats.counts.success,
      color: "#28a745",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Failed",
      population: stats.counts.failed,
      color: "#dc3545",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Pending",
      population: stats.counts.pending,
      color: "#ffc107",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const amountsData = {
    labels: ["Total", "Average", "Min", "Max"],
    datasets: [
      {
        data: [
          stats.amounts.totalRevenue,
          stats.amounts.averageAmount,
          stats.amounts.minAmount,
          stats.amounts.maxAmount,
        ],
      },
    ],
  };

  const methodsData = [
    {
      name: "Card",
      population: stats.methods.card,
      color: "#007bff",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "UPI",
      population: stats.methods.upi,
      color: "#17a2b8",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Bank Transfer",
      population: stats.methods.bank_transfer,
      color: "#6f42c1",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const successRateData = {
    labels: ["Success"],
    data: [stats.successRate / 100],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity
            onPress={() => setReload(!reload)}
            style={{ position: "absolute", right: -30 }}
          >
            <Ionicons name="refresh" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Payment Status</Text>
        <PieChart
          data={countsData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Payment Amounts</Text>
        <BarChart
          data={amountsData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel="$"
          yAxisSuffix=""
          verticalLabelRotation={30}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Payment Methods</Text>
        <PieChart
          data={methodsData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Success Rate</Text>
        <ProgressChart
          data={successRateData}
          width={screenWidth - 40}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </View>
    </ScrollView>
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
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
