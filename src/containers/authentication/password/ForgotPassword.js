'use strict';
/*
 * @file: ForgotPassword.js
 * @description: Forgot Password Request
 * @date: 13.06.2017
 * @author: Manish Budhraja
 * */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Platform
} from 'react-native';
import _ from 'lodash';
import NavigationBar  from "react-native-navbar";
import Constants from '../../../constants';
import Regex from '../../../utilities/Regex';
import Background from '../../../components/common/Background';
import RoundButton from '../../../components/common/RoundButton';
import InputField from '../../../components/common/InputField';
import BackButton  from "../../../components/common/BackButton";
import { ToastActionsCreators } from 'react-native-redux-toast';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserActions from '../../../redux/modules/user';

 class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: ''
    }
    this.navigation = this.props.navigation;
  }

  onSendLinkClick() {
    let { dispatch } = this.props.navigation;
    let { mobile } = this.state;
    let { contactNumber, enterEmailOrMobile, enterValidEmailOrMobile } = Constants.i18n.common;
    let { enterValidMobile } = Constants.i18n.signup;
    let context = this;

    if(_.isEmpty(mobile.trim())) {
     dispatch(ToastActionsCreators.displayInfo(contactNumber));
      return;
    }

    if(!Regex.validateMobile(mobile)) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMobile));
      return;
    }

    this.props.UserActions.forgotRestAPI({...this.state});
  }

  render() {
    let { goBack } = this.props.navigation;
    let { emailOrMobile, enterEmailOrMobile, forgotInstructions } = Constants.i18n.password;
    let { mobile } = Constants.i18n.common;
    let { enterMobile } = Constants.i18n.signup;
    const titleConfig = {
      title: "Forgot",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    return (
      <Background isFaded={true}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.Colors.LightGreen}
        />
        <BackButton title={"Forgot Password"}
          textStyle={{marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*17}} 
          containerStyle={{height:44}} 
          onPress={()=>goBack()} 
        />
        <View style={styles.mainView}>
          <ScrollView 
            showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
            keyboardDismissMode = {Platform.OS==='ios'?"on-drag":"interactive"}
            keyboardShouldPersistTaps='always'
          >
            <KeyboardAvoidingView behavior="padding">
              <Text style={styles.forgotInstructions}>
                {forgotInstructions}
              </Text>
              <View style={styles.container}>
                <InputField
                  ref='emailOrMobile'
                  autoFocus={true}
                  headerText={mobile}
                  placeHolderText={enterMobile}
                  placeHolderColor={Constants.Colors.White}
                  secureText={false}
                  keyboard='phone-pad'
                  returnKey='done'
                  isPassword={false}
                  showPassword={false}
                  SubmitEditing={ (event) => this.onSendLinkClick() }
                  onChangeText={(mobile)=>this.setState({mobile})}
                />
              </View>
            </KeyboardAvoidingView>
            <View style={styles.footer}>
              <RoundButton text="Send OTP"
                _Press={()=>this.onSendLinkClick()}
              />
            </View>
          </ScrollView>
        </View>

      </Background>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Constants.Colors.Transparent
  },
  container: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*20/100,
    alignItems: 'center'
  },
  forgotInstructions: {
    ...Constants.Fonts.bold,
    color: Constants.Colors.White,
    backgroundColor:Constants.Colors.Transparent,
    alignSelf:"center",
    textAlign:"center",
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH*5/100,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*15/100
  }
});

const mapDispatchToProps = dispatch => ({
    UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(null, mapDispatchToProps)(ForgotPassword);
