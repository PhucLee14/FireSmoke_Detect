import { Text, View } from "react-native";
import { useFireAlertSystem } from "../../hooks/useFireAlertSystem";

export default function HomeScreen() {
  useFireAlertSystem();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🔥 Hệ thống phát hiện cháy đang hoạt động</Text>
    </View>
  );
}
