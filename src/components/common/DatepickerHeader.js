/*
 * @file: DatepickerHeader.js
 * @description: Date picker header component for driver side
 * @date: 18.05.2017
 * @author: Rahul Saini
 * */

import React, { PropTypes } from "react";
import { View,TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
let Screen = require("Dimensions").get("window");
import Constants from '../../constants';
import moment from 'moment';

const DatepickerHeader = props => {
  const { title, dateTime, cancel, from , to , fromTime} = props;

  return (
    <View style={[styles.container]}>
      <View style={{flex:1,}}>
      <Text style={[Constants.Fonts.light]}>{title}</Text>   
      <View style={{flex:1,flexDirection:'row' , marginVertical:5 }}>
        { from &&  <Text style={[Constants.Fonts.regular,{marginLeft:0}]}> 
          From { moment(fromTime).format("MMM DD h:mm a") }
        </Text> }
        { to && 
          <Text style={[Constants.Fonts.regular,{marginLeft:7}]} > 
            To {moment(dateTime).format("MMM DD h:mm a") } 
          </Text> 
        }
      </View> 
      </View>
      <View style={{flex:1,alignItems:"flex-end"}}>
        <TouchableOpacity onPress={cancel}>
          <Text style={styles.buttonStyle}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View> 
  );
};
  

const styles = StyleSheet.create({
  loginButtonStyle: {
    borderWidth: 1,
    padding: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3.5,
    backgroundColor: Constants.Colors.actionButtonColor,
    borderColor: "transparent",
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 5,
    marginHorizontal:(Constants.BaseStyle.DEVICE_WIDTH/100)*10
  },
  buttonStyle:{
    ...Constants.Fonts.regular,
    color: Constants.Colors.actionButtonColor,
    paddingLeft:10,
  },

  shadow:{
    shadowColor:"gray",
    shadowOffset: {width: 2, height: 2},
    shadowOpacity:0.9,
    shadowRadius:10
  },

  container:{
    flex:1,flexDirection:"row", backgroundColor:Constants.Colors.tourBackground,padding:10,paddingBottom:0
  }

});

DatepickerHeader.PropTypes = {
  title: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  cancel: PropTypes.func, 
};

export default DatepickerHeader;
