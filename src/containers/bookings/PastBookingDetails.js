/*
 * @file: DisputeResolved.js
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

class PastBookingDetails extends Component {
  constructor(props) {
    super(props)

   this.state={
      amount: 17,
      name: "Francis Ford",
      rating: this.props.navigation.state.params.data.hasOwnProperty("providerRating") ? this.props.navigation.state.params.data.providerRating.rating : 0,
      description: this.props.navigation.state.params.data.hasOwnProperty("providerRating") ? this.props.navigation.state.params.data.providerRating.review : "",
      hourlyRate: "7",
      timeDuration: "07:15",
      startTime: "04:00 pm",
      endTime: "06:00 pm",
      date: "24 Mar 2017",
      editable : this.props.navigation.state.params.data.hasOwnProperty("providerRating") ? false : this.props.navigation.state.params.data.status == 7 ? false : true,
      height: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    }
  }

  componentDidMount(){
  }

  // Function called for releasing payment
  releasePayment() {
    let context = this;
    let {dispatch } = context.props.navigation;
     if(context.state.rating === 0){
        dispatch(ToastActionsCreators.displayInfo("Please rate the chef"));
        return;
      }else{
        let requestObj = {
        bookingNumber : context.props.navigation.state.params.data.booking_number,
        description : context.state.description,
        rating : context.state.rating,
        token : context.props.user.userDetails.auth.token,
        userId: context.props.user.userDetails.userId
      }
      context.props.bookingsActions.releasePayment(requestObj,function(success){
      if(success){
        context.props.navigation.state.params.callBack()
      }
    })
    }
  }

  raiseDispute(){
    let context = this;
    context.props.navigation.navigate("Dispute",{
      booking_number :   context.props.navigation.state.params.data.booking_number,
      callBack :   context.props.navigation.state.params.callBack
    });
  }

  rating(){
    let context = this;
    let {dispatch } = this.props.navigation;
   if(this.state.rating === 0){
      dispatch(ToastActionsCreators.displayInfo("Please rate the chef"));
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
 
  renderDiputeButton(){
    return(
      <View>
        <TouchableOpacity onPress={()=>{this.raiseDispute();}} style={{
          paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
          flexDirection: 'row',
          justifyContent: 'center',
          paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100,}}>
            <Image
              style={{
                width: Constants.BaseStyle.DEVICE_WIDTH*4/100,
                height: Constants.BaseStyle.DEVICE_WIDTH*4/100,
              }}
              source={Constants.Images.caterer.booking_ended_dispute}
            />
            <Text style={styles.textGrayStyle}>
                {Constants.i18n.bookings.raiseADispute}
            </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <View style={{
            flex: 1, 
            height: 1,
            borderBottomWidth: 0.5,
            borderBottomColor: Constants.Colors.Gray
          }} />
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.textGrayStyle}>OR</Text>
          </View>
          <View style={{
            flex: 1,
            height: 1,
            borderBottomWidth: 0.5,
            borderBottomColor: Constants.Colors.Gray
          }} />
        </View>
      </View>
    )
  }

  renderRelaesePayment(){
    return(
      <RoundButton
        text={"RELEASE PAYMENT"}
        buttonStyle={styles.buttonStyle}
        _Press={() => this.releasePayment() }
      />
    )
  }

  renderRate(){
    return(
      <RoundButton
        text={"Rate"}
        buttonStyle={styles.buttonStyle}
        _Press={() => this.rating() }
      />
    )
  }

  renderAmount(){
    let { status } = this.props.navigation.state.params.data;
    if(status==6 || status==7  || status==11 ){
      let cost =  this.props.navigation.state.params.data.totalCost.toFixed(2);
      return Regex.removeTrailingZeros(cost); 
    }else{
      let refundAmout = this.props.navigation.state.params.data.refundAmount?
        this.props.navigation.state.params.data.refundAmount.toFixed(2):"";
      return   Regex.removeTrailingZeros(refundAmout); 
    }
  }

  renderRateCharged(){
    return this.props.navigation.state.params.data.ratePerHour?Regex.removeTrailingZeros(this.props.navigation.state.params.data.ratePerHour):"";
  } 


  renderAmountHeader(){
    switch(this.props.navigation.state.params.data.status){
      case 6:
      return "Total amount paid";
      case 7:
      return "Total amount on hold";
      case 8:
      return "Total amount refunded";
      case 9:
      return "Total amount refunded";
      case 10:
      return "Total amount refunded";
      case 11:
      return "Total amount payable";
    }
  }

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

    return (
      <View style={styles.mainView}>
        <NavigationBar
          leftButton={<BackButton onPress={()=>goBack()} />}
        />
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always'>
          <View style={styles.amountContainer}>
            <Text style={{...Constants.Fonts.subtitle, color: Constants.Colors.White}}>
              { this.renderAmountHeader() }
            </Text>
            <View style={{flexDirection: 'row', paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*4/100}}>
              <Text style={{...Constants.Fonts.normal, color: Constants.Colors.White, top: Constants.BaseStyle.DEVICE_HEIGHT*2.5/100}}>$</Text>
              <Text style={{...Constants.Fonts.largest, color: Constants.Colors.White}}>{this.renderAmount()}</Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Avatar user= {this.props.navigation.state.params.data.user}/>
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
                  {this.props.navigation.state.params.data.status == 7  ? null :
                    <StarRating
                      rating= {this.props.navigation.state.params.data.hasOwnProperty("providerRating") ? this.props.navigation.state.params.data.providerRating.rating : this.state.rating}
                      editable={this.state.editable}
                      style={{
                        marginLeft : -Constants.BaseStyle.DEVICE_WIDTH*1/100,
                      }}
                      iconStyle={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*2.2/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*2.2/100,
                      }}
                      onRate={(value)=>{
                        this.setState({rating: value});
                      }}
                    />
                  }
                </View>
              </View>
            </View>
            {
              <View>
                {
                  this.props.navigation.state.params.data.status == 7 ? null : 
                  (this.props.navigation.state.params.data.hasOwnProperty("providerRating") && this.props.navigation.state.params.data.providerRating.review.trim() == "") ? null : 
                  <View style={{
                    flex: 1,
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Constants.Colors.Gray,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                  }}>
                    {
                      this.state.editable ? 
                      <FormTextInput
                        style={{
                          borderBottomWidth: 0,
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
                        returnKey='done'
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
                        color: Constants.Colors.Gray,
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
                { "$"+ this.renderRateCharged()}
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

      {this.props.navigation.state.params.data.status == 11 ? this.renderDiputeButton() : <View />}

         </View>
        </ScrollView>
      {/*statius==11 && this.s*/}
      { this.props.navigation.state.params.data.status == 11  ? this.renderRelaesePayment() : <View />}
      {
        ((this.props.navigation.state.params.data.status == 10 || this.props.navigation.state.params.data.status == 8 ||this.props.navigation.state.params.data.status == 6) && 
        !this.props.navigation.state.params.data.hasOwnProperty("providerRating")) &&
        this.renderRate()
      }

      {/*this.props.navigation.state.params.data.status == 10 || 
        this.props.navigation.state.params.data.status == 8 || 
        this.props.navigation.state.params.data.status == 6 ? 
        this.props.navigation.state.params.data.status == 6 &&  
        this.props.navigation.state.params.data.hasOwnProperty("providerRating") ?  <View />  : this.renderRate() : <View />*/}
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
export default connect(mapStateToProps, mapDispatchToProps)(PastBookingDetails);