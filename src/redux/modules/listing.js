/* *
 * @file: listing.js
 * @description: Booking History Reducer.
 * @date: 09.08.2017
 * @author: Manish Budhiraja
 * */

/***
Booking History Status
1 - Request sent to chef by customer
2 - Request accepted by chef(pending for payment)
3 - Chef hired,payment done,booking confirmed
4 - Request for cancellation chef(pending for customer)
5 - Decline request
6 - Job done (Money Transfer to shef) (if no rate than show rate)
7 - Dispute raised (no butn)
8 - Refunded (rate)
9 - Cancelled(cancellation request accepted by customer , cancellation after time over , cancelled by consumer)
10 - Dispute Resolved (rate)
11 - Job Completed. (raise a dis, relese)
12 - Refund cancelled by chef or consumer 
***/

'use strict';
import {
  Platform,
} from 'react-native';
import _ from "lodash";
import { startLoading, stopLoading } from './app';
import { goBack, reset } from './nav';
import { LOG_OUT, LOG_OUT_SUCCESS } from './user';
import { ToastActionsCreators } from 'react-native-redux-toast';
import RestClient from '../../utilities/RestClient';
import { cancelAllLocalNotifications } from '../../utilities/PushNotification';

// Actions
const PAST_BOOKING_LIST 		  = "PAST_BOOKING_LIST";
const UPCOMING_BOOKING_LIST 	= "UPCOMING_BOOKING_LIST";
const ACTIVE_BOOKING_LIST 		= "ACTIVE_BOOKING_LIST";
const CANCELLED_BOOKING_LIST 	= "CANCELLED_BOOKING_LIST";
const CLEAR_PAST_LIST         = "CLEAR_PAST_LIST";
const CLEAR_ACTIVE_BOOKING    = "CLEAR_ACTIVE_BOOKING";
const CLEAR_CANCELLED_LIST    = "CLEAR_CANCELLED_LIST";
const CLEAR_UPCOMING_LIST     = "CLEAR_UPCOMING_LIST";
const NEW_BOOKING             = "NEW_BOOKING";
const UPDATE_BOOKING          = "UPDATE_BOOKING";
const REMOVE_BOOKING          = "REMOVE_BOOKING";
const INSERT_UPCOMING         = "INSERT_UPCOMING";
const BOOKING_COMPLETE        = "BOOKING_COMPLETE";
const RAISE_DISPUTE           = "RAISE_DISPUTE";
const DISPUTE_RESOLVED        = "DISPUTE_RESOLVED";
const BOOKING_CANCELLED       = "BOOKING_CANCELLED";
const REFUND                  = "REFUND";
const PAYMENT_RELEASED        = "PAYMENT_RELEASED";
const SERVER_TIME             = "SERVER_TIME";
const ADD_REVIEW              = "ADD_REVIEW";
const REQUEST_CANCEL          = "REQUEST_CANCEL";

// Action Creators
export const setPastList          = (data) => ({ type: PAST_BOOKING_LIST, data });
export const setUpcomingList      = (data) => ({ type: UPCOMING_BOOKING_LIST , data });
export const setActiveList        = (data) => ({ type: ACTIVE_BOOKING_LIST , data});
export const setCancelledList     = (data) => ({ type: CANCELLED_BOOKING_LIST , data });
export const insertNewBooking     = (data) => ({ type: NEW_BOOKING , data });
export const updateExitingBooking = (data) => ({ type: UPDATE_BOOKING, data });
export const removeBooking        = (data) => ({ type: REMOVE_BOOKING, data });
export const insertUpcoming       = (data) => ({ type: INSERT_UPCOMING, data});
export const resetCancelledList   = (data) => ({ type: CLEAR_CANCELLED_LIST , data});
export const resetActiveList      = (data) => ({ type: CLEAR_ACTIVE_BOOKING, data});
export const resetPastList        = (data) => ({ type: CLEAR_PAST_LIST, data});
export const resetUpcomingList    = (data) => ({ type: CLEAR_UPCOMING_LIST, data});
export const bookingComplete      = (data) => ({ type: BOOKING_COMPLETE, data});
export const disputeRaised        = (data) => ({ type: RAISE_DISPUTE, data});
export const disputeResolved      = (data) => ({ type: DISPUTE_RESOLVED, data});
export const bookingCancelled     = (data) => ({ type: BOOKING_CANCELLED, data});
export const refundBookingFee     = (data) => ({ type: REFUND, data});
export const paymentReleased      = (data) => ({ type: PAYMENT_RELEASED, data});
export const getServerTime        = (data) => ({ type: SERVER_TIME, data});
export const addReview            = (data) => ({ type: ADD_REVIEW, data});
export const requestCancel        = (data) => ({ type: REQUEST_CANCEL, data});

/**
* Get list of active booking
*/

export const getActiveBookingList = (data, callBack)=>{
  let requestObject = {
    skip:data.skip,
    limit:data.limit,
    bookingStatus : 1 // 1 (Chef Received Req.) or 2 (Chef Accepted Req.) 
  };
  return dispatch => {
    RestClient.post("user/bookings", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        if(data.skip===0){
          dispatch(resetActiveList(result.result.bookings));
        }
        if(_.isFunction(callBack)){
          callBack(result.result.count);
        }
        dispatch(setActiveList(result.result.bookings));
      }else if(result.statusCode==401){
        if(!data.isInitialLoad){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          dispatch(LOG_OUT_SUCCESS());
          cancelAllLocalNotifications();
        }
      }else if(result.statusCode==402){
        if(!data.isInitialLoad){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          cancelAllLocalNotifications();
          if(_.isFunction(callBack)){
            callBack(null);
          }
        }
      }else{
        if(_.isFunction(callBack)){
          callBack(null);
        }
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};


/**
* Get list of upcoming booking
*/

export const getUpcomingBookingList = (data,callBack)=>{
  let requestObject = {
    limit: data.limit,
    skip: data.skip,
    bookingStatus: 3 // for upcoming booking
  };
  return dispatch => {
    RestClient.post("user/bookings", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        if(data.skip===0){
          dispatch(resetUpcomingList(result.result.bookings));
        }
        if(_.isFunction(callBack)){
          callBack(result.result.count);
        }
        dispatch(setUpcomingList(result.result.bookings));
      }else if(result.statusCode==401){
        if(!data.isInitialLoad){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          dispatch(LOG_OUT_SUCCESS());
          cancelAllLocalNotifications();
        }
      }else if(result.statusCode==402){
        if(!data.isInitialLoad){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          cancelAllLocalNotifications();
          if(_.isFunction(callBack)){
            callBack(null);
          }
        }
      }else{
        if(_.isFunction(callBack)){
          callBack(null);
        }
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};


/**
* Get list of past booking
*/

export const getPastBookingList = (data, callBack)=>{
  let requestObject =  {
    bookingStatus : 6, // 6 (Job Done) or 7 (Dispute) or 10 (Refund) for past
    limit: data.limit,
    skip:data.skip,
  }
  return dispatch => {
    RestClient.post("user/bookings", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        if(data.skip==0){
          dispatch(resetPastList(result.result.bookings));
        }
        if(_.isFunction(callBack)){
          callBack(result.result.count);
        }
        dispatch(setPastList(result.result.bookings));
      }else if(result.statusCode==401){
        if(!data.isInitialLoad){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          dispatch(LOG_OUT_SUCCESS());
          cancelAllLocalNotifications();
        }
      }else if(result.statusCode==402){
        if(!data.isInitialLoad){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          cancelAllLocalNotifications();
          if(_.isFunction(callBack)){
            callBack(null);
          }
        }
      }else{
        if(_.isFunction(callBack)){
          callBack(null);
        }
        dispatch(ToastActionsCreators.displayInfo(result.message));   
      }
    }).catch(error => {
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
}; 


/**
* Get list of cancelled booking
*/

export const getCancelledBookingList = (data,callBack)=>{
  let requestObject = {
    limit: data.limit,
    skip: data.skip,
    bookingStatus : 5 // 5 (Declined) or 9 (Cancelled) 
  };
  return dispatch => {
    RestClient.post("user/bookings", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        if(data.skip===0){
          dispatch(resetCancelledList(result.result.bookings));
        }
        if(_.isFunction(callBack)){
          callBack(result.result.count);
        }
        dispatch(setCancelledList(result.result.bookings));
      }else if(result.statusCode==401){
        if(!data.isInitialLoad){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          dispatch(LOG_OUT_SUCCESS());
          cancelAllLocalNotifications();
        }
      }else if(result.statusCode==402){
        if(!data.isInitialLoad){
          dispatch(ToastActionsCreators.displayInfo(result.message));
          cancelAllLocalNotifications();
          if(_.isFunction(callBack)){
            callBack(null);
          }
        }
      }else{
        if(_.isFunction(callBack)){
          callBack(null);
        }
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }
    }).catch(error => {
      console.log("error=> ", error);
      dispatch(stopLoading());
    });
  }
};

// Initial State 
const initialState = {
  past : [],
  upcoming : [],
  active : [],
  cancelled : [],
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        /**
        * Show list of past booking including disputes
        */
        case PAST_BOOKING_LIST:
          let pastBooking = _.uniqBy([...state.past,...action.data],"_id");
        return { ...state, past:_.sortBy(pastBooking, "updated_at").reverse()};

        /**
        * Show list of upcoming booking.
        */

        case UPCOMING_BOOKING_LIST:
          let upcomingBooking = _.uniqBy([...state.upcoming,...action.data],"_id");
          upcomingBooking = _.sortBy(upcomingBooking, "updated_at").reverse();
        return { ...state, upcoming : _.sortBy(upcomingBooking, "updated_at").reverse()};

        /**
        * Show list of active bookings.
        */

        case ACTIVE_BOOKING_LIST:
          let activeBooking = _.uniqBy([...state.active,...action.data],"_id");
        return { ...state, active: _.sortBy(activeBooking, "updated_at").reverse() };

        /**
        * Show list of cancelled bookings.
        */

        case CANCELLED_BOOKING_LIST:
          let cancelledBooking = _.uniqBy([...state.cancelled,...action.data],"_id")
        return { ...state, cancelled : _.sortBy(cancelledBooking, "updated_at").reverse() };
        
        /**
        *  Add booking details to active list if user send or receive new booking request.
        */ 

        case NEW_BOOKING:
          let newList = _.uniqBy([...state.active, ...action.data],"_id");
        return { ...state, active : _.sortBy(newList, "updated_at").reverse() }

        /**
        * Add entries to active when chef accepts consumer request.
        */

        case UPDATE_BOOKING:
          let updatedList = [...state.active];
          let index = _.findIndex(updatedList, {_id: action.data._id});
          if(index>-1){
            let Obj = {...updatedList[index],...action.data};
            updatedList[index] = Obj;
          }
        return {...state , active : _.sortBy(updatedList, "updated_at").reverse()}

        /**
        * Add entries to upcoming when consumer hires chef.
        */

        case INSERT_UPCOMING:
          let currentActive = [...state.active];
          let newUpcoming = _.remove(currentActive, {_id: action.data._id});
          let upcoming = [...state.upcoming , ...[{...newUpcoming[0],...action.data}]];
        return {...state , active : _.sortBy(currentActive, "updated_at").reverse(), upcoming: _.sortBy(upcoming, "updated_at").reverse()};

        /**
        * remove entries to active if booking request is declined by chef or caterer or conumser.
        */

        case REMOVE_BOOKING:
          let list           = [...state.active];
          let removedBookingDetails = _.remove(list, {_id: action.data._id});
          let removeObject = { ...removedBookingDetails[0],...action.data };
          let cancelledList = [...state.cancelled , ...[removeObject]];
        return {...state , active :_.sortBy(list, "updated_at").reverse() , cancelled: _.sortBy(cancelledList, "updated_at").reverse()};
        
        /**
        * Clear active list records
        */
        case CLEAR_PAST_LIST:
          //let clearPast = _.sortBy(action.data, "updated_at").reverse();
        return { ...state,  past:[]};

        case CLEAR_ACTIVE_BOOKING:
          //_.sortBy(action.data, "updated_at").reverse()
        return {...state , active : []}

        case CLEAR_CANCELLED_LIST:
          //_.sortBy(action.data, "updated_at").reverse()
        return {...state , cancelled : []}

        case CLEAR_UPCOMING_LIST:
          //_.sortBy(action.data, "updated_at").reverse()
        return {...state , upcoming : []}
        
        /**
        * Booking Completed
        */
        case BOOKING_COMPLETE :
          let upcomingList = [...state.upcoming];
          let past_booking = _.remove(upcomingList, {_id: action.data._id});
          let _past = [...state.past , ...[{...past_booking[0],...action.data}]];
        return {
          ...state , 
          upcoming : _.sortBy(upcomingList, "updated_at").reverse() , 
          past: _.sortBy(_past, "updated_at").reverse() , 
        };
        
        /**
        * Booking Cancelled by Chef / Consumer
        */
        case BOOKING_CANCELLED :
          let upcomeList = [...state.upcoming];
          let cancel_booking = _.remove(upcomeList, {_id: action.data._id});
          let _cancel = [...state.cancelled , ...[{...cancel_booking[0],...action.data}]];
        return {
          ...state , 
          upcoming : _.sortBy(upcomeList, "updated_at").reverse() , 
          cancelled: _.sortBy(_cancel, "updated_at").reverse() ,
        };

        /**
        * Past Booking Cases like dispute raise / resolved , Refund amount.
        */
        
        case REFUND :
          let refundBookings = [...state.past], upcomingBook = [...state.upcoming];
          let refundIndex = _.findIndex(refundBookings, { _id: action.data._id });
          let comingIndex = _.findIndex(upcomingBook,{ _id: action.data._id })
          if(refundIndex>-1){
            refundBookings[refundIndex] = { ...refundBookings[refundIndex],...action.data };
          }
          if(comingIndex>-1){
            upcomingBook[comingIndex] = { ...upcomingBook[comingIndex],...action.data };
          }
        return { ...state, 
          past:_.sortBy(refundBookings, "updated_at").reverse() , 
          upcoming: _.sortBy(upcomingBook, "updated_at").reverse()
        };

        case RAISE_DISPUTE :
          let raiseBookings = [...state.past];
          let raiseIndex = _.findIndex(raiseBookings, { _id: action.data._id });
          if(raiseIndex>-1){
            raiseBookings[raiseIndex] = { ...raiseBookings[raiseIndex],...action.data };
          }
        return { ...state, past :  _.sortBy(raiseBookings, "updated_at").reverse() };

        case DISPUTE_RESOLVED :
          let resolvedBookings = [...state.past];
          let resolveIndex = _.findIndex(resolvedBookings, { _id: action.data._id });
          if(resolveIndex>-1){
            resolvedBookings[resolveIndex] = { ...resolvedBookings[resolveIndex],...action.data };
          }
        return { ...state, past : _.sortBy(resolvedBookings, "updated_at").reverse()};

        case PAYMENT_RELEASED :
          let paymentsBookings = [...state.past];
          let bookingIndex = _.findIndex(paymentsBookings, { _id: action.data._id });
          if(resolveIndex>-1){
            paymentsBookings[bookingIndex] = { ...paymentsBookings[bookingIndex] , ...action.data };
          }
        return { ...state, past : _.sortBy(paymentsBookings, "updated_at").reverse()};

        case ADD_REVIEW:
          let reviews = [...state.past];
          let reviewIndex = _.findIndex(reviews, { _id: action.data._id });
          if(reviewIndex>-1){
            reviews[reviewIndex] = { ...reviews[reviewIndex] , ...action.data };
          }
        return { ...state, past : _.sortBy(reviews, "updated_at").reverse()};

        case REQUEST_CANCEL:
          let upcomingListing = [...state.upcoming];
          let upcomingIndex = _.findIndex(upcomingListing, { _id: action.data._id });
          if(upcomingIndex>-1){
            upcomingListing[upcomingIndex] = { ...upcomingListing[upcomingIndex] , ...action.data };
          }
        return { ...state, upcoming : _.sortBy(upcomingListing, "updated_at").reverse()};

        /**
        * Save Server Time.
        */

        case SERVER_TIME:
        return { ...state, serverTime : action.data }

        /**
        * logout
        */
        case LOG_OUT:
        return initialState;

        default:
        return state;
    }
}