/*
 * @file: PastChef.js
 * @description: Past Chef booking component for Past booking screen
 * @date: 13.07.2017
 * @author: Vishal Kumar
 * */

'use-strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import Constants from '../../constants';
import Avatar from '../common/Avatar';
import StarRating from '../common/StarRating';
import moment from 'moment';
import Regex from '../../utilities/Regex';

export default class PastChef extends Component {
  constructor(props) {  
    super(props);
  }

  renderDispute(){
    return(
      <View style={styles.disputeContainerStyle}>
        {(this.props.data.status == 7  || this.props.data.status == 10) &&
          <View style={{alignSelf:"flex-end"}}>
            <Image
              style={[{height: 15, width: 15, alignSelf:"flex-end",}, this.props.profilePhotoStyle]}
              source={Constants.Images.caterer.dispute}
            />
          </View>
        }
        <View style={{alignItems:"flex-end",justifyContent:"flex-end",}}>
           {this.props.data.status == 7 && 
            <Text style={[styles.disputeStyle, this.props.disputeStyle]}>
              Dispute Raised
            </Text>
           }
           {this.props.data.status == 8 &&  
            <Text style={[styles.disputeStyle2, this.props.disputeStyle]}>
              Refunded
            </Text>
          }
          {this.props.data.status == 10 && 
            <Text style={[styles.disputeStyle, this.props.disputeStyle]}>
              Dispute Resolved
            </Text>
          }
        </View>
      </View>
    )
  }
  
  PastBookingDetailChef(){
    if(this.props.data.user !== undefined && this.props.data.user.role == 1){
    this.props.navigation.navigate("PastBookingDetails", { 
      data : this.props.data,
      callBack : this.props.callBack
    })
    }
    else if(this.props.data.user !== undefined && this.props.data.user.role == 0){
    this.props.navigation.navigate("PastBookingDetailChef", { 
      data : this.props.data,
      callBack : this.props.callBack
    })
    }
  }

  renderAmount(){
    if(this.props.data.user && this.props.data.user.role==0){
      let { status } = this.props.data;
      if(status==6 || status==7  || status==11 ){
        let cost = (this.props.data.totalCost - this.props.data.adminCost).toFixed(2)
       return "$"+ Regex.removeTrailingZeros(cost);   
      }else{
        return this.props.data && this.props.data.refundAmount ? "$"+ Regex.removeTrailingZeros(this.props.data.refundAmount.toFixed(2)) : ""; 
      }
    }else{
      let { status } = this.props.data;
      if(status==6 || status==7  || status==11 ){
        return "$"+ Regex.removeTrailingZeros(this.props.data.totalCost.toFixed(2)); 
      }else{
        return this.props.data && this.props.data.refundAmount ? "$" + Regex.removeTrailingZeros(this.props.data.refundAmount.toFixed(2)):""; 
      }
    }
  }

  renderAmountHeader(role){
    switch(this.props.data.status){
      case 6:
      return role==1 ? "Refunded" :"Earning";
      case 7:
      return "On hold";
      case 8:
      return "Refunded";
      case 9:
      return "Refunded";
      case 10:
      return "Refunded";
      case 11:
      return role==1 ? "Payable" :"Earning";
    }
  }

  render() {
    let {
      mainContainerStyle,
      profilePhotoContainerStyle,
      profilePhotoStyle,
      detailsContainerStyle,
      namePaymentContainerStyle,
      nameContainerStyle,
      nameStyle,
      paymentContainerStyle,
      paymentStyle,
      ratingContainerStyle,
      dateTimeContainerStyle,
      dateTimeStyle,
      disputeStyle
    } = this.props;

    return (
      <TouchableOpacity onPress={()=>{this.PastBookingDetailChef()}} activeOpacity={0.9} style={[styles.mainContainerStyle, mainContainerStyle]}>
        <View style={[styles.profilePhotoContainerStyle, profilePhotoContainerStyle]}>
            <Avatar user = {this.props.data.user} />
        </View>

        <View style={[styles.detailsContainerStyle, detailsContainerStyle]}>
          <View style={[styles.namePaymentContainerStyle, namePaymentContainerStyle]}>
            <View style={[styles.nameContainerStyle, nameContainerStyle]}>
              <Text style={[styles.nameStyle, nameStyle]}>
                {this.props.data.user != undefined ? this.props.data.user.fullName.subStringName().capitalizeEachLetter() : null}
              </Text>
            </View>
            <View style={[styles.paymentContainerStyle, paymentContainerStyle]}>
              {this.props.data.user!= undefined && this.props.data.user.role === 0?
                <Text style={[styles.paymentStyle, paymentStyle]}>
                  <Text style={{...Constants.Fonts.tiny}}>
                  {this.renderAmountHeader(this.props.data.user.role)}</Text> {this.renderAmount()}
                </Text>
                :
                <Text style={[styles.paymentStyle, paymentStyle]}>
                  <Text style={{...Constants.Fonts.tiny}}>
                  {this.props.data && this.props.data.user && this.props.data.user.role ? 
                    this.renderAmountHeader(this.props.data.user.role) : null}</Text> {this.renderAmount()}
                </Text>
              }
            </View>
          </View>

          <View style={[styles.ratingContainerStyle, ratingContainerStyle]}>
            { this.props.data.user && this.props.data.user.rating &&
              <StarRating
                rating={this.props.data.user.rating.avgRating}
                editable={false}
                iconStyle={{
                  height: Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,
                  width: Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,
                }}
              />
            }
          </View>
          {
            this.props.data.hasOwnProperty("additionalCost") && this.props.data.additionalCost!==0 &&
            <View>
              <Text style={[styles.additionalCostStyle]}>
                {"Additional cost: $" + Regex.removeTrailingZeros(this.props.data.additionalCost)}
              </Text>
            </View>
          }
          {/*<View style={[styles.dateTimeContainerStyle, dateTimeContainerStyle]}>
            <Text style={[styles.dateTimeStyle, dateTimeStyle]}>
              {"Date: " +  moment(this.props.data.starts_on,"x").format("DD MMM")}
            </Text>
          </View>*/}

          <View style={[styles.dateTimeContainerStyle, dateTimeContainerStyle]}>
            <Text style={[styles.dateTimeStyle, dateTimeStyle]}>
              { "From " + moment(this.props.data.starts_on,"x").format("DD MMM hh:mm a") +
                " to " + moment(this.props.data.ends_on,"x").format("DD MMM hh:mm a")
              }
            </Text>
          </View>

          <View style={{alignItems:"flex-end"}}>
            {this.renderDispute()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flexDirection: 'row',
    backgroundColor: Constants.Colors.White,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
  },
  profilePhotoContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: Constants.BaseStyle.DEVICE_WIDTH*3/100,
    //borderWidth: 2
  },
  profilePhotoStyle: {
    height: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    width: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    borderRadius: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
  },
  detailsContainerStyle: {
    flex: 4,
    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2.5/100
    //borderWidth: 2
  },
  namePaymentContainerStyle: {
    //flex: 1,
    flexDirection: 'row',
    //borderWidth: 2
  },
  nameContainerStyle: {
    flex: 2,
    //borderWidth: 2
  },
  nameStyle: {
    ...Constants.Fonts.bold,
    color: Constants.Colors.Black,
  },
  paymentContainerStyle: {
    flex: 2,
    alignItems: 'flex-end',
    //borderWidth: 2
  },
  paymentStyle: {
    ...Constants.Fonts.normal,
    color: Constants.Colors.Gray,
  },
  ratingContainerStyle: {
    //flex: 1,
    //justifyContent: 'center',
    //backgroundColor: 'red',
    //borderWidth: 2,
  },
  dateTimeContainerStyle: {
    //flex: 1,
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100
    //borderWidth: 2,
  },
  dateTimeStyle: {
    ...Constants.Fonts.tiny,
    color: Constants.Colors.Gray,
  },
  disputeContainerStyle: {
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
    flexDirection :"row",
    alignSelf:"flex-end",
  },
  disputeStyle: {
    ...Constants.Fonts.tiny,
    paddingLeft: Constants.BaseStyle.DEVICE_WIDTH*1/100,
    color: Constants.Colors.Black,
    alignSelf:"flex-end",
    width: Constants.BaseStyle.DEVICE_WIDTH*28/100,
  },
  disputeStyle2: {
    ...Constants.Fonts.tiny,
    paddingLeft: Constants.BaseStyle.DEVICE_WIDTH*1/100,
    paddingRight :  Constants.BaseStyle.DEVICE_WIDTH*1/100,
    color: Constants.Colors.Black,
    alignSelf:"flex-end",
  },
  additionalCostContainerStyle: {
    //flex: 1,
    //paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100
    //justifyContent: 'center',
    //backgroundColor: 'red',
    //borderWidth: 2,
  },
  additionalCostStyle: {
    ...Constants.Fonts.tiny,
    color: Constants.Colors.LightGray,
  },
});

PastChef.defaultProps = {
  name: 'Johen Doe',
  payment: '10',
  rating: 4,
  date: '20 Feb',
  timeFrom: '4:00 PM',
  timeTo: '6:00 PM',
  disputeResolved: false
};

PastChef.propTypes = {
};
