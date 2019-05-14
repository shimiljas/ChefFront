/* *
 * @file: conversations.js
 * @description: Conversation Reducer.
 * @date: 04.08.2017
 * @author: Lancy Goyal
 * */
'use strict';
import {
  Platform,
} from 'react-native';
import _ from "lodash";
import { startLoading, stopLoading } from './app';
import { goBack, reset } from './nav';
import { LOG_OUT_SUCCESS, LOG_OUT  } from './user';
import RestClient from '../../utilities/RestClient';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { cancelAllLocalNotifications } from '../../utilities/PushNotification';

// Actions
export const ROOM_ADDED        = "ROOM_ADDED";
export const ROOM_CHANGED      = "ROOM_CHANGED";
export const ROOM_REMOVED      = "ROOM_REMOVED";
export const MESSAGE_ADDED     = "MESSAGE_ADDED";
export const MESSAGE_CHANGED   = "MESSAGE_CHANGED";
export const MESSAGE_REMOVED   = "MESSAGE_REMOVED";
export const GET_MESSAGES      = "GET_MESSAGES";

// Action Creators
export const insertRoom     = (id, fields) => ({ type: ROOM_ADDED, id, fields });
export const updateRoom     = (id, fields) => ({ type: ROOM_CHANGED, id, fields });
export const deleteRoom     = id => ({ type: ROOM_REMOVED, id });
export const insertMessage  = (id, roomId, fields) => ({ type: MESSAGE_ADDED, id, roomId, fields });
export const updateMessage  = (id, roomId, fields) => ({ type: MESSAGE_CHANGED, id, roomId, fields });
export const deleteMessage  = (id, roomId) => ({ type: MESSAGE_REMOVED, id, roomId });
export const getMessages    = (data) => ({ type: GET_MESSAGES, data });


/**
* Get Chat History.
*/

export const getChatHistory = (data,callBack) => {
  let requestObject = {
    receiverId : data.receiverId
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("user/chat", requestObject, data.token, data.userId).then((result) => {
      if(result.statusCode==200){
        dispatch(stopLoading());
        if(data.notification){
            if(_.isFunction(callBack)){
                callBack(result.result);
            }
        }else{
            let chatDetails = {...result.result,...{receiverDetails : data}};
            dispatch(getMessages(chatDetails));
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
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};



// Reducer
const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ROOM_ADDED:
        return { ...state,
            ...{
                [action.id]: action.fields
            }
        };

        case ROOM_CHANGED:
        return { ...state,
            ...{
                [action.id]: { ...state[action.id], ...action.fields }
            }
        };

        case ROOM_REMOVED:
            delete state[action.id];
        return { ...state };

        case MESSAGE_ADDED:
        let recentMessages = state[action.roomId] && state[action.roomId].messages ? { ...state[action.roomId].messages } : {};
        return { ...state,
            ...{
                [action.roomId]: { ...state[action.roomId],
                    messages: {
                        ...recentMessages,
                        ...{
                            [action.id]: action.fields
                        }
                    }
                }
            }
        };

        case MESSAGE_CHANGED:
            return { ...state,
                ...{
                    [action.roomId]: { ...state[action.roomId],
                        messages: {
                            ...state[action.roomId].messages,
                            ...{
                                [action.id]: { ...state[action.roomId].messages[action.id], ...action.fields }
                            }
                        }
                    }
                }
            };

        case MESSAGE_REMOVED:
            delete state[action.roomId].messages[action.id];
            return { ...state };

        case LOG_OUT:
            return initialState;

        default:
            return state;
    }
}