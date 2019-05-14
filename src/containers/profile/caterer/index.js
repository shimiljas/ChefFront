import React, { Component } from 'react';
import { VirtualizedList, StyleSheet, View, Dimensions, Image, Text, Animated, TouchableOpacity } from 'react-native';
import Constants from "../../constants";
import Avatar from "../../components/common/Avatar";
import NavigationBar  from "react-native-navbar"

export default class Profile extends React.Component {
  
  constructor(props){
    super(props);
    console.log("Lazy Load not working");
  }

	static navigationOptions = {
	    tabBarIcon: ({ tintColor }) => (
	      <Image
	        source={Constants.Images.user.bottom_profile_active}
	        style={[styles.icon, {tintColor: tintColor}]}
	      />
	    ),  
  	}

  	render() {
      const titleConfig = {
        title: "Profile",
        tintColor: "#fff",
        style:{
          ...Constants.Fonts.content
        }
      };
    	return (
        <View style={styles.container}>
          <NavigationBar title={titleConfig} />
          <View>
            <Avatar 
              placeholderStyle = {styles.placeholderStyle}
              avatarStyle = {styles.avatarStyle}
              user={{name:"Manish Budhiraja",type:1}}/>
          </View>
        </View>
      )
  	}
}



const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  placeholderStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*12,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*12,
  },
  avatarStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*14,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*14,
  },
});