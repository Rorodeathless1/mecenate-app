import axios from "axios";
import * as Crypto from "expo-crypto";

const USER_ID = Crypto.randomUUID();

export const apiClient = axios.create({
  baseURL: "https://k8s.mectest.ru/test-app",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${USER_ID}`;
  return config;
});

export { USER_ID };
