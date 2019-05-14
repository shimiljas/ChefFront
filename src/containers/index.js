/*
 * @file: Welcome.js
 * @description: Welcome Page of the Application.
 * @date: 30.06.2017
 * @author: Vishal Kumar
 * */

'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import Constants from '../constants';
import Background from '../components/common/Background';
import * as locationActions from '../redux/modules/location';

class Welcome extends Component {

  constructor(props){
    super(props);
  }

  render() {
    let context = this; 
    let { navigate } = this.props.navigation;
    return (
      <Background>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.Colors.LightGreen}
        />
        <TouchableOpacity 
          onPress={()=>{
            context.props.locationActions.selectLocation(null);
            navigate("LoginSignup",{userType:"customer",initialIndex:0});
          }}
          activeOpacity={0.9} 
          style={styles.container}>
            <Image
              resizeMode={"contain"}
              style={styles.imageStyle}
              source={Constants.Images.user.customer}
            />
            <Text style={styles.textStyle} >Customer</Text>
        </TouchableOpacity>
        <View style={{height: 0.5,backgroundColor:Constants.Colors.Gray,}}/>
        <TouchableOpacity activeOpacity={0.9}
          onPress={()=>{
            context.props.locationActions.selectLocation(null);
            navigate("LoginSignup",{userType:"chef",initialIndex:0})
          }}
          style={styles.container}
        >
          <Image
            resizeMode={"contain"}
            style={styles.imageStyle}
            source={Constants.Images.user.chef}
          />
          <Text style={styles.textStyle}>Chef</Text>
        </TouchableOpacity>
        <View style={{height: 0.5,backgroundColor:Constants.Colors.Gray,}}/>
        <TouchableOpacity activeOpacity={0.9}
          onPress={()=>{
            context.props.locationActions.selectLocation(null);
            alert("Coming Soon");
            //navigate("LoginSignup",{userType:"caterer",initialIndex:0})
          }}
          style={styles.container}
        >
          <Image
            resizeMode={"contain"}
            style={styles.button}
            source={Constants.Images.user.caterer}
          />
          <Text style={styles.textStyle} >Caterer</Text>
        </TouchableOpacity>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:Constants.Colors.Gray,
    backgroundColor:"rgba(0,0,0,.4)",
  },
  textStyle:{
    ...Constants.Fonts.normal,
    color:Constants.Colors.White,
    alignSelf: 'stretch',
    textAlign: 'center',
    backgroundColor:Constants.Colors.Transparent,
    margin:5
  },
  imageStyle:{
    height: Constants.BaseStyle.DEVICE_WIDTH/100*12,
    width: Constants.BaseStyle.DEVICE_WIDTH/100*12,
  },
  button: {
    height: Constants.BaseStyle.DEVICE_WIDTH/100*13,
    width: Constants.BaseStyle.DEVICE_WIDTH/100*20,
  },
});

const mapDispatchToProps = dispatch => ({
  locationActions: bindActionCreators(locationActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Welcome);