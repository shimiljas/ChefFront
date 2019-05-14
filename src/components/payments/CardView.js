import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform
} from "react-native";
import Constants from "../../constants";
import Avatar from "../common/Avatar";
import StarRating from "../common/StarRating";
import NavigationBar from "react-native-navbar";
import TextField from "../common/TextField";
import ComingSoon from "../common/ComingSoon";
import _ from "lodash";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../redux/modules/user";
import Idx from "../../utilities/Idx";
import CardIcons from "../../utilities/CardIcons";

export default class CardView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let context = this;
    let {
      cardNumber,
      cardHolder,
      expiry,
      cvv,
    } = Constants.i18n.payments;
    return (
      <View style={styles.container}>
        <View style={styles.customStyle}>
          <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
            <View style={{flex:5,}}>
              <TouchableOpacity style={{
                width:Constants.BaseStyle.DEVICE_WIDTH/100*30
              }} onPress={this.props.setDefaultCard} activeOpacity={0.9}>
                {
                  this.props.data.cardId!=this.props.defaultCard?
                  <Text style={Constants.Fonts.normal}>
                    {"Set as default"}
                  </Text>
                  :
                  <Text style={styles.defaultCard}>
                    {"Default"}
                  </Text>
                }
              </TouchableOpacity>
            </View>
            <View style={{flex:5,alignItems:"flex-end"}}  >
              <TouchableOpacity style={{
                width:Constants.BaseStyle.DEVICE_WIDTH/100*30,
              }} activeOpacity={0.9} onPress={this.props.onRemovePress}>
                <Text style={{...Constants.Fonts.normal,alignSelf:"flex-end"}}>Remove Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
         <View style={{flexDirection:'row',justifyContent:"center",alignSelf:"center"}}>
          <View  style={[styles.customStyle1,{backgroundColor:'#003334',borderRadius:5}]}>
            
            <View style={{flex:1,height:Constants.BaseStyle.DEVICE_HEIGHT/100*30,width:Constants.BaseStyle.DEVICE_WIDTH/100*80,}}>
              <View style={{flexDirection:'row',marginTop:10,marginRight:15}}>
                <View style={{flex:1 ,flexDirection:'row',justifyContent:'flex-end'}}>
                  <Image style={styles.icon} source={{uri:CardIcons[this.props.data.brand.toLowerCase()]}} />
                </View>   
              </View>

              <View style={{flexDirection:'column',justifyContent:'flex-start',marginHorizontal:15}}>
                <Text style={{color:Constants.Colors.White,...Constants.Fonts.tinyLarge,top:0,}}>{cardNumber}</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:Constants.BaseStyle.DEVICE_WIDTH/100*2,marginTop:Constants.BaseStyle.DEVICE_WIDTH/100*2.5}} >
                  <Text style={styles.cardNumber}>{"XXXX"}</Text>
                  <Text style={styles.cardNumber}>{"XXXX"}</Text>
                  <Text style={styles.cardNumber}>{"XXXX"}</Text>
                  <Text style={styles.cardNumber}>{this.props.data.last4.toUpperCase()}</Text>
                </View>
              </View>

              <View style={{
                justifyContent:"space-between",
                marginTop:Platform.OS==="ios"?Constants.BaseStyle.DEVICE_WIDTH/100*10:Constants.BaseStyle.DEVICE_WIDTH/100*5,
                marginBottom:Platform.OS==="ios"?Constants.BaseStyle.DEVICE_WIDTH/100*10:Constants.BaseStyle.DEVICE_WIDTH/100*5,
                flexDirection:"row",
                marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4
              }}>
                <View style={{flexDirection:'column',alignSelf:'flex-start',}}>
                  <Text style={{color:Constants.Colors.White,...Constants.Fonts.tinyLarge}}>{cardHolder}</Text>
                  <Text style={{color:Constants.Colors.White,paddingTop:3,...Constants.Fonts.normal}}>
                    {this.props.userDetails.fullName.capitalizeEachLetter()}
                  </Text>
                </View>
                <View style={{flexDirection:'column',alignSelf:'flex-end',}}>
                  <Text style={{color:Constants.Colors.White,...Constants.Fonts.tinyLarge}}>{expiry}</Text>
                  <Text style={{color:Constants.Colors.White,paddingTop:3,...Constants.Fonts.normal}}>
                    { this.props.data.exp_month.toString().length!==1?this.props.data.exp_month:"0"+this.props.data.exp_month+ "/" +  this.props.data.exp_year.toString().substring(0,2)}
                  </Text>
                </View>
              </View>
            </View>   
          </View>
        </View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.White,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
    paddingBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*2, 
  },
  innerContainer:{
  	flex: 1,
    backgroundColor: Constants.Colors.White,
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*2, 
  },
  customStyle:{ 
  	flexDirection:'row' , flex:1,
  	marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*8, 
  	marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2,
  },
  customStyle1:{ 
  	flexDirection:'row' , flex:1,
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*8, 
  	marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2,
    shadowColor:Constants.Colors.Gray,
    shadowOffset:{
      width: 4, 
      height: 4
    },
    shadowOpacity:0.7,
    marginBottom:10
  },	
  cardNumber:{
    color:Constants.Colors.White,
    ...Constants.Fonts.content_bold,
    letterSpacing:2
  },
  icon: {
    right: 0,
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  defaultCard:{
    ...Constants.Fonts.bold,
    color:Constants.Colors.Magenta
  }
});