/*
 * @file: RoundButton.js
 * @description: Contains button with round corners.
 * @date: 06.07.2017
 * @author: Vishal Kumar
 * */

'use strict';

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Constants from '../../constants';

export default class RoundButton extends Component{
  constructor(props){
    super(props);
  }

  // Default render function
  render(){

    let { buttonStyle, textStyle} = this.props;

    return(
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.button,buttonStyle]}
        onPress={this.props._Press}
      >
        <Text style={[styles.text, textStyle]}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: Constants.BaseStyle.DEVICE_HEIGHT*7/100,
    backgroundColor: Constants.Colors.HeaderLightGreen,
    width: Constants.BaseStyle.DEVICE_WIDTH*85/100,
    borderRadius: Constants.BaseStyle.DEVICE_WIDTH/100*10,
    alignItems:'center',
    justifyContent: 'center'
  },
  text: {
    ...Constants.Fonts.content_bold,
    color: Constants.Colors.White,
  }
});
