/*
 * @file: FormSubmitButton.js
 * @description: Submit button component
 * @date: 18.05.2017
 * @author: Rahul Saini
 * */

import React, { PropTypes } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
let Screen = require("Dimensions").get("window");
import Constants from '../../constants';
const FormSubmitButton = props => {
  const { text, onPress, style, textStyle } = props;

  return (
    <TouchableOpacity
      style={[styles.loginButtonStyle,style]}
      onPress={onPress}
    >
      <Text style={{ color: "#fff", textAlign: "center",...Constants.Fonts.bold,fontSize:Constants.BaseStyle.FONT_SIZE_5 }}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  loginButtonStyle: {
    borderWidth: 1,
    padding: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3.5,
    backgroundColor: Constants.Colors.actionButtonColor,
    borderColor: "transparent",
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 5,
    marginHorizontal:(Constants.BaseStyle.DEVICE_WIDTH/100)*10
  }
});

FormSubmitButton.PropTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object.isRequired,
  textStyle: PropTypes.object.isRequired
};

export default FormSubmitButton;
