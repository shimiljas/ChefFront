/**
 * @file: CircularCheckbox.js
 * @description: Checkbox component
 * @date: 10.07.2017
 * @author: Vishal Kumar
 */

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity
} from 'react-native';
import Constants from '../../constants';

export default class CircularCheckbox extends Component{

  // Default render function
  render(){
    
    return(
      <TouchableOpacity
        style={{alignSelf: 'stretch', borderWidth: 0}}
        onPress={() => this.props.onClick()}
      >
        <View style={styles.viewStyle}>
          {
            this.props.isChecked ?
              <Image style={styles.icon} source={Constants.Images.caterer.checkbox_selected} /> :
              <Image style={styles.icon} source={Constants.Images.caterer.checkbox} />
          }
          <Text style={styles.labelStyle}>
            {this.props.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
  },
  icon: {
    height: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    width: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
  },
  labelStyle: {
    ...Constants.Fonts.normal,
    paddingLeft: Constants.BaseStyle.DEVICE_WIDTH*3/100,
    color: Constants.Colors.Gray,
    flex: 1,
    backgroundColor : Constants.Colors.Transparent,
  }
});
