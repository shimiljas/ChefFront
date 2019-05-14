/* *
 * @file: app.js
 * @description: Application Reducer for handling toasts and spinner.
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */

'use strict';
// Actions
const LOADING_STOP = "LOADING_STOP";
const LOADING_START = "LOADING_START";
const SHOW_TOAST = "SHOW_TOAST";
const HIDE_STOP = "HIDE_STOP";

// Action Creators

export const startLoading = () => ({ type: LOADING_START });

export const stopLoading = () => ({ type: LOADING_STOP });

export const showToast = text => ({ type: SHOW_TOAST, text });

export const hideToast = () => ({ type: HIDE_STOP });


// Reducer

const initialState = {
    isLoading: false,
    isToast: false,
    toastText: ""
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOADING_START:
            return { ...state, isLoading: true };

        case LOADING_STOP:
            return { ...state, isLoading: false };

        case SHOW_TOAST:
            return { ...state, isToast: true, toastText: action.text };

        case HIDE_STOP:
            return { ...state, isToast: false };

        default:
            return state;
    }
}
