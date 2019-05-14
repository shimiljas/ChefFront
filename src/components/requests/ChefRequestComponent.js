/*
 * @file: ChefRequestComponent.js
 * @description: Component for chef request page.
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
  Dimensions
} from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import Constants from '../../constants';
import Background from '../../components/common/Background';
import * as bookingsActions from '../../redux/modules/bookings';
import Avatar from '../../components/common/Avatar';
import StarRating from '../../components/common/StarRating';
import BackButton from "../../components/common/BackButton";
import NavigationBar from "react-native-navbar"
import _ from "lodash";
import moment from "moment";

class SingleRequest extends Component {

  constructor(props) {
    super(props);
  }

  // Default render function
  render() {
    let { navigate } = this.props.navigation;
    return ( 
      <TouchableOpacity activeOpacity={0.9} style={styles.mainContainer} onPress={()=>navigate("ViewRequest",this.props.data)}>
        <View style={styles.AvatarContainer}>
          <View style={{paddingVertical:10}}>
            <Avatar 
              user={this.props.data.user}
              avatarStyle={styles.AvatarStyle}
              />          
          </View>  
        </View>
        <View style={{flex:3,flexDirection:'column'}}>
          <View style={{marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*1,}}>
            <Text style={{...Constants.Fonts.contentBold}}>
              {this.props.data.user.fullName.capitalizeEachLetter()}
            </Text>
          </View>
          <View> 
            <StarRating 
               rating={this.props.data.user.rating.avgRating} 
               editable={false}
               iconStyle={{
               height:Constants.BaseStyle.DEVICE_HEIGHT*1.8/100,
               width:Constants.BaseStyle.DEVICE_HEIGHT*1.8/100
               }} />
          </View>
          <View style={{marginRight:Constants.BaseStyle.DEVICE_HEIGHT/100*4}}>
            <Text style={styles.addressStyle}>
              {this.props.data.user.position.address}
            </Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.Gray}}>
              { "Time: From " + moment(this.props.data.starts_on,"x").format("DD MMM hh:mm a") +
              " to " + moment(this.props.data.ends_on,"x").format("DD MMM hh:mm a")
              }
            </Text>
          </View>
          {this.props.data.status ===1 &&
            <View style={styles.acceptRejectContainer}>
              <TouchableOpacity activeOpacity={0.9} onPress={this.props.onRequestAccept} >
                <Text style={{color:Constants.Colors.Green,...Constants.Fonts.bold}}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} onPress={this.props.onRequestReject} style={{marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*10}}>
                <Text style={{color:Constants.Colors.Magenta,...Constants.Fonts.bold}}>Reject</Text>
              </TouchableOpacity>
            </View>
          }
        </View>  
      </TouchableOpacity>
     );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    backgroundColor:Constants.Colors.White
    
  },
  bookNowText:{
    ...Constants.Fonts.bold,
    color:Constants.Colors.Magenta,
  },
  AvatarStyle:{
    marginLeft:15,
    //height:Constants.BaseStyle.DEVICE_HEIGHT/100*9,
    //width:Constants.BaseStyle.DEVICE_HEIGHT/100*9,
    //borderRadius:100
  },
  mainContainer:{
    flexDirection:'row',
    paddingBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*2,
    borderBottomWidth:0.5,borderColor:Constants.Colors.Gray ,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2
  },
  AvatarContainer:{
    flex:0.8,
    marginRight:Constants.BaseStyle.DEVICE_WIDTH/100*2,
    marginTop:Constants.BaseStyle.DEVICE_WIDTH/100*2
  },
  addressStyle:{
    ...Constants.Fonts.tinyLarge,
    marginVertical:Constants.BaseStyle.DEVICE_HEIGHT/100*1,
    color:Constants.Colors.Gray
  },
  acceptRejectContainer:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginRight:Constants.BaseStyle.DEVICE_WIDTH/100*5,
    marginTop:Constants.BaseStyle.DEVICE_WIDTH/100*2
  }
});

SingleRequest.defaultProps = {
  fullName: '',
  rating: 0,
  address: '',
  date: '',
  timeFrom: '',
  timeTo: '',
};

const mapDispatchToProps = dispatch => ({
  bookingsActions: bindActionCreators(bookingsActions, dispatch),
});

export default connect(null, mapDispatchToProps)(SingleRequest);