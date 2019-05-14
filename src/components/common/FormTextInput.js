'use strict';

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

export default class FormTextInput extends Component{
  constructor(props){
    super(props);
    this.state={
      isFocused   : false,
      focusColor  : Constants.Colors.Gray,
      borderBottomWidth : 1
    }
  }

  // Function calls the parent class onBlur function
  onBlur() {
    this.setState({ isFocused: false});
    if(this.props.onBlur){
      this.props.onBlur();
    }
  }

  onFocus(){
    let colour = this.props.focusColor ? this.props.focusColor : Constants.Colors.Green;
    this.setState({ isFocused: true, focusColor  : colour, borderBottomWidth : 2});
    if(this.props.onFocus)
      this.props.onFocus();
  }

  focus(){
    this.refs.inputBox.focus()
  }

  onChange(event){
    if(this.props.onChange){
      this.props.onChange(event)
    }
  }

  render(){
    let {
      headerText, placeHolderText, placeHolderColor,
      keyboard, secureText, returnKey, SubmitEditing,
      isPassword, showPassword, multiline, inputStyle, autoFocus,
      editable,value
    } = this.props;

    return(
      <View style={[styles.viewStyle,{
        borderBottomColor:this.state.focusColor,
        borderBottomWidth:this.state.borderBottomWidth
      },this.props.style]}>
        <TextInput
          ref={"inputBox"}
          autoFocus={autoFocus}
          underlineColorAndroid="transparent"
          style={[styles.inputStyle,inputStyle]}
          autoCapitalize={"none"}
          value={value}
          placeholder={placeHolderText}
          placeholderTextColor={this.state.focusColor}
          keyboardType={keyboard}
          secureTextEntry={secureText}
          editable={editable}
          onChangeText={(text) => this.props.onChangeText(text)}
          onChange={(event) => this.onChange(event)}
          returnKeyType={returnKey}
          autoCorrect={false}
          onSubmitEditing={SubmitEditing}
          onFocus={() => this.onFocus()}
          onBlur={() => this.setState({ isFocused: false, focusColor  : Constants.Colors.Gray,borderBottomWidth:1 })}
          multiline={multiline}
          maxLength={250}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    borderBottomColor: Constants.Colors.White,
    borderBottomWidth: 1,
    marginHorizontal: (Constants.BaseStyle.DEVICE_WIDTH/100)*5,
    marginVertical: Constants.BaseStyle.DEVICE_WIDTH*2/100,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*3
  },
  inputStyle: {
    ...Constants.Fonts.normal,
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*1/100,
    height: Constants.BaseStyle.DEVICE_HEIGHT/100*7,
    textAlign: 'left',
    color: Constants.Colors.Gray
  }
});
