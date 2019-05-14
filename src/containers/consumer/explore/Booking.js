/*
 * @file: Booking.js
 * @description: 
 * @date: 11.07.2017
 * @author: Nishant Saraswat
 * */

'use strict';
import React, { Component } from 'react';
import ReactNative , {
  findNodeHandle,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ActionSheetIOS,
  Platform
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import _ from 'lodash';

import Constants from '../../../constants';
import CircularCheckbox from '../../../components/common/CircularCheckBox';
import Regex from '../../../utilities/Regex';
import Background from '../../../components/common/Background';
import RoundButton from '../../../components/common/RoundButton';
import InputField from '../../../components/common/InputField';
import AddressField from '../../../components/common/AddressField';
import { ToastActionsCreators } from 'react-native-redux-toast';
import BackButton  from "../../../components/common/BackButton";
import ImagePicker from 'react-native-image-crop-picker';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as LocationActions from '../../../redux/modules/location';
import NavigationBar  from "react-native-navbar";
import TypesOfDietCaterer from '../../../components/common/TypesOfDietCaterer';
import moment from 'moment';
import * as bookingActions from '../../../redux/modules/bookings';

const mealsSupportedArray = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  EVENINGSNACKS: 'Evening Snacks',
  DINNER: 'Dinner',
};

const typesOfDietArray = {
  VEGETARIAN: 'Vegetarian',
  NONVEGETARIAN: 'Non-vegetarian',
  VEGAN: 'Vegan',
  PESCETARIANS: 'Pescetarians',
  OTHER: 'Other',
}

class BookingRequestInfo extends Component {
  constructor(props) {
    super(props);

    let dataText = this.props.location;
    let location = '';
    if(dataText) {
      if(dataText.selectedLocation) {
        if(dataText.selectedLocation.description) {
          location = dataText.selectedLocation.description;
        }
      } else if(dataText.currentLocation) {
        if(dataText.currentLocation.formattedAddress) {
          location = dataText.currentLocation.formattedAddress;
        }
      } else {
        location = Constants.i18n.signup.enterFullAddress;
      }
    }

    this.state={
      typeOfDietSelectedArray: [],
      fullAddress: location,
      bookingDescription: '',
      token : this.props.user.userDetails.auth.token,
      userId: this.props.user.userDetails.userId
    }
  }

  // Function enables selecting types of diet
  onTypeOfDietClick(diet) {  
    let array = this.state.typeOfDietSelectedArray;
    let index = array.indexOf(diet);
    if(index == -1) {
      array.push(diet);
    } else {
      array.splice(index, 1);
    }
    this.setState({
      typeOfDietSelectedArray : array
    });
  }


  renderPreferences(data,i){
    let context = this;
    let index = this.state.typeOfDietSelectedArray.indexOf(data);
    return (
      <TouchableOpacity key={i} 
          style={(index>=0) ? styles.buttonSelected : styles.buttonUnselected} 
          onPress={this.onTypeOfDietClick.bind(this,data)}>
            <Text style={styles.textWhite}>{data.capitalizeFirstLetter()}</Text>
      </TouchableOpacity>
    );
  }

  // Submits the request
  onNextClick() { 
    let context = this, userLocation = {};

    let { 
      fullAddress, bookingDescription, typeOfDietSelectedArray
    } = this.state;

    let {
      selectMealsSupported, enterFullAddress
    } = Constants.i18n.signup;
    
    let { navigate, dispatch } = this.props.navigation;

    let { starts_on, ends_on, userId, ratePerHour, isExplore  } =  this.props.navigation.state.params;

    if(!context.props.location.currentLocation && !context.props.location.selectedLocation) {
      context.navigation.dispatch(ToastActionsCreators.displayInfo(enterFullAddress));
      return;
    }

    if(context.props.location.currentLocation && !context.props.location.selectedLocation){
      userLocation.address = context.props.location.currentLocation.formattedAddress;
      userLocation.position = context.props.location.currentLocation.position;
    }

    if(context.props.location.selectedLocation) {
      userLocation.position = context.props.location.selectedLocation.position?context.props.location.selectedLocation.position:this.props.location.selectedLocation.geometry.location;
      userLocation.address  = context.props.location.selectedLocation.formatted_address?context.props.location.selectedLocation.formatted_address:this.props.location.selectedLocation.formattedAddress;
    }
          
    if((typeOfDietSelectedArray).length<=0) {
      dispatch(ToastActionsCreators.displayInfo('Please select food preferences'));
      return;
    }

    // let totalBookedHours = moment(moment(ends_on).seconds(0)).diff(moment(moment(starts_on).seconds(0)), 'h')
    
    context.props.bookingActions.consumerBookingRequestForChef({
      starts_on: moment(starts_on, "DD MM YYYY hh:mm a").toISOString(),
      ends_on: moment(ends_on, "DD MM YYYY hh:mm a").toISOString(),
      position: {
        lat : userLocation.position.lat,
        long : userLocation.position.lng,
        address : userLocation.address,
      },
      foodPreference: typeOfDietSelectedArray,
      requestDescription: bookingDescription.trim(),
      provider_id: userId,
      rate_charged: parseFloat(ratePerHour),
      token: context.state.token,
      userId: context.state.userId,
      isExplore
    });
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
        0, //(Screen.height/100) * 50, //additionalOffset
        true
      );
    }, 100);
  }

  // Default render function
  render() {
    let { enterFullName, enterFullAddress, description, enterDescription, enterValidDescription } = Constants.i18n.signup;
    let { fullName, fullAddress } = Constants.i18n.common;
    let { time, bookingDescription,enterBookingDescription } = Constants.i18n.bookings;
    let { goBack } = this.props.navigation;
    let { starts_on, ends_on, mealsSupported } =  this.props.navigation.state.params;
    let foodPreferencesArray = _.union(mealsSupported.breakfastArray, mealsSupported.lunchArray, mealsSupported.eveningSnacksArray, mealsSupported.dinnerArray);
    let context = this;
    return (
      <Background isFaded={true}>
        <BackButton 
          textStyle={{
            marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*10,
            marginRight:Constants.BaseStyle.DEVICE_WIDTH/100*10,
            textAlign:"center"
          }}
          title={"Fill up information to send request"} 
          containerStyle={{height:44,width:Constants.BaseStyle.DEVICE_WIDTH/100*70}} 
          onPress={()=>goBack()}
        />

        <View style={styles.mainView}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' ref='mainScrollView'>
            <View style={styles.container}>

              <AddressField
                viewStyle={{
                  alignItems: 'center',
                }}
                headerText={fullAddress}
                placeHolderText={enterFullAddress}
                placeHolderColor={Constants.Colors.White}
                onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.fullAddress));}}
                onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.fullAddress));}}
                dataText={this.props.location}
                _onPress={()=>{
                  this.props.navigation.navigate('Location');
                }}
              />

              <View style={styles.timeContainer}>
                <Text style={[styles.headerStyle]}>Time</Text>
                <Text style={[styles.headerInput]}>
                  { moment(starts_on).format("MMM DD h:mm a") } - { moment(ends_on).format("MMM DD h:mm a") }
                </Text>
              </View>
              
              <View style={{marginVertical:Constants.BaseStyle.DEVICE_HEIGHT/100*2}}> 
                <View style={styles.foodContainer}> 
                  <Text style={styles.foodField}>Food Preferences</Text>
                </View> 
                <View  style={styles.viewStyle}>
                  {
                    _.map(foodPreferencesArray,(data,i)=>{
                      return context.renderPreferences(data,i);
                    })
                  }
                </View>
              </View>   

              <InputField
                ref='description'
                autoFocus={false}
                headerText={bookingDescription}
                multiline={true}
                placeHolderText={enterBookingDescription}
                placeHolderColor={Constants.Colors.White}
                secureText={false}
                returnKey='next'
                SubmitEditing={ (event) => this.onNextClick() }
                onChangeText={(bookingDescription)=>this.setState({bookingDescription})}
                onChange={(event) => {
                  this.setState({
                    height: event.nativeEvent.contentSize.height,
                  });
                }}
                inputStyle={{height: Math.max(35, this.state.height)}}
                onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.description));}}
                onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.description));}}
              />

            </View>
            <View style={styles.footer}>
              <RoundButton text="Send Booking Request"
                _Press={()=>this.onNextClick()}
              />
            </View>
          </ScrollView>
        </View>

      </Background>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Constants.Colors.Transparent
  },
  container: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
  },
  footer: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    alignItems: 'center',
    paddingBottom :  Constants.BaseStyle.DEVICE_HEIGHT*5/100,
  },
  imageContainer:{
    height: Constants.BaseStyle.DEVICE_WIDTH*21/100,
    width: Constants.BaseStyle.DEVICE_WIDTH*21/100,
    borderRadius:Constants.BaseStyle.DEVICE_WIDTH*10.5/100,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    alignSelf:'center'
  },
  imageStyle: {
    height: Constants.BaseStyle.DEVICE_WIDTH*20/100,
    width: Constants.BaseStyle.DEVICE_WIDTH*20/100,
    borderRadius:Constants.BaseStyle.DEVICE_WIDTH*10/100,
  },
  headerTextStyle:{
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    ...Constants.Fonts.normal,
    color:Constants.Colors.Gray,
    marginTop:20
  },
  grayText: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Gray,
  },
  headerText: {
    ...Constants.Fonts.normal,
    color:Constants.Colors.Gray,
  },
  headerStyle:{
    ...Constants.Fonts.normal,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    color:Constants.Colors.Gray,
    backgroundColor: 'transparent',
  },
   headerInput:{
    ...Constants.Fonts.normal,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    color:Constants.Colors.White,
    backgroundColor: 'transparent',
  },
  timeContainer:{
    alignItems: 'center',
    borderBottomColor: Constants.Colors.Gray,
    borderBottomWidth: 0.5,
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
  },
  foodContainer:{
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT/100*2
  },
  foodField:{
    color:Constants.Colors.Gray
  },
  viewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.Colors.Gray,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
  },
  buttonSelected: {
    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*2/100,
    borderRadius: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    borderColor: Constants.Colors.Gray,
    borderWidth: 0.5,
    height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.Colors.Green
  },
  buttonUnselected: {
    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*2/100,
    borderRadius: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    borderColor: Constants.Colors.Gray,
    borderWidth: 0.5,
    height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWhite: {
    ...Constants.Fonts.normal,
    color: Constants.Colors.White,
  },
});

ReactMixin(BookingRequestInfo.prototype, TimerMixin);

const mapStateToProps = (state)=>({
  location: state.location,
  user:state.user
});

const mapDispatchToProps = dispatch => ({
  LocationActions: bindActionCreators(LocationActions, dispatch),
  bookingActions: bindActionCreators(bookingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingRequestInfo);
