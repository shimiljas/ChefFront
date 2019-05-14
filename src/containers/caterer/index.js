import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import Constants from "../../constants";
import Background from '../../components/common/Background';
import NavigationBar  from "react-native-navbar";

export default class Chef extends Component {
  
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // Default Render Function
  render() {
    let { welcome, request, appointment, report, availability, messages, profile } = Constants.i18n.chef_caterer_dashboard;

    const titleConfig = {
      title: welcome,
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };

    return (
      <Background>
        <NavigationBar title={titleConfig} />
        <View>
          <View style={styles.box}>
            <TouchableOpacity activeOpacity={0.9} style={styles.boxLeftStyle}>
              <Image style={styles.requestIcon} source={Constants.Images.caterer.request}  />
              <Text style={styles.text}>{request}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.boxRightStyle}>
              <Image style={styles.appointmentIcon} source={Constants.Images.caterer.appointment}  />
              <Text style={styles.text}>{appointment}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <TouchableOpacity activeOpacity={0.9} style={styles.boxLeftStyle}>
              <Image style={styles.reportIcon} source={Constants.Images.caterer.request}  />
              <Text style={styles.text}>{report}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.boxRightStyle}>
              <Image style={styles.profileIcon} source={Constants.Images.caterer.profile}  />
              <Text style={styles.text}>{profile}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <TouchableOpacity activeOpacity={0.9} style={styles.boxLeftStyle}>
              <Image style={styles.availabilityIcon} source={Constants.Images.caterer.availability}  />
              <Text style={styles.text}>{availability}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.boxRightStyle}>
              <Image style={styles.messagesIcon} source={Constants.Images.caterer.messages}  />
              <Text style={styles.text}>{messages}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Background>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:null,
    width:null,
    resizeMode:'cover',
    marginTop:Constants.BaseStyle.DEVICE_WIDTH/100*10
  },
  box:{
    flexDirection:'row'
  },
  boxLeftStyle: {
    flex:1,
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*31.1,
    borderBottomWidth:.5,
    borderRightWidth:.5,
    borderColor:'rgba(255,255,255,.5)', 
    alignItems:'center', 
    justifyContent:'center'
  },
  boxRightStyle: {
    flex:1,
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*31.1,
    borderBottomWidth:.5,
    borderColor:'rgba(255,255,255,.5)', 
    alignItems:'center', 
    justifyContent:'center'
  },
  text: {
    color:Constants.Colors.Gray,
    backgroundColor:'transparent',
    ...Constants.Fonts.normal
  },
  requestIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*14,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  appointmentIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*12,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  profileIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*8,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  availabilityIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*13,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  reportIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*14,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  messagesIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*11.7,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  }
});