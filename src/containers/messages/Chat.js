/**
 * @file: Chat.js
 * @description: Messaging.
 * @date: 04.07.2017
 * @author: Manish Budhraja
 */

import React, { Component } from 'react';
import { ActivityIndicator, RefreshControl, FlatList, StyleSheet, View, Dimensions, Image, Text, Animated, TouchableOpacity } from 'react-native';
import Constants from "../../constants";
import NavigationBar  from "react-native-navbar"
import RecentChatList from "../../components/messages/RecentChatList";
import Idx from '../../utilities/Idx';
import ComingSoon from '../../components/common/ComingSoon';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as conversationsActions from '../../redux/modules/conversations';
import BackButton  from "../../components/common/BackButton";
import NoRecord from "../../components/common/NoRecord";
import { GiftedChat } from 'react-native-gifted-chat';
import { getSocketClient } from '../../utilities/SocketClient';
import Connection from "../../config/Connection";
import _ from 'lodash';
import moment from 'moment';

class Chat extends Component {
  
  constructor(props) {
    super(props);
    this.recevierId   = null;
    this.roomId       = null;
    this.roomData     = null;
    this.recevierName = '';
    this.getRoomDetails.bind(this)();
  }

  componentWillMount(){
    this.getMessages();
  }

  componentDidMount(){
    this.markRoomAsRead();
  }

  componentWillUnmount () {
    currentPage = null, currentRoom=null;
  }

  /**
  * @function : Get receiver id
  */
  getRoomDetails(){
    let context = this;
    currentPage = 'Chat';
    context.state = {
      messages : []
    }
    /**
    *  Get receiver details.
    */
    if (Idx(context.props, _ => _.navigation.state.params.receiverDetails)){
      context.recevierId = context.props.navigation.state.params.receiverDetails.receiverId;
      context.recevierName = context.props.navigation.state.params.receiverDetails.receiverName;
    }

    /**
    *  Get message history.
    */

    if (Idx(context.props, _ => _.navigation.state.params.roomData)){
      currentRoom = context.props.navigation.state.params.roomData._id;
      context.roomData = context.props.navigation.state.params.roomData;
      context.roomId = context.props.navigation.state.params.roomData._id;
      context.recevierId = context.roomData.userId;
      context.recevierName = context.roomData.name;
      let messagesList = context.props.navigation.state.params.messages;
      let messages = _.map(messagesList,(message,i)=>{
          if(context.roomData.userId === message.created_by){
            message.user = {
              _id : context.roomData.userId,
              name : context.roomData.name,
              avatar :context.roomData.icon!==''?Connection.getMedia(context.roomData.icon):'',
            }
          }else{
            message.user = {
              _id : context.props.user.userId,
              name : context.props.user.fullName,
              avatar :context.props.user.profilePic!==""?Connection.getMedia(context.props.user.profilePic):"",
            }
          }
          message.messageId = message._id;
          return message;
      });
      context.state = {
        messages : messages
      }
    }else{
      context.state = {
        messages : []
      }
    }
  }

  /*
  * @function : Get list of messages when coming from notifications page.
  */

  getMessages=()=>{
    currentPage = 'Chat';
    let context = this;
    if (Idx(context.props, _ => _.navigation.state.params.fromNotification)){
      let requestObject = {
        token : context.props.user.auth.token,
        userId : context.props.user.userId,
        notification : true,
        receiverId :context.props.navigation.state.params.receiverDetails.receiverId
      }
      context.props.conversationsActions.getChatHistory(requestObject,(data)=>{
        currentRoom=data.roomData._id;
        context.roomData = data.roomData;
        context.roomId = data.roomData._id;
        context.recevierId = data.roomData.userId;
        context.recevierName = data.roomData.name;
        let messagesList = data.messages;
        let messages = _.map(messagesList,(message,i)=>{
            if(context.roomData.userId === message.created_by){
              message.user = {
                _id : context.roomData.userId,
                name : context.roomData.name,
                avatar :context.roomData.icon!==''?Connection.getMedia(context.roomData.icon):'',
              }
            }else{
              message.user = {
                _id : context.props.user.userId,
                name : context.props.user.fullName,
                avatar :context.props.user.profilePic!==""?Connection.getMedia(context.props.user.profilePic):"",
              }
            }
            message.messageId = message._id;
            return message;
        });
        context.setState({
          messages : messages
        });
        context.setTimeout(()=>{
          context.markRoomAsRead();
        },500);
      });
    }
  }

  /**
  * @function : Mark chat room as read.
  */
  markRoomAsRead = () => {
    let context = this;
    if(context.roomId){
      getSocketClient().markRoomAsRead(context.roomId);
    }
  }

  /* *
   * @function: On Send Press
   * */

  onSend = (messages = [], imageUrl) => {
    let context = this;
    if(messages[0].text.trim().length>0){
      getSocketClient().sendMessage(context.recevierId, messages[0].text.trim(),context.roomId,function(roomId){
        context.roomId = roomId;
      });
    }
  }

  render() {
    let context = this;
    let { goBack } = this.props.navigation, messages=[]; 
    const titleConfig = {
      title: context.recevierName.capitalizeEachLetter(),
      tintColor: "#fff",
    };
    messages = [...context.state.messages];

    if(context.roomId && context.props.conversations[context.roomId] && context.props.conversations[context.roomId].messages){
      let latestMessages = Object.keys(context.props.conversations[context.roomId].messages).map((key)=> { 
        if(context.props.conversations[context.roomId].messages){
          let message = context.props.conversations[context.roomId].messages[key];
          if(context.props.conversations[context.roomId].userId === message.created_by){
            message.user = {
              _id : context.props.conversations[context.roomId].userId,
              name : context.props.conversations[context.roomId].name,
              avatar : context.props.conversations[context.roomId].icon!==''?
              Connection.getMedia(context.props.conversations[context.roomId].icon):"",
            }
          }else{
            message.user = {
              _id : context.props.user.userId,
              name : context.props.user.fullName,
              avatar : context.props.user.profilePic!==''?Connection.getMedia(context.props.user.profilePic):"",
            }
          }
          return message;
        }
      });
      messages = _.uniqBy([...messages, ...latestMessages],"messageId");
    }

    return (
     <View style={[styles.container]}>  
      <NavigationBar 
        title={titleConfig}
        leftButton={<BackButton onPress={()=>goBack()}/>}
      /> 
      <GiftedChat
        messages={messages.reverse()}
        onSend={context.onSend}
        senderId={{
          _id: this.props.user.userId, 
          avatar: Connection.getMedia(this.props.user.profilePic),
        }}
        user={{
          _id: this.props.user.userId, 
          avatar: Connection.getMedia(this.props.user.profilePic),
          name: context.props.user.fullName,
        }}
        primaryStyle={styles.primaryStyle}
        textInputStyle={styles.textInputStyle}
        navigation = {this.props.navigation}
      />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:Constants.Colors.Transparent,
    flex:1
  },
  primaryStyle:{
    backgroundColor: Constants.Colors.SettingLightGray,
    alignItems: 'center'
  },
  footerContainer: {
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: Constants.Colors.Gray,
  },
  textInputStyle:{
    color:Constants.Colors.Black,
    backgroundColor:Constants.Colors.White,
    padding:5,
    ...Constants.Fonts.normal,
  },
  photoview:{
    height:Constants.BaseStyle.DEVICE_WIDTH*1.5,
    width:Constants.BaseStyle.DEVICE_WIDTH,
  },
});

ReactMixin(Chat.prototype, TimerMixin);

const mapStateToProps = state => ({
  user : state.user.userDetails,
  conversations : state.conversations
});

const mapDisptachToProps = dispatch => ({
  conversationsActions : bindActionCreators(conversationsActions,dispatch),
});

export default connect(mapStateToProps, mapDisptachToProps)(Chat);