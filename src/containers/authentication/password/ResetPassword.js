'use strict';
/*
 * @file: ResetPasword.js
 * @description: Reset App Password
 * @date: 13.06.2017
 * @author: Manish Budhraja
 * */

import React, { Component , PropTypes} from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Image, Text, TouchableOpacity, Platform } from 'react-native';
import Constants from "../../../constants";
import FormTextInput from '../../../components/common/FormTextInput';
import NavigationBar  from "react-native-navbar";
import BackButton  from "../../../components/common/BackButton";
import SubmitButton from '../../../components/common/RoundButton';
import Regex from '../../../utilities/Regex';
import { ToastActionsCreators } from 'react-native-redux-toast';
import _ from 'lodash';
import * as userActions from '../../../redux/modules/user';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';


class ResetPassword extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      oldPassword:'',
      newPassword:'',
      confirmPassword:''
    }
  }

  submitForm(){
    let context = this ;
    let { dispatch } = context.props.navigation;
    let { oldPassword, newPassword, confirmPassword } = context.state;
    let { currentPassword, newPasskey, confirmPasskey, passwordMatched, validatePassword  } = Constants.i18n.password;
    
    if(_.isEmpty(newPassword)) {
      dispatch(ToastActionsCreators.displayInfo(newPasskey));
      return;
    }

    if(!Regex.validatePassword(newPassword)){
      dispatch(ToastActionsCreators.displayInfo(validatePassword));
      return;
    }

    if(_.isEmpty(confirmPassword)) {
      dispatch(ToastActionsCreators.displayInfo(confirmPasskey));
      return;
    }

    if(confirmPassword!==newPassword) {
      dispatch(ToastActionsCreators.displayInfo(passwordMatched));
    }

    context.props.userActions.resetPassword({...context.state,...context.props.navigation.state.params}); 
  }

  // Default Render Function
  render() {
    let { goBack } = this.props.navigation;
    let { reset, current, newPass, confirm, save  } = Constants.i18n.password;
    const titleConfig = {
      title: reset,
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
        <ScrollView 
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          keyboardDismissMode = {Platform.OS==='ios'?"on-drag":"interactive"}
          keyboardShouldPersistTaps='always'
        >
          <KeyboardAvoidingView behavior="padding">
            <FormTextInput
              ref='newPass'
              autoFocus={true}
              style={{marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*3,}}
              placeHolderText={newPass}
              secureText={true}
              returnKey='next'
              isPassword={true}
              SubmitEditing={() => {this.refs.confirmPass.focus();}}
              onChangeText={(newPassword)=>this.setState({newPassword})}
            />
            <FormTextInput
              ref='confirmPass'
              autoFocus={false}
              placeHolderText={confirm}
              secureText={true}
              returnKey='done'
              isPassword={true}
              SubmitEditing={() => this.submitForm()}
              onChangeText={(confirmPassword)=>this.setState({confirmPassword})}
            />
            <SubmitButton 
              buttonStyle={styles.buttonStyle}
              text={save.toUpperCase()} 
              _Press={() => this.submitForm()} 
            />
          </KeyboardAvoidingView>
        </ScrollView>
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
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT*52/100
  }
});

const mapStateToProps = state => ({
  userData: state
});

const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
