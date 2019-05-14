/*
 * @file: TextField.js
 * @description: Component for text field having header for authentication screens
 * @date: 17.07.2017
 * @author: Vishal Kumar
 * */

'use-strict';

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput
} from 'react-native';
import Constants from '../../constants';

export default class TextField extends Component{
  constructor(props){
    super(props);
    this.state={}
  }

  render(){
    let {
      headerText,
      dataText,

      viewStyle,
      headerStyle,
      dataStyle
    } = this.props;

    let {
      addDetails,
    } = Constants.i18n.common;

    return(
      <View style={[styles.viewStyle, viewStyle]}>
        <Text style={[styles.headerStyle, headerStyle]}>
          {headerText}
        </Text>
        <Text style={[styles.dataStyle, dataStyle]}>
          {dataText.toString()}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    justifyContent: 'center',
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
  },
  headerStyle:{
    ...Constants.Fonts.normal,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
    color:Constants.Colors.Black,
    backgroundColor: 'transparent',
  },
  dataStyle: {
    ...Constants.Fonts.normal,
    color:Constants.Colors.Gray,
    backgroundColor: Constants.Colors.Transparent,
  },
});
