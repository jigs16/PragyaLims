import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import styles from './styles';
import {BaseColor, Images} from '../../config';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Header, Image, Loader, Text, TextInput} from '../../components';
import {moderateScale} from '../../config/scaling';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import DropdownSelected from '../../components/DropdownSelected/DropdownSelected';
import {InwardRegisterReportExportApiCall} from '../../redux/services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from '../../components/AlertModal';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

const MISDetails = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [msgModal, setMsgModal] = useState('');

  const [FromDate, setFromDate] = useState('9-Jan-2024');
  const [ToDate, setToDate] = useState('10-Apr-2024'); //
  const [TCNo, setTCNo] = useState(''); // WorkDetail
  const [InwardNo, setInwardNo] = useState('');
  const [LetterRef, setLetterRef] = useState('');
  const [WorkDetail, setWorkDetail] = useState('');
  const [Customer, setCustomer] = useState(null);
  const [Department, setDepartment] = useState(null);
  const [DispatchNo, setDispatchNo] = useState('');
  const [Project, setProject] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const requestPermissions = async () => {
    try {
      const readPermission = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      const writePermission = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      console.log('checking or requesting permissions');
       if (readPermission !== RESULTS.GRANTED) {
        await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        console.log('readPermission ===>>>', readPermission);
      }

      if (writePermission !== RESULTS.GRANTED) {
        await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        console.log('writePermission ===>>>', writePermission);
      }

      
    } catch (error) {
      console.error('Error checking or requesting permissions:', error);
    }
  };

  useEffect(() => {
    

    requestPermissions();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.warn('A date has been picked: ', date);
    hideDatePicker();
  };

  const data = [
    {label: 'Item 1', value: '1'},
    {label: 'Item 2', value: '2'},
    {label: 'Item 3', value: '3'},
    {label: 'Item 4', value: '4'},
    {label: 'Item 5', value: '5'},
  ];
  useEffect(() => {}, []);

  const checkPermission = async FilePath => {
    if (Platform.OS === 'ios') {
      actualDownload(FilePath);
    } else {
      downloadFileAndroid(FilePath);
    }
  };

  const actualDownload = async urlDownloadLink => {
    //showToast("I am ios")
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const str = urlDownloadLink;

    const index = str.lastIndexOf('.');
    console.log(index); // 👉️ 4

    const before = str.slice(0, index);
    console.log(before); // 👉️ "3.14"

    const extension = str.slice(index + 1);

    console.log(extension);
    const fileName = before + '.' + extension;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: fileName,
      path: `${dirs.DocumentDir}/` + fileName,
      // title: "pdfInfo.pdf",
      // path: `${dirToSave}/${pdfInfo.pdf}`,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: extension,
      },
      android: configfb,
    });

    console.log('The file saved to 23233', configfb, dirs);

    RNFetchBlob.config(configOptions)
      .fetch('GET', urlDownloadLink, {})
      .then(res => {
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        //setisdownloaded(false)
        if (Platform.OS == 'android') {
          //showSnackbar('File downloaded');
        }
        console.log('The file saved to ', res);
      })
      .catch(e => {
        console.log('The file saved to ERROR', e.message);
      });
  };

  const downloadFileAndroid = async urlDownloadLink => {
    try {
      
      const readPermission = await check(
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      );
      const writePermission = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );

      if (
        readPermission === RESULTS.GRANTED &&
        writePermission === RESULTS.GRANTED
      ) {
        console.log('Storage permissions already granted');
        actualDownloadAndroid(urlDownloadLink);
      } else {
        console.log('readPermission11 ===>>>', readPermission);
        console.log('readPermission12 ===>>>', writePermission);
        console.log('Storage permissions not granted, requesting...');
        const readPermissionRequest = request(
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        );
        const writePermissionRequest = request(
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
        const [readResult, writeResult] = await Promise.all([
          readPermissionRequest,
          writePermissionRequest,
        ]);

        if (readResult === RESULTS.GRANTED && writeResult === RESULTS.GRANTED) {
          console.log('Storage permissions granted');
          actualDownloadAndroid(urlDownloadLink);
        } else {
          console.log('Storage permissions denied');
          // Display an alert to the user
          Alert.alert(
            'Permission Denied',
            'Please allow access to storage in order to download files.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          );
        }
      }
    } catch (error) {
      console.error('Error checking or requesting permissions:', error);
    }
  };

  //actualDownloadAndroid(urlDownloadLink);

  const actualDownloadAndroid = urlDownloadLink => {
    const {dirs} = RNFetchBlob.fs;

    var str1 = urlDownloadLink;
    var n = str1.lastIndexOf('/');
    var result = str1.substring(n + 1);
    console.log('result name ' + result);

    const str = urlDownloadLink;

    const index = str.lastIndexOf('.');
    console.log(index); // 👉️ 4

    const before = str.slice(0, index);
    console.log(before); // 👉️ "3.14"

    const extension = str.slice(index + 1);

    console.log(extension);
    const fileName = before + '.' + extension;
    console.log('fileName ' + fileName);
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: result,
        path: `${dirs.DownloadDir}/` + result,
      },
    })
      .fetch('GET', urlDownloadLink, {})
      .then(res => {
        console.log('The file saved to ', res.path());
      })
      .catch(e => {
        console.log(e);
      });
  };

  const InwardRegisterReportExportApi = async () => {
    let LoginDetails = JSON.parse(await AsyncStorage.getItem('LoginDetails'));
    console.log('LoginDetails ===>>> ', LoginDetails);
    setLoading(true);
    var params = {
      CurrentPage: 1,
      PageSize: 10000,
      Search: '',
      Sorting: '',
      BranchIDEncrypted: LoginDetails.BranchIDEncrypt,
      CompanyIDEncrypted: LoginDetails.CompanyIDEncrypt,
      FromDate: FromDate,
      ToDate: ToDate,
      InwardCurrentStatus: '',
      CustomerIDEncrypted: '',
      ProjectIDEncrypted: '',
      TCNo: TCNo,
      CreatedByEncrypted: '',
    };
    console.log('Params =====>>>>>>>>>>', params);
    InwardRegisterReportExportApiCall(params)
      .then(res => {
        console.log(
          'Response Inward Register Report excel download',
          JSON.stringify(res),
        );
        if (res.IsSuccess) {
          setLoading(false);
          if (res.FilePath != '') {
            checkPermission(res.FilePath);
          }
        } else {
          console.log('Faild  >>>>>>>========');
          setLoading(false);
          setMsgModal(res.Message);
          setAlertModal(true);
        }
      })
      .catch(error => {
        setLoading(false);
        setMsgModal(error.message);
        setAlertModal(true);
      });
  };

  return (
    <>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Loader loading={loading} />
      <AlertModal
        showAlertModal={alertModal}
        setShowAlertModal={setAlertModal}
        message={msgModal}></AlertModal>

      <Header
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderLeft={() => {
          return (
            <Image
              style={{width: 25, height: 25}}
              resizeMode="contain"
              tintColor={BaseColor.blackColor}
              source={Images.ic_back}></Image>
          );
        }}
        title={route.params.screenType}
      />
      <LinearGradient
        colors={[BaseColor.whiteColor, BaseColor.whiteColor]}
        locations={[0, 1]}
        style={styles.mainContainer}>
        <StatusBar hidden />
        <ScrollView>
          {route.params.screenType === 'Inward Register' && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(5)}}>
                {'From Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={FromDate}
                onChangeText={text => setFromDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your from date'}
                keyboardType={'phone-pad'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'To Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={ToDate}
                onChangeText={text => setToDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your to date'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'TC No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={TCNo}
                onChangeText={text => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your TC No'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Customer'}
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {}]}
                placeholderStyle={[
                  styles.placeholderStyle,
                  {color: BaseColor.borderColor},
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  {color: '#000000'},
                ]}
                renderItem={(item, selected) => (
                  <DropdownSelected item={item?.label} selected={selected} />
                )}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Customer' : '...'}
                search
                searchPlaceholder={'Search'}
                value={Customer}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setCustomer(item.value);
                  setIsFocus(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Project'}
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus1 && {}]}
                placeholderStyle={[
                  styles.placeholderStyle,
                  {color: BaseColor.borderColor},
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  {color: BaseColor.blackColor},
                ]}
                renderItem={(item, selected) => (
                  <DropdownSelected item={item?.label} selected={selected} />
                )}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 ? 'Select Project' : '...'}
                search
                searchPlaceholder={'Search'}
                value={Project}
                onFocus={() => setIsFocus1(true)}
                onBlur={() => setIsFocus1(false)}
                onChange={item => {
                  setProject(item.value);
                  setIsFocus1(false);
                }}
              />

              <Button
                icon
                onPress={() => {
                  // navigation.navigate('AppNavigator');
                  InwardRegisterReportExportApi();
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}>
                {'Download'}
              </Button>
            </View>
          )}

          {route.params.screenType === 'Process Status' && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(5)}}>
                {'From Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={FromDate}
                onChangeText={text => setFromDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your from date'}
                keyboardType={'phone-pad'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'To Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={ToDate}
                onChangeText={text => setToDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your to date'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Customer'}
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {}]}
                placeholderStyle={[
                  styles.placeholderStyle,
                  {color: BaseColor.borderColor},
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  {color: '#000000'},
                ]}
                renderItem={(item, selected) => (
                  <DropdownSelected item={item?.label} selected={selected} />
                )}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Customer' : '...'}
                search
                searchPlaceholder={'Search'}
                value={Customer}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setCustomer(item.value);
                  setIsFocus(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Project'}
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus1 && {}]}
                placeholderStyle={[
                  styles.placeholderStyle,
                  {color: BaseColor.borderColor},
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  {color: BaseColor.blackColor},
                ]}
                renderItem={(item, selected) => (
                  <DropdownSelected item={item?.label} selected={selected} />
                )}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 ? 'Select Project' : '...'}
                search
                searchPlaceholder={'Search'}
                value={Project}
                onFocus={() => setIsFocus1(true)}
                onBlur={() => setIsFocus1(false)}
                onChange={item => {
                  setProject(item.value);
                  setIsFocus1(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Department'}
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus2 && {}]}
                placeholderStyle={[
                  styles.placeholderStyle,
                  {color: BaseColor.borderColor},
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  {color: BaseColor.blackColor},
                ]}
                renderItem={(item, selected) => (
                  <DropdownSelected item={item?.label} selected={selected} />
                )}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus2 ? 'Select Department' : '...'}
                search
                searchPlaceholder={'Search'}
                value={Department}
                onFocus={() => setIsFocus2(true)}
                onBlur={() => setIsFocus2(false)}
                onChange={item => {
                  setDepartment(item.value);
                  setIsFocus2(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'TC No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={TCNo}
                onChangeText={text => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your TC No'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Inward No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={InwardNo}
                onChangeText={text => setInwardNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your inward no'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Letter Ref No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={LetterRef}
                onChangeText={text => setLetterRef(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your letter ref no'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Work Detail'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={WorkDetail}
                onChangeText={text => setWorkDetail(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your Work Detail'}
                keyboardType={'numeric'}
              />

              <Button
                icon
                onPress={() => {
                  // navigation.navigate('AppNavigator');
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}>
                {'Download'}
              </Button>
            </View>
          )}

          {route.params.screenType === 'Dispatch Report' && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(5)}}>
                {'From Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={FromDate}
                onChangeText={text => setFromDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your from date'}
                keyboardType={'phone-pad'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'To Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={ToDate}
                onChangeText={text => setToDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your to date'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Customer'}
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {}]}
                placeholderStyle={[
                  styles.placeholderStyle,
                  {color: BaseColor.borderColor},
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  {color: '#000000'},
                ]}
                renderItem={(item, selected) => (
                  <DropdownSelected item={item?.label} selected={selected} />
                )}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Customer' : '...'}
                search
                searchPlaceholder={'Search'}
                value={Customer}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setCustomer(item.value);
                  setIsFocus(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'TC No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={TCNo}
                onChangeText={text => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your TC No'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Dispatch No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={DispatchNo}
                onChangeText={text => setDispatchNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your dispatch no'}
                keyboardType={'numeric'}
              />

              <Button
                icon
                onPress={() => {
                  // navigation.navigate('AppNavigator');
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}>
                {'Download'}
              </Button>
            </View>
          )}

          {route.params.screenType === 'Dispatch Material' && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(5)}}>
                {'From Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={FromDate}
                onChangeText={text => setFromDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your from date'}
                keyboardType={'phone-pad'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'To Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={ToDate}
                onChangeText={text => setToDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your to date'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Customer'}
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {}]}
                placeholderStyle={[
                  styles.placeholderStyle,
                  {color: BaseColor.borderColor},
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  {color: '#000000'},
                ]}
                renderItem={(item, selected) => (
                  <DropdownSelected item={item?.label} selected={selected} />
                )}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Customer' : '...'}
                search
                searchPlaceholder={'Search'}
                value={Customer}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setCustomer(item.value);
                  setIsFocus(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'TC No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={TCNo}
                onChangeText={text => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your TC No'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Dispatch No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={DispatchNo}
                onChangeText={text => setDispatchNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your dispatch no'}
                keyboardType={'numeric'}
              />

              <Button
                icon
                onPress={() => {
                  // navigation.navigate('AppNavigator');
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}>
                {'Download'}
              </Button>
            </View>
          )}

          {route.params.screenType === 'Pending Testing' && (
            <View style={styles.container}>
              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(5)}}>
                {'From Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={FromDate}
                onChangeText={text => setFromDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your from date'}
                keyboardType={'phone-pad'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'To Date'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={ToDate}
                onChangeText={text => setToDate(text)}
                iconLeft={Images.scheduleIcon}
                placeholder={'Select your to date'}
                keyboardType={'numeric'}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Customer'}
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {}]}
                placeholderStyle={[
                  styles.placeholderStyle,
                  {color: BaseColor.borderColor},
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  {color: '#000000'},
                ]}
                renderItem={(item, selected) => (
                  <DropdownSelected item={item?.label} selected={selected} />
                )}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Customer' : '...'}
                search
                searchPlaceholder={'Search'}
                value={Customer}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setCustomer(item.value);
                  setIsFocus(false);
                }}
              />

              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'Inward No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={InwardNo}
                onChangeText={text => setInwardNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your inward no'}
                keyboardType={'numeric'}
              />
              <Text
                subhead
                bold
                darkColor
                style={{marginTop: moderateScale(18)}}>
                {'TC No'}
              </Text>
              <TextInput
                style={{marginTop: moderateScale(12)}}
                value={TCNo}
                onChangeText={text => setTCNo(text)}
                iconLeft={Images.ic_user1}
                placeholder={'Enter your TC No'}
                keyboardType={'numeric'}
              />

              <Button
                icon
                onPress={() => {
                  // navigation.navigate('AppNavigator');
                }}
                styleText={{
                  color: BaseColor.whiteColor,
                }}
                style={{
                  marginVertical: moderateScale(30),
                  width: moderateScale(220),
                  flex: 1,
                }}>
                {'Download'}
              </Button>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default MISDetails;
