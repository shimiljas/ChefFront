import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import Constants from "../../constants";
import Avatar from "../../components/common/Avatar";
import moment from 'moment';

export default class RecentChatList extends React.Component {
  
  constructor(props){
    super(props);
  }
  
  // Default render function
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={()=>this.props.onPress(this.props.data)}>
        <View activeOpacity={0.9} style={styles.roomDetailsContainer}>
          <Avatar 
            user = {{profilePic:this.props.data.icon}}
            placeholderStyle = {styles.placeholderStyle}
            avatarStyle = {styles.avatarStyle}
          />
          {
            this.props.data.unreadCount>0 &&
            <View style={styles.notifyView}>
              <Text style={styles.notifyText}>
                {this.props.data.unreadCount>9?"9+":this.props.data.unreadCount}
              </Text>
            </View>
          }
          {
            this.props.data.unreadCount===0 ?
            <View style={{flex:8}}> 
              <Text style={styles.userName}>
                {this.props.data.name.capitalizeEachLetter()}
              </Text>
              <Text numberOfLines={1} style={styles.lastMessage}>
                {this.props.data.last_message}
              </Text>
            </View>
            :
            <View style={{flex:8,}}> 
              <Text style={styles.userName}>
                {this.props.data.name?this.props.data.name.split(" ")[0].capitalizeEachLetter():""}
              </Text>
              <Text numberOfLines={2} style={[styles.lastMessage,Constants.Fonts.tiny_bold]}>
                {this.props.data.last_message}
              </Text>
            </View>
          }
        </View>
        <View style={styles.timeContainer}>
          <Text numberOfLines={2} style={[styles.lastMessage]}>
            {moment(this.props.data.updated_at).format("DD MMM hh:mm A")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    borderBottomWidth:1,
    borderBottomColor:Constants.Colors.GhostWhite
  },
  roomDetailsContainer:{
    ...Platform.select({
      ios:{
       height:Constants.BaseStyle.DEVICE_HEIGHT/100*9
      },
      android:{
       height : Constants.BaseStyle.DEVICE_HEIGHT/100*11,
      }
    }),
    backgroundColor:Constants.Colors.Transparent,
    flexDirection:"row"
  },
  userName:{
    color:Constants.Colors.Black,
    ...Constants.Fonts.content,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2,
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  lastMessage:{
    color:Constants.Colors.LightBlack,
    ...Constants.Fonts.tiny,
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*3,
    marginRight:Constants.BaseStyle.DEVICE_WIDTH/100*4,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*0.5
  },
  avatarStyle:{
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2.5,
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*4
  },
  notifyView:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*4.5,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*4.5,
    borderRadius : Constants.BaseStyle.DEVICE_WIDTH/100*2.25,
    marginLeft:-Constants.BaseStyle.DEVICE_WIDTH/100*4,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2,
    backgroundColor:Constants.Colors.Magenta,
    overflow:"hidden",
    alignItems:"center",
    justifyContent:"center"
  },
  notifyText :{
    alignSelf:"center",
    color:"white",
    ...Constants.Fonts.tinyMedium
  },
  timeContainer:{
    alignSelf:"flex-end", 
    alignItems:"flex-end",
    paddingBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*0.5
  }
});