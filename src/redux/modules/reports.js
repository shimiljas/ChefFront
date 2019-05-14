/* *
 * @file: reports.js
 * @description: Revenue reports of chef according to week , month, year and lifetime. 
 * @date: 04.09.2017
 * @author: Manish Budhiraja
 * */

'use strict';
import _ from 'lodash';
import RestClient from '../../utilities/RestClient';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { startLoading, stopLoading, } from './app';
import { LOG_OUT, LOG_OUT_SUCCESS } from './user';
import { cancelAllLocalNotifications } from '../../utilities/PushNotification';

/**
* Actions
*/
export const SET_REPORTS = "SET_REPORTS";
export const GET_AVAILABLE_SLOTS = "GET_AVAILABLE_SLOTS";
/**
* Action Creators
*/
export const setReports = (data) => ({  type: SET_REPORTS, data});

/**
* Fetch list of booking dates.
*/
export const getReports = (data) => {
  return dispatch => {
    dispatch(startLoading());
    let requestObject = {
       duration   : data.duration,
     }
    RestClient.post("chef/reports", requestObject, data.token, data.userId).then((result) => {
      console.log(result)
      if(result.statusCode==200){
        dispatch(setReports(result.result));
      }else if(result.statusCode == 401){
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
        cancelAllLocalNotifications();
      }else{
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
      dispatch(stopLoading());
    }).catch(error => {
      dispatch(stopLoading());
      console.log("error=> ", error);
    });
  }
};

/**
* Reducer
*/
const initialState = {
 reports : [],
};
 
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOG_OUT:
      return initialState;
    case SET_REPORTS:
      return { reports : action.data };
    default:
        return state;
  }
}
