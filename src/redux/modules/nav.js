/* *
 * @file: nav.js
 * @description: Navigation reducer to handle navigation.
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */
'use strict';
import Idx from "../../utilities/Idx";
import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../../config/navigator";
import { REHYDRATE } from "redux-persist/constants";
import { LOG_IN_CHEF, LOG_IN_SUCCESS, NEW_CONSUMER_USER, NEW_CHEF_USER, NEW_CATERER_USER, GO_TO_OTP, LOG_OUT, GO_TO_RESETPSWD,GET_DETAILS } from './user';
import { FETCH_BANK_DETAILS, REGISTER_BANK } from "./payments" ;
import { GET_AVAILABLE_SLOTS } from "./availability" ;
import { GET_MESSAGES } from "./conversations" ; 
import { READ_NOTIFICATION } from "./notifications" ; 
 
//Actions
const GOBACK            = "GOBACK";
const ResetNavigator    = "ResetNavigator";
const GOTO              = "GOTO";
const GOTO_AVAIL        = "GOTO_AVAIL";

// Action Creators
export const goBack = () => ({ type: GOBACK });
export const reset  = (data) => ({ type: ResetNavigator, data });
export const goTo   = (data) => ({ type: GOTO, data });
export const goToAvail = () => ({ type: GOTO_AVAIL });

const initialState = AppNavigator.router.getStateForAction(NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Loader',
      }),
    ],
})); 

export default function reducer(state = initialState, action) {
    let firstState = "Welcome", role = 0;
    if(action.payload && action.payload.user && action.payload.user.userDetails){
        switch(parseInt(action.payload.user.userDetails.role)){
            case 0:
                firstState = "ConsumerDashboard" ;
                role = 0;
            break;
            case 1:
                firstState = "ChefDashboard" ;
                role = 1;
            break;
            case 2:
                firstState = "RegisterCreditDebitCards" ;
                role = 2;
            break;
        }
    }

    switch (action.type) {
        case NEW_CONSUMER_USER:
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({
                    routeName: "ConsumerSignup",
                    params: action.data
                }),
                state
            );

        case NEW_CHEF_USER:
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({
                    routeName: "ChefSignUp",
                    params: action.data
                }),
                state
            );

        case NEW_CATERER_USER:
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({
                    routeName: "CatererSignUp",
                    params: action.data
                }),
                state
            );

    	case LOG_IN_SUCCESS:
            return AppNavigator.router.getStateForAction(
                NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: "ConsumerDashboard" })],
                }),
                state
            );

        case LOG_IN_CHEF:
            return AppNavigator.router.getStateForAction(
                NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: "ChefDashboard" })],
                }),
                state
            );

        case GO_TO_OTP:
        return AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: "OTP",
                params:action.data
            }),
            state
        );

        case GO_TO_RESETPSWD:
        return AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: "ResetPassword",
                params: action.data
            }),
            state
        );

        case GET_DETAILS:
        return AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: action.data.role === 1? "ChefViewProfile" : "ConsumerProfile" ,
            }),
            state
        );

        case FETCH_BANK_DETAILS:
        return AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: "RegisterBankDetails",
                params: action.data
            }),
            state
        );

        case REGISTER_BANK:
        return AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: "RegisterBank",
                params: action.data
            }),
            state
        );

        case GOTO_AVAIL:
        console.log("goToAvail")
        return AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: "Availability",
            }),
            state
        );

        case GET_MESSAGES:
        return AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: "Chat",
                params: action.data
            }),
            state
        );

        case ResetNavigator:
            return AppNavigator.router.getStateForAction(
                NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: "Welcome" })],
                }),
                state
            );

        case GOBACK:
            return AppNavigator.router.getStateForAction(
                NavigationActions.back(),
                state
            );

        case GOTO:
        return AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: action.data.route,
                params: action.data.params || {},
            }),
            state
        );

        case LOG_OUT:
            return AppNavigator.router.getStateForAction(
                NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: "Welcome" })],
                }),
                state
            );

        case REHYDRATE:
            return AppNavigator.router.getStateForAction(
                NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: firstState })],
                }),
                state
            );

        default:
            return AppNavigator.router.getStateForAction(action, state);
    }
}
