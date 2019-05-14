/*
 * @file: SmallLink.js
 * @description: Simple component for showing small links to navigate to other screen 
 * @date: 18.05.2017
 * @author: Rahul Saini
 * */

import React, { PropTypes } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
let Screen = require("Dimensions").get("window");
import Constants from '../../constants';

const SmallLink = props => {
  const { text, onPress, style } = props;

  return (
  	<TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
  		<Text style={[style,styles.textStyle]}>{text}</Text>
  	</TouchableOpacity>
  );
};
const styles = StyleSheet.create({
	textStyle: {
	    color:Constants.Colors.Green,
	},
	buttonStyle:{
		width :  Constants.BaseStyle.DEVICE_WIDTH/100*40
	}
});
 
SmallLink.PropTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object.isRequired
};

export default SmallLink;
