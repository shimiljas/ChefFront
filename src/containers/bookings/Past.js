/*
 * @file: BookingPast.js
 * @description: Past booking screen
 * @date: 13.07.2017
 * @author: Parshant
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
import PastChef from '../../components/bookings/PastChef';
import PastCaterer from '../../components/bookings/PastCaterer';
import NoRecord from "../../components/common/NoRecord";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import Idx from '../../utilities/Idx';
import * as listingActions from '../../redux/modules/listing';
import { ToastActionsCreators } from 'react-native-redux-toast';

let limit=5,
    skip=0,
    isEndReached=true;


class BookingPast extends Component {
  constructor(props){
    super(props);
    if(Idx(this.props,_ => _.user.userDetails.auth.token)){
      token = this.props.user.userDetails.auth.token;
      userId = this.props.user.userDetails.userId;
    }
    this.state = {
      dataSource: [],
      isRefreshing:true,
      total:0,
      isFooterVisible : false,
      isInitialLoad : true
    }
    this.onRefresh  = this.onRefresh.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }
  
  componentDidMount() { 
    this.setTimeout(()=>{
      this.setState({
        isInitialLoad : false
      });
      this.getPastList();
    },3000);
  }

  /**
  * Fetch listing of past bookings
  */

  getPastList=()=>{
     let context = this;
     let requestObject = { 
      token : token,
      userId: userId,
      limit : limit,
      skip : skip,
      isInitialLoad : context.state.isInitialLoad
    }
    this.props.listingActions.getPastBookingList(requestObject,function(count){
        isEndReached = true;
        context.setState({
          total:count?count:context.state.total,
          isRefreshing:false,
          isFooterVisible : false
        });
    });
  }

  /**
  * Navigate to Dispute
  */

  raiseResolvesDispute(item){
    this.props.navigation.navigate("Dispute",{
      booking_number : item.booking_number
    });
  }

  /**
  * Pull to refresh. 
  */
  
  onRefresh=()=>{
    let context=this;
    context.setState({isRefreshing:true});
    skip=0;
    context.getPastList();
  }

  /**
  * Render list items.
  */

  renderItem({item,index}){
    return (
      <PastChef 
        data={item} 
        isChef={this.props.isChef}
        callBack={this.onRefresh}
        navigation={this.props.navigation}/>
    )
  }
  
  /**
  * Handle list on end reached for laod more.
  */

  listonReachedEnd(){
    if(isEndReached && skip<this.state.total){
      this.setState({
        isFooterVisible : true
      })
      skip=skip+limit;
      isEndReached = false;
      this.getPastList();
    }
  }
  
  /**
  * Render Footer
  */
  renderFooter(){
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


  /**
  * Assign unique keys to list item.
  */

  _keyExtractor = (item, index) => item._id;

	render() {
  	return (
      <FlatList
        data={this.props.past.length>0?this.props.past:[]}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        onRefresh={()=>this.onRefresh()}
        refreshing={this.state.isRefreshing}
        onEndReachedThreshold={0.5}
        enableEmptySections={true}
        onEndReached={()=> this.listonReachedEnd()}
        ListFooterComponent={()=>this.renderFooter()}
        ListEmptyComponent={()=><NoRecord />} />
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
ReactMixin(BookingPast.prototype, TimerMixin);

const mapStateToProps = state => ({
  past : state.listing.past,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  listingActions: bindActionCreators(listingActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPast);
