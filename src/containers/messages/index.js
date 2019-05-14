/*
 * @file: index.js
 * @description: Messages screen.
 * @date: 04.08.2017
 * @author: Vishal Kumar
 * */

'use strict';

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
import * as userActions from '../../redux/modules/user';
import * as conversationActions from '../../redux/modules/conversations';
import BackButton  from "../../components/common/BackButton";
import NoRecord from "../../components/common/NoRecord";

class Messages extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      isRefreshing:false,
      totalRecords:0,
      skip:0,
      dataSource:[]
    }
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.isLoggedIn = false;

    if(Idx(this.props,_ => _.user.userDetails.auth.token)){
      this.isLoggedIn = true;
    }

  }

	static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={Constants.Images.user.bottom_messages_active}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),  
  }

  // Function takes to chat screen of a particular user
  onPress = (data)=>{
    let context = this, messages=[];
    context.props.conversationActions.getChatHistory({
      token: this.props.user.userDetails.auth.token,
      userId: this.props.user.userDetails.userId,
      receiverId: data.userId,
    });
  }

  /**
  * Render FlatList Items
  */
  renderItem=({item, index})=>{
    let context=this;
    return(
      <RecentChatList 
        key={index}
        data={item}
        onPress={this.onPress.bind(this, item)}
      />
    );
  }
    
  /**
  * Render FlatList Footer
  */
  renderFooter = () => {
    let context=this;
    return (
      context.state.footerVisible &&
      <View style={styles.paginationView}>
        <ActivityIndicator 
          style={{alignSelf:"center"}} 
          size={"large"} 
          color={Constants.Colors.Green}
        />
      </View>
    );
  };

  /**
  * FlatList Load More
  */
  onEndReached = () => {
    let context=this;
    if(context.state.dataSource.length >= 10 && context.state.skip<context.state.totalRecords){
      context.setState({
        footerVisible:true,
        isRefreshing:false,
      });
    }
  };

  /**
  * Pull to Refresh
  */
  onRefresh = () => {
    let context=this;
    let skip=0;
    context.setState({
      isRefreshing: true,
      footerVisible: false,
      dataSource: this.state.dataSource
    });

    setTimeout(function(){
      context.setState({isRefreshing: false})
    }, 2000);
  };

  /**
  * Extract Item Key
  */
  _keyExtractor = (item, index) => item.roomId;

  // Default render function
  render() {
    let context = this;
    let { navigate, state, goBack } = this.props.navigation;
    const titleConfig = {
      title: "Messages",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };


    let conversations = Object.keys(this.props.conversations).map((key)=> { return this.props.conversations[key] });

    return (
      <View style={styles.container}>
        {
          state && !state.params &&
          <NavigationBar title={titleConfig} />
        }
        {
          state && state.params && !state.params.isConsumer &&
          <NavigationBar  
            leftButton={<BackButton onPress={()=>goBack()} />}
            title={titleConfig} />
        }
        {(!this.isLoggedIn) &&
          <ComingSoon info={"Please Sign in."} onPress={()=> navigate('LoginSignup', { userType: 'customer',initialIndex:1 }) } />
        }
        {
          this.isLoggedIn &&
          <FlatList
            style={styles.list}
            data={conversations}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            //renderFooter = {this.renderFooter}
            //onEndReached = {context.onEndReached}
            //onEndReachedThreshold = {10}
            //onRefresh={this.onRefresh}
            //refreshing={this.state.isRefreshing}
            enableEmptySections={true}
            ListEmptyComponent={()=><NoRecord />}
          />
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container:{
    backgroundColor:Constants.Colors.White,
    flex:1
  },
  icon: {
    width: 26,
    height: 26,
  },
});

ReactMixin(Messages.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user,
  conversations : state.conversations
});

const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators(userActions, dispatch),
    conversationActions : bindActionCreators(conversationActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Messages);