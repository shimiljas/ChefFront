/*
 * @file: Location.js
 * @description: Handle Location Permissions and save location to store.
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */

'use strict';
import React, { Component } from "react";
import { Alert, InteractionManager} from "react-native";
import Permissions from 'react-native-permissions';
import * as LocationActions from '../redux/modules/location';
import Constants from '../constants';
import Geocoder from 'react-native-geocoder';

Geocoder.fallbackToGoogle(Constants.GoogleAPIKey);

export function checkPermissions(store) {
	Permissions.getPermissionStatus('location', 'whenInUse').then(response => {
      if(response==="authorized"){
        InteractionManager.runAfterInteractions(() => {
          navigator.geolocation.watchPosition(
            (success)=>{
              Geocoder.geocodePosition({
                lat:success.coords.latitude,
                lng:success.coords.longitude
              }).then(res => {
                  store.dispatch(LocationActions.locationError(false));
                  store.dispatch(LocationActions.setDetails(res[0]));
              }).catch(err => {
                  console.log(err);
                  store.dispatch(LocationActions.setDetails(null));
                  store.dispatch(LocationActions.locationError(true));
              });
            },
            (error)=>{
              store.dispatch(LocationActions.setDetails(null));
              store.dispatch(LocationActions.locationError(true));
            },
            {
              enableHighAccuracy: false, 
              timeout: 1000*60*1,
              maximumAge: 2000,
              distanceFilter:100
            }
          );
        });
      }else{
      	requestPermissions(store);
      }
    });
}

export function requestPermissions(store){
	Permissions.requestPermission('location', 'whenInUse').then(response => {
        if(response!=="authorized"){
        	store.dispatch(LocationActions.setDetails(null));
          store.dispatch(LocationActions.locationError(true));
          setTimeout(()=>{
            Alert.alert(
              "Location Permissions", 
              "We need to access your location. Please go to Settings > Privacy > Location to allow ChefOrder to access your location.", 
              [{
                text: "Enable",
                onPress:()=>{Permissions.openSettings()}
              },{
                text: "Cancel",
                onPress:()=>{console.log("cancelable")}
              }],
              {cancelable: false}
            );
          },700);
        }else{
        	checkPermissions(store);
        }
	});
}