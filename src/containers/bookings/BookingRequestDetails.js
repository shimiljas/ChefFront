/*
 * @file: BookingRequestInfo.js
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

import Constants from '../../constants';
import CircularCheckbox from '../../components/common/CircularCheckBox';
import Regex from '../../utilities/Regex';
import Background from '../../components/common/Background';
import RoundButton from '../../components/common/RoundButton';
import InputField from '../../components/common/InputField';
import AddressField from '../../components/common/AddressField';
import { ToastActionsCreators } from 'react-native-redux-toast';
import BackButton  from "../../components/common/BackButton";
import ImagePicker from 'react-native-image-crop-picker';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as LocationActions from '../../redux/modules/location';
import NavigationBar  from "react-native-navbar";
import TypesOfDietCaterer from '../../components/common/TypesOfDietCaterer';
import MealsSupportedCheckboxes from '../../components/common/MealsSupportedCheckboxes';

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
    super(props)
    this.state={
      mealSelected: mealsSupportedArray.BREAKFAST,
      typeOfDietSelectedArray: [],
      breakfastArray: [],
      dinnerArray: [],
      eveningSnacksArray: [],
      lunchArray: [],
      eventCateringEnable: false,
      dropOffCateringEnable: false,
      deliveryFees: '',
      pickupEnable: false,
      breakfastChecked: false,
      breakfastEnable: false,
      dinnerChecked: false,
      dinnerEnable: false,
      eveningSnacksChecked: false,
      eveningSnacksEnable: false,
      lunchChecked: false,
      lunchEnable: false,
      costPerPerson: '',
      minGuestCount: '',
      maxGuestCount: '',


    }

    this.renderBreakfastTypesOfDiet = this.renderBreakfastTypesOfDiet.bind(this);
    this.renderEveningSnacksTypesOfDiet = this.renderEveningSnacksTypesOfDiet.bind(this);
    this.renderDinnerTypesOfDiet = this.renderDinnerTypesOfDiet.bind(this);
    this.renderLunchTypesOfDiet = this.renderLunchTypesOfDiet.bind(this);
    this.onTypeOfDietClick = this.onTypeOfDietClick.bind(this);
  }

  // Function renders diet selection component for breakfast
  renderBreakfastTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.BREAKFAST,
      typeOfDietSelectedArray: this.state.breakfastArray,

      breakfastEnable: true,
      lunchEnable: false,
      eveningSnacksEnable: false,
      dinnerEnable: false,
    });
  }

  // Function renders diet selection component for lunch
  renderLunchTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.LUNCH,
      typeOfDietSelectedArray: this.state.lunchArray,

      breakfastEnable: false,
      lunchEnable: true,
      eveningSnacksEnable: false,
      dinnerEnable: false,
    });
  }

  // Function renders diet selection component for evening snacks
  renderEveningSnacksTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.EVENINGSNACKS,
      typeOfDietSelectedArray: this.state.eveningSnacksArray,

      breakfastEnable: false,
      lunchEnable: false,
      eveningSnacksEnable: true,
      dinnerEnable: false,
    });
  }

  // Function renders diet selection component for dinner
  renderDinnerTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.DINNER,
      typeOfDietSelectedArray: this.state.dinnerArray,

      breakfastEnable: false,
      lunchEnable: false,
      eveningSnacksEnable: false,
      dinnerEnable: true,
    });
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
    //console.log('typeOfDietSelectedArray', array);
    //let checked = array.length > 0 ? true : false;

    if(this.state.mealSelected === mealsSupportedArray.BREAKFAST) {
      this.setState({
        breakfastChecked: true,
        lunchChecked: false,
        eveningSnacksChecked: false,
        dinnerChecked: false,

        breakfastArray: array,
        typeOfDietSelectedArray: array,
      })
    } else if(this.state.mealSelected === mealsSupportedArray.LUNCH) {
      this.setState({
        breakfastChecked: false,
        lunchChecked: true,
        eveningSnacksChecked: false,
        dinnerChecked: false,

        lunchArray: array,
        typeOfDietSelectedArray: array,
      })
    } else if(this.state.mealSelected === mealsSupportedArray.EVENINGSNACKS) {
      //console.log("Important Console *********");
      this.setState({
        breakfastChecked: false,
        lunchChecked: false,
        eveningSnacksChecked: true,
        dinnerChecked: false,

        eveningSnacksArray: array,
        typeOfDietSelectedArray: array,
      })
    } else {
      this.setState({
        breakfastChecked: false,
        lunchChecked: false,
        eveningSnacksChecked: false,
        dinnerChecked: true,

        dinnerArray: array,
        typeOfDietSelectedArray: array,
      })
    }
  }

  // Function checks or unchecks event catering
  checkEventCatering() {
    //console.log("State: " + this.state.eventCateringEnable);
    this.setState({eventCateringEnable: !this.state.eventCateringEnable});
    //console.log("State: " + this.state.eventCateringEnable);
  }

  // Function checks or unchecks drop off catering
  checkDropOffCatering() {
    this.setState({dropOffCateringEnable: !this.state.dropOffCateringEnable});
  }

  // Function checks or unchecks pickup catering
  checkPickup() {
    //console.log("State: " + this.state.pickupEnable);
    this.setState({pickupEnable: !this.state.pickupEnable});
  }
  onNextClick(){
       console.log('complete state data',this.state);


        let {
              breakfastEnable,
              lunchEnable,
              eveningSnacksEnable,
              dinnerEnable,
              breakfastArray,
              dinnerArray,
              eveningSnacksArray,
              lunchArray,
              eventCateringEnable,
              dropOffCateringEnable,
              pickupEnable,
              costPerPerson,
              minGuestCount,
              maxGuestCount,
              deliveryFees,


            } = this.state;

        let {
              selectMealsSupported
          } = Constants.i18n.signup;

        let {
            enterCostPerPerson,
            enterValidCostPerPerson,
            enterMinGuestCount,
            enterValidMinGuestCount,
            enterMaxGuestCount,
            enterValidMaxGuestCount,
            enterDeliveryFees,
            enterValidDeliveryFees,
            enterOpeningDay,
            enterClosingDay,
            selectAny,
          } = Constants.i18n.signupCaterer;



            let { navigate, dispatch } = this.props.navigation;

            if(!(eventCateringEnable || dropOffCateringEnable || pickupEnable)) {
              dispatch(ToastActionsCreators.displayInfo(selectAny));
              return;
            }

            if(eventCateringEnable) {

                  if(_.isEmpty(costPerPerson.trim())) {
                    dispatch(ToastActionsCreators.displayInfo(enterCostPerPerson));
                    return;
                  }
                  if(!Regex.validateNumbers(costPerPerson.trim())) {
                    dispatch(ToastActionsCreators.displayInfo(enterValidCostPerPerson));
                    return;
                  }

                  if(_.isEmpty(maxGuestCount.trim())) {
                    dispatch(ToastActionsCreators.displayInfo(enterMaxGuestCount));
                    return;
                  }
                  if(!Regex.validateNumbers(maxGuestCount.trim())) {
                    dispatch(ToastActionsCreators.displayInfo(enterValidMaxGuestCount));
                    return;
                  }
                  if(_.isEmpty(minGuestCount.trim())) {
                    dispatch(ToastActionsCreators.displayInfo(enterMinGuestCount));
                    return;
                  }
                  if(!Regex.validateNumbers(minGuestCount.trim())) {
                    dispatch(ToastActionsCreators.displayInfo(enterValidMinGuestCount));
                    return;
                  }
    }

                  if(dropOffCateringEnable) {
                    if(_.isEmpty(deliveryFees.trim())) {
                      dispatch(ToastActionsCreators.displayInfo(enterDeliveryFees));
                      return;
                    }
                    if(!Regex.validateNumbers(deliveryFees.trim())) {
                      dispatch(ToastActionsCreators.displayInfo(enterValidDeliveryFees));
                      return;
                    }
                  }


                    if(!(breakfastEnable || dinnerEnable || eveningSnacksEnable || lunchEnable)) {
                        dispatch(ToastActionsCreators.displayInfo(selectMealsSupported));
                        return;
                      }

                      if((breakfastEnable || dinnerEnable || eveningSnacksEnable || lunchEnable))
                      {
                           if( ( _.isEmpty(breakfastArray) &&  _.isEmpty(dinnerArray) && _.isEmpty(eveningSnacksArray) && _.isEmpty(lunchArray) ))
                          {
                            dispatch(ToastActionsCreators.displayInfo(selectMealsSupported));
                          }

                      }



  }

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
    let {
      cateringType,
      eventCatering,
      costPerPerson,
      minGuestCount,
      maxGuestCount,
      dropOffCatering,
      deliveryFees,
      pickup,
      daysOpenOn,
      timeOpenOn,
      from,
      to,
    } = Constants.i18n.signupCaterer;
    return (
      <Background isFaded={true}>
        <BackButton title={"Booking Info"} containerStyle={{height:44}} onPress={()=>goBack()} />

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
                  onChangeText={(fullAddress)=>this.setState({fullAddress})}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.fullAddress));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.fullAddress));}}
                  dataText={this.props.location}
                  _onPress={()=>{
                    this.props.navigation.navigate('Location');
                  }}
                />

                <InputField
                  ref='time'
                  autoFocus={true}
                  headerText={time}
                  placeHolderText={time}
                  placeHolderColor={Constants.Colors.White}
                  secureText={false}
                  returnKey='next'
                  SubmitEditing={(event) => {this.refs.description.focus();}}
                  onChangeText={(bookingTime)=>this.setState({bookingTime})}
                />


                <View
                  style={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    borderBottomWidth: 1,
                    borderBottomColor: Constants.Colors.Gray,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
                  }}
                >

                  <Text style={styles.headerText}>
                    {cateringType}
                  </Text>

                  <CircularCheckbox
                    isChecked={this.state.eventCateringEnable}
                    label={eventCatering}
                    onClick={this.checkEventCatering.bind(this)}
                  />

                    {
                      this.state.eventCateringEnable &&
                      <View style={{width:Constants.BaseStyle.DEVICE_WIDTH, paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', }}>
                          <Text style={{flex: 1, color: Constants.Colors.White}}>{costPerPerson} :</Text>
                          <View
                            style={{flex: 2, height: Constants.BaseStyle.DEVICE_HEIGHT*5/100, borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,}}
                          >
                            <TextInput
                              style={{
                                ...Constants.Fonts.tinyLarge,
                                color: Constants.Colors.White,
                                height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                              }}
                              keyboardType='numeric'
                              onChangeText={(costPerPerson) => this.setState({costPerPerson})}
                              value={this.state.costPerPerson}
                            />
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{flex: 1, color: Constants.Colors.White}}>{maxGuestCount} :</Text>
                          <View
                            style={{flex: 2, height: Constants.BaseStyle.DEVICE_HEIGHT*5/100, borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,}}
                          >
                            <TextInput
                              style={{
                                ...Constants.Fonts.tinyLarge,
                                color: Constants.Colors.White,
                                height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                              }}
                              autoFocus={false}
                              keyboardType='numeric'
                              onChangeText={(maxGuestCount) => this.setState({maxGuestCount})}
                              value={this.state.maxGuestCount}
                            />
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{flex: 1, color: Constants.Colors.White}}>{minGuestCount} : </Text>
                          <View
                            style={{flex: 2, height: Constants.BaseStyle.DEVICE_HEIGHT*5/100, borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,}}
                          >
                            <TextInput
                              style={{
                                ...Constants.Fonts.tinyLarge,
                                color: Constants.Colors.White,
                                height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                              }}
                              autoFocus={false}
                              keyboardType='numeric'
                              onChangeText={(minGuestCount) => this.setState({minGuestCount})}
                              value={this.state.minGuestCount}
                            />
                          </View>
                        </View>
                      </View>
                    }

                  <CircularCheckbox
                    isChecked={this.state.dropOffCateringEnable}
                    label={dropOffCatering}
                    onClick={this.checkDropOffCatering.bind(this)}
                  />
                  {
                    this.state.dropOffCateringEnable &&
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{flex: 1, color: Constants.Colors.White}}>{deliveryFees} :</Text>
                      <View
                        style={{flex: 2, height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,}}
                      >
                        <TextInput
                          style={{
                            ...Constants.Fonts.tinyLarge,
                            color: Constants.Colors.White,
                            height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                          }}
                          autoFocus={false}
                          keyboardType='numeric'
                          onChangeText={(deliveryFees) => this.setState({deliveryFees})}
                          value={this.state.deliveryFees}
                        />
                      </View>
                    </View>
                  }
                  <CircularCheckbox
                    isChecked={this.state.pickupEnable}
                    label={pickup}
                    onClick={this.checkPickup.bind(this)}
                  />
                </View>



                 <MealsSupportedCheckboxes

                  mainView={{
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}

                  checkboxesStyle={{
                    justifyContent: 'center',
                  }}

                  breakfastArray={this.state.breakfastArray}
                  dinnerArray={this.state.dinnerArray}
                  eveningSnacksArray={this.state.eveningSnacksArray}
                  lunchArray={this.state.lunchArray}
                  renderBreakfastTypesOfDiet={this.renderBreakfastTypesOfDiet}
                  renderEveningSnacksTypesOfDiet={this.renderEveningSnacksTypesOfDiet}
                  renderDinnerTypesOfDiet={this.renderDinnerTypesOfDiet}
                  renderLunchTypesOfDiet={this.renderLunchTypesOfDiet}
                />


                <View
                  style={{alignSelf: 'stretch',
                    borderBottomWidth: 0.5,
                    borderBottomColor: Constants.Colors.Gray,
                    alignItems: 'center',
                    justifyContent: 'center',
                    //paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
                  }}
                >

                {
                  this.state.breakfastEnable &&
                  <TypesOfDietCaterer
                    onTypeOfDietClick={this.onTypeOfDietClick}
                    typeOfDietSelectedArray={this.state.typeOfDietSelectedArray}
                  />
                }
                {
                  this.state.lunchEnable &&
                  <TypesOfDietCaterer
                    onTypeOfDietClick={this.onTypeOfDietClick}
                    typeOfDietSelectedArray={this.state.typeOfDietSelectedArray}
                  />
                }
                {
                  this.state.eveningSnacksEnable &&
                  <TypesOfDietCaterer
                    onTypeOfDietClick={this.onTypeOfDietClick}
                    typeOfDietSelectedArray={this.state.typeOfDietSelectedArray}
                  />
                }
                {
                  this.state.dinnerEnable &&
                  <TypesOfDietCaterer
                    onTypeOfDietClick={this.onTypeOfDietClick}
                    typeOfDietSelectedArray={this.state.typeOfDietSelectedArray}
                  />
                }

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
                <RoundButton text="Next"
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
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 2,
  },
  footer: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    alignItems: 'center',
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
  }
});

const mapStateToProps = (state)=>({
   location: state.location
});

const mapDispatchToProps = dispatch => ({
    LocationActions: bindActionCreators(LocationActions, dispatch)
});

ReactMixin(BookingRequestInfo.prototype, TimerMixin);

export default connect(mapStateToProps, mapDispatchToProps)(BookingRequestInfo);
