/*
 * @file: PushNotification.js
 * @description: Initiliazing push notification , Redirection on push notifications
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */
'use strict';
import React, { Component } from "react";
import { Platform } from 'react-native';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import { mongoid } from 'mongoid-js';
import _ from "lodash";
import Idx from './Idx';
import moment from "moment";
import * as userActions from '../redux/modules/user';
import { goTo } from '../redux/modules/nav';
let notificationListener,refreshTokenListener;
let notificationToken = 'dummytoken';

/**
* Initiliazing push notification
*/ 

export function pushNotificationInit(store) {
	FCM.requestPermissions(); // for iOS
    // FCM token on intial app load.
    FCM.getFCMToken().then(token => {
        if(token){
        	store.dispatch(userActions.setDeviceToken(token));
        }
    });

    // Receive Notification in kill state, inactive state or bankground state.
	FCM.getInitialNotification().then(res=>{
		console.log("getInitialNotification=> ", res);
		let context = this;
		if(JSON.stringify(res)){
		    setTimeout(function(){
		        onNotificationRedirection(res,store);
		    },500);
		}
	});

	// Receive Notification in forground
	notificationListener = FCM.on(FCMEvent.Notification, async (res) => {
		console.log("notificationListener=> ", res);
		let context = this;
		if(res.opened_from_tray){
		    setTimeout(function(){
		    	onNotificationRedirection(res,store);
		    },500);
	    }
	});

	// Fcm token may not be available on first load, catch it here
	refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
		if(token){
		  store.dispatch(userActions.setDeviceToken(token));
		}
	});
}


/**
* Schedule Local Notifications.
*/

export function scheduleNotifications(data){ 
	let fire_date = parseInt(moment(data.date).seconds(0).format("x"));  // eliminate secs.
	FCM.scheduleLocalNotification({
    fire_date: fire_date,
    id: data.id,
    body: 'Job is about is start in '+ data.hours +(data.hours===1?' hour':' hours'),
    show_in_foreground: true,
    priority: 'high',
    lights: true,   
    vibrate: 500,
    notificationType : 6
  });
};


/**
* Get Scheduled Notifications List.
*/

export function getScheduleNotifications(data,callback){
	FCM.getScheduledLocalNotifications().then(notification=>{
		console.log(" getScheduleNotifications ",notification);
		 if(_.isFunction(callback)){
        callback(notification);
        }
    });
};

/**
*  Removes all future local notifications.
*/

export function cancelAllLocalNotifications(){
    FCM.cancelAllLocalNotifications();
};

/**
* Redirection on Notification Tap. 
*/

export function onNotificationRedirection(res,store){
	if (Idx(store.getState().user, _ => _.userDetails.auth.token)) {
      	let dashboard 	= "";
      	let usertoken 	= store.getState().user.userDetails.auth.token;
	    let userRole 	= store.getState().user.userDetails.role;
	    switch(userRole){
	    	case 0:
	    		dashboard = "ConsumerDashboard";
	    	break;
	    	case 1:
	    		dashboard = "ChefDashboard";
	    	break;
	    	case 2:
	    		dashboard = "CatererDashboard";
	    	break;
	    	default :
	    		dashboard = "ConsumerDashboard";
	    	break;
	    }

		switch(parseInt(res.notificationType)){
			case 1: // Takes user to chat page.
				if(store.getState().nav.routes[store.getState().nav.routes.length-1].routeName == 'Chat'){
	        		break;
	            }else{
		            store.dispatch(goTo({
		            	route:'Chat',
		            	params:{
			            	receiverDetails : {
			            		receiverId : res.sender_id?res.sender_id:"",
			            		receiverName : res.senderName?res.senderName:""
			            	},
			            	fromNotification : true
		            	}
		        	}));
		            break;
	       		}

			case 2: // Takes user to notifications page.
				if(store.getState().nav.routes[store.getState().nav.routes.length-1].routeName == 'Notifications'){
	        		break;
	            }else{
		            store.dispatch(goTo({
	            		route : 'Notifications'
	            	}));
		            break;
	       		}
			break;

			case 3: // Takes user to ratings page.
				if(store.getState().nav.routes[store.getState().nav.routes.length-1].routeName == 'Notifications'){
	        		break;
	            }else{
		            store.dispatch(goTo({
		            	route:'Notifications'
		            }));
		            break;
	       		}
			break;

			case 4: // Takes user to dashboard.
				if(store.getState().nav.routes[store.getState().nav.routes.length-1].routeName == dashboard){
	        		break;
	            }else{
		            store.dispatch(goTo({
		            	route : dashboard
		            }));
		            break;
	       		}
			break;

			case 5: // Takes user to contact support if user deactivated by admin.
				if(store.getState().nav.routes[store.getState().nav.routes.length-1].routeName == 'ContactSupport'){
	        		break;
	            }else{
		            store.dispatch(goTo({
		            	route:'ContactSupport'
		            }));
		            break;
	       		}
			break;

			default: //Takes user to dashboard.
				if(store.getState().nav.routes[store.getState().nav.routes.length-1].routeName == dashboard){
	        		break;
	            }else{
		            store.dispatch(goTo({
		            	route : dashboard
		            }));
		            break;
	       		}
			break;
	    }
    }

    if(_.isFunction(res.finish)){
    	res.finish();
    };
  	
}

/**
* Stop listening push notification events
*/

export function pushNotificationRemove(store) {
	notificationListener.remove();
	refreshTokenListener.remove();
}
