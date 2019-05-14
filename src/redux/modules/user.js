/*
 * @file: user.js
 * @description: User Reducer handles authentication, forgot password, change password apis.
 * @date: 10.07.2017
 * @author: Manish Budhiraja
 * */
 'use strict';
import {
  Platform,
} from 'react-native';
import _ from "lodash";
import { startLoading, stopLoading, showToast, hideToast } from './app';
import { goBack, reset } from './nav';
import { selectLocation } from './location';
import { BANK_DETAILS_ADDED, CARD_ADDED } from './payments';
import RestClient from '../../utilities/RestClient';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { destroySocketClient } from '../../utilities/SocketClient';
import { cancelAllLocalNotifications } from '../../utilities/PushNotification';


// Actions
export const NEW_CONSUMER_USER      = "NEW_CONSUMER_USER";
export const NEW_CHEF_USER          = "NEW_CHEF_USER";
export const NEW_CATERER_USER       = "NEW_CATERER_USER";
export const LOG_IN                 = "LOGIN";
export const LOG_IN_SUCCESS         = "LOG_IN_SUCCESS";
export const LOG_IN_CHEF            = "LOG_IN_CHEF";
export const LOG_IN_CATERER         = "LOG_IN_CATERER";
export const LOG_OUT                = "LOGOUT";
export const GO_TO_OTP              = 'GO_TO_OTP';
export const GO_TO_RESETPSWD        = 'GO_TO_RESETPSWD';
export const CONSUMER_EDIT_PROFILE  = 'CONSUMER_EDIT_PROFILE';
export const CHEF_EDIT_PROFILE      = 'CHEF_EDIT_PROFILE';
export const DEVICE_TOKEN           = "DEVICE_TOKEN";
export const RATINGS                = "RATINGS";
export const GET_DETAILS            = "GET_DETAILS";
export const UPDATE_SETTINGS        = "UPDATE_SETTINGS";

// Action Creators
export const CONSUMER_CHECK = (data) => ({ type: NEW_CONSUMER_USER,data});
export const CHEF_CHECK = (data) => ({ type: NEW_CHEF_USER,data});
export const CATERER_CHECK = (data) => ({ type: NEW_CATERER_USER,data});
export const LOG_SUCCESS = (data) => ({ type: LOG_IN_SUCCESS,data});
export const LOG_SUCCESS_CHEF = (data) => ({ type: LOG_IN_CHEF,data});
export const LOG_SUCCESS_CATERER = (data) => ({ type: LOG_IN_CATERER,data});
export const LOG_OUT_SUCCESS = () => ({ type: LOG_OUT});
export const OTP_REQUEST = (data) => ({ type: GO_TO_OTP,data});
export const RESET_PASSWORD = (data) => ({ type: GO_TO_RESETPSWD,data});
export const CONSUMER_EDIT_SUCCESS = (data) => ({type:CONSUMER_EDIT_PROFILE,data});
export const CHEF_EDIT_SUCCESS = (data) => ({type:CHEF_EDIT_PROFILE,data});
export const setDeviceToken = (data) => ({type:DEVICE_TOKEN,data});
export const setRatings = (data) => ({type:RATINGS, data});
export const getDetails = (data) => ({type:GET_DETAILS , data});
export const updateChefSetting = (data) => ({type:UPDATE_SETTINGS, data});

/**
* API to Upload Images .
*/

export const uploadImages = (data,callBack) => {
  let requestObject = new FormData();
  _.each(data,function(img,i){
    if(img.isVideo){
      let video = {
        uri: img.videoPath,
        type: "video/mp4",
        name: 'user video.mp4',
      };
      let thumbnail = {
        uri: img.path,
        type: "image/jpeg",
        name: "thumbnail.png",
      };
      requestObject.append("video", video);
      requestObject.append("thumbnail", thumbnail);
    }else{
      let photo = {
        uri: img.path,
        type: "image/jpeg",
        name: 'user photo.png',
      };
      requestObject.append("image"+i, photo);
    }
  });

  return dispatch => {
    dispatch(startLoading());
    RestClient.imageUpload("files/upload",requestObject).then((result) => {
     if(result.statusCode==200){
        dispatch(stopLoading());
        callBack(result.result);
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> ", error)
      dispatch(stopLoading());
    });
  }
};

/**
* Check User Exists API
*/
export const checkExisitngUser = (data) => {
  let requestObject = {
    email: data.email.toLowerCase(),
    phoneNum: data.mobile,
  }

  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/checkuser",requestObject).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        switch(data.userType.toLowerCase()) {
          case 'customer':
            dispatch(CONSUMER_CHECK(data));
          break;
          case 'chef':
            dispatch(CHEF_CHECK(data));
          break;
          case 'caterer':
            dispatch(CATERER_CHECK(data));
          break;
        }
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Consumer Signup API.
*/
export const consumerSignup = (data) => {
  let requestObject = {
    email     : data.email,
    password  : data.password,
    phoneNum  : data.mobile,
    profilePic: data.imageUrl,
    fullName  : data.fullName,
    position  : {
      lat     : data.position.lat,
      long    : data.position.lng,
      address : data.address,
    },
    favouriteFoods : data.favouriteFoods,
  }

  return dispatch => {
    dispatch(startLoading());
    RestClient.post("consumer/signUp",requestObject).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(OTP_REQUEST({...data, source: "signup"}));
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Chef Signup API.
*/
export const chefSignup = (data) => {

  let requestObject = {
    email: data.email,
    phoneNum: data.phoneNum,
    password: data.password,
    profilePic: data.profilePic,
    fullName: data.fullName,
    position: data.position,
    ratePerHour: parseFloat(data.ratePerHour),
    expInYears: parseFloat(data.expInYears),
    milesToTravel: parseFloat(data.milesToTravel),
    mealsSupported: data.mealsSupported,
    typesOfSpecializedCooking: data.typesOfSpecializedCooking,
    minGuestCount: parseInt(data.minGuestCount),
    maxGuestCount: parseInt(data.maxGuestCount),
    //criminalCase: data.criminalCase,
    describeYourself: data.describeYourself,
    workHistory: data.workHistory,
  }

  return dispatch => {
    dispatch(startLoading());
    RestClient.post("chef/signUp", requestObject).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(OTP_REQUEST({...data, source: "signup"}));
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};


/**
* Caterer Signup API.
*/
export const catererSignup = (data) => {
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/login",requestObject).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Resend OTP
*/
export const resendOTP =(data)=> {
  let requestObject = {
    phoneNum:data
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/resendOtp",requestObject).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
}

/**
* Verify OTP
*/
export const verifyOTP =(data)=> {
  let requestObject = {
    phoneNum   : data.mobile?data.mobile:data.phoneNum,
    otp        : data.otp,
    deviceInfo : {
      deviceType : Platform.OS==="ios"?"ios":"android",
      deviceToken : data.deviceToken,
    }
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/verify", requestObject).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        if(result.result.role===0){
          dispatch(LOG_SUCCESS(result.result));
        }else if(result.result.role===1){
          dispatch(LOG_SUCCESS_CHEF(result.result));
        }else{

        }
        dispatch(selectLocation(null));
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> ", error)
      dispatch(stopLoading());
    });
  }
}

/**
* Login API
*/
export const loginRestAPI = (data) => {

	let requestObject = {
    username: data.emailOrMobile,
    password: data.password,
    deviceInfo  :{
      deviceType : Platform.OS==="ios"?"ios":"android",
      deviceToken :  data.deviceToken,
    },
    role:''+data.role
  }

  return dispatch => {
  	dispatch(startLoading());
  	RestClient.post("user/login",requestObject).then((result) => {
      if(result.statusCode==200){
      	dispatch(stopLoading());
        if(data.role==0){
          dispatch(LOG_SUCCESS(result.result));
        }else if(data.role===1){
          dispatch(LOG_SUCCESS_CHEF(result.result));
        }else{

        }
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
  	}).catch(error => {
      console.log("error=> " ,error)
  		dispatch(stopLoading());
  	});
  }
};


/**
* Forgot Password API
*/
export const forgotRestAPI = (data) => {
  let requestObject = {
    phoneNum : data.mobile
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/forgotpwd",requestObject).then((result) => {
     if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(OTP_REQUEST({...data,source:"forgot"}));
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Verify Forgot Password OTP
*/
export const verifyForgotOTP =(data)=> {
  let requestObject = {
    phoneNum:data.mobile,
    otp:data.otp
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/verifyOtp",requestObject).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(RESET_PASSWORD(result));
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
}


/**
* Reset Forgot Password OTP
*/
export const resetPassword =(data)=> {
  let requestObject = {
    phoneNum:data.result.phoneNum,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword,
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/resetpwd",requestObject).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(reset());
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
}

/**
* Change Password Rest Service.
*/
export const changePassword =(data)=> {

  let requestObject = {
    oldPassword: data.oldPassword,
    confirmPassword: data.confirmPassword,
    newPassword: data.newPassword,
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/changepwd",requestObject,data.token,data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(goBack());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
        cancelAllLocalNotifications();
      }else if(result.statusCode==402){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
}

/**
* Logout API.
*/
export const logout =(data)=> {
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/logout",{},data.token,data.userId).then((result) => {
      if(result.statusCode===200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        destroySocketClient();
        cancelAllLocalNotifications();
        dispatch(LOG_OUT_SUCCESS());
      }else if(result.statusCode==401){
        cancelAllLocalNotifications();
        dispatch(stopLoading());
        dispatch(LOG_OUT_SUCCESS());
      }else if(result.statusCode==402){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
}

/**
* Consumer Edit Profile API.
*/
export const consumerEditProfile = (data) => {
  let requestObject = {
    position: data.position,
    favouriteFoods: data.favouriteFoods,
    profilePic : data.profilePic
  }

  return dispatch => {
    dispatch(startLoading());
    RestClient.put("consumer/updateConsumer", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(CONSUMER_EDIT_SUCCESS({
          position: data.position,
          favouriteFoods: data.favouriteFoods,
          profilePic : data.profilePic
        }));
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(goBack());
        dispatch(selectLocation(null));
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        cancelAllLocalNotifications();
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
      }else if(result.statusCode==402){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Chef Edit Profile API.
*/
export const chefEditProfile = (data) => {
  let requestObject = {
    position: data.position,
    ratePerHour: parseFloat(data.ratePerHour),
    expInYears: parseFloat(data.expInYears),
    milesToTravel: parseFloat(data.milesToTravel),
    mealsSupported: data.mealsSupported,
    typesOfSpecializedCooking: data.typesOfSpecializedCooking,
    minGuestCount: parseInt(data.minGuestCount),
    maxGuestCount: parseInt(data.maxGuestCount),
    describeYourself: data.describeYourself,
    workHistory: data.workHistory
  };

  return dispatch => {
    dispatch(startLoading());
    RestClient.put("chef/updateChef", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(CHEF_EDIT_SUCCESS({
          position: data.position,
          ratePerHour: data.ratePerHour,
          expInYears: data.expInYears,
          milesToTravel: data.milesToTravel,
          mealsSupported: data.mealsSupported,
          typesOfSpecializedCooking: data.typesOfSpecializedCooking,
          minGuestCount: data.minGuestCount,
          maxGuestCount: data.maxGuestCount,
          describeYourself: data.describeYourself,
          workHistory: data.workHistory
        }))
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(goBack());
      }else if(result.statusCode==401){
        cancelAllLocalNotifications();
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
      }else if(result.statusCode==402){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> ", error)
      dispatch(stopLoading());
    });
  }
};

/**
* Caterer Edit Profile API.
*/
export const catererEditProfile = (data) => {
  let requestObject = {
    
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.put("", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(goBack());
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        cancelAllLocalNotifications();
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
      }else if(result.statusCode==402){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Update Settings
*/
export const updateSettings = (data) => {
  let requestObject = {
    reminder :{
      status : data.status , 
      hours : data.hours 
    },
    getNotification : data.getNotification
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("chef/updateSettings", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(updateChefSetting(data));
        dispatch(goBack());
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
        cancelAllLocalNotifications();
      }else if(result.statusCode==402){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Get user details.
*/
export const getUserDetails = (data) => {
  return dispatch => {
    dispatch(startLoading());
    RestClient.get("user/getUserData", {}, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(getDetails(result.result));
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
        cancelAllLocalNotifications();
      }else if(result.statusCode==402){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
}

/**
* Get review list.
*/
export const getReviewsList = (data,callBack) => {
  return dispatch=>{
    RestClient.post("user/reviews", {}, data.token, data.userId).then((result) => {
      callBack(false);
      if(result.statusCode==200){
        dispatch(setRatings(result.result.list));
      }else if(result.statusCode==401){
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
        cancelAllLocalNotifications();
      }else if(result.statusCode==402){
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      callBack(false);
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
}

/**
* Contact Support
*/
export const contactSupport = (data) => {
  let requestObject = {
    fullName    : data.name,
    email       : data.email,
    phoneNum    : data.contact,
    message     : data.description,
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/contact", requestObject, "", "").then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(goBack());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }else{
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Initial state
*/
const initialState = {
  userDetails : null,
  deviceToken : "test",
  reviews     : []
};

/**
* Reducer
*/
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOG_IN_SUCCESS:
          return { ...state, userDetails: action.data };
        case LOG_IN_CHEF:
          return { ...state, userDetails: action.data };
        case LOG_IN_CATERER:
          return { ...state, userDetails: action.data };
        case CONSUMER_EDIT_PROFILE:
          return {...state, userDetails:{
            ...state.userDetails, favouriteFoods:action.data.favouriteFoods,
            position: action.data.position,
            profilePic: action.data.profilePic
          }};

        case CHEF_EDIT_PROFILE:
          return {...state, userDetails:{
            ...state.userDetails,
            position:action.data.position,
            ratePerHour: action.data.ratePerHour,
            expInYears: action.data.expInYears,
            milesToTravel: action.data.milesToTravel,
            mealsSupported: action.data.mealsSupported,
            typesOfSpecializedCooking: action.data.typesOfSpecializedCooking,
            minGuestCount: action.data.minGuestCount,
            maxGuestCount: action.data.maxGuestCount,
            criminalCase: action.data.criminalCase,
            describeYourself: action.data.describeYourself,
            workHistory: action.data.workHistory
          }};

        case GET_DETAILS:
        return { ...state, userDetails : { ...state.userDetails , ...action.data } }

        case BANK_DETAILS_ADDED:
          return { ...state, userDetails:{
            ...state.userDetails,
            isStripeVerified:true
          }};

        case CARD_ADDED:
        return {...state, userDetails:{
          ...state.userDetails, 
          defaultCard:true
        }};

        case DEVICE_TOKEN:
          return { ...state, deviceToken:action.data };

        case RATINGS:
        return { ...state , reviews : action.data };

        case UPDATE_SETTINGS:
        return {...state , userDetails : {
          ...state.userDetails,
          reminder : {
            status : action.data.status , 
            hours : action.data.hours 
          },
          getNotification : action.data.getNotification
        }};
        case LOG_OUT:
          return { ...initialState, deviceToken:state.deviceToken };

        default:
          return state;
    }
}
