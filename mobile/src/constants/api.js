// export const API_URL = "http://localhost:3000/api";
// export const API_URL = "https://bookworm-app-lwmz.onrender.com/api"

import { Platform } from "react-native";

export const API_URL = Platform.OS === "web"
  ? "http://localhost:3000/api"
  :"https://bookworm-app-lwmz.onrender.com/api" ;