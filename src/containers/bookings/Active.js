  /*
 * @file: BookingActive.js
 * @description: Active booking screen
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
import Active from '../../components/bookings/Active';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import NoRecord from "../../components/common/NoRecord";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as listingActions from '../../redux/modules/listing';
import Idx from '../../utilities/Idx';

class BookingActive extends React.Component {
	constructor(props){
    super(props);
    let token = '', userId = '';
    if(Idx(this.props,_ => _.user.auth.token)){
      token = this.props.user.auth.token;
      userId = this.props.user.userId;
    }

    this.state = {
      dataSource: [],
      isRefreshing:true,
      isFooterVisible:false,
      skip:0,
      total:0,
      limit:5,
      token:token,
      userId:userId,
      isInitialLoad : true,
    }
    this.isEndReached = false;
  }
  
  componentDidMount(){
    this.setTimeout(()=>{
      this.setState({
        isInitialLoad : false,
      });
      this.getListOfActiveBookings();
    },1000);
  }

  getListOfActiveBookings=()=>{
    let context = this;
    this.props.listingActions.getActiveBookingList(context.state,function(count) {
      context.setState({
        isRefreshing:false,
        isFooterVisible:false,
        total:count?count:context.state.total
      });
      context.isEndReached = false;
    });
  }

  renderItem=({item, index})=>{
    return  (
      <Active 
        data={item}
        isChef={this.props.isChef}
        navigation={this.props.navigation}
      />
    )
  }

  onRefresh=()=>{
    let context=this;
    context.setState({
      isRefreshing:true,
      skip:0,
      total:0
    });
    context.setTimeout(()=>context.getListOfActiveBookings(),1000);
  }

  listonReachedEnd=()=>{
    let context=this;
    if(!context.isEndReached  && context.state.skip<context.state.total){
      context.isEndReached = true;
      context.setState({
        skip:context.state.skip+5,
        isFooterVisible : true
      });
      this.setTimeout(()=>this.getListOfActiveBookings(),1000);
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

  _keyExtractor = (item, index) => item.booking_number;

  render() {
  	return ( 
      <FlatList
        data={this.props.active.length>0?this.props.active:[]}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        onRefresh={()=>this.onRefresh()}
        refreshing={this.state.isRefreshing}
        onEndReachedThreshold={0.8}
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

ReactMixin(BookingActive.prototype, TimerMixin);

const mapStateToProps = state => ({
  active : state.listing.active,
  user   : state.user.userDetails
});

const mapDispatchToProps = dispatch => ({
  listingActions: bindActionCreators(listingActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingActive);
