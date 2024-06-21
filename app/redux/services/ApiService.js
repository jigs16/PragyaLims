import AsyncStorage from '@react-native-async-storage/async-storage'
import { reject } from 'lodash'
import { Alert } from 'react-native'
import api from '../../network/api'

export const loginApiCall = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("Authentication/Login", data)
        .then((response) => {
          //console.log("Response" + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetTodaysSummaryDataApiCall = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("Dashboard/GetTodaysSummaryData", data)
        .then((response) => {
          console.log("Response" + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            console.log('response body IsSuccess ---- TRUE');
            resolve(response.body);
          } else {
            console.log('response body IsSuccess ---- FALSE');
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    console.log('error ===>>>> ', error);
    reject(error);
  }
};

export const GetTopCustomersDataApiCall = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("Dashboard/GetTopCustomersData", data)
        .then((response) => {
          console.log("Response" + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            console.log('response body IsSuccess ---- TRUE');
            resolve(response.body);
          } else {
            console.log('response body IsSuccess ---- FALSE');
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    console.log('error ===>>>> ', error);
    reject(error);
  }
};


export const GetTopDepartmentDataApiCall = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("Dashboard/GetTopDepartmentsData", data)
        .then((response) => {
          console.log("Response" + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            console.log('response body IsSuccess ---- TRUE');
            resolve(response.body);
          } else {
            console.log('response body IsSuccess ---- FALSE');
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    console.log('error ===>>>> ', error);
    reject(error);
  }
};
//GetTopDepartmentDataApiCall

export const GetTopTestDataApiCall = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("Dashboard/GetTopTestsData", data)
        .then((response) => {
          console.log("Response" + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            console.log('response body IsSuccess ---- TRUE');
            resolve(response.body);
          } else {
            console.log('response body IsSuccess ---- FALSE');
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    console.log('error ===>>>> ', error);
    reject(error);
  }
};

export const GetTopMachinesDataApiCall = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("Dashboard/GetTopMachinesData", data)
        .then((response) => {
          console.log("Response" + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            console.log('response body IsSuccess ---- TRUE');
            resolve(response.body);
          } else {
            console.log('response body IsSuccess ---- FALSE');
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    console.log('error ===>>>> ', error);
    reject(error);
  }
};

export const GetActivityLogDataApiCall = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("Dashboard/GetActivityLogData", data)
        .then((response) => {
          console.log("Response" + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            console.log('response body IsSuccess ---- TRUE');
            resolve(response.body);
          } else {
            console.log('response body IsSuccess ---- FALSE');
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    console.log('error ===>>>> ', error);
    reject(error);
  }
};

export const UserLogoutApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Authentication/LogoutUser', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const RefreshTokenApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Authentication/RefreshToken', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetControlCenterDataApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('ControlCenter/GetControlCenterList', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetCustomerDDLListAJAXApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Customer/GetCustomerDDLListAJAX', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetCustomerProjectDDLListApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Customer/GetCustomerProjectDDLList', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetProcessFormListDDLApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('ControlCenter/GetProcessFormListDDL', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetProcessFormStatusListDDLApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('ControlCenter/GetProcessFormStatusListDDL', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetDepartmentDropDownListApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Department/GetDepartmentDropDownList', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const ProductGroupDropDownListByDepartmentIDApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('ProductGroups/ProductGroupDropDownListByDepartmentID', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetMaterialTypeDDLListByDepartment_ProductGroupApiApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Parameter/GetMaterialTypeDDLListByDepartment_ProductGroup', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const DDLGetTestMasterByCompanyIDApiApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('RefStandardTestMap/DDLGetTestMasterByCompanyID', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetDDLTestMethodsByCompanyIDApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Parameter/GetDDLTestMethodsByCompanyID', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const InwardRegisterReportExportApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Reports/InwardRegisterReportExport', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetProcessStatusReportExportApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Reports/GetProcessStatusReportExport', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetReportDispatchReportExportApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Reports/GetReportDispatchReportExport', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetReportDispatchMaterialExportApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Reports/GetReportDispatchMaterialExport', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetReportPendingTestingExportApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Reports/GetReportPendingTestingExport', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetInwardApprovalDetailByIDApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('InwardApproval/GetInwardApprovalDetailByID', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};


export const InwardApprovalUpdateStatusApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('InwardApproval/InwardApprovalUpdateStatus', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetTestingsApprovalDetailByIDApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Testing/GetTestingsApprovalDetailByID', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const TestingsApprovalInsertApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Testing/TestingsApprovalInsert', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetReportingsListApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Reportings/GetReportingsList', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetReportDispatchListApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('ReportDispatch/GetReportDispatchList', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetReportDispatchPrintByIDApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('ReportDispatch/GetReportDispatchPrintByID', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetReportDispatchPrintLabelApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('ReportDispatch/GetReportDispatchPrintLabel', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetCourierDDLListApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('Courier/GetCourierDDLList', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetMaterialDispatchListApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('MaterialDispatch/GetMaterialDispatchList', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const GetMaterialDispatchPrintByIDApiCall = data => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post('MaterialDispatch/GetMaterialDispatchPrintByID', data)
        .then(response => {
          console.log('Response' + JSON.stringify(response.body));
          if (response.body.IsSuccess) {
            resolve(response.body);
          } else {
            resolve(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};
// Courier/GetCourierDDLList

