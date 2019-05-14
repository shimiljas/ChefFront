/* *
 * @file: location.js
 * @description: Location reducer to handle user current location and selected location.
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */
'use strict';
// Actions
const SET_DETAILS = "SET_DETAILS";
const SELECTED_DETAILS = "SELECTED_DETAILS";
const LOCATION_ERROR    = "LOCATION_ERROR";

// Action Creators
export const setDetails = (data) => ({ type: SET_DETAILS, data });
export const selectLocation = (data) => ({ type: SELECTED_DETAILS, data });
export const locationError = (data) => ({ type: LOCATION_ERROR, data });

// Reducer

const initialState = {
    currentLocation     : null,
    selectedLocation    : null,
    isError             : false
};
 
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_DETAILS:            
            return { ...state, currentLocation : action.data};

        case SELECTED_DETAILS:
        	return { ...state, selectedLocation : action.data};

        case LOCATION_ERROR:
            return {...state, isError : action.data};

        default:
            return state;
    }
}
