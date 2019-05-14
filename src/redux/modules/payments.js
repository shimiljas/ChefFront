/*
 * @file: payments.js
 * @description: Payment Reducer handles add card, delete card, set default card, add bank and view bank details. 
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
import { LOG_OUT_SUCCESS, LOG_OUT  } from './user';
import RestClient from '../../utilities/RestClient';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { cancelAllLocalNotifications } from '../../utilities/PushNotification';

// Actions

export const ALL_CARDS      = "ALL_CARDS";
export const CARD_ADDED     = "CARD_ADDED";
export const CARD_DELETED   = "CARD_DELETED";
export const DEFAULT_CARD   = "DEFAULT_CARD";
export const BANK_DETAILS_ADDED = "BANK_DETAILS_ADDED";
export const UPDATE_DEFAULT_CARD = "UPDATE_DEFAULT_CARD";
export const REGISTER_BANK = "REGISTER_BANK";
export const FETCH_BANK_DETAILS = "ADD_BANK_DETAILS";

// Action Creators

export const ADD_CARD         = (data) => ({ type: CARD_ADDED,data});
export const FETCH_CARDS      = (data) => ({ type: ALL_CARDS,data});
export const SET_DEFAULT_CARD = (data) => ({ type: DEFAULT_CARD,data});
export const REMOVE_CARD      = (data) => ({ type: CARD_DELETED,data});
export const UPDATE_CARD      = (data) => ({ type: UPDATE_DEFAULT_CARD,data});
export const REGISTERBANK     = () => ({type:REGISTER_BANK});
export const BANK_DETAILS     = (data) => ({ type: BANK_DETAILS_ADDED,data});
export const FETCH_BANK       = (data) => ({type:FETCH_BANK_DETAILS,data});

/**
* Save Credit/Debit Card.
*/

export const saveCreditDebitCard = (data) => {
  let requestObject = {
    cardToken   : data.cardToken,
    //holderName  : data.name
  }
  return dispatch => {
    RestClient.post("stripe/createCard", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        dispatch(ADD_CARD([result.result]));
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(goBack());
      }else if(result.statusCode==401){
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
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
* Fetch Saved Cards List From Stripe.
*/
export const fetchSavedCardsList = (data) => {
  return dispatch => {
    RestClient.get("stripe/getCardsOfCustomer", {}, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(SET_DEFAULT_CARD(result.result.defaultCard));
        dispatch(FETCH_CARDS(result.result.cardList));
      }else if(result.statusCode==401){
        cancelAllLocalNotifications();
      }else{
        cancelAllLocalNotifications();
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Delete Saved Card. 
*/

export const removeCard=(data)=>{
  let requestObject = {
   cardId : data.id
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.delete("stripe/deleteCustomerCard", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(REMOVE_CARD(data.id));
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
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
* Set Default Card. 
*/

export const updateDefaultCard=(data)=>{
  let requestObject = {
    cardToken : data.id
  };
  return dispatch => {
    dispatch(startLoading());
    RestClient.put("stripe/updateDefaultCard", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(UPDATE_CARD(data.id));
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
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
* Save Bank Details.
*/

export const createStripeAccount = (data) => {
  let requestObject = {
    firstName:data.firstName,
    lastName:data.lastName,
    email:data.email,
    dob:data.dob,
    country:data.country,
    street:data.street,
    city:data.city,
    state:data.state,
    encryptedObject:data.encryptedObject
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("stripe/createStripeAccount", requestObject, data.token, data.userId).then((result) => {
      console.log("result",result)
      if(result.statusCode==200){
        dispatch(BANK_DETAILS(result.result));
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(goBack());
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
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
* Fetch Bank Details From Stripe.
*/
export const fetchSavedBankDetails = (data) => {
  return dispatch => {
    dispatch(startLoading());
    RestClient.get("stripe/getStripeAccounts", {}, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(FETCH_BANK(result.result));
        dispatch(stopLoading());
        //dispatch(ToastActionsCreators.displayInfo(result.message));
      }else if(result.statusCode==401){
        dispatch(stopLoading());
        dispatch(ToastActionsCreators.displayInfo(result.message));
        dispatch(LOG_OUT_SUCCESS());
        cancelAllLocalNotifications();
      }else{
        dispatch(stopLoading());
        if(result.message==="Bank account not exist"){
          dispatch(REGISTERBANK());
        }else{
          dispatch(ToastActionsCreators.displayInfo(result.message));
        }
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
  cardsList : [],
  bankDetails : null,
  defaultCard : null
};

/**
* Reducer
*/

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ALL_CARDS:
          return { ...state, cardsList: action.data };
        
        case CARD_ADDED:
          let card = null;
          if(state.cardsList.length===0){
            card = action.data[0].cardId;
          }else{
            card = state.defaultCard;
          }
        return {...state, defaultCard:card, cardsList:[...state.cardsList,...action.data]};
        case CARD_DELETED:
          let listClone = state.cardsList;
          _.remove(listClone, {cardId: action.data});
        return {...state, cardsList:listClone};
        
        case BANK_DETAILS_ADDED:
        return { ...state, bankDetails: action.data };
        
        case FETCH_BANK_DETAILS:
        return { ...state, bankDetails: action.data };

        case DEFAULT_CARD:
        return { ...state, defaultCard: action.data };

        case UPDATE_DEFAULT_CARD:
        return { ...state, defaultCard: action.data };
        
        case LOG_OUT:
        return initialState;
        
        default:
        return state;
    }
};