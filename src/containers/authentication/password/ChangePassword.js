/*
 * @file: ChangePassword.js
 * @description: Change App Password
 * @date: 13.06.2017
 * @author: Manish Budhraja
 * */

'use strict';
import React, { Component , PropTypes} from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard
} from 'react-native';
import Constants from "../../../constants";
import FormTextInput from '../../../components/common/FormTextInput';
import NavigationBar  from "react-native-navbar";
import BackButton  from "../../../components/common/BackButton";
import SubmitButton from '../../../components/common/RoundButton';
import Regex from '../../../utilities/Regex';
import { ToastActionsCreators } from 'react-native-redux-toast';
import _ from 'lodash';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../../redux/modules/user';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      oldPassword:'',
      newPassword:'',
      confirmPassword:'',
      token: this.props.user.userDetails.auth.token,
      userId: this.props.user.userDetails.userId,
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

  submitForm() {
    let context = this ;
    let { dispatch } = this.props.navigation;
    let { oldPassword, newPassword, confirmPassword } = this.state;
    let { currentPassword, newPasskey, confirmPasskey, passwordMatched, validatePassword  } = Constants.i18n.password;

    if(_.isEmpty(oldPassword)) {
      dispatch(ToastActionsCreators.displayInfo(currentPassword));
      return;
    }

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

    context.props.userActions.changePassword(this.state);
  }

  // Default Render Function
  render() {
    let { goBack } = this.props.navigation;
    let { change, current, newPass, confirm, save  } = Constants.i18n.password;
    const titleConfig = {
      title: change,
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
          keyboardDismissMode = {Platform.OS==='ios'?"on-drag":"interactive"}
        >
          <KeyboardAvoidingView behavior="padding">
            <FormTextInput
              ref='oldPass'
              autoFocus={true}
              style={{marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*3,}}
              placeHolderText={current}
              secureText={true}
              returnKey='next'
              isPassword={true}
              SubmitEditing={() => {this.refs.newPass.focus();}}
              onChangeText={(oldPassword)=>this.setState({oldPassword})}
            />
            <FormTextInput
              ref='newPass'
              placeHolderText={newPass}
              secureText={true}
              autoFocus={false}
              returnKey='next'
              isPassword={true}
              SubmitEditing={() => {this.refs.confirmPass.focus();}}
              onChangeText={(newPassword)=>this.setState({newPassword})}
            />
            <FormTextInput
              ref='confirmPass'
              placeHolderText={confirm}
              secureText={true}
              autoFocus={false}
              returnKey='done'
              isPassword={true}
              SubmitEditing={() => this.submitForm()}
              onChangeText={(confirmPassword)=>this.setState({confirmPassword})}
            />
          </KeyboardAvoidingView>
        </ScrollView>
        {
          !this.state.keyboardVisible &&
          <View style={{bottom:Constants.BaseStyle.DEVICE_HEIGHT/100*5}}>
            <SubmitButton
              buttonStyle={styles.buttonStyle}
              text={save.toUpperCase()}
              _Press={() => this.submitForm()} 
            />
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
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2/100
  },
  scroll:{
    marginBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*5
  }
});

ReactMixin(ChangePassword.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
