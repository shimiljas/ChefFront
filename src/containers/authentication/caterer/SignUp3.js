/*
 * @file: SignUp3.js
 * @description: ChefSignUpStep3
 * @date: 11.07.2017
 * @author: Vishal Kumar
 * */

'use strict';

import React, { Component } from 'react';
import Reactnative , {
  AppRegistry,findNodeHandle,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import TagInput from 'react-native-tag-input';
import _ from 'lodash';

import Constants from '../../../constants';
import Regex from '../../../utilities/Regex';
import Background from '../../../components/common/Background';
import RoundButton from '../../../components/common/RoundButton';
import InputField from '../../../components/common/InputField';
//import Switch from '../../../components/common/Switch';
import MealsSupportedCheckboxes from '../../../components/common/MealsSupportedCheckboxes';
import TypesOfDietCaterer from '../../../components/common/TypesOfDietCaterer';
import { ToastActionsCreators } from 'react-native-redux-toast';
import BackButton  from "../../../components/common/BackButton";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";

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

class SignUp3 extends Component {
  constructor(props) {
    super(props);

    this.state= {
      expInYears: '',
      // isConvicted: false,

      mealSelected: mealsSupportedArray.BREAKFAST,
      typeOfDietSelectedArray: [],

      breakfastArray: [],
      dinnerArray: [],
      eveningSnacksArray: [],
      lunchArray: [],

      breakfastChecked: false,
      breakfastEnable: false,
      dinnerChecked: false,
      dinnerEnable: false,
      eveningSnacksChecked: false,
      eveningSnacksEnable: false,
      lunchChecked: false,
      lunchEnable: false,

      mealSubcategoryName: '',
      mealSubcategoryPrice: '',

      eventsArray: [],
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

  // Function adds or removes events
  onChangeEvents = (eventsArray) => {
    this.setState({
      eventsArray: eventsArray
    });
  };

  // Function validates all user input and then navigates to CatererSignUpStep4
  onNextClick() {
    let {
      expInYears,
      isConvicted,
      eventsArray,
      mealSubcategoryName,
      mealSubcategoryPrice,
      breakfastEnable,
      lunchEnable,
      eveningSnacksEnable,
      dinnerEnable
    } = this.state;

    let {
      enterExperienceInYears,
      enterValidExperienceInYears,
      enterMinimunMealSubcategory,
      enterMealSubcategory,
      selectMealsSupported
    } = Constants.i18n.signup;

    let {
      enterPastEvents,
      enterPrice,
      enterValidPrice
    } = Constants.i18n.signupCaterer;

    let { navigate, dispatch } = this.props.navigation;

    if(_.isEmpty(expInYears.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterExperienceInYears));
      return;
    }
    if(parseFloat(expInYears.trim())<=0) {
      dispatch(ToastActionsCreators.displayInfo('Miles should be more than 0'));
      return;
    }
    if(!Regex.validateDecimalNumbers(expInYears.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidExperienceInYears));
      return;
    }

    if(!(breakfastEnable || dinnerEnable || eveningSnacksEnable || lunchEnable)) {
      dispatch(ToastActionsCreators.displayInfo(selectMealsSupported));
      return;
    }

    if(!_.isEmpty(mealSubcategoryName.trim())) {
      if(_.isEmpty(mealSubcategoryPrice.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterPrice));
        return;
      } else if(!Regex.validatePrice(mealSubcategoryPrice.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterValidPrice));
        return;
      }
    }

    if(eventsArray.length < 1) {
      alert(enterPastEvents);
      return;
    }

    navigate('CatererSignUpStep4', {
      ...this.props.navigation.state.params,

      expInYears: this.state.expInYears,
      //criminalCase: this.state.isConvicted,
      mealsSupported: {
        breakfastArray: this.state.breakfastArray,
        lunchArray: this.state.lunchArray,
        eveningSnacksArray: this.state.eveningSnacksArray,
        dinnerArray: this.state.dinnerArray
      },
      mealSubcategoryName: this.state.mealSubcategoryName,
      mealSubcategoryPrice: this.state.mealSubcategoryPrice,
      eventsDoneInPast: this.state.eventsArray
    });
  }

  // Keyboard Handler
  _handleScrollView(ref) {
    //alert('1');
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
    //alert('2');
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

    let { goBack } = this.props.navigation;

    let {
      enterMealSubcategory,
      enterPrice,

      pastEvents,
      enterHereWithComma,
    } = Constants.i18n.signupCaterer;

    let {
      experienceInYears,
      enterExperienceInYears,
      crimeConvicted,
      mealsSupported
    } = Constants.i18n.signup;

    return (
      <Background isFaded={true}>
        <BackButton title={"Step 3 of 4"} containerStyle={{height:44}} onPress={()=>goBack()} />
        <View style={styles.mainView}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' ref='mainScrollView'>

              <View style={styles.container}>

                <InputField
                  ref='expInYears'
                  autoFocus={true}
                  headerText={experienceInYears}
                  placeHolderText={enterExperienceInYears}
                  placeHolderColor={Constants.Colors.White}
                  secureText={false}
                  returnKey='next'
                  SubmitEditing={(event) => {this.refs.milesWillingToTravel.focus();}}
                  onChangeText={(expInYears)=>this.setState({expInYears})}
                />

                {/*<View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Constants.Colors.Gray,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    //paddingRight: Constants.BaseStyle.DEVICE_WIDTH*10/100
                  }}
                >
                  <Text
                    style={{
                      ...Constants.Fonts.normal,
                      color:Constants.Colors.Gray,
                      backgroundColor: 'transparent',
                      width: Constants.BaseStyle.DEVICE_WIDTH*70/100,
                      //textAlign: 'center'
                    }}
                  >
                    {crimeConvicted}
                  </Text>

                  <Switch
                    isSwitchOn={this.state.isConvicted}
                    onClick={()=>{
                      this.setState({isConvicted: !this.state.isConvicted});
                    }}
                  />

                </View>*/}

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

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                      marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
                    }}
                  >
                    <View style={{flex: 3}}>
                      <TextInput
                        ref='enterMealSubcategory1'
                        style={{
                          height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                          ...Constants.Fonts.normal,
                          color: 'white',
                          borderWidth: 0
                        }}
                        autoFocus={false}
                        placeholderTextColor='white'
                        placeholder={enterMealSubcategory}
                        onChangeText={(text) => this.setState({mealSubcategoryName: text})}
                        value={this.state.mealSubcategoryName}
                        onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.enterMealSubcategory1));}}
                        onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.enterMealSubcategory1));}}
                      />
                    </View>
                    <View style={{flex: 1}}>

                      <TextInput
                        ref='enterMealSubcategory2'
                        autoFocus={false}
                        style={{
                          height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                          ...Constants.Fonts.normal,
                          color: Constants.Colors.White,
                          borderBottomWidth: 0,
                        }}
                        placeholderTextColor='white'
                        placeholder={enterPrice}
                        onChangeText={(text) => this.setState({mealSubcategoryPrice: text})}
                        value={this.state.mealSubcategoryPrice}
                        onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.enterMealSubcategory2));}}
                        onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.enterMealSubcategory2));}}
                      />
                    </View>

                  </View>

                </View>

                <View
                  style={styles.pastEventsContainer}
                >
                  <Text style={styles.headerStyle}>
                    {pastEvents}
                  </Text>

                  <TagInput
                    ref='pastEvents'
                    autoFocus={false}
                    onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.pastEvents));}}
                    onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.pastEvents));}}
                    value={this.state.eventsArray}
                    onChange={this.onChangeEvents}
                    placeholderText={this.state.eventsArray.length>0?"":"Enter here"}
                    alertText={"Enter a valid past event"}
                    tagTextStyle={{
                      ...Constants.Fonts.normal,
                      color: Constants.Colors.White,
                    }}
                    tagContainerStyle={{
                      borderColor: Constants.Colors.Gray,
                      borderWidth: 1,
                      padding: Constants.BaseStyle.DEVICE_WIDTH*2/100,
                    }}
                    textInput={{
                      ...Constants.Fonts.normal,
                    }}
                    tagColor="transparent"
                    tagTextColor={Constants.Colors.White}
                    inputColor={Constants.Colors.White}
                  />
                </View>

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    alignItems: 'center',
  },
  pastEventsContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderBottomColor: Constants.Colors.Gray,
    borderBottomWidth: 0.5,
    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100
  },
  headerStyle:{
    ...Constants.Fonts.normal,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    color:Constants.Colors.Gray,
    backgroundColor: 'transparent',
  },
  icon: {
    height: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    width: Constants.BaseStyle.DEVICE_HEIGHT*5.5/100,
  },
});


ReactMixin(SignUp3.prototype, TimerMixin);
module.exports = SignUp3;
