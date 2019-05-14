/*
 * @file: BookingUpcoming.js
 * @description: Upcoming booking screen
 * @date: 13.07.2017
 * @author: Vishal Kumar
 * */

import React, { Component } from 'react';
import {
  VirtualizedList,
  StyleSheet,
  ScrollView,
  FlatList,
  View,
  ActivityIndicator
} from 'react-native';
import Constants from "../../constants";
import Upcoming from '../../components/bookings/Upcoming';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import NoRecord from "../../components/common/NoRecord";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { ToastActionsCreators } from 'react-native-redux-toast';
import * as listingActions from '../../redux/modules/listing';
import Idx from '../../utilities/Idx';

class BookingUpcoming extends React.Component {
  constructor(props){
    super(props);
    let token = '', userId = '';
    if(Idx(this.props,_ => _.user.userDetails.auth.token)){
      token  = this.props.user.userDetails.auth.token;
      userId = this.props.user.userDetails.userId;    
    }
    this.state = {
      isRefreshing: true,
      isFooterVisible:false,
      skip: 0,
      limit: 5,
      total:0,
      isInitialLoad : true,
      token : token,
      userId : userId
    }
    this.isEndReached = true;
    this.onRefresh = this.onRefresh.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  // Fetches list of upcoming bnokings
  componentDidMount=()=>{
    this.setTimeout(()=>{
      this.getUpcomingList();
      this.setState({
        isInitialLoad : false
      });
    },2500);
  }

  getUpcomingList=()=>{
    let context = this;
    let requestObject = {
      token : context.state.token,
      userId : context.state.userId,
      skip: context.state.skip,
      limit: context.state.limit,
      isInitialLoad : context.state.isInitialLoad
    }
    context.props.listingActions.getUpcomingBookingList(requestObject,function(count){
      this.isEndReached = true;
      context.setState({
        isRefreshing: false,
        isFooterVisible:false,
        total:count?count:context.state.total
      });
    });
  }

  // Renders each upcoming booking
  renderItem = ({item, index}) => {
    return (
      <Upcoming 
        data = {item}
        isChef={this.props.isChef}
        navigation = {this.props.navigation}
      />
    );
  }

  // Refreshes list of upcoming booking
  onRefresh=()=>{
    let context=this;
    context.setState({isRefreshing: true, skip: 0});
    this.setTimeout(()=>this.getUpcomingList(),500);
  }

  listonReachedEnd(){
    if(this.isEndReached && this.state.skip < this.state.total){
      this.isEndReached = false;
      this.setState({
        isFooterVisible:true,
        isEndReached : false,
        skip : this.state.skip + this.state.limit
      });
      this.setTimeout(()=>this.getUpcomingList(),500);
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

  // Default render function
	render() {
    return (
      <FlatList
        data={this.props.upcoming.length>0?this.props.upcoming:[]}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        onRefresh={()=>this.onRefresh()}
        refreshing={this.state.isRefreshing}
        onEndReachedThreshold={0.5}
        enableEmptySections={true}
        onEndReached={()=> this.listonReachedEnd()}
        ListEmptyComponent={()=><NoRecord />} 
        ListFooterComponent={this.renderFooter}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.White,
  },
  paginationView:{
    height:50,
    backgroundColor:Constants.Colors.Transparent,
    justifyContent:"center"
  },
});

ReactMixin(BookingUpcoming.prototype, TimerMixin);

const mapStateToProps = state => ({
  upcoming : state.listing.upcoming,
  user   : state.user
});

const mapDispatchToProps = dispatch => ({
  listingActions: bindActionCreators(listingActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingUpcoming);