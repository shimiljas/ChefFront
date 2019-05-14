'use strict';

/*
 * @file: index.js
 * @description: Raise Dispute against any job.
 * @date: 30.06.2017
 * @author: Manish Budhiraja
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
  KeyboardAvoidingView
} from 'react-native';
import _ from 'lodash';
import Constants from '../../constants';
import Regex from '../../utilities/Regex';
import BackgroundImage from '../../components/common/Background';
import RoundButton from '../../components/common/RoundButton';
import InputField from '../../components/common/InputFieldNonEditable';
import { ToastActionsCreators } from 'react-native-redux-toast';
import NavigationBar  from "react-native-navbar";
import BackButton  from "../../components/common/BackButton";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Idx from '../../utilities/Idx';
import * as bookingsActions from '../../redux/modules/bookings';
let token = "",userId= "";
class Dispute extends Component {
  constructor(props) {
    super(props);
    if(Idx(this.props,_ => _.user.userDetails.auth.token)){
      token = this.props.user.userDetails.auth.token;
      userId = this.props.user.userDetails.userId;
    }
    this.state= {
      userEmail   : this.props.user.userDetails.email,
      userName    : this.props.user.userDetails.fullName,
      userPhone   : this.props.user.userDetails.phoneNum,
      userMessage : '',
      desHeight   : 35
    };
    this.navigation = this.props.navigation;
  }

  /**
  * Form Submission and Rest API Call
  */
  componentDidMount() {
   
  }

  onSubmit() {
    let context = this;
    let { goBack, navigate, dispatch } = context.props.navigation;
    let { userMessage , userName , userPhone, userEmail } = context.state;
    let {enterMessage } = Constants.i18n.signup;
    let { booking_number }  = context.props.navigation.state.params;
    if(_.isEmpty(userMessage.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterMessage));
      return;
    }else{
      let requestObj = {
                      token : token,
                      userId : userId,
                      bookingNumber : booking_number,
                      enterMessage : userMessage,
                      userName : userName,
                      userPhone : userPhone,
                      userEmail : userEmail
                    };
     context.props.bookingsActions.raiseDispute(requestObj,function(success){
      if(success){
        context.props.navigation.state.params.callBack()
      }
     });
    }

  }

  onChange=(event)=>{
    let context = this;
    const { contentSize, text } = event.nativeEvent;
    if (this.state.desHeight !== contentSize.height) {
      this.setState({
        desHeight : contentSize.height+15,
      });
    }
  }

  render() {
    let { title, name, email, contact, msg } = Constants.i18n.dispute;
    let { goBack } = this.props.navigation;
    const titleConfig = {
      title: title,
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    return (
        <View style={styles.mainView}>
          <NavigationBar 
            leftButton={<BackButton onPress={()=>goBack()} />}
            title={titleConfig} />
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always'>
            <KeyboardAvoidingView behavior='position'>
              <View style={styles.container}>
                <InputField
                  ref='name'
                  inputStyle={styles.inputStyle}
                  viewStyle={styles.viewStyle}
                  headerStyle={styles.headerStyle}
                  headerText={name}
                  value={this.state.userName}
                  editable={false}
                  //placeHolderText={enterEmail}
                  placeHolderColor={Constants.Colors.Gray}
                  returnKey='next'
                  SubmitEditing={(event) => {this.refs.email.focus();}}
                  onChangeText={(userName)=>this.setState({userName})}
                />
                <InputField
                  ref='email'
                  inputStyle={styles.inputStyle}
                  viewStyle={styles.viewStyle}
                  headerStyle={styles.headerStyle}
                  headerText={email}
                  value={this.state.userEmail}
                  keyboard='email-address'
                  editable={false}
                  //placeHolderText={enterPassword}
                  placeHolderColor={Constants.Colors.Gray}
                  returnKey='next'
                  SubmitEditing={(event) => {this.refs.phone.focus();}}
                  onChangeText={(userEmail)=>this.setState({userEmail})}
                />
                <InputField
                  ref='phone'
                  headerStyle={styles.headerStyle}
                  inputStyle={styles.inputStyle}
                  viewStyle={styles.viewStyle}
                  headerText={contact}
                  editable={false}
                  value={this.state.userPhone}
                  //placeHolderText={enterPassword}
                  placeHolderColor={Constants.Colors.Gray}
                  returnKey='next'
                  SubmitEditing={(event) => {this.refs.message.focus();}}
                  onChangeText={(userPhone)=>this.setState({userPhone})}
                />
                <InputField
                  ref='message'
                  inputStyle={[styles.inputStyle,{height:this.state.desHeight}]}
                  headerStyle={styles.headerStyle}
                  headerText={msg}
                  //placeHolderText={enterPassword}
                  placeHolderColor={Constants.Colors.Gray}
                  returnKey='done'
                  autoFocus={true}
                  SubmitEditing={ (event) => this.onSubmit() }
                  multiline = {true}
                  maxLength = {250}
                  onChange={this.onChange}
                  onChangeText={(userMessage)=>this.setState({userMessage})}
                />
              </View>
              <RoundButton
                text="SUBMIT"
                viewStyle={{paddingBottom:Constants.BaseStyle.DEVICE_HEIGHT*5/100,}}
                buttonStyle={styles.buttonStyle}
                _Press={()=>this.onSubmit()}
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>      
    );
  }
}


const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor:Constants.Colors.White
  },
  container: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*22.5/100,
    alignItems: 'center',
  },
  inputStyle:{
    color:Constants.Colors.Black,
  },
  buttonStyle:{
    alignSelf:"center",
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    width:Constants.BaseStyle.DEVICE_WIDTH*50/100,
    borderRadius:Constants.BaseStyle.DEVICE_WIDTH*10/100
  },
  headerStyle:{
    ...Constants.Fonts.tinyLarge,
  }
});

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  bookingsActions: bindActionCreators(bookingsActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Dispute);