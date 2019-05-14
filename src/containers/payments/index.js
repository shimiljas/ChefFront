/* *
 * @file: index.js
 * @description: List of Saved cards and default card.
 * @date: 27.07.2017
 * @author: Manish Budhiraja
 * */

import React, { Component } from 'react';
import { RefreshControl, Alert, ScrollView, FlatList, StyleSheet, View, Image, Text, TouchableOpacity, Platform } from 'react-native';
import Constants from "../../constants";
import NavigationBar  from "react-native-navbar";
import CardsView from "../../components/payments/CardView";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as paymentActions from '../../redux/modules/payments';
import Idx from '../../utilities/Idx';
import ComingSoon from '../../components/common/ComingSoon';

let cardsImages = [];

class Payments extends React.Component {
  
  constructor(props){
    super(props);
    let token = "", userId="";
    this.isLoggedIn = false;
    if(Idx(this.props,_ => _.user.userDetails.auth.token)){
      this.isLoggedIn = true;
      token = this.props.user.userDetails.auth.token;
      userId = this.props.user.userDetails.userId;
    }

    this.state={
      totalRecords:0,
      skip:0,
      token:token,
      userId:userId,
      isRefreshing:true
    }
  }

	static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={Constants.Images.user.bottom_payments_active}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),  
  }

  componentDidMount(){
    this.getCards();
  }

  getCards(){
    if(this.isLoggedIn){
      this.props.paymentActions.fetchSavedCardsList(this.state);
      this.setTimeout(()=>this.setState({isRefreshing:false}),1000);
    }
  }

  onRemovePress(data){
    let context=this;
    if(this.props.payments.cardsList.length>1 && data.cardId == context.props.payments.defaultCard){
      alert("Please set a default card first.");
    }else{
      Alert.alert(
        "Remove Card",
        "Are you sure you want to remove this card?",
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
          {text: 'OK', onPress: () =>{
          context.props.paymentActions.removeCard({
            id:data.cardId,
            token:context.state.token,
            userId:context.state.userId,
          });
          }},
        ],
        { cancelable: false }
      );
    }
  }

  setDefaultCard(data){
    let context=this;
    if(data.cardId !== context.props.payments.defaultCard){
      context.props.paymentActions.updateDefaultCard({
        id:data.cardId,
        token:context.state.token,
        userId:context.state.userId,
      });
    }
  }

  /**
  * Render FlatList Items
  */
  
  renderItem({item,index}){
    let context=this;
    return(
      <CardsView
        data={item}
        onRemovePress   = {this.onRemovePress.bind(this,item)}
        setDefaultCard  = {this.setDefaultCard.bind(this,item)}
        defaultCard     = {this.props.payments.defaultCard}
        userDetails     = {this.props.user.userDetails}
      />
    );
  }

  /**
  * Extract Item Key
  */
  _keyExtractor = (item, index) => item.cardId;

	render() {
    let context = this;
    const titleConfig = {
      title: "Payments",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    let { navigate, dispatch } = this.props.navigation;
  	return (
      <View style={styles.container}>
        <NavigationBar title={titleConfig} />
          { 
            !this.isLoggedIn &&
            <ComingSoon info={"Please sign in."} onPress={()=> navigate('LoginSignup', { userType: 'customer',initialIndex:1 }) } />
          }
          { 
            this.isLoggedIn &&
            <ScrollView
              showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={()=>{
                    this.setState({
                      isRefreshing:true
                    })
                    this.getCards();
                  }}
                />
              } 
              >
              <FlatList
                data={this.props.payments.cardsList.length>0?this.props.payments.cardsList:[]}
                renderItem={(data)=>this.renderItem(data)}
                keyExtractor={(item, index)=>this._keyExtractor(item, index)}
                enableEmptySections={true}
                extraData={this.props.payments.defaultCard}
              />
              <TouchableOpacity style={{marginVertical:15}} onPress={()=> navigate('RegisterCreditDebitCards') }>
                <Text style={{paddingLeft:30,color:Constants.Colors.HeaderLightGreen,...Constants.Fonts.contentBold}}>
                  {"ADD CARD"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          }
      </View>
    )
	}
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26
  },
  container:{
    backgroundColor:Constants.Colors.White,
    height: Platform.OS === "ios" ? Constants.BaseStyle.DEVICE_HEIGHT/100*93 : Constants.BaseStyle.DEVICE_HEIGHT/100*87
  }
});

ReactMixin(Payments.prototype, TimerMixin);

const mapStateToProps = (state) => ({
  user: state.user,
  payments  : state.payments,
});

const mapDispatchToProps = dispatch => ({
  paymentActions: bindActionCreators(paymentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Payments);