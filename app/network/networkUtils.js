import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserLogoutApiCall } from "../redux/services/ApiService";
import { Platform } from "react-native";
import Api from "./api";

const apiAxios = axios.create({
  baseURL: "http://124.123.122.224:814/api/",
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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// apiAxios.interceptors.response.use(
//   response => {
//     // return response;
//     return {statusCode: response.status, body: response.data};
//   },
//   async error => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = await AsyncStorage.getItem('RefreshToken');
//         const response = await axios.post(
//           'http://124.123.122.224:814/api/Authentication/RefreshToken',
//           {
//             RefreshToken: refreshToken,
//           },
//         );
//         console.log('Refresh token Responce:', response);
//         const newToken = response.data.Token;
//         await AsyncStorage.setItem('Token', newToken);
//         const newRefreshToken = response.data.RefreshToken;
//         await AsyncStorage.setItem('RefreshToken', newRefreshToken);
//         apiAxios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
//         return apiAxios(originalRequest);
//       } catch (error) {
//         // Handle refresh token error
//         console.error('Refresh token error:', error);
//         return Promise.reject(error);
//       }
//     } else {
//       return Promise.reject(error);
//     }
//   },
// );

apiAxios.interceptors.response.use(
  (response) => {
    return { statusCode: response.status, body: response.data };
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem("RefreshToken");
      if (!refreshToken) {
        // Handle scenario where RefreshToken is not available
        console.error("RefreshToken not found");
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://124.123.122.224:814/api/Authentication/RefreshToken",
          {
            RefreshToken: refreshToken,
          }
        );

        const newToken = response.data.Token;
        await AsyncStorage.setItem("Token", newToken);
        const newRefreshToken = response.data.RefreshToken;
        await AsyncStorage.setItem("RefreshToken", newRefreshToken);

        // Update the Authorization header with the new token
        apiAxios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // Retry the original request
        return apiAxios(originalRequest);
      } catch (error) {
        // Handle refresh token error
        console.error("Refresh token error:", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default NetworkUtils;
