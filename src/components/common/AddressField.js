/*
 * @file: AddressField.js
 * @description: Address Field Component
 * @date: 10.07.2017
 * @author: Vishal Kumar
 * */

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import Constants from '../../constants';

export default class AddressField extends Component{
  constructor(props) {
    super(props);
    let { dataText } = this.props;
    let location = 'Please ensure your GPS is enabled.';
    if(dataText) {
      if(dataText.selectedLocation) {
        location = dataText.selectedLocation.formatted_address?dataText.selectedLocation.formatted_address:dataText.currentLocation.formattedAddress;
      } else if(dataText.currentLocation && !dataText.selectedLocation){
        location = dataText.currentLocation.formattedAddress
      }else if(dataText.address && !dataText.selectedLocation){
        location = dataText.address;
      }
    }

    this.state = {
      dataText: location
    }
  }

  componentWillReceiveProps(next) {
    let location = 'Please ensure your GPS is enabled.';
    if(next.dataText) {
      if(next.dataText.selectedLocation) {
        location = next.dataText.selectedLocation.formatted_address?next.dataText.selectedLocation.formatted_address:next.dataText.currentLocation.formattedAddress;
      }else if(next.dataText.currentLocation && !next.dataText.selectedLocation){
        location = next.dataText.currentLocation.formattedAddress
      }else if(next.dataText.address && !next.dataText.selectedLocation){
        location = next.dataText.address;
      }
    }
    this.setState({
      dataText: location
    });
  }

  // Default render function
  render() {
    let {
      headerText, viewStyle, inputStyle, headerStyle,
    } = this.props;

    return(
      <View style={[styles.viewStyle, viewStyle]}>

        <View>
          <Text style={[styles.headerStyle, headerStyle]}>
            {headerText}
          </Text>
        </View>

        <TouchableOpacity
          onPress={()=>this.props._onPress()}
        >
          <Text numberOfLines={3} style={[styles.inputStyle, inputStyle]}
          >
            {this.state.dataText}
          </Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    // alignItems: 'center',
    borderBottomColor: Constants.Colors.Gray,
    borderBottomWidth: 0.5,
  },
  headerStyle:{
    ...Constants.Fonts.normal,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    color: Constants.Colors.Gray,
    backgroundColor: 'transparent',
  },
  inputStyle: {
    ...Constants.Fonts.normal,
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    width: Constants.BaseStyle.DEVICE_WIDTH*90/100,
    color: Constants.Colors.White,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
