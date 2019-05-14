/*
 * @file: Notifications.js
 * @description: Notification View.
 * @date: 24.08.2017
 * @author: Manish Budhiraja
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
  Listview,
  FlatList
} from 'react-native';
import Constants from '../../constants';
import BackButton  from "../../components/common/BackButton";
import NavigationBar  from "react-native-navbar";
import Avatar from '../../components/common/Avatar'
import moment from 'moment';

class NotificationItem extends Component {

  constructor(props) {
    super(props);
  }

  /*Blur the fontcolor based on attribute  */
  colorText = (options)=> {
    if(options==1){
      return {color: Constants.Colors.Black}
    }
    else{
      return {color: Constants.Colors.Gray}
    }
  }
  
  /*change the backgroundcolor based on attribute  */    
  colorBackgroud=(options)=>{
    if(options==1) {
      return {backgroundColor: Constants.Colors.White}
    } else {
      return {backgroundColor: Constants.Colors.SmokeWhite}
    }
  }

  /*change the backgroundcolor based on attribute  */    
  timerColor=(options)=>{
    if(options==1){
      return {color: Constants.Colors.Black}
    }
    else{
      return {color: Constants.Colors.Gray}
    }
  }

  /**
  * Get based on their role and type of notification.
  */
  getText(q) {
    if(this.props.isChef){
      /**
      * Chef View
      */
      switch(this.props.rowData.type.toLowerCase().trim()) {
        case "request":
          return " has requested booking from ";
        
        case "declination":
          return " has declined your booking request from ";
        
        case 'acceptance':
          return " has accepted your booking request from ";
        
        case "autocomplete":
          return "Booking has been completed.";
        
        case "autorelease":
          return " has released payment for your booking from ";
        
        case "cancellationacceptance":
          return " has accepted your cancellation request from ";

        case "cancellation":
          return " has canceled booking request from ";

        case "hired":
          return " has hired you for booking from ";

        case "paymentreleased":
          return " has released payment for your booking from ";
        
        case "consumerdispute":
          return " has raised a dispute for booking from ";
        
        case "raisecancellation":
          return " has cancelled booking from ";
        
        case "acceptancecancellationreq":
          return " has accepted your booking cancellation request from ";
        
        case "dispute":
          return " has raised a dispute for booking from ";
        
        case "rating":
          return this.props.rowData.user.fullName.capitalizeEachLetter() + " has given you rating.";

        default:
          return " ";
      }
    }else{
      /**
      * Consumer View
      */
      switch(this.props.rowData.type.toLowerCase().trim()) {
        case 'acceptance':
          return " has accepted your booking request from ";
        
        case 'cancellation':
          return " has requested to cancel your booking from ";
        
        case 'declination':
          return " has declined your booking request from ";
        
        case "autocomplete":
          return "Booking has been completed.";
        
        case "raisecancellation":
          return "has requested to cancel the booking request from ";

        case "dispute":
          return " has raised a dispute for booking from ";
        
        case "closingdispute":
          return " has agreed and closed the dispute raised for booking from ";
        
        case "paymentreleased":
          return "Payment released to chef.";
        
        case "acceptancecancellationreq":
          return " has requested to cancel booking from ";

        case "rating":
          return this.props.rowData.user.fullName.capitalizeEachLetter() + " has given you rating.";

        case "autorelease":
          return "Payment has been auto released to chef for your booking.";

        case "refundoncancellation":
          return "Refund has been credited to your bank account.";

        case "partialrefundoncancellation":
          return "Refund has been credited to your bank account.";

        default: 
          console.log("Ravan => ", this.props.rowData.type.toLowerCase() == " autorelease", q, !this.props.isChef)
          return " ";
      }
    }
  }


  render() {
    let context = this;
    let { navigate, goBack } = this.props.navigation; 
    return (
      <TouchableOpacity activeOpacity={0.9} onPress = {this.props.onPress}
        style={[styles.rowContainer,this.colorBackgroud(this.props.rowData.status)]}
      >
        <View style={styles.leftImageBox}>
          <Avatar user ={this.props.rowData.user}/>
        </View>
        <View style={styles.rightImageBox}>
          {
            (this.props.rowData.type.toLowerCase()=="autocomplete" || 
              this.props.rowData.type.toLowerCase()=="rating" || 
              (this.props.rowData.type.toLowerCase().trim()=="autorelease" && !this.props.isChef) ||
              (this.props.rowData.type.toLowerCase()=="refundoncancellation" && !this.props.isChef) ||
              (this.props.rowData.type.toLowerCase()=="partialrefundoncancellation" && !this.props.isChef) || 
              (this.props.rowData.type.toLowerCase()=="paymentreleased" && !this.props.isChef)) ?
              <View style={{}}>
                <Text style={[styles.lastTextItem,this.colorText(this.props.rowData.status)]}>
                  {this.getText(1)}
                </Text>
              </View>
            :
            <View style={styles.topTextRight}>
              <Text style={styles.textRightAbove}>
                <Text style={[styles.lastTextItemBold,this.timerColor(this.props.rowData.status)]}>
                  {this.props.rowData.user.fullName.capitalizeEachLetter()}
                </Text>
                <Text style={[styles.lastTextItem,this.colorText(this.props.rowData.status)]}>
                  {this.getText(2)}
                </Text>
                <Text style={[styles.lastTextItemBold,this.timerColor(this.props.rowData.status)]}>
                  {this.props.rowData.bookingDetails?
                    moment(this.props.rowData.bookingDetails.starts_on).format("DD MMM hh:mm A"):""
                  }
                </Text>
                <Text style={[styles.lastTextItem,this.colorText(this.props.rowData.status)]}> to </Text>
                <Text style={[styles.lastTextItemBold,this.timerColor(this.props.rowData.status)]}>
                  { this.props.rowData.bookingDetails ? 
                    moment(this.props.rowData.bookingDetails.ends_on).format("DD MMM hh:mm A") : ""
                  }
                </Text>
                <Text>.</Text>
                { /*
                  <Text style={[styles.lastTextItem,this.colorText(this.props.rowData.status)]}>
                    {(this.props.rowData.bookingDetails && 
                                      this.props.rowData.bookingDetails.position &&
                                      this.props.rowData.bookingDetails.position.address)?
                    " at " +this.props.rowData.bookingDetails.position.address.capitalizeFirstLetter():""}
                  </Text>
                  */
                }
              </Text>
            </View>
          }
          <View style={styles.lastText}>
            <Text style={[styles.lastTextBelow,{color : this.props.rowData.status===1 ? Constants.Colors.Gray : Constants.Colors.BlurGrey}]}>
              {moment(this.props.rowData.createdAt).format("DD MMM") +" at " + moment(this.props.rowData.createdAt).format("hh:mm A") }
            </Text>
          </View>
        </View> 
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer:{
    borderBottomWidth:0.5,
    borderBottomColor : Constants.Colors.Gray,
    flex : 1,
    flexDirection :'row',
    paddingVertical:Constants.BaseStyle.DEVICE_HEIGHT/100*3,
    paddingHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  leftImageBox:{
    flex : 0.2,
    justifyContent :'center',
    alignItems :'center'
  },
  rightImageBox:{
    flex : 0.8,
    flexDirection :'column',
    marginLeft:5
  },
  topTextRight:{
    flex : 0.7,
    justifyContent : "flex-end"
  },
  textRightAbove:{
    ...Constants.Fonts.normal
  },
  arrow:{
    height: Constants.BaseStyle.DEVICE_WIDTH/100*4,
    width: Constants.BaseStyle.DEVICE_WIDTH/100*3,
    paddingRight : Constants.BaseStyle.DEVICE_WIDTH/100*5
  },
  lastText:{
    flex : 0.3
  },
  lastTextItem:{
    ...Constants.Fonts.mediumSize
  },
  lastTextItemBold:{
    ...Constants.Fonts.mediumSizeBold
  },
  lastTextBelow:{
    ...Constants.Fonts.smallSize,
    color: Constants.Colors.Gray
  }
});

export default NotificationItem;