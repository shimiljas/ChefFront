/**
 * @file: Switch.js
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

export default class SwitchSettings extends Component{
  constructor(props) {
    super(props);

    let { isSwitchOn } = this.props;

    this.state = {
      isSwitchOn: isSwitchOn,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({isSwitchOn: nextProps.isSwitchOn})
  }

  render(){
    let {
      label,
    } = this.props;

    return(
      <TouchableOpacity
        style={{alignSelf: 'center'}}
        onPress={() => this.props.onClick()}
    
      >
        <View style={[styles.viewStyle, this.props.viewStyle]}>
          {
            this.props.isSwitchOn ?
              <Image style={[styles.icon, this.props.icon]} source={Constants.Images.caterer.toggle_green} /> :
              <Image style={[styles.icon, this.props.icon]} source={Constants.Images.caterer.toggle_gray} />
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
  },
  icon: {
    height: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    width: Constants.BaseStyle.DEVICE_HEIGHT*5.5/100,
  },
});
