'use strict';
/*
 * @file: i18n.js
 * @description: Contact Admin in case of any query.
 * @date: 13.06.2017
 * @author: Manish Budhraja
 * */
import React, { Component , PropTypes} from 'react';
import ReactNative, { ScrollView, StyleSheet, View, findNodeHandle, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import Constants from "../../constants";
import FormTextInput from '../../components/common/FormTextInput';
import NavigationBar  from "react-native-navbar";
import BackButton  from "../../components/common/BackButton";
import SubmitButton from '../../components/common/RoundButton';
import Regex from '../../utilities/Regex';
import { ToastActionsCreators } from 'react-native-redux-toast';
import _ from 'lodash';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../redux/modules/user';

class ContactSupport extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      email : '',
      contact : '',
      description : '',
      desHeight : Constants.BaseStyle.DEVICE_HEIGHT/100*7,
      keyboardVisible: false
    }
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow=()=>{
    this.setState({ keyboardVisible: true });
  }

  _keyboardDidHide=()=>{
    this.setState({ keyboardVisible: false });
  }

  // Keyboard Handling
  _handleScrollView(ref) {
    let context = this;
    context.setTimeout(() => {
      let scrollResponder = context.refs.mainScrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ref,
        (Constants.BaseStyle.DEVICE_HEIGHT/100) * 30, //additionalOffset
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
  
  // Form Submission and Rest API Call
  submitForm(){
    let context = this ;
    let { dispatch } = this.props.navigation;

    let { name, email, contact, description } = this.state;

    let { enterFullName, enterMobile, enterValidMobile } = Constants.i18n.signup;
    let { enterEmail, enterValidEmail, contactNumber } = Constants.i18n.common;
    let { enterDescription } = Constants.i18n.bookings;

    if(_.isEmpty(name.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterFullName));
      return;
    }

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

    if(_.isEmpty(contact.trim())) {
      dispatch(ToastActionsCreators.displayInfo(contactNumber));
      return;
    }
    if(!Regex.validateMobile(contact.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMobile));
      return;
    }

    if(_.isEmpty(description.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterDescription));
      return;
    }

    context.props.userActions.contactSupport(context.state);
  }

  // Default Render Function
  render() {
    let { goBack } = this.props.navigation;
    let { contact, write_us, save, fullName, emailAddress, contactNumber  } = Constants.i18n.common;
    const titleConfig = {
      title: contact,
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };

    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<BackButton onPress={()=>goBack()} />}
          title={titleConfig}
        />
        <ScrollView style={styles.scroll}
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  
          keyboardDismissMode={Platform.OS==="ios"?'on-drag':'interactive'}
          keyboardShouldPersistTaps='always'
          ref='mainScrollView'
        >
          <KeyboardAvoidingView behavior="padding">
            <FormTextInput
              ref='name'
              placeHolderText={fullName}
              returnKey='next'
              secureText={false}
              isPassword={false}
              SubmitEditing={() => {this.refs.email.focus();}}
              onChangeText={(name)=>this.setState({name})}
            />
            <FormTextInput
              ref='email'
              placeHolderText={emailAddress}
              returnKey='next'
              secureText={false}
              isPassword={false}
              keyboard='email-address'
              SubmitEditing={() => {this.refs.contact.focus();}}
              onChangeText={(email)=>this.setState({email})}
            />
            <FormTextInput
              ref='contact'
              placeHolderText={"E.g. +1234567890"}
              returnKey='next'
              secureText={false}
              isPassword={false}
              keyboard='phone-pad'
              SubmitEditing={() => {this.refs.description.focus();}}
              onChangeText={(contact)=>this.setState({contact})}
            />
            <FormTextInput
              ref='description'
              placeHolderText={write_us}
              returnKey='done'
              secureText={false}
              isPassword={false}
              multiline={true}
              inputStyle={{height:this.state.desHeight}}
              SubmitEditing={() => this.submitForm()}
              onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.description));}}
              onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.description));}}
              onChange = {(event)=>{
                const { contentSize, text } = event.nativeEvent;
                if (this.state.desHeight !== contentSize.height) {
                  this.setState({desHeight: contentSize.height+15});
                }
              }}
              onChangeText={(description)=>this.setState({description})}
            />
          </KeyboardAvoidingView>
        </ScrollView>
        {
          !this.state.keyboardVisible &&
          <View style={{bottom:Constants.BaseStyle.DEVICE_HEIGHT/100*5}}>
            <SubmitButton 
              buttonStyle={styles.buttonStyle}
              text={save.toUpperCase()} 
              _Press={() => this.submitForm()} />
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex  : 1,
    width : Constants.BaseStyle.DEVICE_WIDTH,
    backgroundColor:Constants.Colors.White
  },
  buttonStyle:{
    borderRadius:null,
    alignSelf:"center",
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2
  },
  scroll:{
    marginBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*5
  }
});

ReactMixin(ContactSupport.prototype, TimerMixin);

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(null, mapDispatchToProps)(ContactSupport);
