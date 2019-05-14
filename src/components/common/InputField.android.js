/**
 * @file: InputField.js
 * @description: Input field component.
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
  TouchableOpacity
} from 'react-native';

import Constants from '../../constants';
import Images from '../../constants/Images';

export default class InputField extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    }
  }

  // Function calls the parent class onFocus function
  onFocus() {
    this.setState({ isFocused: true, multiline:true});
    if(this.props.onFocus) {
      this.props.onFocus();
    }
  }

  // Focuses on inputBox
  focus() {
    this.refs.inputBox.focus();
  }

  // Function calls the parent onChange function
  onChange(event) {
    if(this.props.onChange) {
      this.props.onChange(event);
    }
  }

  // Function calls the parent class onBlur function
  onBlur() {
    this.setState({ isFocused: false});
    if(this.props.onBlur){
      this.props.onBlur();
    }
  }

  dollarConverter(text){
    if(this.props.isDollar){
      if(text.length>0 && text!='$'){
      let value=this.replaceAll(text,"$ ", "");
      value='$ '+value;
      this.setState({localValue:value});
      }else{
       this.setState({localValue:text});
     }
   }
  }

  replaceAll(text,str1, str2, ignore){
    return text.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
  }

  // Default render function
  render() {
    let context = this ;
    let {
      headerText, placeHolderText, placeHolderColor,
      keyboard, secureText, returnKey, SubmitEditing, isPassword,
      multiline, viewStyle, inputStyle, headerStyle, passwordIconStyle, autoFocus
    } = this.props;

    return(
      <View style={[styles.viewStyle, viewStyle]}>
        <View
          style= {{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch'
          }}
        >
          <Text style={[styles.headerStyle, headerStyle]}>
            {headerText}
          </Text>
          {
            isPassword &&
            <TouchableOpacity
              style={styles.passwordIconViewStyle}
              hitSlop={{top:15,bottom:15,left:15,right:15}}
              onPress={()=>context.props.onShowHidePassword()}
            >
              <Image
                resizeMode="stretch"
                style={[styles.passwordIconStyle, passwordIconStyle]}
                source={Images.caterer.password_hide}
              />
            </TouchableOpacity>
          }
        </View>
        <TextInput
          ref={"inputBox"}
          autoFocus={autoFocus}
          numberOfLines={1}
          autoCapitalize={"none"}
          autoCorrect={false}
          style={[styles.inputStyle, inputStyle]}
          multiline = {multiline}
          maxLength = {(isPassword||keyboard=='phone-pad')? 16 :multiline?250:40}
          onChange={(event) => context.onChange(event)}
          placeholder={placeHolderText}
          placeholderTextColor={placeHolderColor}
          keyboardType={keyboard}
          value={this.state.localValue}
          secureTextEntry={this.props.secureText}
          onChangeText={(text) => { this.props.onChangeText(text); this.dollarConverter(text);   }}
          returnKeyType={returnKey}
          isDollarTrue={this.props.isDollar}
          onSubmitEditing={SubmitEditing}
          onFocus={() => context.onFocus()}
          onBlur={() => context.onBlur()}
          editable={this.props.editable==false ?this.props.editable:true }
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    alignItems: 'center',
    borderBottomColor: Constants.Colors.Gray,
    borderBottomWidth: 0.5
  },
  headerStyle:{
    ...Constants.Fonts.normal,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    color:Constants.Colors.Gray,
    backgroundColor: 'transparent'
  },
  inputStyle: {
    ...Constants.Fonts.normal,
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
    height: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    width: Constants.BaseStyle.DEVICE_WIDTH,
    textAlign: 'center',
    color: Constants.Colors.White
  },
  passwordIconViewStyle: {
    right: Constants.BaseStyle.DEVICE_WIDTH*20/100, 
    position: 'absolute'
  },
  passwordIconStyle: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    width: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    height: Constants.BaseStyle.DEVICE_WIDTH*3.5/100,
    alignSelf:'flex-end'
  }
});
