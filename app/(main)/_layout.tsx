import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function MainTabs() {
  return (
    <Tabs>
      <Tabs.Screen
        name="payments" // This should be the folder name
        options={{
          headerShown: false,
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="money" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="makepayment"
        options={{
          tabBarLabel: "Pay",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="credit-card" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
