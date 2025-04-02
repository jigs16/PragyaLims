import NetworkUtils from "./networkUtils";

const Api = new NetworkUtils(
  {
    baseUrl: "http://124.123.122.224:814/api/",
    // baseUrl: "http://192.168.0.200:814/api/",
  },
  { signalRBaseUrl: "http://124.123.122.224:814/myHub" }
);

export default Api;
