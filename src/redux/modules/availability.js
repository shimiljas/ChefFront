/* *
 * @file: availability.js
 * @description: Manages calander. 
 * @date: 28.08.2017
 * @author: Manish Budhiraja
 * */
'use strict';
import _ from 'lodash';
import moment from "moment";
import RestClient from '../../utilities/RestClient';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { startLoading, stopLoading, showToast, hideToast } from './app';
import { LOG_OUT, LOG_OUT_SUCCESS } from './user';
import { goToAvail } from './nav';
import { cancelAllLocalNotifications } from '../../utilities/PushNotification';


/**
* Actions
*/
export const GET_AVAILABLE_SLOTS = "GET_BOOKED_DATES";
export const SET_AVAILABLE_SLOTS = "SET_BOOKED_DATES";
export const ADD_NEW_BOOKING     = "ADD_NEW_BOOKING";
export const CLEAR_AVAILABLE_SLOTS = "CLEAR_AVAILABLE_SLOTS";

/**
* Action Creators
*/
export const setAvailablilyList = (data) => ({  type: GET_AVAILABLE_SLOTS, data});
export const setBookings        = (data) => ({  type: SET_AVAILABLE_SLOTS, data});
export const addBooking         = (data) => ({  type: ADD_NEW_BOOKING, data});
export const clear              = (data) => ({  type: CLEAR_AVAILABLE_SLOTS, data});

/** 
* Fetch list of booking dates.
*/
export const getAvailablilyList = (data) => {
  return dispatch => {
    if(!data.isLoading){
      dispatch(startLoading());
    }
    RestClient.post("chef/getAvailability", {}, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(clear());
        dispatch(setAvailablilyList(result.result));
        if(!data.isLoading){
          dispatch(goToAvail())
        }
      }else if(result.statusCode==401){
        cancelAllLocalNotifications();
        if(!data.isLoading){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          dispatch(LOG_OUT_SUCCESS());
        }
      }else if(result.statusCode==402){
        cancelAllLocalNotifications();
        if(!data.isLoading){
          dispatch(ToastActionsCreators.displayInfo(result.message));
        }
      }else{
        if(!data.isLoading){
           dispatch(ToastActionsCreators.displayInfo(result.message));
        }
      }
      if(!data.isLoading){
        dispatch(stopLoading());
      }
    }).catch(error => {
      dispatch(stopLoading());
      console.log("error=> ", error);
    });
  }
};

/**
* Set availablity
*/
export const setAvailablity = (data,callBack) => {
  let requestObject = {
    availabilityStatus: data.availabilityStatus,
    starts_on: data.starts_on,
    ends_on : data.ends_on
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("chef/setAvailability", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200) {
        dispatch(setBookings(data));
        callBack(true);
      }else if(result.statusCode==401) {
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
        cancelAllLocalNotifications();
      }else if(result.statusCode==402){
        dispatch(ToastActionsCreators.displayInfo(result.message));
        cancelAllLocalNotifications();
      }else{
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
      dispatch(stopLoading());
    }).catch(error => {
      dispatch(stopLoading());
      console.log("error=> ", error)
    });
  }
};

/**
* Reducer
*/
const initialState = {
  leaves : [], // My leaves
  upcoming : [], // Appointments List
  past:[], // Previous Appointments List
};
 
export default function reducer(state = initialState, action) {
  switch (action.type) {
      case GET_AVAILABLE_SLOTS:
        let data = _.uniqBy(action.data.upcomingBookings,"id");
        let past = _.uniqBy(action.data.pastBookings,"id");
      return { ...state, leaves: action.data.leaves, upcoming: data, past:past  };
      
      case SET_AVAILABLE_SLOTS:
        let leaves = [...state.leaves];
        if(action.data.availabilityStatus === 0){
          console.log("availabilityStatus => ", moment(action.data.local).format("x"))
          leaves.push({
            starts_on: new Date(action.data.local).getTime(),
            ends_on:action.data.ends_on
          });
        }else{
          _.remove(leaves, function(o) {
            let date1 = moment(o.starts_on).format("X");
            let date2 = moment(action.data.local).format("X");
            return date1 == date2;
          });
        }
      return { ...state, leaves : leaves };

      case ADD_NEW_BOOKING:
        let newData = _.uniqBy([...state.upcoming,...action.data],"id");
      return { ...state, upcoming : newData };

      case CLEAR_AVAILABLE_SLOTS:
      return { ...state, leaves:[], upcoming:[], past:[] };

      case LOG_OUT:
      return initialState;

      default:
      return state;
    }
}
