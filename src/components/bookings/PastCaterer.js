/*
 * @file: PastCaterer.js
 * @description: Past Caterer booking component for Past booking screen
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

export default class PastCaterer extends Component {
  constructor(props) {
    super(props);

  }

  // Function raises dispute
  // raiseResolvesDispute() {
  //   this.setState({disputeResolved: !this.props.disputeResolved})
  // }

  // Default render function
  render() {
    let {
      mainContainerStyle,
      profilePhotoContainerStyle,
      profilePhotoStyle,
      detailsContainerStyle,
      nameContainerStyle,
      nameStyle,
      paymentContainerStyle,
      paymentStyle,
      ratingContainerStyle,
      dateTimeContainerStyle,
      dateTimeStyle,
      disputeContainerStyle,
      disputeStyle,
      addressContainerStyle,
      addressStyle
    } = this.props;

    return (
      <TouchableOpacity activeOpacity={0.9} style={[styles.mainContainerStyle, mainContainerStyle]}>
        <View style={[styles.profilePhotoContainerStyle, profilePhotoContainerStyle]}>
            <Avatar />
            <StarRating
              rating={this.props.rating}
              editable={false}
              style={{
                paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
              }}
              iconStyle={{
                height: Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,
                width: Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,
              }}
              onRate={(value)=>{
                this.setState({rating: value});
                //console.log("$$$$", this.props.rating)
              }}
            />
        </View>

        <View style={[styles.detailsContainerStyle, detailsContainerStyle]}>

          <View style={[styles.nameContainerStyle, nameContainerStyle]}>
            <Text style={[styles.nameStyle, nameStyle]}>
              {this.props.name}
            </Text>
          </View>

          <View style={[styles.addressContainerStyle, addressContainerStyle]}>
            <Text style={[styles.addressStyle, addressStyle]}>
              {this.props.address}
            </Text>
          </View>

          <View style={[styles.paymentContainerStyle, paymentContainerStyle]}>
            <Text style={[styles.paymentStyle, paymentStyle]}>
              Received: <Text style={{color: Constants.Colors.Black}}>${this.props.payment}</Text>
            </Text>
          </View>

          <View style={[styles.dateTimeContainerStyle, dateTimeContainerStyle]}>
            <Text style={[styles.dateTimeStyle, dateTimeStyle]}>
              {this.props.date}. {this.props.timeFrom} to {this.props.timeTo}
            </Text>
          </View>

          <View
            //onPress={()=>this.raiseResolvesDispute()}
            style={[styles.disputeContainerStyle, disputeContainerStyle]}
          >
            <View>
              <Image
                style={[{height: 15, width: 15}, profilePhotoStyle]}
                source={Constants.Images.caterer.dispute}
              />
            </View>
            <View>
              <Text style={[styles.disputeStyle, disputeStyle]}>
                {this.props.disputeResolved ? "Dispute Resolved" : "Dispute raised"}
              </Text>
            </View>
          </View>

        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    //flex: 1,
    flexDirection: 'row',
    backgroundColor: Constants.Colors.White,
    borderBottomColor: Constants.Colors.Gray,
    borderBottomWidth: 0.5,
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
  nameContainerStyle: {
    //flex: 2,
    //borderWidth: 2
  },
  nameStyle: {
    ...Constants.Fonts.bold,
    color: Constants.Colors.Black,
  },
  paymentContainerStyle: {
    //flex: 1,
    //alignItems: 'flex-end',
    //borderWidth: 2
  },
  paymentStyle: {
    ...Constants.Fonts.tiny,
    color: Constants.Colors.Gray,
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100
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
    color: Constants.Colors.Black,
  },
  disputeContainerStyle: {
    //flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100
    //borderWidth: 2,
  },
  disputeStyle: {
    ...Constants.Fonts.tiny,
    paddingLeft: Constants.BaseStyle.DEVICE_WIDTH*1/100,
    color: Constants.Colors.Black,
  },
  addressContainerStyle: {
    //borderWidth: 2
  },
  addressStyle: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Gray,
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100
  }
});

PastCaterer.defaultProps = {
  name: 'Jhony Livas',
  rating: 3,
  address: '32 Crown Street, near Hotel Grandeur',
  payment: '10',
  date: '20 Feb',
  timeFrom: '4:00 PM',
  timeTo: '6:00 PM',
  disputeResolved: true
};

PastCaterer.propTypes = {
};
