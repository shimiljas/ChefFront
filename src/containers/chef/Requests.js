/*
 * @file: ChefRequest.js
 * @description: Request page of Chef.
 * @date: 04.08.2017
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
  Dimensions,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import Constants from '../../constants';
import Background from '../../components/common/Background';
import * as locationActions from '../../redux/modules/location';
import * as bookingsActions from '../../redux/modules/bookings';
import * as listingActions from '../../redux/modules/listing';
import Avatar from '../../components/common/Avatar';
import StarRating from '../../components/common/StarRating';
import BackButton from "../../components/common/BackButton";
import NoRecord from "../../components/common/NoRecord";
import NavigationBar from "react-native-navbar";
import ChefRequestComponent from "../../components/requests/ChefRequestComponent";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";

class Requests extends Component {

  constructor(props){
    super(props);
    this.state = {
      dataSource: [],
      isRefreshing: true,
      skip:0,
      total:0,
      limit:10,
      token:this.props.user.auth.token,
      userId:this.props.user.userId,
    }
    this.isEndReached = false;
    this.onRefresh = this.onRefresh.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentWillMount=()=>{
    this.getListOfRequest();
  }

  getListOfRequest=()=>{
    let context = this;
    context.props.listingActions.getActiveBookingList(context.state,function(count) {
      context.setState({
        isRefreshing:false,
        isFooterVisible:false,
        total:count?count:context.state.total
      });
      context.isEndReached = false;
    });
  }

  /**
  * Accept the consumer request and share details.
  */

  onRequestAccept=(data)=>{
    let {navigate} = this.props.navigation;

    if(!this.props.user.isStripeVerified){
      Alert.alert(
        "Add Bank Details",
        "Please add bank detailscard before accepting request.",
        [
          {text: 'Continue', onPress: () => navigate("RegisterBank")},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
        ],
        { cancelable: false }
      )
    }else{
      this.props.bookingsActions.acceptConsumerRequest({
        bookingStatus:2,
        token:this.props.user.auth.token,
        userId:this.props.user.userId,
        bookingNumber:data.booking_number,
        addition_cost:0,
        additionalDescription:"",
        isRequestPage : true
      });
    }
  }

  /**
  * Reject the consumer request. 
  */

  onRequestReject=(data)=>{
    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject the booking request.",
      [
        {text: 'Yes', onPress: () => {
          this.props.bookingsActions.declineRequest({
            bookingStatus:5,
            token:this.props.user.auth.token,
            userId:this.props.user.userId,
            bookingNumber:data.booking_number,
            isRequestPage : true
          });
        }},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
      { cancelable: false }
    )
  }

  // Function renders each element of flatlist
  renderItem=({item, index})=>{
    return (
      <ChefRequestComponent
        data={item}
        onRequestAccept = {this.onRequestAccept.bind(this,item)}
        onRequestReject = {this.onRequestReject.bind(this,item)}
        navigation      = {this.props.navigation}
      />
    )
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

  // Function refreshes flatlist
  onRefresh=()=>{
    let context = this;
    context.setState({isRefreshing: true,skip:0,total:0});
    context.setTimeout(()=>context.getListOfRequest(),1000);
  }

  // Function to be called on reaching end of list
  listonReachedEnd=()=>{
    let context=this;
    if(!context.isEndReached  && context.state.skip<context.state.total){
      context.isEndReached = true;
      context.setState({
        skip:context.state.skip+10,
        isFooterVisible : true
      });
      this.setTimeout(()=>this.getListOfRequest(),1000);
    }
  }
  
  // Function extracts each element from datasource of flatlist
  _keyExtractor = (item, index) => item._id;
 
  // Default render function
  render() {
    let context = this;
    let { navigate, goBack } = this.props.navigation;
    const titleConfig = {
      title: "Requests",
      tintColor: "#fff",
      style: {
        ...Constants.Fonts.content
      }
    };
    return ( 
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          leftButton={<BackButton onPress={()=>goBack()} />}
        /> 
        <FlatList
          data={this.props.active}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          refreshing={this.state.isRefreshing}
          onEndReachedThreshold={0.8}
          enableEmptySections={true}
          onEndReached={this.listonReachedEnd}
          ListEmptyComponent={()=><NoRecord />}
          ListFooterComponent={this.renderFooter}
        />            
      </View>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Constants.Colors.White
  },
  bookNowText:{
    ...Constants.Fonts.bold,
    color:Constants.Colors.Magenta,
  }
});

const mapStateToProps = state => ({
  active : state.listing.active,
  user   : state.user.userDetails,
  payments : state.payments
});

const mapDispatchToProps = dispatch => ({
  bookingsActions: bindActionCreators(bookingsActions, dispatch), 
  listingActions: bindActionCreators(listingActions, dispatch),
});

ReactMixin(Requests.prototype, TimerMixin);
export default connect(mapStateToProps, mapDispatchToProps)(Requests);