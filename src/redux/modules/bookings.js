/* *
 * @file: bookings.js
 * @description: Booking Reducer.
 * @date: 26.07.2017
 * @author: Manish Budhiraja
 * */

/***
Booking History Status
1 - Request sent to chef by customer
2 - Request accepted by chef(pending for payment)
3 - Chef hired,payment done,booking confirmed
4 - Request for cancellation chef(pending for customer)
5 - Decline request
6 - Job done
7 - Dispute raised
8 - Refunded
9 - Cancelled(cancellation request accepted by customer , cancellation after time over , cancelled by consumer)
10 - 
11 - Job Completed.
***/

'use strict';

import {
  Platform,
} from 'react-native';
import _ from "lodash";
import { startLoading, stopLoading, initializeSocket } from './app';
import { goBack, reset } from './nav';
import { LOG_OUT, LOG_OUT_SUCCESS } from './user';
import {  selectLocation } from './location';
import RestClient from '../../utilities/RestClient';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { cancelAllLocalNotifications } from '../../utilities/PushNotification';

// Actions
const GET_CHEF_LIST   = "GET_CHEF_LIST";
const CLEAR_CHEF_LIST = "CLEAR_LIST"; 

// Action Creators

export const getChefList = (data) => ({type: GET_CHEF_LIST,data});
export const clearChefList = ()=>({type: CLEAR_CHEF_LIST})

/**
* Fetch list of chefs
*/
export const chefList = (requestObject,callback) => {
  return dispatch => {
    RestClient.post("consumer/home", requestObject).then((result) => {
      if(result.statusCode==200){
        if(requestObject.skip==0){
          dispatch(clearChefList());
        }
        if(_.isFunction(callback)){
          callback(result.result.total);
        }
        setTimeout(()=>dispatch(getChefList(result.result)),0);
      }else{
        dispatch(ToastActionsCreators.displayInfo(result.message));
        if(_.isFunction(callback)){
          callback(false);
        }
      }
    }).catch(error => {
      console.log("error=> ", error)
      if(_.isFunction(callback)){
        callback(false);
      }
    });
  }
};


/**
* Send Booking Request to Chef. 
*/

export const consumerBookingRequestForChef = (data) => {
  let requestObject = {
    starts_on: data.starts_on,
    ends_on:  data.ends_on,
    position: data.position,
    foodPreference: data.foodPreference,
    requestDescription: data.requestDescription,
    provider_id: data.provider_id,
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("consumer/bookingReq", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(selectLocation(null));
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(goBack());
        if(!data.isExplore){
          dispatch(goBack());
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};

/**
* Accept / Reject Consumer Request. // 2 for accept , 5 for reject
*/
export const acceptConsumerRequest = (data,callback)=>{
  let requestObject = {
    bookingNumber : data.bookingNumber,
    bookingStatus : data.bookingStatus,
    additionalCost : parseFloat(data.addition_cost),
    additionalDescription : data.additionalDescription
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("chef/acceptDeclineReq", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        if(!data.isRequestPage){
          dispatch(goBack());
        }
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};

/**
* Decline booking request.
*/
export const declineRequest = (data,callback)=>{
  let requestObject = {
    bookingNumber : data.bookingNumber,
    bookingStatus : data.bookingStatus,
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/declineReq", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        if(!data.isRequestPage){
          dispatch(goBack());
        }
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};

/**
* Hire Chef.
*/

export const hireChef = (data,callback)=>{
  let requestObject = {
    bookingNumber:data.bookingNumber
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("consumer/hireChef", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};


/**
* Request consumer to cancel booking. (By Chef)
*/

export const cancelBooking = (data,callback)=>{
  let requestObject = {
    bookingNumber: data.bookingNumber,
    bookingStatus: 4
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("chef/cancelBooking", requestObject, data.token, data.userId).then((result) => {
      console.log("chefresult",result)
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(goBack());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};

/**
* Cancel booking by consumer
*/

export const requestCancelBooking = (data,callback)=>{
  let requestObject = {
    bookingNumber: data.bookingNumber
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("consumer/cancelBooking", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};


/**
* Accept Booking Cancellation Request. (By Consumer)
*/

export const acceptCancallationRequest = (data,callback)=>{
  let requestObject = {
    bookingNumber: data.bookingNumber,
    bookingStatus: 9,
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("consumer/acceptAfterCancellation", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};


/**
* Release payment on booking completion. (By Consumer)
*/

export const releasePayment = (data,callback)=>{
  let requestObject = {
    booking_number: data.bookingNumber,
    rating : {
      review: data.description,
      rating: data.rating,
    },
    status: 6
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("consumer/jobComplete", requestObject, data.token, data.userId).then((result) => {
      console.log("result",result)
      if(result.statusCode==200){
        dispatch(stopLoading());
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};


/**
* Raise Disupte on booking.
*/

export const raiseDispute = (data,callback)=>{
  let requestObject = {
    bookingNumber: data.bookingNumber,
    fullName : data.userName, 
    mobile : data.userPhone,
    email : data.userEmail,
    description : data.enterMessage,
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/dispute", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        if(_.isFunction(callback)){
          callback(true);
        }
        dispatch(goBack());
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};

/**
* Close a Disupte on booking by chef.
*/

export const closeDispute = (data,callback)=>{
  let requestObject = {
    bookingNumber: data.bookingNumber,
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("chef/closeDispute", requestObject, data.token, data.userId).then((result) => {
      console.log("result",result)
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(goBack());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};
/**
* Review consumer , caterer, chef.
*/

export const review = (data,callback) => {
  let requestObject = {
    booking_number: data.bookingNumber,
    rating : {
      review: data.description,
      rating: data.rating,
    }
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/rating", requestObject, data.token, data.userId).then((result) => {

      if(result.statusCode==200){
        if(_.isFunction(callback)){
          callback(true);
        }
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
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};

// Reducer

const initialState = {
  chefList : []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_CHEF_LIST:
          let chefData = _.uniqBy([...state.chefList,...action.data.chefList],"_id")
        return { ...state, chefList:chefData};

        case CLEAR_CHEF_LIST:
        return { ...state, chefList:[]};

        case LOG_OUT:
        return initialState;

        default:
        return state;
    }
}
