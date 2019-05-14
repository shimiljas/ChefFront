/*
 * @file: Cancelled.js
 * @description: Cancelled booking component for Cancelled booking screen
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

export default class Cancelled extends Component {
  constructor(props) {
    super(props);
  } 

  renderStatus(){
    return(
      <View style={styles.disputeContainerStyle}>
        <View style={{alignItems:"flex-end",justifyContent:"flex-end",}}>
          <Text style={[styles.disputeStyle2, this.props.disputeStyle]}>
            {"Refunded"}
          </Text>
        </View>
      </View>
    )
  }

  // Default render function
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
      disputeContainerStyle,
      disputeStyle
    } = this.props;
   
    return (
      <TouchableOpacity onPress={()=>{
        if(this.props.isChef){
          this.props.navigation.navigate('ViewRequest',this.props.data)
        }else{
          this.props.navigation.navigate('Request',this.props.data)
        }
      }} activeOpacity={0.9} style={[styles.mainContainerStyle, mainContainerStyle]}>
        <View style={[styles.profilePhotoContainerStyle, profilePhotoContainerStyle]}>
            { this.props.data.user != undefined ? <Avatar 
              user= {this.props.data.user}/> : null}
        </View>
        <View style={[styles.detailsContainerStyle, detailsContainerStyle]}>
          <View style={[styles.nameContainerStyle, nameContainerStyle]}>
            <Text numberOfLines={1} style={[styles.nameStyle, nameStyle]}>
              { this.props.data.user != undefined ? this.props.data.user.fullName.capitalizeEachLetter()  : null}
            </Text>
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
          {/*<View style={[styles.dateTimeContainerStyle, dateTimeContainerStyle]}>
            <Text style={[styles.dateTimeStyle, dateTimeStyle]}>
              {"Scheduled date: " + moment(this.props.data.starts_on,"x").format("DD MMM") }
            </Text>
          </View>*/}
          {
            this.props.data.hasOwnProperty("additionalCost") && this.props.data.additionalCost!==0 &&
            <View>
              <Text style={[styles.additionalCostStyle]}>
                {"Additional cost: $" + Regex.removeTrailingZeros(this.props.data.additionalCost)}
              </Text>
            </View>
          }
          <View style={[styles.dateTimeContainerStyle, dateTimeContainerStyle]}>
            <Text style={[styles.dateTimeStyle, dateTimeStyle]}>
              { "From " + moment(this.props.data.starts_on,"x").format("DD MMM hh:mm a") +
                " to " + moment(this.props.data.ends_on,"x").format("DD MMM hh:mm a")
              }
            </Text>
          </View>
          {
            this.props.data.status == 9 &&
            <View style={{alignItems:"flex-end"}}>
              {this.renderStatus()}
            </View>
          }
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
    //flex: 2,
    //borderWidth: 2
  },
  nameStyle: {
    ...Constants.Fonts.bold,
    color: Constants.Colors.Black,
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

Cancelled.defaultProps = {
  name: 'Johen Doe',
  payment: '10',
  rating: 4,
  date: '20 Feb',
  timeFrom: '4:00 PM',
  timeTo: '6:00 PM',
  disputeResolved: true
};

Cancelled.propTypes = {
};
