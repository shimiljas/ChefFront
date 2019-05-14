/**
 * @file: BackButton.js
 * @description: Back Button Module for Navigation Bar.
 * @date: 17.12.2016
 * @author: Manish Budhraja
 */

'use strict';

import React, { Component } from 'react';
import {
  Image,
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import Constants from '../../constants';

export default class EditButton extends Component {
  render() {
    return (
      <View style={[styles.container,this.props.containerStyle]}>
        <TouchableHighlight
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          underlayColor={Constants.Colors.Transparent} 
          style={[styles.button,this.props.buttonStyle]} onPress={this.props.onPress}
        >
          <Text style={[styles.textStyle,this.props.textStyle]}>
            {this.props.title}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:Platform.OS==="ios"?20:0
  },
  button:{
    backgroundColor:Constants.Colors.Transparent,
    width:Constants.BaseStyle.DEVICE_WIDTH/100*18,
    marginRight:Constants.BaseStyle.DEVICE_WIDTH/100*5
  },
  backImage:{
    height:Constants.BaseStyle.DEVICE_WIDTH/100*4.5,
    width:Constants.BaseStyle.DEVICE_WIDTH/100*7
  },
  textStyle:{
    alignSelf:"flex-end",
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*22,
    backgroundColor:Constants.Colors.Transparent,
    color:Constants.Colors.White,
    ...Constants.Fonts.content
  }
});
