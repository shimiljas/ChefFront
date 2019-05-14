/*
 * @file: index.js
 * @description: Scrollable tab bar screen for different booking screens.
 * @date: 13.07.2017
 * @author: Vishal Kumar
 * */

'use strict';

import React, { Component } from 'react';
import Reactnative , {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import NavigationBar  from "react-native-navbar";
import Constants from '../../constants';
import BookingPast from './Past';
import BookingUpcoming from './Upcoming';
import BookingCancelled from './Cancelled';
import BookingActive from './Active';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../redux/modules/user';
import Idx from '../../utilities/Idx';
import ComingSoon from '../../components/common/ComingSoon';
import BackButton from '../../components/common/BackButton';


class index extends Component {
  constructor(props) {
    super(props);
    let isChef = false;
    this.isLoggedIn = false;
    if(Idx(this.props,_ => _.user.userDetails.auth.token)){
      this.isLoggedIn = true;
      isChef = this.props.user.userDetails.role;
    }
    this.state={
      initialPage : (this.props.navigation.state && this.props.navigation.state.params)?this.props.navigation.state.params.initialIndex:0,
      isChef:isChef===1
    }
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={Constants.Images.user.bottom_bookings_active}
        style={[styles.icon, { tintColor: tintColor }]}
      />
  };

  // Default render function
  render() {
    let { appointment } = Constants.i18n.chef_caterer_dashboard;
    const titleConfig = {
      title: this.state.isChef ? appointment:"Bookings",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    let { navigate, dispatch, goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        {
          this.state.isChef && 
          <NavigationBar
            leftButton={<BackButton onPress={()=>goBack()} />}
            title={titleConfig} />
        }  
        {
          !this.state.isChef && 
          <NavigationBar title={titleConfig} />
        } 
        {
          this.isLoggedIn &&
          <ScrollableTabView
            initialPage={this.state.initialPage}
            tabStyle={styles.tabStyle}
            tabBarTextStyle={styles.textStyle}
            scrollWithoutAnimation={false}
            tabBarUnderlineStyle={{height:3,backgroundColor:Constants.Colors.White}}
            tabBarActiveTextColor={Constants.Colors.White}
            tabBarInactiveTextColor={Constants.Colors.GhostWhite}
            locked={false}
            prerenderingSiblingsNumber={Infinity}
            renderTabBar={() => <ScrollableTabBar style={styles.scrollableStyle} />}>
              <BookingActive
                {...this.props}
                isChef={this.state.isChef}
                tabLabel={"Active"}
              />
              <BookingUpcoming
                {...this.props}
                isChef={this.state.isChef}
                tabLabel={"Upcoming"}
              />
              <BookingPast
                {...this.props}
                isChef={this.state.isChef}
                tabLabel={"Past"}
              />
              <BookingCancelled
                {...this.props}
                isChef={this.state.isChef}
                tabLabel={"Cancelled"}
              />
          </ScrollableTabView>
        }
        {
          !this.isLoggedIn &&
          <ComingSoon info={"Please Sign in."} onPress={()=> navigate('LoginSignup', { userType: 'customer',initialIndex:1 }) } />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Constants.Colors.White
  },
  textStyle:{
    ...Constants.Fonts.content,
    backgroundColor:Constants.Colors.Transparent,
    //paddingHorizontal:20
  },
  scrollableStyle:{
    backgroundColor:Constants.Colors.HeaderLightGreen,
    width:Constants.BaseStyle.DEVICE_WIDTH,
  },
  tabStyle:{
    width:Constants.BaseStyle.DEVICE_WIDTH/100*50,
  },
  icon: {
    width: 26,
    height: 26
  }
});

ReactMixin(index.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(index);
