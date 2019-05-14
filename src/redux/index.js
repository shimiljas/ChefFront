import { combineReducers } from 'redux';
import { toastReducer as toast } from 'react-native-redux-toast';
import app from "./modules/app";
import nav from "./modules/nav";
import user from "./modules/user";
import location from "./modules/location";
import booking from "./modules/bookings";
import bookings from "./modules/bookings";
import payments from "./modules/payments";
import conversations from "./modules/conversations";
import listing from "./modules/listing";
import availability from './modules/availability';
import notifications from './modules/notifications';
import reports from './modules/reports';

export default function getRootReducer() {
    return combineReducers({
        toast,
        app,
        nav,
        user,
        location,
        bookings,
        listing,
        payments,
        conversations,
        availability,
        notifications,
        reports
    });
}
