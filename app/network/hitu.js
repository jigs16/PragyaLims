import axios from "axios";
import { POST_RefreshToken } from "./url_helper";
import { user_logout } from "../../services/AuthService";
// import { useNavigate } from "react-router-dom";

//pass new generated access token here
var accessToken =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsImp0aSI6ImQ2MTEwYzAxLWMwYjUtNDUzNy1iNDZhLTI0NTk5Mjc2YjY1NiIsImlhdCI6MTU5MjU2MDk2MCwiZXhwIjoxNTkyNTY0NjE5fQ.QgFSQtFaK_Ktauadttq1Is7f9w0SUtKcL8xCmkAvGLw";
const token = accessToken;

//apply base url for axios
const API_URL = process.env.REACT_APP_API_BASEURL;

const axiosApi = axios.create({
  baseURL: API_URL,
});


const getLocalAccessToken = () => {
  var obj = JSON.parse(localStorage.getItem("userDetails"));
  if (obj && obj.Token) {
    return obj.Token;
  } else {
    return token;
  }
};

axiosApi.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
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

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    //status 401 = Unauthorized then get new Authorization token using refresh token
    const originalRequest = error.config; //original requested api
    if (error?.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true; //handle infinite
      if (!isRefreshing) {
        isRefreshing = true;
        var obj = JSON.parse(localStorage.getItem("userDetails"));
        if (obj) {
          try {
            const res = await axiosApi.post(POST_RefreshToken, {
              RefreshToken: obj?.RefreshToken,
            });
            //console.log("new token response: ", res?.data);
            if (res?.data?.IsSuccess) {
              //set new token
              obj.Token = res?.data?.Token;
              obj.TokenExpiryDate = res?.data?.TokenExpiryDate;
              obj.RefreshToken = res?.data?.RefreshToken;
              obj.RefreshTokenExpiryDate = res?.data?.RefreshTokenExpiryDate;
              localStorage.setItem("userDetails", JSON.stringify(obj));

              axiosApi.defaults.headers.common["Authorization"] =
                "Bearer " + res?.data?.Token;

              originalRequest.headers.Authorization =
                "Bearer " + res?.data?.Token;

              // Retry all requests in the queue with the new token
              refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                axiosApi
                  .request(config)
                  .then((response) => resolve(response))
                  .catch((err) => reject(err));
              });

              // Clear the queue
              refreshAndRetryQueue.length = 0;
              return axiosApi(originalRequest); //to call original requested api after new token set
            } else {
              //logout & redirect to login screen
              LogoutAndRedirectToLogin();
            }
          } catch (refreshError) {
            // Handle token refresh error
            //logout & redirect to login screen
            LogoutAndRedirectToLogin();
            throw refreshError;
          } finally {
            isRefreshing = false;
          }
        } else {
          //user auth details not found then redirect to login screen
          LogoutAndRedirectToLogin();
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

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}
export async function postFormData(url, data) {
  return axiosApi
    .post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
}

export const setAuthToken = (token) => {
  //this function is use to set new token to axios api instance login time
  axiosApi.defaults.headers.common["Authorization"] = "Bearer " + token;
};

export const LogoutAndRedirectToLogin = () => {
  //const navigate = useNavigate();

  //logout & redirect to login screen
  var obj = JSON.parse(localStorage.getItem("userDetails"));
  if (obj) {
    user_logout(obj?.LoginIDEncrypt);
  }
  localStorage.removeItem("userDetails");
  //navigate("/login");
  window.location = "/login";
};
