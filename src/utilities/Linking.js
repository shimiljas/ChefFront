/*
 * @file: Linking.js
 * @description: For handle push notification functionality
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */
'use strict';
import { Linking, Platform } from "react-native";

export function telephone(phoneNumber){
	Linking.canOpenURL("tel:" +phoneNumber).
    then(supported => {
      if (!supported) {
        console.log("Can't handle => " + phoneNumber);
      } else {
        return Linking.openURL("tel:" + phoneNumber)
      }}).catch(err => console.error('An error occurred', err));
};