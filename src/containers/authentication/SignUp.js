'use strict';
import React, { Component } from 'react';
import ReactNative, {
  findNodeHandle,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import _ from 'lodash';
import Constants from '../../constants';
import Regex from '../../utilities/Regex';
import BackgroundImage from '../../components/common/Background';
import RoundButton from '../../components/common/RoundButton';
import InputField from '../../components/common/InputField';
import { ToastActionsCreators } from 'react-native-redux-toast';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserActions from '../../redux/modules/user';

class SignUp extends Component {
  constructor(props) {
    super(props);
    let { userType } = this.props.navigation.state.params;
    this.state= {
      email: '',
      mobile: '',
      password: '',
      secureText : true,
      userType : userType
    }
  }

  onNextClick() {
    let context = this;
    let { dispatch } = this.props.navigation;
    let { email, mobile, password } = this.state;
    let { navigate } = this.props.navigation;
    let { userType } = this.props.navigation.state.params;
    let { enterMobile, enterValidMobile } = Constants.i18n.signup;
    let { enterEmail, enterPassword, enterValidEmail, enterValidPassword } = Constants.i18n.common;
    
    if(_.isEmpty(email.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterEmail));
      return;
    }
    if(Regex.validateEmoji(email.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidEmail));
      return;
    }

    if(!Regex.validateEmail(email.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidEmail));
      return;
    }
    if(_.isEmpty(mobile.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterMobile));
      return;
    }
    if(!Regex.validateMobile(mobile.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMobile));
      return;
    }
    if(_.isEmpty(password)) {
      dispatch(ToastActionsCreators.displayInfo(enterPassword));
      return;
    }
    if(!Regex.validatePassword(password)){
      dispatch(ToastActionsCreators.displayInfo(enterValidPassword));
      return;
    }
    this.props.UserActions.checkExisitngUser({...this.state});
  }

  // Keyboard Handling

  _handleScrollView(ref) {
    let context = this;
    context.setTimeout(() => {
      let scrollResponder = context.refs.mainScrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ref,
        (Constants.BaseStyle.DEVICE_HEIGHT/100) * 40, //additionalOffset
        true
      );
    }, 100);
  }

  _resetScrollView(ref) {
    let context = this;
    context.setTimeout(() => {
      let scrollResponder = context.refs.mainScrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ref,
        0,
        true
      );
    }, 100);
  }

  render() {
    let { enterMobile } = Constants.i18n.signup;
    let { emailAddress, mobile, password } = Constants.i18n.common;
    let { enterEmail, enterPassword } = Constants.i18n.common;
    let { navigate } = this.props.navigation;
    return (
      <View style={styles.mainView}>
        <ScrollView 
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          keyboardDismissMode = {Platform.OS === 'ios' ? 'on-drag' : 'interactive'} 
          keyboardShouldPersistTaps='always' 
          ref="mainScrollView"
        >
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <InputField
              ref='email'
              autoFocus={false}
              headerText={emailAddress}
              placeHolderText={enterEmail}
              placeHolderColor={Constants.Colors.White}
              secureText={false}
              keyboard='email-address'
              returnKey='next'
              SubmitEditing={(event) => this.refs.mobile.focus()}
              onChangeText={(email)=>this.setState({email})}
            />
            <InputField
              ref='mobile'
              autoFocus={false}
              headerText={mobile}
              placeHolderText={enterMobile}
              placeHolderColor={Constants.Colors.White}
              secureText={false}
              //maxLength={13}
              keyboard='phone-pad'
              returnKey='next'
              //isPassword={false}
              //showPassword={false}
              SubmitEditing={(event) => this.refs.password.focus()}
              onChangeText={(mobile)=>this.setState({mobile})}
              onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.mobile));}}
              onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.mobile));}}
            />

            <InputField
              ref='password'
              autoFocus={false}
              headerText={password}
              placeHolderText={enterPassword}
              placeHolderColor={Constants.Colors.White}
              secureText={this.state.secureText}
              onShowHidePassword={()=>{
                console.log("*****", this.state.secureText);
                this.setState({secureText: !this.state.secureText})}}
              returnKey='done'
              isPassword={true}
              //showPassword={this.state.showHidePassword}
              SubmitEditing={(event) => this.onNextClick()}
              onChangeText={(password)=>this.setState({password})}
              onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.password));}}
              onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.password));}}

            />
          </KeyboardAvoidingView>
          {
            this.state.userType === "customer" &&
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: Constants.BaseStyle.DEVICE_HEIGHT/100*8
            }}>
              <Text style={styles.guest} onPress={()=>navigate('ConsumerDashboard')}>
                {"Continue as guest"}
              </Text>
            </View>
          }
          <View style={styles.footer}>
            <RoundButton text="Next"
              _Press={()=>this.onNextClick()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1
  },
  container: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    marginBottom: Platform.OS === 'ios' ? 0 : Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    alignItems: 'center'
  },
  guest: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Green,
    textDecorationLine: 'underline',
    backgroundColor:Constants.Colors.Transparent
  }
});

ReactMixin(SignUp.prototype, TimerMixin);

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(null, mapDispatchToProps)(SignUp);
