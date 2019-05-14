/*
 * @file: Active.js
 * @description: Active booking component for Active booking screen
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
import moment from 'moment';
import Regex from '../../utilities/Regex';

export default class Active extends Component {
  constructor(props) {
    super(props);
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
      additionalCostContainerStyle,
      additionalCostStyle,
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
      }} 
        activeOpacity={0.9} style={[styles.mainContainerStyle, mainContainerStyle]}>
        <View style={[styles.profilePhotoContainerStyle, profilePhotoContainerStyle]}>
          {this.props.data.user != undefined ? <Avatar 
            user = {this.props.data.user}/> : null}
        </View>

        <View style={[styles.detailsContainerStyle, detailsContainerStyle]}>
          <View style={[styles.namePaymentContainerStyle, namePaymentContainerStyle]}>
            <View style={[styles.nameContainerStyle, nameContainerStyle]}>
              <Text style={[styles.nameStyle, nameStyle]}>
                {this.props.data.user !== undefined ? this.props.data.user.fullName.subStringName().capitalizeEachLetter() : null}
              </Text>
            </View>
            {
              <View style={[styles.paymentContainerStyle, paymentContainerStyle]}>
              <Text style={[styles.paymentStyle, paymentStyle]}>
                {"$" + this.props.data.ratePerHour?this.props.data.ratePerHour:""}
              </Text>
              <Text style={{top: Constants.BaseStyle.DEVICE_HEIGHT*0.5/100, ...Constants.Fonts.tiny, color: Constants.Colors.Gray}}>
                {"/hr"}
              </Text>
            </View>
            }
          </View>

          {
            this.props.data.hasOwnProperty("additionalCost") && this.props.data.additionalCost!==0 &&
            <View>
              <Text style={[styles.additionalCostStyle, additionalCostStyle]}>
                {"Additional cost: $" + Regex.removeTrailingZeros(this.props.data.additionalCost)}
              </Text>
            </View>
          }

          {/*<View style={[styles.dateTimeContainerStyle, dateTimeContainerStyle]}>
            <Text style={[styles.dateTimeStyle, dateTimeStyle]}>
              {"Date: " + moment(this.props.data.starts_on,"x").format("DD MMM") }
            </Text>
          </View>*/}

          <View style={[styles.dateTimeContainerStyle, dateTimeContainerStyle]}>
            <Text style={[styles.dateTimeStyle, dateTimeStyle]}>
              { "From " + moment(this.props.data.starts_on,"x").format("DD MMM hh:mm a") +
                " to " + moment(this.props.data.ends_on,"x").format("DD MMM hh:mm a")
              }
            </Text>
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
    height: Constants.BaseStyle.DEVICE_HEIGHT*3.5/100,
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  paymentStyle: {
    ...Constants.Fonts.normal,
    color: Constants.Colors.Gray,
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
  dateTimeContainerStyle: {
    //flex: 1,
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100
    //borderWidth: 2,
  },
  dateTimeStyle: {
    ...Constants.Fonts.tiny,
    color: Constants.Colors.Gray,
  },
});

Active.defaultProps = {
  name: 'Johen Doe',
  payment: '07',
  additionalCost: '30',
  date: '20 Feb',
  timeFrom: '4:00 PM',
  timeTo: '6:00 PM',
  activeChef: true
};

Active.propTypes = {
};
