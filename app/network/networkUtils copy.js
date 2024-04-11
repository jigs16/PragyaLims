import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkInternetConnection} from '../utils';
import Toast from 'react-native-simple-toast';

class NetworkUtils {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.signalRBaseUrl = options.signalRBaseUrl;
  }

  get(endpoint) {
    console.log(this.baseUrl + '' + endpoint);
    return this.requestHttpJSON('GET', this.baseUrl + endpoint, null);
  }

  post(endpoint, params, isFormData) {
    console.log(this.baseUrl + '' + endpoint + ' ' + params);
    return this.requestHttpJSON(
      'POST',
      this.baseUrl + endpoint,
      params,
      isFormData,
    );
  }

  put(endpoint, params) {
    return this.requestHttpJSON('PUT', this.baseUrl + endpoint, params);
  }

  delete(endpoint, params) {
    return this.requestHttpJSON('DELETE', this.baseUrl + endpoint, params);
  }

  async requestHttpJSON(method, url, params, isFormData) {
    // var token = AsyncStorage.getItem('Token');
    var token = await AsyncStorage.getItem('Token');
    return new Promise((resolve, reject) => {
      if (isFormData == 'true') {
        console.log('isFormData  ===============>');
        var options = {
          method,
          url,
          headers: {
            'Content-Type': 'multipart/form-data',
            //Accept: "*/*",
          },
        };
      } else {
        var options = {
          method,
          url,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // Accept: 'application/json',
          },
        };
      }

      if (params) {
        options.data = params;
      }

      if (token !== null) {
        console.log('Token >>>> ', token);
        options.headers['Authorization'] = 'Bearer ' + token;
      }
      // if (token !== null) {
      //   options.headers['Authorization'] = `Bearer ${JSON.stringify(token)}`;
      // }

      axios(options)
        .then(response => {
          resolve({statusCode: response.status, body: response.data});
        })
        .catch(error => {
          console.log('Api_error1: ' + JSON.stringify(error.response));
          console.log('Api_error: ' + JSON.stringify(error));
          var isChcek = checkInternetConnection();
          console.log('ischeck', isChcek);

          if (isChcek) {
            if (error.status == null) {
              resolve({
                statusCode: error.status,
                body: error.message,
              });
              // alert(error.message);
            } else {
              reject(
                Toast.show(
                  'Please check your internet connection.',
                  Toast.LONG,
                ),
              );
            }
          } else {
            reject();
            // Toast.show('Please check your internet connection.', Toast.LONG),
          }
          //navigate("SplashNavigator");
        });
    });
  }
}

export default NetworkUtils;
