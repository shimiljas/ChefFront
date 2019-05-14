/*
 * @file: Permissions.js
 * @description: Handle Permissions
 * @date: 17.08.2017
 * @author: Manish Budhiraja
 * */

'use strict';
import React, { Component } from "react";
import { Alert, InteractionManager} from "react-native";
import Permissions from 'react-native-permissions';
import Constants from '../constants';

export function mediaPermissions(type,callBack){
  Permissions.checkMultiplePermissions(['camera', 'photo']).then(response => {
      if(response){
        context.launchCameraGallery();
      }else if(response==="denied"){
        Alert.alert(
          'Permissions Request',
          "Please go to Settings > Applications > Sportsfixer > Permissions > Camera and Storage to allow Sportsfixer to access your Camera & Gallery.",
          [
            { text: 'Settings', onPress: () => Permissions.openSettings()},
            { text: 'cancel',   onPress: () => console.log("cancelled")},
          ],
          {cancelable: false}
        ); 
      }else{
        Permissions.requestPermission(type).then(response => {
          if(response==="authorized"){
            
          }else{
            Alert.alert(
              'Permissions Request',
              "Please go to Settings > Applications > Sportsfixer > Permissions > Camera and Storage to allow Sportsfixer to access your Camera & Gallery.",
              [
                { text: 'Settings', onPress: () => Permissions.openSettings()},
                { text: 'cancel',   onPress: () => console.log("cancelled")},
              ],
              {cancelable: false}
            );
          }
        });
      }
    });
}