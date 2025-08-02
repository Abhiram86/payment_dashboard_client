import { useUser } from "@/context/UserContext";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert, Text, View } from "react-native";

export default function Index() {
  const { user, login } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      setIsLoading(false);
      router.replace("/(main)/payments");
      return;
    } else {
      async function verifyToken() {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          const data = await fetch("http://172.16.141.104:8080/auth/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const res = await data.json();
          console.log(res);
          if (data.ok) {
            login(res, token);
            setIsLoading(false);
            router.replace("/(main)/payments");
          } else {
            setIsLoading(false);
            Alert.alert("Login Failed", "An unexpected error occurred.");
          }
        } else {
          setIsLoading(false);
        }
      }
      verifyToken();
    }
  }, [router, isLoading]);
  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  return <Redirect href="/(auth)/login" />;
}
