/**
 * @file: Avatar.js
 * @description: Back Button Module for Navigation Bar.
 * @date: 17.12.2016
 * @author: Manish Budhraja
 */

'use strict';

// Import React & React Native Components, JS Libraries, Other Libraries and Modules.

import React, { Component } from 'react';
import {
  Image,
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import Constants from '../../constants';
import Connection from '../../config/Connection';

export default class Avatar extends Component {

  constructor(props){
    super(props);
    this.avatarName = "";
    this.avatarColor = null;
  }

  renderAvatar(){
    let userPlaceholder = null;
    if(this.props.profile){
      return (
        <Image
          source={{uri:this.props.profile.uri}}
          style={[defaultStyles.avatarStyle, this.props.avatarStyle]}
        />
      );
    }

    if(this.props.user.profilePic===""){
      switch(this.props.user.role){
        case 0 :
          userPlaceholder = Constants.Images.user.customer;
        break;
        case 1 :
          userPlaceholder = Constants.Images.user.chef;
        break;
        case 2 :
          userPlaceholder = Constants.Images.user.caterer;
        break;
        default :
          userPlaceholder = Constants.Images.user.customer;
        break;
      }

      return(
        <View style={[{backgroundColor:Constants.Colors.Green,},defaultStyles.avatarStyle,this.props.avatarStyle]}>
          <Image
            resizeMode={"contain"}
            source={userPlaceholder}
            style={[defaultStyles.placeholderStyle ,this.props.placeholderStyle]}
          />
        </View>
      )
    }

    return (
      <Image
        source={{uri:Connection.getMedia(this.props.user.profilePic)}}
        style={[defaultStyles.avatarStyle, this.props.avatarStyle]}
      />
    );
  }

  renderInitials(){
    const userName = this.props.user.name || '';
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      this.avatarName = '';
    }

    return (
      <View style={[{backgroundColor:Constants.Colors.Green,},defaultStyles.avatarStyle]}
      >
        <Text style={[defaultStyles.textStyle,this.props.textStyle,]}>
          {this.avatarName}
        </Text>
      </View>
    );
  }

  render() {
    let img= null;
    return(
    <View>
      {this.renderAvatar()}
    </View>
    )
  }
}

const styles = StyleSheet.create({
  roundImage:{
    height:(Constants.BaseStyle.DEVICE_WIDTH/100)*10,
    width:(Constants.BaseStyle.DEVICE_WIDTH/100)*10,
    borderRadius:(Constants.BaseStyle.DEVICE_WIDTH/100)*5,
  }
});


const defaultStyles = {
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Constants.BaseStyle.DEVICE_WIDTH/100*14,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*14,
    borderRadius: Constants.BaseStyle.DEVICE_WIDTH/100*7,
  },
  textStyle: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent',
    fontWeight: '100',
  },
  placeholderStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*12,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*12,
    alignSelf:"center",
    borderRadius: Constants.BaseStyle.DEVICE_WIDTH/100*6,
    justifyContent: 'center',
  }
};

Avatar.defaultProps = {
  user: {
    name: null,
    avatar: null,
    image: null,
    role : 0,
    profilePic:""
  },
  avatarStyle: {},
  textStyle:{},
  placeholderStyle : {}
};

Avatar.propTypes = {
  user: React.PropTypes.object,
  avatarStyle: Image.propTypes.style,
  textStyle:  Text.propTypes.style,
  placeholderStyle : Image.propTypes.style,
};
