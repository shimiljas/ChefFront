/*
 * @description: form to fill  otp for signup as well as for forgot passowrd
 * @date: 18.05.2017
 * @author: Pwayz Team(Rishabh, Manpreet, Rahul, Deep)
 * */

import React, { Component } from "react";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Dimensions, 
  TextInput,
  Keyboard,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  findNodeHandle
} from "react-native";
import _ from 'lodash';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import * as userActions from "../../redux/modules/user";
import TimerMixin from 'react-timer-mixin';
import ReactMixin from 'react-mixin';
import Constants from '../../constants';
import { ToastActionsCreators } from 'react-native-redux-toast';
import NavigationBar  from "react-native-navbar";
import SmallLink from "../../components/common/SmallLink";
import RoundButton from "../../components/common/RoundButton";
import BackButton  from "../../components/common/BackButton";
import Idx  from "../../utilities/Idx";

let counter=0,
    TIME=15,
    timerObj = null;

class OtpForm extends Component {
  constructor(props) {
    super(props);
    let mobile = "";
    if(Idx(props,_ => _.navigation.state.params.mobile)){
      mobile = this.props.navigation.state.params.mobile
    }

    if(Idx(props,_ => _.navigation.state.params.navProps.mobile)){
      mobile = this.props.navigation.state.params.navProps.mobile
    }

    this.navigation = this.props.navigation;
    this.state = {
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      currentTime:TIME,
      isDisabled:false,
      otp:'',
      mobile:mobile,
      deviceToken:this.props.user.deviceToken
    };
  }

  componentWillMount () {
    this.startTimer()
  }

  onKeyPress(e) {
    let context=this;
    if(e.nativeEvent.key=="Backspace"){
      if(context.refs['two'].isFocused()){
          if(context.state.code2===null || _.isEmpty(context.state.code2)){
            context.refs['one'].focus();
          }
      }
      if(context.refs['three'].isFocused()){
          if(context.state.code3===null || _.isEmpty(context.state.code3)){
            context.refs['two'].focus();
          }
      }
      if(context.refs['four'].isFocused()){
          if(context.state.code4===null || _.isEmpty(context.state.code4)){
            context.refs['three'].focus();
          }
      }
    }
  }

   /**
  * Stop Timer
  */
  stopTimer(){
    let context=this;
    if (timerObj) {
      context.clearInterval(timerObj);
      timerObj = null;
      counter=0;
      context.setState(() => {
        return {
          currentTime:"00",
          isDisabled:false
        };
      });
    } 
  }

  /**
  * Start Timer
  */

  startTimer(){
    let context=this;
    context.resetTimer();
    if (!timerObj) {
      timerObj = context.setInterval(()=>{
        counter++;
        let currentTime=context.state.currentTime-1;
        if(currentTime<10){
          currentTime="0"+currentTime;
        }
        context.setState(() => {
          return {
            currentTime:currentTime,
            isDisable:true
          };
        });
        if(counter===TIME){
          context.stopTimer();
        }
      }, 1000*1*1);
    }
  }

  /**
  * Reset Timer
  */
  resetTimer=()=>{
    let context=this;
    if (timerObj) {
      context.clearInterval(timerObj);
      timerObj = null;
      counter=0;
      context.setState(() => {
        return {
          currentTime:TIME,
          isDisabled:true
        };
      });
    }else{
      timerObj = null;
      counter=0;
      context.setState(() => {
        return {
          currentTime:TIME,
          isDisabled:true
        };
      });
    }
  }

  // Resend token actions, need d/w action for forgot password and signup
   resendOtpRestAPI(){
    let context = this;
    Keyboard.dismiss();
    context.startTimer();
    let propObject=this.props.navigation.state.params;
     switch(this.props.navigation.state.params.source){
        case "signup":
           this.props.userActions.resendOTP(propObject.mobile); 
        break;
        case "forgot":
          this.props.userActions.resendOTP(propObject.mobile); 
        break;
      }
  }

  // submit otp 
  onSubmitOtp(){
      Keyboard.dismiss();
      let { dispatch } =this.props.navigation;
      let otp = this.state.code1+this.state.code2+this.state.code3+this.state.code4; 
      let propObject=this.props.navigation.state.params;  
      if(otp.trim().length<4){
        dispatch(ToastActionsCreators.displayInfo("Enter a valid OTP"));
        return;
      }

      switch(this.props.navigation.state.params.source){
        case "signup":
          this.props.userActions.verifyOTP({...this.state,...propObject,otp}); 
        break;
        case "forgot":
          this.props.userActions.verifyForgotOTP({...this.state,...propObject,otp}); 
        break;
      }
  }

  _handleScrollView(ref) {
    let context = this;
    context.setTimeout(() => {
      let scrollResponder = context.refs.mainScrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ref,
        (Constants.BaseStyle.DEVICE_HEIGHT/100) * 50, //additionalOffset
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
        0, //(Screen.height/100) * 50, //additionalOffset
        true
      );
    }, 100);
  }

  render() {
    let context = this;
    // text input common props for otp
    const textInputCommonProps = {
      autoCapitalize:"none",
      keyboardType:"number-pad",
      maxLength:1,
      autoCorrect:false,
      onKeyPress:context.onKeyPress.bind(context),
    }
    const titleConfig = {
      title: "Mobile Number Verification",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
   
    let { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<BackButton onPress={()=>goBack()} />}
          title={titleConfig} />
        <ScrollView
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          keyboardDismissMode='on-drag' 
          keyboardShouldPersistTaps='always'
          ref={"mainScrollView"}
          style={{
            marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5,
          }}
        >
          <Text style={styles.headerStyle}>
            {'Enter the code sent to you at ' + this.state.mobile }
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 10
            }}
          >
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5
              }}
            >
              <TextInput
                keyboardType="numeric"
                autoFocus={false}
                ref="one"
                {...textInputCommonProps}
                onChangeText={(text)=>{
                  this.setState({code1:text});
                  if(text.trim().length!==0){
                    this.refs['two'].focus();
                  }
                }}
                style={styles.textInputStyle}
                onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.one));}}
                onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.one));}}
              />
            </View>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5
              }}
            >
              <TextInput
                keyboardType="numeric"
                ref="two"
                {...textInputCommonProps}
                onChangeText={(text)=>{
                  this.setState({code2:text});
                  if(text.trim().length!==0){
                    this.refs['three'].focus();
                  }
                }}
                style={styles.textInputStyle}
                autoFocus={false}
                onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.two));}}
                onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.two));}}
              />
            </View>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5
              }}
            >
              <TextInput
                keyboardType="numeric"
                ref="three"
                autoFocus={false}
                {...textInputCommonProps}
                onChangeText={(text)=>{
                  this.setState({code3:text});
                  if(text.trim().length!==0){
                    this.refs['four'].focus();
                  }
                }}
                style={styles.textInputStyle}
                onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.three));}}
                onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.three));}}
              />
            </View>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5
              }}
            >
              <TextInput
                keyboardType="numeric"
                ref="four"
                autoFocus={false}
                {...textInputCommonProps}
                keyboardAppearance={'light'}
                onChangeText={code4 => this.setState({ code4 })}
                style={styles.textInputStyle}
                onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.four));}}
                onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.four));}}
              />
            </View>
          </View> 
          {
            context.state.isDisabled ?
            <Text style={[styles.otp, {color: Constants.Colors.Gray}]}>
              {"Resend Code in  00:"+context.state.currentTime}
            </Text>
            :
            <View>
              <View style={{height: Constants.BaseStyle.DEVICE_HEIGHT / 100 *10}} />
              <TouchableOpacity onPress={() => this.resendOtpRestAPI()}>
                <Text style={[styles.otp, {color: Constants.Colors.Green, marginTop: 0}]}>Resend code</Text>
              </TouchableOpacity>
            </View>
          }
          <RoundButton
            text={"Verify"}
            buttonStyle={styles.buttonStyle}
            _Press={() => this.onSubmitOtp() }
          />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  otp: {
    marginLeft:Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    marginRight:Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT / 100 *10,
    ...Constants.Fonts.normal
  },
  resendLinkotp: {
    marginLeft:Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    marginRight:Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT / 100 *10,
    ...Constants.Fonts.normal,
    color:Constants.Colors.Green
  },
  headerStyle: {
    textAlign:"center",
    ...Constants.Fonts.content,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT / 100 *5,
  },
  buttonStyle: {
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT / 100 *10,
    alignSelf:"center",
    borderRadius: null
  },
  textInputStyle: {
    height: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 10,
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 11,
    textAlign: "center"
  }
});

ReactMixin(OtpForm.prototype, TimerMixin);

const mapStateToProps = state => ({
  user : state.user
})

const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(OtpForm)

