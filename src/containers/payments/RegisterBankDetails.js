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
import _ from 'lodash';
import TextField from '../../components/common/TextField';
import moment from "moment";



class RegisterBankDetails extends React.Component {
    
  constructor(props){
    super(props);
  }

  render() {
    let { goBack } = this.props.navigation;
    const titleConfig = {
      title: "View Bank Details",
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
          leftButton={<BackButton onPress={()=>goBack()} />} />
        <ScrollView 
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' ref='mainScrollView'>
        <View style={{  marginHorizontal:Constants.BaseStyle.DEVICE_HEIGHT*2/100,paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100, paddingBottom:Constants.BaseStyle.DEVICE_HEIGHT*5/100  }}>
           <TextField
                headerText={firstName}
                dataText={this.props.payments.bankDetails.first_name}
            />
            <TextField
                headerText={lastName}
                dataText={this.props.payments.bankDetails.last_name}
            />
            <TextField
                headerText={email}
                dataText={this.props.payments.bankDetails.email}
            />
            <TextField
                headerText={"DOB"}
                dataText={
                moment(this.props.payments.bankDetails.dob.day +' '+this.props.payments.bankDetails.dob.month +' '+ this.props.payments.bankDetails.dob.year, "D MM YYYY").format("DD-MMMM-YYYY")}
              />
              <TextField
                  headerText={"Country"}
                dataText={this.props.payments.bankDetails.address.country}
            />
            <TextField
                headerText={"Street"}
                dataText={this.props.payments.bankDetails.address.line1}
            />
            <TextField
                headerText={"City"}
                dataText={this.props.payments.bankDetails.address.city}
            />
            <TextField
                headerText={"State"}
                dataText={this.props.payments.bankDetails.address.state}
            />
            <TextField
                headerText={"Postal Code"}
                dataText={this.props.payments.bankDetails.address.postal_code}
            />

            <TextField
                headerText={"Account Number"}
                dataText={"xxxx xxxx " + this.props.payments.bankDetails.last4}
            />
            <TextField
                headerText={"Routing Number"}
                dataText={this.props.payments.bankDetails.routing_number}
            />
           

        </View>    

        </ScrollView>  
      </View>
    )
  }
}

 ReactMixin(RegisterBankDetails.prototype, TimerMixin);

const styles = StyleSheet.create({
  container:{
    flex:1,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    backgroundColor:Constants.Colors.White,


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
  payments:state.payments
});

export default connect(mapStateToProps, null)(RegisterBankDetails);
