/* *
 * @file: RegisterBank.js
 * @description: Saves card details.
 * @date: 27.07.2017
 * @author: Manish Budhiraja
 * */

import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Image, Text, Animated, Picker, TouchableOpacity } from 'react-native';
import Constants from "../../constants";
import NavigationBar  from "react-native-navbar"
import BackButton  from "../../components/common/BackButton";
import RoundButton  from "../../components/common/RoundButton";
import DatePicker  from "../../components/common/Datepicker";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../redux/modules/user';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import Regex from '../../utilities/Regex';
import * as paymentActions from "../../redux/modules/payments";
import _ from 'lodash';
import FormTextInput from '../../components/common/FormTextInput';
import moment from 'moment';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { Keyboard } from 'react-native';
import CryptoJS from 'crypto-js';
import DatepickerHeader from '../../components/common/DatepickerHeader';

class RegisterBank extends Component {
  constructor(props){
    super(props);
    this.state={
      showPicker:false,
      dob:new Date(),
      tempDob : new Date(),
      dobColor:Constants.Colors.Gray,
      dobWidth:1,
      countryColor:Constants.Colors.Gray,
      countryWidth:1,
      firstName:'',
      email:'',
      lastName:'',
      state:'',
      street:'',
      city:'',
      country:'',
      ssnLast4:'',
      postalCode:'',
      accountNumber:'',
      routingNumber:'',
      countryPicker:false,
      token:this.props.user.userDetails.auth.token,
      userId:this.props.user.userDetails.userId,
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

  hidePicker(){
    this.setState({showPicker: false, dobColor: Constants.Colors.Gray, dobWidth: 1})
  }

  onSubmit(){
    Keyboard.dismiss()
    let { navigate,dispatch } = this.props.navigation;
    let { firstName,lastName,dob,email,country,accountNumber,routingNumber,postalCode,street,state,city,ssnLast4} = this.state;
    let { enterEmail, enterPassword, enterValidEmail, enterValidPassword } = Constants.i18n.common;
    let { firstNameNotEmpty, enterValidFirstName, lastNameNotEmpty, enterValidLastName, enterValidCountryName, 
      enterValidAccountNumber, enterValidRoutingNumber, enterValidPostalCode, enterValidCityName, 
      enterValidStateName, enterValidSSN, onlyLastFourDigits 
    } = Constants.i18n.bookings;

    if(_.isEmpty(firstName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(firstNameNotEmpty));
      return;
     }
      if(Regex.validateEmoji(firstName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidFirstName));
      return;
    }

    if(!Regex.validateString(firstName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidFirstName));
      return;
    }
     if(_.isEmpty(lastName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(lastNameNotEmpty));
      return;
     }
      if(Regex.validateEmoji(lastName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidLastName));
      return;
    }

    if(!Regex.validateString(lastName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidLastName));
      return;
    }

    if(!Regex.validateEmail(email.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidEmail));
      return;
    }

    if(!Regex.validateStringMinimumLength2(country.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidCountryName));
      return;
    }
    if(!Regex.validateNumbers(accountNumber.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidAccountNumber));
      return;
    }
    if(!Regex.validateNumbers(routingNumber.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidRoutingNumber));
      return;
    }

    if(!Regex.validateAlphaNumberic(postalCode.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidPostalCode));
      return;
    }

    if(!Regex.validateString(city.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidCityName));
      return;
    }
    if(!Regex.validateStringMinimumLength2(state.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidStateName));
      return;
    }
    if(!Regex.validateNumbers(ssnLast4.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidSSN));
      return;
    }
    if(ssnLast4.length>4){
      dispatch(ToastActionsCreators.displayInfo(onlyLastFourDigits));
      return;
    }   
    
    let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({
      'accountNumber':accountNumber,
      'routingNumber':routingNumber,
      'postalCode':postalCode,
      'ssnLast4':ssnLast4}), Constants.Encryption_Decryption_Key);

    this.props.paymentActions.createStripeAccount({
      ...this.state,encryptedObject:ciphertext.toString()
    });
  }

  render() {
    let { goBack } = this.props.navigation;
    const titleConfig = {
      title: "Add Bank Account",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    let { firstName, lastName, email } = Constants.i18n.common;
    return (
      <View style={styles.container}>
        <NavigationBar 
          title={titleConfig}
          leftButton={<BackButton onPress={()=>goBack()} />}
        />
        <ScrollView 
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' ref='mainScrollView'>
          <FormTextInput
            ref='firstName'
            autoFocus={true}
            style={{marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*3,}}
            placeHolderText={firstName}
            inputStyle={Constants.Fonts.content }
            secureText={false}
            isPassword={false}
            returnKey='next'
            SubmitEditing={() => {this.refs.lastName.focus();}}
            onChangeText={(firstName)=>this.setState({firstName})}
          />
          <FormTextInput
            ref='lastName'
            placeHolderText={lastName}
            secureText={false}
            inputStyle={Constants.Fonts.content }
            isPassword={false}
            autoFocus={false}
            returnKey='next'
            SubmitEditing={() => {this.refs.email.focus();}}
            onChangeText={(lastName)=>this.setState({lastName})}
          />
          <FormTextInput
            ref='email'
            placeHolderText={email}
            secureText={false}
            isPassword={false}
            inputStyle={Constants.Fonts.content }
            autoFocus={false}
            returnKey='done'
            isPassword={true}
            keyboard="email-address"
            SubmitEditing={() => {this.refs.dob.focus();}}
            onChangeText={(email)=>this.setState({email})}
          />

          <TouchableOpacity style={[styles.viewStyle,{ borderBottomColor:this.state.dobColor,borderBottomWidth:this.state.dobWidth }]} onPress={ ()=>{ Keyboard.dismiss()
            this.setState({showPicker:true,dobColor:Constants.Colors.Green,dobWidth:2}); }} >
            <Text
              ref='dob'
              style={[
                Constants.Fonts.content, 
                {
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*1/100,
                  height: Constants.BaseStyle.DEVICE_HEIGHT/100*7,
                  textAlign: 'left',
                  color: this.state.dobColor
                }
              ]}
            >
              {this.state.dob !='' ? moment(this.state.dob).format('MMMM Do YYYY') : 'DOB' }
            </Text>
          </TouchableOpacity> 

          <TouchableOpacity style={[styles.viewStyle,{ borderBottomColor:this.state.countryColor,borderBottomWidth:this.state.countryWidth }]} onPress={ ()=>{ Keyboard.dismiss()
            this.setState({countryPicker:true,countryColor:Constants.Colors.Green,countryWidth:2}); }} >
            <Text
              ref='country'
              style={[
                Constants.Fonts.content, 
                {
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*1/100,
                  height: Constants.BaseStyle.DEVICE_HEIGHT/100*7,
                  textAlign: 'left',
                  color: this.state.dobColor
                }
              ]}
            >
              {this.state.country !='' ? this.state.country : 'Country' }
            </Text>
          </TouchableOpacity> 

           <FormTextInput
            ref='accountNumber'
            placeHolderText={'Account Number'}
            inputStyle={Constants.Fonts.content }
            secureText={false}
            isPassword={false}
            autoFocus={false}
            returnKey='done'
            isPassword={true}
            keyboard="numeric"
            onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.accountNumber));}}
            onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.accountNumber));}}
            SubmitEditing={() => {this.refs.routingNumber.focus();}}
            onChangeText={(accountNumber)=>this.setState({accountNumber})}
          />
          <FormTextInput
            ref='routingNumber'
            placeHolderText={'Routing Number'}
            inputStyle={Constants.Fonts.content }
            secureText={false}
            isPassword={false}
            autoFocus={false}
            returnKey='done'
            isPassword={true}
            keyboard="numeric"
            onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.routingNumber));}}
            onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.routingNumber));}}
            SubmitEditing={() => {this.refs.currency.focus();}}
            onChangeText={(routingNumber)=>this.setState({routingNumber})}
          />
          
          <FormTextInput
            ref='postalCode'
            placeHolderText={'Postal Code'}
            secureText={false}
            inputStyle={Constants.Fonts.content }
            isPassword={false}
            autoFocus={false}
            returnKey='done'
            isPassword={true}
            keyboard="numeric"
            onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.postalCode));}}
            onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.postalCode));}}
            SubmitEditing={() => {this.refs.street.focus();}}
            onChangeText={(postalCode)=>this.setState({postalCode})}
          />
           <FormTextInput
            ref='street'
            placeHolderText={'Street'}
            inputStyle={Constants.Fonts.content }
            secureText={false}
            isPassword={false}
            autoFocus={false}
            returnKey='done'
            isPassword={true}
            onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.street));}}
            onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.street));}}
            SubmitEditing={() => {this.refs.city.focus();}}
            onChangeText={(street)=>this.setState({street})}
          />
          <FormTextInput
            ref='city'
            placeHolderText={'City'}
            inputStyle={Constants.Fonts.content }
            secureText={false}
            isPassword={false}
            autoFocus={false}
            returnKey='done'
            isPassword={true}
            onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.city));}}
            onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.city));}}
            SubmitEditing={() => {this.refs.state.focus();}}
            onChangeText={(city)=>this.setState({city})}
          />
          <FormTextInput
            ref='state'
            placeHolderText={'State'}
            inputStyle={Constants.Fonts.content }
            secureText={false}
            isPassword={false}
            autoFocus={false}
            returnKey='done'
            isPassword={true}
            onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.state));}}
            onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.state));}}
            onChangeText={(state)=>this.setState({state})}
          />
          <FormTextInput
            ref='ssnLast4'
            placeHolderText={'SSN Last Four Digit'}
            inputStyle={Constants.Fonts.content }
            secureText={false}
            isPassword={false}
            autoFocus={false}
            returnKey='done'
            keyboard={'numeric'}
            isPassword={true}
            onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.ssnLast4));}}
            onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.ssnLast4));}}
            onChangeText={(ssnLast4)=>this.setState({ssnLast4})}
          />
         
         <RoundButton
            text={'Save'}
            _Press={() => this.onSubmit()}
            buttonStyle={styles.buttonStyle}
          />
        </ScrollView>
        { 
          this.state.showPicker && 
          <DatePicker
              onDateChange={date => this.setState({ tempDob : date })}
              onCancel={() => {
                this.hidePicker();
              }}
              date={ this.state.dob !='' ? this.state.tempDob : new Date() }
              type='filter'
              label="Done"
              mode="date"
              maximumDate={new Date()}
              Press={() => { this.setState({showPicker:false,dob:this.state.tempDob,dobColor:Constants.Colors.Gray,dobWidth:1}) }}
          />
        }
        {
          this.state.countryPicker &&
          <View style={{ top:0, bottom:0, left:0,right:0, position:"absolute", backgroundColor:'rgba(0,0,0,0)'}}>
            <View  style={{
              width: Constants.BaseStyle.DEVICE_WIDTH,
              position: "absolute",
              bottom: 0,
              backgroundColor: 'white',
              shadowColor:"gray",
              shadowOffset: {width: 2, height: 2},
              shadowOpacity:0.9,
              shadowRadius:10
            }}>
              <DatepickerHeader
                title={this.props.type=='filter'?"":''}
                cancel={ ()=>this.setState({countryPicker:false}) }
              />
              <Picker
                selectedValue={this.state.tempCountry}
                onValueChange={(itemValue, itemIndex) => {this.setState({tempCountry: itemValue})}}>
                {Constants.Countries.map((country) => (
                  <Picker.Item
                    key={country.name + " " + country.code}
                    value={country.code}
                    label={country.name}
                  />
                  )
                )}
              </Picker>
              <RoundButton
                text={'Done'}
                _Press={() => {this.setState({country:this.state.tempCountry,countryPicker:false,countryColor:Constants.Colors.Gray,countryWidth:1})}}
                buttonStyle={styles.buttonStyle}
              />
            </View>
          </View>
        }
      </View>
    );
  }
}

ReactMixin(RegisterBank.prototype, TimerMixin);

const styles = StyleSheet.create({
  container:{
    flex:1,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    backgroundColor:Constants.Colors.White
  },
  label: {
    color: Constants.Colors.Gray,
    fontWeight:"200"
  },
  input: {
    color: Constants.Colors.Black,
    fontWeight:"200"
  },
  buttonStyle:{
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT / 100 *5,
    marginBottom:Constants.BaseStyle.DEVICE_HEIGHT / 100 *5,
    alignSelf:"center",
    borderRadius:null
  },
  viewStyle: {
    borderBottomColor: Constants.Colors.Gray,
    borderBottomWidth: 1,
    marginHorizontal: (Constants.BaseStyle.DEVICE_WIDTH/100)*5,
    marginVertical: Constants.BaseStyle.DEVICE_WIDTH*2/100,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*3,
  }
});

const mapStateToProps = state => ({
  user:state.user,
});

const mapDispatchToProps = dispatch => ({
  paymentActions    : bindActionCreators(paymentActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterBank);
