'use strict';
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ScrollView,
  StatusBar
} from "react-native";
import Constants from '../../constants';
import NavigationBar  from "react-native-navbar";
import BackButton  from "../../components/common/BackButton";
import Background from '../../components/common/Background';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar, CustomTabBar } from 'react-native-scrollable-tab-view';
import SignUp from "./SignUp";
import SignIn from "./SignIn";

export default class LoginSignup extends Component {
  constructor(props) {
    super(props);

    let { userType, initialIndex } = this.props.navigation.state.params;
    this.state = {
      title: userType==="customer"?"Step 1 of 2":"Step 1 of 4",
      initialIndex:initialIndex
    }
  }


  render() {
    let context=this;
    let { goBack } = this.props.navigation;
    let { signup, signin } = Constants.i18n.common;
    return (
      <Background isFaded={true}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.Colors.LightGreen}
        />
        <BackButton 
          title={context.state.initialIndex===0?context.state.title:""} 
          containerStyle={{height:44}} 
          onPress={()=>goBack()}
        />
        <ScrollableTabView
          initialPage={this.props.navigation.state.params.initialIndex}
          onChangeTab={(event)=>this.setState({initialIndex:event.i})}
          tabStyle={styles.tabStyle}
          tabBarTextStyle={styles.textStyle}
          scrollWithoutAnimation={false}
          tabBarUnderlineStyle={{height:0}}
          tabBarActiveTextColor={Constants.Colors.White}
          tabBarInactiveTextColor={Constants.Colors.GhostWhite}
          locked={true}
          prerenderingSiblingsNumber={Infinity}
          renderTabBar={() => <CustomTabBar style={styles.scrollableStyle} />}
        >
          <SignUp
            {...this.props}
            tabLabel={signup}
          />
          <SignIn
            {...this.props}
            tabLabel={signin}
          />
        </ScrollableTabView>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: Constants.Colors.White
  },
  textStyle:{
    backgroundColor: Constants.Colors.Transparent
  }
});

