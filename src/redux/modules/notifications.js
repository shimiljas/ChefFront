/* *
 * @file: notifications.js
 * @description: Notifications History.
 * @date: 11.08.2017
 * @author: Manish Budhiraja
 * */
'use strict';

import {
  Platform,
} from 'react-native';
import _ from "lodash";
import { startLoading, stopLoading } from './app';
import { goBack, reset } from './nav';
import { LOG_OUT, LOG_OUT_SUCCESS } from './user';
import RestClient from '../../utilities/RestClient';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { cancelAllLocalNotifications } from '../../utilities/PushNotification';

// Actions
export const NOTIFICATIONS        = "NOTIFICATIONS";
export const CLEAR_NOTIFICATIONS  = "CLEAR_NOTIFICATIONS";
export const READ_NOTIFICATION    = "READ_NOTIFICATION";
export const UNREAD_NOTIFICATION_COUNT    = "UNREAD_NOTIFICATION_COUNT";

// Action Creators
export const setNotifications     = (data) => ({ type: NOTIFICATIONS, data});
export const updateNotifications  = (data) => ({ type: READ_NOTIFICATION, data});
export const clearNotification    = (data) => ({ type: CLEAR_NOTIFICATIONS, data});
export const unreadCount          = (data) => ({ type: UNREAD_NOTIFICATION_COUNT , data});

/**
* Fetch list of notifications and count of unread messages.
*/

export const getNotificationsList = (data, callBack)=>{
  let requestObject = {};
  if(data.skip >= 0){
    requestObject = {
      skip : data.skip,
      limit : data.limit
    };
  }else{
    requestObject = {
      unReadCount : true
    }
  }

  return dispatch => {
    RestClient.post("user/pushNotification", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        if(_.isFunction(callBack)){
          callBack(result.result.count);
        }
        if(data.skip>=0){
          if(data.skip===0){
            dispatch(clearNotification(result.result.notifications));
          }else{
            dispatch(setNotifications(result.result.notifications));
          }
        }else{
          dispatch(unreadCount(result.result.unReadNotification))
        }
      }else if(result.statusCode==401){
        cancelAllLocalNotifications();
        if(data.skip >= 0){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          dispatch(LOG_OUT_SUCCESS());
          if(_.isFunction(callBack)){
            callBack(null);
          }
        }
      }else if(result.statusCode==402){
        cancelAllLocalNotifications();
        if(data.skip>=0){
          if(_.isFunction(callBack)){
            callBack(null);
          }
          dispatch(ToastActionsCreators.displayInfo(result.message));
        }
      }else{
        if(data.skip>=0){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          if(_.isFunction(callBack)){
            callBack(null);
          }
        }
      }
    }).catch(error => {
      console.log("error=> ", error);
      if(_.isFunction(callBack)){
        callBack(null);
      }
    });
  }
}; 

/**
* Mark notifications as read.
*/

export const readNotification = (request) =>{
  let requestObject = {
    id : request.data._id
  };
  return dispatch => {
    RestClient.post("user/pushNotificationStatus", requestObject, request.token, request.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(updateNotifications(request.data));
      }
    }).catch(error => {
      console.log("error=> ", error);
    });
  }
}

// Initial State 
const initialState = {
  list:[],
  unreadCount : 0
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case NOTIFICATIONS:
          let list =_.uniqBy([...state.list, ...action.data],"_id");
        return { ...state,list : list };
        
        case CLEAR_NOTIFICATIONS:
        return { ...state,list : action.data };

        case READ_NOTIFICATION:
          let unreadCount = state.unreadCount;
          let notificationsList =_.uniqBy([...state.list],"_id");
          let index = _.findIndex(notificationsList, { _id : action.data._id });
          if(index>-1){
            notificationsList[index].status = 0;
            unreadCount --;
          }
        return { ...state,list : notificationsList, unreadCount : unreadCount };
        
        case UNREAD_NOTIFICATION_COUNT : 
        return { ...state, unreadCount : action.data};; 

        case LOG_OUT:
        return initialState;

        default:
        return state;
    }
}