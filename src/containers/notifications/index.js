/*
 * @file: Notifications.js
 * @description: Contains list of notifications.
 * @date: 01.08.2017
 * @author: Manish Budhiraja
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
  Listview,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Constants from '../../constants';
import BackButton  from "../../components/common/BackButton";
import NavigationBar  from "react-native-navbar";
import NotificationItem from "../../components/notifications/NotificationItem";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as notificationActions from '../../redux/modules/notifications';
import Idx from '../../utilities/Idx';
import NoRecord from "../../components/common/NoRecord";

class Notifications extends Component {

  constructor(props){
    super(props);
    this.skip   = 0;
    this.limit  = 10;
    this.total  = 0;
    this.token  = this.props.user.auth.token;
    this.userId = this.props.user.userId;
    this.isEndReached = false;
    this.state  =  {
      isRefreshing : true,
      isFooterVisible : false
    }
  }

  componentDidMount(){
    this.setTimeout(()=>this.getNotifications(),350);
  } 

  /**
  * Get Notifications
  */

  getNotifications=()=>{
    let context = this;
    let requestObject = {
      token   : context.token,
      userId  : context.userId,
      limit   : context.limit,
      skip    : context.skip,
    }
    context.props.notificationActions.getNotificationsList(requestObject,(count)=>{
      context.setState({
        isRefreshing : false,
        isFooterVisible : false
      });
      context.isEndReached = false;
      context.total = count?count:context.total
    });
  }
  /**
  * On Notification Press
  */
  onPress=(data)=>{
    let context=this;
    let { navigate } =  context.props.navigation;
    if(data.status==1){
      context.props.notificationActions.readNotification({
        data    : data,
        token   : context.token,
        userId  : context.userId,
      });
    };
    if(data.type=="Rating"){ 
      navigate("Ratings");
      return;
    }else{
      let details = {
        ...data.bookingDetails , 
        ...{user:data.user},
      };
      if(details.status==1 || details.status==2 || details.status==3 || details.status==4 ||
      details.status==5 || details.status==9 ){
        details = {
          ...details,
          ...{callBack :context.onRefresh.bind(this)}
        };
        if(details.user.role==1){
          navigate("Request", details);
        }else{
          navigate("ViewRequest", details);
        }
      }else{
        if(details.user.role==1){
          navigate("PastBookingDetails", { 
            data : details,
            callBack : context.onRefresh.bind(this)
          });
        }else{
          navigate("PastBookingDetailChef", {
            data : details,
            callBack : context.onRefresh.bind(this)
          });
        }
      }
    }
  }

  /**
  * Render FlatList Items
  */
  renderItem = ({item, index})=>{
    let context=this;
    return(
      <NotificationItem
        rowData     = {item}
        navigation  = {this.props.navigation}
        onPress     = {this.onPress.bind(context,item)}
        isChef      = {this.props.user.role==1}
      />
    );
  }

  onRefresh=()=>{
    let context=this;
    context.skip  = 0;
    context.total = 0;

    context.setState({
      isRefreshing:true,
    });
    context.setTimeout(()=>context.getNotifications(),250);
  }

  onEndReached=()=>{
    let context=this;
    if(!context.isEndReached  && (context.skip < context.total)){
      context.setState({
        isFooterVisible : true
      });
      context.isEndReached = true;
      context.skip = context.skip +  context.limit,
      context.setTimeout(()=>context.getNotifications(),250);
    } 
  }
  
  /**
  * Render Footer
  */
  renderFooter=()=>{
    let context=this;
    return(
      <View style={context.state.isFooterVisible?styles.paginationView:{height:0,width:0}}>
        { this.state.isFooterVisible &&
          <ActivityIndicator
            style={{alignSelf:"center"}} 
            size={"large"} 
            color={Constants.Colors.Black}/>
        }
      </View>
    )
  }


  _keyExtractor = (item, index) => item._id;
  
  render() {
    const titleConfig = {
      title: "Notifications",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    let context = this;
    let { navigate, goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<BackButton onPress={()=>goBack()} />} 
          title={titleConfig} />
         <View style={styles.container}>  
          <FlatList
            style={styles.list}
            data={this.props.notifications}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
            onRefresh={()=>this.onRefresh()}
            refreshing={this.state.isRefreshing}
            onEndReachedThreshold={0.8}
            enableEmptySections={true}
            onEndReached={()=> this.onEndReached()}
            ListEmptyComponent={()=><NoRecord />}
            ListFooterComponent={this.renderFooter}
            showsHorizontalScrollIndicator = {false}
            showsVerticalScrollIndicator = {false} 
          />
         </View>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex :1,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    backgroundColor:Constants.Colors.White,
  },
  mainContainer:{
    flex :1,
    backgroundColor:Constants.Colors.White,
  },
  colorText:{
    color: Constants.Colors.Gray
  },
  colorTextBlur:{
   color: Constants.Colors.BlurGrey
  },
  list:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*70,
  },
  rowContainer:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*18,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    borderBottomWidth:1,
    borderBottomColor : Constants.Colors.LightGray,
    flex : 1,
    flexDirection :'row',
  },
  leftImageBox:{
    flex : 0.3,
    justifyContent :'center',
    alignItems :'center',
  },
  rightImageBox:{
    flex : 0.7,
    flexDirection :'column'
  },
  rowTitle:{
    marginLeft:20,
    color:Constants.Colors.Green
  },
  topTextRight:{
    flex : 0.7,
    justifyContent : "flex-end"

  },
  textRightAbove:{
    ...Constants.Fonts.normal,
  },
  arrow:{
    height: Constants.BaseStyle.DEVICE_WIDTH/100*4,
    width: Constants.BaseStyle.DEVICE_WIDTH/100*3,
    paddingRight : Constants.BaseStyle.DEVICE_WIDTH/100*5,
  },
  lastText:{
    flex : 0.3,
  },
  leftimage:{
    height: Constants.BaseStyle.DEVICE_WIDTH/100*15,
    width: Constants.BaseStyle.DEVICE_WIDTH/100*15,
    borderRadius : 30,
  },
  lastTextItem:{
    ...Constants.Fonts.mediumSize,
  },
  lastTextItemBold:{
    ...Constants.Fonts.mediumSize,
    fontWeight: "bold", 

  },
  lastTextBelow:{
    ...Constants.Fonts.smallSize,
    fontWeight : 'normal',
    color: Constants.Colors.Gray,
  },
  paginationView:{
    height:50,
    backgroundColor:Constants.Colors.Transparent,
    justifyContent:"center"
  },
});

ReactMixin(Notifications.prototype, TimerMixin);

const mapStateToProps = (state) => ({
  user: state.user.userDetails,
  notifications : state.notifications.list
});

const mapDispatchToProps = dispatch => ({
  notificationActions: bindActionCreators(notificationActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
