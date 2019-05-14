/**
 * @file: InputField2.js
 * @description: Input field component for profile pages.
 * @date: 18.07.2017
 * @author: Vishal Kumar
 */

'use strict';

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  Platform
} from 'react-native';

import Constants from '../../constants';

export default class InputField2 extends Component{
  constructor(props){
    super(props);

    this.state={
      headerText: this.props.headerText,
      isFocused:false
    }

  }

  onFocus(){
    this.setState({ isFocused: true, multiline:true });
    if(this.props.onFocus)
    this.props.onFocus();
  }

  focus(){
    this.refs.inputBox.focus()
  }

  render(){
       let { headerStyle
    } = this.props;
    return(
      <View style={styles.viewStyle}>
        <Text style={[styles.headerStyle,headerStyle]}>
          {this.state.headerText}
        </Text>

        <TextInput
          style={[styles.dataStyle, this.props.dataStyle]}
          ref={"inputBox"}
          keyboardType={this.props.keyboardType}
          autoCorrect={false}
          multiline = {this.props.multiline}
          underlineColorAndroid = "transparent"
          maxLength = {this.props.multiline ? 250 : 40}
          autoCapitalize={"none"}
          placeholder={this.props.placeHolderText}
          placeholderTextColor={Constants.Colors.Gray}
          onChangeText={(text) => this.props.onChangeText(text)}
          onSubmitEditing={this.props.SubmitEditing}
          onFocus={() => this.onFocus()}
          onBlur={() => this.setState({ isFocused: false })}
          value={this.props.value}
          {...this.props.properties}
        />
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
    borderBottomWidth: 1
  },
  headerStyle:{
    ...Constants.Fonts.normal,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
    color: Constants.Colors.Black,
    backgroundColor: 'transparent'
  },
  dataStyle: {
    ...Constants.Fonts.normal,
    height: Platform.OS==="ios" ? Constants.BaseStyle.DEVICE_HEIGHT/100*3 : Constants.BaseStyle.DEVICE_HEIGHT/100*7,
    color: Constants.Colors.Gray,
    backgroundColor: 'transparent'
  },
});
