/*
 * @file: index.js
 * @description: Bottom Tabs for ios & android
 * @date: 30.06.2017
 * @author: Manish Budhiraja
 * */

'use strict';

import { TabNavigator, TabBarBottom, TabBarTop } from "react-navigation";
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, Animated, TouchableOpacity } from 'react-native';
import Explore from './explore';
import Bookings from '../bookings';
import Messages from '../messages';
import Payments from '../payments';
import Profile from '../profile/consumer';

const tabBarOptions = {
  tabBarPosition: 'bottom',
  tabBarComponent:TabBarBottom,
  initialRouteName :"Explore",
  animationEnabled: false,
  swipeEnabled: false,
  lazyLoad: true,
  lazy:true,
  tabBarOptions: {
    activeTintColor : '#009a2e',
    activeBackgroundColor : "#fff",
    inactiveTintColor : "gray",
    inactiveBackgroundColor : "#fff",
    showLabel : true , 
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: 'white',
      height:50
    },
  },
} ;

const routes = {
  Explore  : {
    screen : Explore,
  },
  Bookings : {
    screen : Bookings,
  }, 
  Payments : {
    screen : Payments,
  }, 
  Messages : {
    screen : Messages,
  },
  Profile  : {
    screen : Profile,
  },
};

const DashBoard = TabNavigator(routes, tabBarOptions);

export default DashBoard;