import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";

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
    this.navigation = navigation;
  }

  get(endpoint) {
    console.log(this.baseUrl + "" + endpoint);
    return apiAxios.get(endpoint);
  }

  post(endpoint, params, isFormData = false) {
    const config = {
      headers: {
        ...(isFormData && { "Content-Type": "multipart/form-data" }),
      },
    };
    console.log(this.baseUrl + "" + endpoint, params, config);
    return apiAxios.post(this.baseUrl + endpoint, params, config);
  }

  put(endpoint, params) {
    return apiAxios.put(this.baseUrl + endpoint, params);
  }

  delete(endpoint, params) {
    return apiAxios.delete(this.baseUrl + endpoint, { data: params });
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

const refreshAndRetryQueue = [];
let isRefreshing = false;

apiAxios.interceptors.response.use(
  (response) => {
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
          if (response?.data?.IsSuccess) {
            const newToken = response.data.Token;
            await AsyncStorage.setItem("Token", newToken);
            const newRefreshToken = response.data.RefreshToken;
            await AsyncStorage.setItem("RefreshToken", newRefreshToken);
            apiAxios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
              apiAxios
                .request(config)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
            });
            refreshAndRetryQueue.length = 0;
            return apiAxios(originalRequest);
          } else {
            LogoutAndRedirectToLogin();
          }
        } catch (error) {
          LogoutAndRedirectToLogin();
          throw error;
        } finally {
          isRefreshing = false;
        }
      }
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
  AsyncStorage.clear();
  navigate("AuthNavigator");
};

export default NetworkUtils;
