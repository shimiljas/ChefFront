/*
 * @file: PastBookingChef.js
 * @description: Screen for past bookings after the dispute has been resolved.
 * @date: 24.07.2017
 * @author: Parshant
 * */

'use strict';
import React, { Component } from 'react';
import ReactNative , {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import _ from 'lodash';
import { ToastActionsCreators } from 'react-native-redux-toast';
import NavigationBar  from "react-native-navbar";
import Constants from '../../constants';
import Regex from '../../utilities/Regex';
import BackButton  from "../../components/common/BackButton"; 
import Avatar from "../../components/common/Avatar";
import StarRating from "../../components/common/StarRating";
import RoundButton from "../../components/common/RoundButton";
import FormTextInput from "../../components/common/FormTextInput";
import { connect } from "react-redux";
import Idx from '../../utilities/Idx';
import { bindActionCreators } from 'redux'
import moment from 'moment';
import * as bookingsActions from '../../redux/modules/bookings';

class PastBookingDetailChef extends Component {
  constructor(props) {
    super(props)
    this.state={
      amount: 17,
      name: "Francis Ford",
      rating: this.props.navigation.state.params.data.hasOwnProperty("customerRating") ? this.props.navigation.state.params.data.customerRating.rating : 0,
      description: this.props.navigation.state.params.data.hasOwnProperty("customerRating") ? this.props.navigation.state.params.data.customerRating.review : "",
      hourlyRate: "7",
      timeDuration: "07:15",
      startTime: "04:00 pm",
      endTime: "06:00 pm",
      date: "24 Mar 2017",
      editable : this.props.navigation.state.params.data.hasOwnProperty("customerRating") ? false : this.props.navigation.state.params.data.status == 7 ? false : true,
      height: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    }

    console.log("PastBookingDetailChef=>  ", this.props.navigation.state.params.data)

  }

  // Function called for close a dispute
  closeDispute(){
    let context = this;
    let requestObj = {
      bookingNumber : context.props.navigation.state.params.data.booking_number,
      token : context.props.user.userDetails.auth.token,
      userId : context.props.user.userDetails.userId,
    }
    context.props.bookingsActions.closeDispute(requestObj,function(success){
      if(success){
       context.props.navigation.state.params.callBack()
      }
    });
  }


 // Function called for to raise a dispute
  raiseDispute(){ 
    let context = this;
    context.props.navigation.navigate("Dispute",{
      booking_number : context.props.navigation.state.params.data.booking_number,
      callBack : context.props.navigation.state.params.callBack
    });
  }

  rating(){
    let context = this;
    let {dispatch } = context.props.navigation;
    if(context.state.rating === 0){
      dispatch(ToastActionsCreators.displayInfo("Please rate the consumer."));
      return;
    }else{
     let requestObj = { 
        bookingNumber : context.props.navigation.state.params.data.booking_number,
        rating : context.state.rating,
        description : context.state.description,
        token : context.props.user.userDetails.auth.token,
        userId : context.props.user.userDetails.userId,
      }
      context.props.bookingsActions.review(requestObj,function(success){
        if(success){
         context.props.navigation.state.params.callBack()
        }
      });
    }
  }

// Function called to show close and raise a dispute 
  renderCancelAndRaised(){
    return(
      <View style={{flex : 1,flexDirection : "row"}}>
        <View style={{flex : 0.3,padding :10}}>
          <TouchableOpacity onPress={()=>{this.closeDispute()}} style={{borderWidth : 1,borderColor : "red",height : Constants.BaseStyle.DEVICE_HEIGHT*7/100,justifyContent : "center",alignItems : "center"}}>
           <Text  style={{color : "red"}}>
           CLOSE
           </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex : 0.7,padding :10}}>
          <TouchableOpacity onPress={()=>{this.raiseDispute();}} style={{borderWidth : 1,borderColor : "green",height : Constants.BaseStyle.DEVICE_HEIGHT*7/100,justifyContent : "center",alignItems : "center"}}>
            <Text style={{color : "green"}}>
              RAISE A DISPUTE
           </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
// Function called to show rating 
  renderRate(){
    return(
      <RoundButton
        text={"Rate"}
        buttonStyle={styles.buttonStyle}
        _Press={() => this.rating() }
      />
    )
  }

  renderRateCharged(){
    return this.props.navigation.state.params.data.ratePerHour?Regex.removeTrailingZeros(this.props.navigation.state.params.data.ratePerHour):"";
  } 

  /**
  * Get Amount 
  */ 

  renderAmount(){
    let { status } = this.props.navigation.state.params.data;
    if(status==6 || status==7  || status==11 ){
      let cost = (this.props.navigation.state.params.data.totalCost.toFixed(2) - this.props.navigation.state.params.data.adminCost.toFixed(2));
     return Regex.removeTrailingZeros(cost);   
    }else{
      let refundCost  = this.props.navigation.state.params.data.refundAmount?
      this.props.navigation.state.params.data.refundAmount.toFixed(2):""; 
      return Regex.removeTrailingZeros(refundCost); 
    }
  }

  /**
  * Render amount header
  */ 

  renderAmountHeader(){
    switch(this.props.navigation.state.params.data.status){
      case 6:
      return "Total Earning";
      case 7:
      return "Total amount on hold";
      case 8:
      return "Total amount refunded";
      case 9:
      return "Total amount refunded";
      case 10:
      return "Total amount refunded";
      case 11:
      return "Total Earning";
    }
  }

  // Default render function
  render() {
    const titleConfig = {
      title: "Dispute Resolved",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    let { goBack } = this.props.navigation;
    let {
      totalAmountPaid,
      hourlyRate,
      timeDuration,
      cookingStartTime,
      cookingEndTime,
      cookingDate,
      cookingStartDate,
      cookingEndDate,
      addDescription,
      writeAReview,
      raiseADispute
    } = Constants.i18n.bookings;

    let a = moment(this.props.navigation.state.params.data.ends_on);
    let b = moment(this.props.navigation.state.params.data.starts_on);
    let duration = a.diff(b, 'hours');
    console.log("PastBookingDetailChef Rate " , this.props.navigation.state.params.data.ratePerHour)
    return (
      <View style={styles.mainView}>
        <NavigationBar
          leftButton={<BackButton onPress={()=>goBack()} />}
        />
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always'>
          <View style={styles.amountContainer}>
            <Text style={{...Constants.Fonts.subtitle, color: Constants.Colors.White}}>
              { this.renderAmountHeader()}
            </Text>
            <View style={{flexDirection: 'row', paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*4/100}}>
              <Text style={{...Constants.Fonts.normal, color: Constants.Colors.White, top: Constants.BaseStyle.DEVICE_HEIGHT*2.5/100}}>$</Text>
              <Text style={{...Constants.Fonts.largest, color: Constants.Colors.White}}>{this.renderAmount()}</Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Avatar user ={this.props.navigation.state.params.data.user} />
              </View>
              <View style={{
                flex: 4,
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <View style={styles.nameContainerStyle}>
                  <Text style={styles.nameStyle}>
                   {this.props.navigation.state.params.data.user.fullName.capitalizeEachLetter()}
                  </Text>
                </View>
                <View style={styles.ratingContainerStyle}>
                  { this.props.navigation.state.params.data.status != 7 &&
                    <StarRating
                      rating= {this.props.navigation.state.params.data.customerRating ? this.props.navigation.state.params.data.customerRating.rating : this.state.rating }
                      editable={this.state.editable}
                      iconStyle={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*2.2/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*2.2/100,
                      }}
                      style={{
                        marginLeft : -Constants.BaseStyle.DEVICE_WIDTH*0.5/100,
                      }}
                      onRate={(value)=>{
                        this.setState({rating: value});
                        console.log("$$$$", this.state.rating)
                      }}
                    />
                  }
                </View>
              </View>
            </View>
            { 
              (this.props.navigation.state.params.data.hasOwnProperty("customerRating") && this.props.navigation.state.params.data.customerRating.review.trim() == "") ? null : 
              <View>
                {
                  this.props.navigation.state.params.data.status != 7 &&
                  <View style={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Constants.Colors.Gray,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                  }}>
                    {
                      this.state.editable ?
                      <FormTextInput
                        style={{
                          borderBottomWidth:0,
                          marginHorizontal: 0,
                          marginVertical: 0,
                        }}
                        inputStyle={{
                          height: Math.max(10, this.state.height),
                          ...Constants.Fonts.tinyMedium,
                          color: Constants.Colors.Gray,
                          marginHorizontal: 0,
                          borderWidth: 0,
                        }}
                        focusColor={Constants.Colors.Gray}
                        placeHolderText={writeAReview}
                        value={this.state.description}
                        editable={this.state.editable}
                        placeholderTextColor={Constants.Colors.Gray}
                        multiline={true}
                        onChangeText={(description) => this.setState({description})}
                        onChange={(event) => {
                          this.setState({
                            height: event.nativeEvent.contentSize.height,
                          });
                        }}
                      />
                      :
                      <Text style={{
                        ...Constants.Fonts.tinyMedium,
                        color: Constants.Colors.Gray
                      }}>
                        {this.state.description}
                      </Text>
                    }
                  </View>
                }
              </View>
            }
            <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100, flexDirection: 'row'}}>
              <Text style={styles.textGrayStyle}>
                {hourlyRate}:
              </Text>
              <Text style={[styles.textBlackStyle, {paddingLeft: Constants.BaseStyle.DEVICE_WIDTH*3/100}]}>
                {"$"+ this.renderRateCharged()}
              </Text>
            </View>

            <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100, flexDirection: 'row'}}>
              <Text style={styles.textGrayStyle}>
                {timeDuration}:
              </Text>
              <Text style={[styles.textBlackStyle, {paddingLeft: Constants.BaseStyle.DEVICE_WIDTH*3/100}]}>
               {duration + (duration>1?" hours" : " hour")}
              </Text>
            </View>
              {
              this.props.navigation.state.params.data.hasOwnProperty("additionalCost") && this.props.navigation.state.params.data.additionalCost!==0 &&
                <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100, flexDirection: 'row'}}>
                  <Text style={styles.textGrayStyle}>
                    {"Additional cost:"}
                  </Text>
                  <Text style={[styles.textBlackStyle, {paddingLeft: Constants.BaseStyle.DEVICE_WIDTH*3/100}]}>
                    {"$"+Regex.removeTrailingZeros(this.props.navigation.state.params.data.additionalCost)}
                  </Text>
                </View>
              }
            <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.textGrayStyle}>
                  {cookingStartTime}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.textGrayStyle}>
                  {cookingEndTime}
                </Text>
              </View>
            </View>

            <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.textBlackStyle}>
                 {moment(this.props.navigation.state.params.data.starts_on).format('LT')} 
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.textBlackStyle}>
                  {moment(this.props.navigation.state.params.data.ends_on).format('LT')}
                </Text>
              </View>
            </View>

            <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                  <Text style={styles.textGrayStyle}>
                    {cookingStartDate}
                  </Text>
               </View>
               <View style={{flex: 1}}>
                  <Text style={styles.textGrayStyle}>
                    {cookingEndDate}
                  </Text>
               </View>
            </View>

            <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.textBlackStyle}>
                  {moment(this.props.navigation.state.params.data.starts_on).format('LL')} 
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.textBlackStyle}>
                  {moment(this.props.navigation.state.params.data.ends_on).format('LL')} 
                </Text>
              </View>
            </View>

      <View style={{height: Constants.BaseStyle.DEVICE_HEIGHT*4/100}}></View>
      {this.props.navigation.state.params.data.status == 7 && 
        !this.props.navigation.state.params.data.hasOwnProperty("providerDispute")  ? this.renderCancelAndRaised() : null }
      {this.props.navigation.state.params.data.status != 7 && !this.props.navigation.state.params.data.hasOwnProperty("customerRating") ?  this.renderRate() : null}

         </View>
        </ScrollView>
      {/*statius==11 && this.s*/}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Constants.Colors.White,
    flexDirection: 'column'
  },
  amountContainer: {
    flex: 2.5,
    backgroundColor: Constants.Colors.HeaderLightGreen,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  profileContainer: {
    flex: 6,
    backgroundColor: Constants.Colors.White,
    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    paddingVertical: Constants.BaseStyle.DEVICE_WIDTH*5/100,
  },
  nameStyle: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Gray,
  },
  textGrayStyle: {
    ...Constants.Fonts.tinyMedium,
    color: Constants.Colors.Gray,
  },
  textBlackStyle: {
    ...Constants.Fonts.tinyMedium,
    color: Constants.Colors.Black,
  },
  buttonStyle: {
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    alignSelf:"center",
    borderRadius:null
  },
  additionalCostContainerStyle: {
    //flex: 1,
    //paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100
    //justifyContent: 'center',
    //backgroundColor: 'red',
    //borderWidth: 2,
  },
  additionalCostStyle: {
    ...Constants.Fonts.tiny,
    color: Constants.Colors.LightGray,
  },
});
const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  bookingsActions: bindActionCreators(bookingsActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(PastBookingDetailChef);