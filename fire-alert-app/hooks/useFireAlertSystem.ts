import { useEffect } from "react";
import { Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBKU6YSsJPnUS-ogCE8NAm7LqSm891vFOQ",
  authDomain: "btl-finalterm.firebaseapp.com",
  projectId: "btl-finalterm",
  storageBucket: "btl-finalterm.appspot.com",
  messagingSenderId: "653525205990",
  appId: "1:653525205990:web:fc64da5c38a895ef4e8c27",
};

// Init Firebase safely
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getDatabase(app);

// Main hook
export function useFireAlertSystem() {
  useEffect(() => {
    // Register push token
    const registerForPushNotificationsAsync = async () => {
      if (!Device.isDevice) {
        Alert.alert("Thông báo chỉ hoạt động trên thiết bị thật!");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Không cấp quyền gửi thông báo!");
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      console.log("📱 Expo Push Token 3luan:", tokenData);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    registerForPushNotificationsAsync();

    // Listen to Firebase fireAlert
    const fireRef = ref(db, "fireAlert");
    const unsubscribe = onValue(fireRef, (snapshot) => {
      const isFire = snapshot.val();
      if (isFire === true) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "🔥 CẢNH BÁO CHÁY!",
            body: "Hệ thống phát hiện cháy trong khu vực!",
          },
          trigger: null,
        });
      }
    });

    return () => {
      // Clean up if necessary (Firebase onValue has no unsubscribe)
    };
  }, []);
}
