/*
 * @file: BookingCancelled.js
 * @description: Cancelled booking screen
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
import Cancelled from '../../components/bookings/Cancelled';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import NoRecord from "../../components/common/NoRecord";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { ToastActionsCreators } from 'react-native-redux-toast';
import * as listingActions from '../../redux/modules/listing';
import Idx from '../../utilities/Idx';


class BookingCancelled extends React.Component {
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
    this.onRefresh  = this.onRefresh.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  // Fetched list of cancelled bookings
  componentDidMount=()=>{
    this.setTimeout(()=>{
      this.getListOfCancelledBookins();
      this.setState({
        isInitialLoad : false
      });
    },3500);
  }

  getListOfCancelledBookins=()=>{
    let context = this;
    let requestObject = {
      skip: context.state.skip,
      limit: context.state.limit,
      isInitialLoad : context.state.isInitialLoad,
      token : context.state.token,
      userId : context.state.userId
    };

    context.props.listingActions.getCancelledBookingList(requestObject,function(count){
      context.isEndReached = true;
      context.setState({
        total:count?count:context.state.total,
        isRefreshing: false,
        isFooterVisible:false,
      });
    });
  }

  // Renders each cancelled booking
  renderItem({item, index}) {
    let context = this;
    return(
      <Cancelled
        data={item}
        isChef={this.props.isChef}
        navigation = {context.props.navigation}
      />
    )
  }

  // Refreshes list of cancelled booking
  onRefresh(){
    let context=this;
    context.setState({isRefreshing: true, skip: 0});
    this.setTimeout(()=>this.getListOfCancelledBookins(),500);
  }

  listonReachedEnd(){
    if(this.isEndReached && this.state.total != this.props.cancelled.length){
      this.isEndReached = false;
      this.setState({
        isFooterVisible:true,
        isEndReached : false,
        skip : this.state.skip + this.state.limit
      });
      this.setTimeout(()=>this.getListOfCancelledBookins(),500);
    }
  }

  _keyExtractor = (item, index) => item._id;
  

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

  // Default render function
  render() {
  	return (
       <FlatList
        data={this.props.cancelled.length>0?this.props.cancelled:[]}
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
  container:{
    backgroundColor:Constants.Colors.White,
    flex:1
  },
  paginationView:{
    height:50,
    backgroundColor:Constants.Colors.Transparent,
    justifyContent:"center"
  },
});

ReactMixin(BookingCancelled.prototype, TimerMixin);

const mapStateToProps = state => ({
  cancelled : state.listing.cancelled,
  user   : state.user
});

const mapDispatchToProps = dispatch => ({
  listingActions: bindActionCreators(listingActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingCancelled);
