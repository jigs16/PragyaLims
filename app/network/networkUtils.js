import * as React from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const apiAxios = axios.create({
  baseURL: "http://124.123.122.224:814/api/",
  // baseURL: "http://192.168.0.200:814/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

class NetworkUtils {
  constructor(options, navigation) {
    this.baseUrl = options.baseUrl;
    this.signalRBaseUrl = options.signalRBaseUrl;
    this.navigation = navigation;
  }

  get(endpoint) {
    console.log(this.baseUrl + "" + endpoint);
    // return this.requestHttpJSON('GET', this.baseUrl + endpoint, null);
    return apiAxios.get(endpoint);
  }

  post(endpoint, params, isFormData) {
    console.log(this.baseUrl + "" + endpoint + " " + params);
    return apiAxios.post(endpoint, params, isFormData);
  }

  put(endpoint, params) {
    // return this.requestHttpJSON('PUT', this.baseUrl + endpoint, params);
    return apiAxios.put(endpoint, params);
  }

  delete(endpoint, params) {
    // return this.requestHttpJSON('DELETE', this.baseUrl + endpoint, params);
    return apiAxios.delete(endpoint, params);
  }
}

apiAxios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define the structure of a retry queue item
const refreshAndRetryQueue = [];
// Flag to prevent multiple token refresh requests
let isRefreshing = false;

apiAxios.interceptors.response.use(
  (response) => {
    // return response;
    return { statusCode: response.status, body: response.data };
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = await AsyncStorage.getItem("RefreshToken");
          const response = await axios.post(
            "http://124.123.122.224:814/api/Authentication/RefreshToken",
            {
              RefreshToken: refreshToken,
            }
          );
          console.log("Refresh token Responce =====>>> : ", response?.data);
          if (response?.data?.IsSuccess) {
            console.log("Refresh token Responce:", response);
            const newToken = response.data.Token;
            await AsyncStorage.setItem("Token", newToken);
            const newRefreshToken = response.data.RefreshToken;
            await AsyncStorage.setItem("RefreshToken", newRefreshToken);
            console.log("Authorization Set Start 1==>>");
            apiAxios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            console.log("Authorization Set Start 2==>>");
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            console.log("Authorization Set Done==>>");
            // Retry all requests in the queue with the new token
            refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
              apiAxios
                .request(config)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
            });
            console.log("refreshAndRetryQueue Loop Done==>>");
            // Clear the queue
            refreshAndRetryQueue.length = 0;

            return apiAxios(originalRequest);
          } else {
            //logout & redirect to login screen
            LogoutAndRedirectToLogin();
          }
        } catch (error) {
          // Handle refresh token error
          LogoutAndRedirectToLogin();
          throw error;
          // console.error("Refresh token error:", error);
          // return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
      // Add the original request to the queue
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    } else {
      return Promise.reject(error);
    }
  }
);

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export const LogoutAndRedirectToLogin = () => {
  console.log("Logout ===>>>");
  AsyncStorage.clear();
  navigate("AuthNavigator");
};

export default NetworkUtils;
