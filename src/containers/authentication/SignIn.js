'use strict';
import React, { Component } from 'react';
import ReactNative , {
  AppRegistry,
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
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
import * as userActions from '../../redux/modules/user';

class SignIn extends Component {
  constructor(props) {
    super(props);
    let { userType } = this.props.navigation.state.params;
    this.state= {
      emailOrMobile: '',
      password: '',
      secureText:true,
      role : userType==="customer"?0:userType==="chef"?1:2,
      deviceToken:this.props.user.deviceToken
    };
    this.navigation = this.props.navigation;
  }

  // Function validates all compulsory input fields and then navigates to next screen
  onGoClick() {
    let context = this;
    let { emailOrMobile, password } = this.state;
    let { enterEmailOrMobile, enterValidEmailOrMobile, enterPassword, enterValidPassword } = Constants.i18n.common;
    let { navigate, dispatch } = this.props.navigation;

    if(_.isEmpty(emailOrMobile.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterEmailOrMobile));
      return;
    }
    if(!Regex.validateEmail(emailOrMobile.trim()) && !Regex.validateMobile(emailOrMobile.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidEmailOrMobile));
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
    
    this.props.userActions.loginRestAPI({...this.state});  
  }

  // Keyboard Handling
  _handleScrollView(ref) {
    let context = this;
    context.setTimeout(() => {
      let scrollResponder = context.refs.mainScrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ref,
        (Constants.BaseStyle.DEVICE_HEIGHT/100) * 35,
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
    let { emailOrMobile, password, enterEmailOrMobile, enterPassword } = Constants.i18n.common;
    let { forgotPassword } = Constants.i18n.signin;
    let { navigate } = this.props.navigation;
    return (
      <View style={styles.mainView}>
        <ScrollView
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          keyboardDismissMode={Platform.OS==='ios' ? 'on-drag' : 'interactive'}
          keyboardShouldPersistTaps='always' 
          ref='mainScrollView'
        >
          <KeyboardAvoidingView behaviour="padding">
            <View style={styles.container}>
              <InputField
                autoFocus={false}
                ref='emailOrMobile'
                headerText={emailOrMobile}
                placeHolderText={enterEmailOrMobile}
                placeHolderColor={Constants.Colors.White}
                secureText={false}
                keyboard='email-address'
                returnKey='next'
                isPassword={false}
                showPassword={false}
                SubmitEditing={(event) => {this.refs.password.focus();}}
                onChangeText={(emailOrMobile)=>this.setState({emailOrMobile})}
              />

              <InputField
                ref='password'
                autoFocus={false}
                onShowHidePassword={()=>{
                  this.setState({secureText: !this.state.secureText})
                }}
                headerText={password}
                placeHolderText={enterPassword}
                placeHolderColor={Constants.Colors.White}
                secureText={this.state.secureText}
                returnKey='done'
                isPassword={true}
                showPassword={true}
                SubmitEditing={ (event) => this.onGoClick() }
                onChangeText={(password)=>this.setState({password})}
                onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.password));}}
                onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.password));}}
              />

            </View>
            {
              this.state.role === 0 &&
              <View style={{ justifyContent: 'center',
              alignItems: 'center',marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*8}}>
                  <Text style={ styles.forgotPassword} onPress={()=>navigate('ConsumerDashboard')}>
                  {"Continue as guest"}
                  </Text>
              </View>
            }

            <View style={this.state.role === 0 ? styles.footer : [styles.footer,{marginTop: Constants.BaseStyle.DEVICE_HEIGHT*10/100}]}>
              <Text style={styles.forgotPassword}
                onPress={()=>navigate('ForgotPassword')}
              >
                {forgotPassword}
              </Text>
            </View>
          </KeyboardAvoidingView>
          <View style={this.state.role === 0 ? styles.footerButton : [styles.footerButton,{marginTop: Constants.BaseStyle.DEVICE_HEIGHT*10/100}]}>
            <RoundButton
              text="Go"
              _Press={()=>this.onGoClick()}
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
    alignItems: 'center'
  },
  footerButton: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    marginBottom: Platform.OS === 'ios' ? 0 : Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    alignItems: 'center'
  },
  forgotPassword: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Green,
    textDecorationLine: 'underline',
    marginBottom: 20,
    backgroundColor:Constants.Colors.Transparent
  }
});

ReactMixin(SignIn.prototype, TimerMixin);

const mapStateToProps = state => ({
  user : state.user
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
