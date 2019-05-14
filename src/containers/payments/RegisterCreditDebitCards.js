/* *
 * @file: RegisterCreditDebitCards.js
 * @description: Saves card details.
 * @date: 27.07.2017
 * @author: Manish Budhiraja
 * */

import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import Constants from "../../constants";
import NavigationBar  from "react-native-navbar";
import CryptoJS from 'crypto-js';
import BackButton  from "../../components/common/BackButton";
import RoundButton  from "../../components/common/RoundButton";
import { CreditCardInput } from "react-native-credit-card-input";
import Stripe  from "react-native-stripe-api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../redux/modules/user";
import * as paymentActions from "../../redux/modules/payments";
import * as applicationActions from '../../redux/modules/app';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { ToastActionsCreators } from 'react-native-redux-toast';
import Idx from "../../utilities/Idx";

const StripeClient = new Stripe(Constants.StripeAPIKey);

class RegisterCreditDebitCards extends React.Component {
  constructor(props) {
    super(props);
    if (Idx(this.props, _ => _.user.userDetails.auth.token)) {
      this.isLoggedIn = true;
      this.token = this.props.user.userDetails.auth.token;
      this.userId = this.props.user.userDetails.userId;
    }
    this.state = {
      cardDetails: {},
    }
    this.onChange = this.onChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.isValid = false;
  }

  // Receives all changes in card details
  onChange(data) {
    this.setState({
      cardDetails: data.values,
    });
    this.isValid = data.valid;
    console.log("onChange ", data)

  }

  // Create a Stripe token with new card infos & send to server.
  async onFormSubmit() {
    let context = this;
    if(context.isValid) {
      context.props.applicationActions.startLoading();
      let { number, expiry, cvc, type } = context.state.cardDetails;
      let dates = expiry.split("/");
      const token = await StripeClient.createToken({
        number: number ,
        exp_month: dates[0], 
        exp_year: dates[1], 
        cvc:cvc,
      });
      if(!token.Error) {
        context.props.paymentActions.saveCreditDebitCard({
          cardToken:token.id,
          token:context.token,
          userId:context.userId,
          name:this.props.user.userDetails.fullName
        });
      } else {
        context.props.applicationActions.stopLoading();
        context.props.navigation.dispatch(ToastActionsCreators.displayInfo("Failed to create card token. Try again."));
      }
    } else {
      context.props.navigation.dispatch(ToastActionsCreators.displayInfo(Constants.i18n.payments.validCard));
    }
  }

  // Default render function
  render() {
    let { goBack } = this.props.navigation;
    const titleConfig = {
      title: "Add Card",
      tintColor: "#fff",
      style: {
        ...Constants.Fonts.content
      }
    };
    let { cardHolder, cardNumber, expiry, cvv } = Constants.i18n.payments;
    return (
      <View style={styles.container}>
        <NavigationBar 
          title={titleConfig}
          leftButton={<BackButton onPress={()=>goBack()} />} 
        />
        <ScrollView 
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          keyboardDismissMode = {Platform.OS==='ios' ? "on-drag" : "interactive"}
          keyboardShouldPersistTaps='always'
          style={styles.scroll}
        >
          <KeyboardAvoidingView behavior="padding">
            <CreditCardInput
              //requiresName={true}
              allowScroll={false}
              cardImageFront={Constants.Images.payment_bg_white}
              cardImageBack={Constants.Images.payment_bg_back}
              cardFontFamily={"Montserrat-Regular"}
              placeholderColor={Constants.Colors.Gray}
              labels={{
                number: cardNumber, 
                expiry: expiry, 
                cvc: cvv, 
                name:cardHolder, 
              }}
              placeholders={{
                number: cardNumber, 
                expiry: expiry, 
                cvc: cvv, 
                name:cardHolder, 
              }}
              inputContainerStyle={{
                borderBottomWidth: 1, borderBottomColor:Constants.Colors.Green
              }}
              onChange={this.onChange}
              labelStyle={[styles.label,Constants.Fonts.content]}
              inputStyle={[styles.input,Constants.Fonts.content]}
              autoFocus={false}
            />
            <RoundButton 
              text={"Save"}
              buttonStyle={styles.buttonStyle}
              _Press={this.onFormSubmit}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Constants.BaseStyle.DEVICE_WIDTH,
    backgroundColor: Constants.Colors.White
  },
  scroll: {
    paddingTop:Constants.BaseStyle.DEVICE_HEIGHT/100*5,
  },
  label: {
    color: Constants.Colors.Gray,
    fontWeight: "200"
  },
  input: {
    color: Constants.Colors.Black,
    fontWeight: "200"
  },
  buttonStyle: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT/100*25,
    alignSelf: "center",
    borderRadius: null
  }
});

ReactMixin(RegisterCreditDebitCards.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  userActions     : bindActionCreators(userActions, dispatch),
  paymentActions  : bindActionCreators(paymentActions, dispatch),
  applicationActions : bindActionCreators(applicationActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterCreditDebitCards);
