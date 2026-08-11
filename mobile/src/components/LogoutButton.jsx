import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { useCustomAlertModal } from "@/hooks/useCustomAlertModal";

export default function LogoutButton() {
  const { logout } = useAuthStore();
  const { showAlert, AlertModal } = useCustomAlertModal();

  const confirmLogout = () => {
    showAlert({
      title: "Logout",
      message: "Are you sure you want to logout?",
      alertType: "warning",
      buttons: [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logout(), style: "destructive" },
      ],
    });
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
      {AlertModal}
    </TouchableOpacity>
  );
}
