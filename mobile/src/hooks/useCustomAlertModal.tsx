import { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";

interface AlertModalButton {
  text: string;
  onPress: () => void;
  style?: "cancel" | "destructive" | "default";
}

type AlertType =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "question";

interface AlertOptions {
  title: string;
  message: string;
  buttons?: AlertModalButton[];
  alertType?: AlertType;
}

interface AlertState extends AlertOptions {
  visible: boolean;
}

const DEFAULT_STATE: AlertState = {
  visible: false,
  title: "",
  message: "",
  buttons: [],
  alertType: "default",
};

// color scheme + icon per alert type
const ALERT_THEMES: Record<
  AlertType,
  {
    accent: string;
    tint: string;
    iconBg: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  default: {
    accent: COLORS.primary,
    tint: COLORS.inputBackground,
    iconBg: COLORS.border,
    icon: "chatbubble-ellipses-outline",
  },
  success: {
    accent: "#2e7d32",
    tint: "#e8f5e9",
    iconBg: "#c8e6c9",
    icon: "checkmark-circle-outline",
  },
  error: {
    accent: "#e53935",
    tint: "#fdecea",
    iconBg: "#f9c6c2",
    icon: "close-circle-outline",
  },
  warning: {
    accent: "#f57c00",
    tint: "#fff3e0",
    iconBg: "#ffe0b2",
    icon: "warning-outline",
  },
  info: {
    accent: "#1565c0",
    tint: "#e3f2fd",
    iconBg: "#bbdefb",
    icon: "information-circle-outline",
  },
  question: {
    accent: "#6a1b9a",
    tint: "#f3e5f5",
    iconBg: "#e1bee7",
    icon: "help-circle-outline",
  },
};

export function useCustomAlertModal() {
  const [alertState, setAlertState] = useState<AlertState>(DEFAULT_STATE);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({ alertType: "default", ...options, visible: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  }, []);

  const resolvedButtons: AlertModalButton[] =
    alertState.buttons && alertState.buttons.length > 0
      ? alertState.buttons
      : [{ text: "Close", style: "cancel", onPress: () => {} }];

  const theme = ALERT_THEMES[alertState.alertType ?? "default"];

  const handlePress = (btn: AlertModalButton) => {
    if (btn.onPress) btn.onPress();
    hideAlert();
  };

  const AlertModal = (
    <Modal
      visible={alertState.visible}
      transparent
      animationType="fade"
      onRequestClose={hideAlert}
    >
      <Pressable style={styles.overlay} onPress={hideAlert}>
        <Pressable
          style={[
            styles.card,
            { backgroundColor: theme.tint, borderColor: theme.accent },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.iconBg }]}>
            <Ionicons name={theme.icon} size={28} color={theme.accent} />
          </View>

          {alertState.title ? (
            <Text style={[styles.title, { color: theme.accent }]}>
              {alertState.title}
            </Text>
          ) : null}
          {alertState.message ? (
            <Text style={styles.message}>{alertState.message}</Text>
          ) : null}

          <View style={styles.buttonRow}>
            {resolvedButtons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  { backgroundColor: theme.accent },
                  btn.style === "cancel" && styles.cancelButton,
                  btn.style === "destructive" && styles.destructiveButton,
                  resolvedButtons.length === 1 && styles.singleButton,
                ]}
                onPress={() => handlePress(btn)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    btn.style === "cancel" && styles.cancelButtonText,
                    btn.style === "destructive" && styles.destructiveButtonText,
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  return { showAlert, hideAlert, AlertModal };
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    alignItems: "center",
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    width: "100%",
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  singleButton: {
    flex: 0,
  },
  cancelButton: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  destructiveButton: {
    backgroundColor: "#e53935",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 15,
  },
  cancelButtonText: {
    color: COLORS.textDark,
  },
  destructiveButtonText: {
    color: COLORS.white,
  },
});


// -------- HOW TO USE ------------


// import { useCustomAlertModal } from "@/hooks/useCustomAlertModal";

// export default function Login() {
//   const { showAlert, AlertModal } = useCustomAlertModal();
//   const { isLoading, login } = useAuthStore();

//   const handleLogin = async () => {
//     const result = await login(email, password);

//     if (!result.success) {
//       showAlert({
//         title: "Error",
//         message: result.error,
//       });
//     }
//   };

//   const handleDelete = () => {
//     showAlert({
//       title: "Delete this book?",
//       message: "This action cannot be undone.",
//       buttons: [
//         { text: "Cancel", style: "cancel", onPress: () => {} },
//         { text: "Delete", style: "destructive", onPress: () => console.log("deleted") },
//       ],
//     });
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }}>
//       {/* ...your screen content... */}

//       {AlertModal}
//     </KeyboardAvoidingView>
//   );
// }