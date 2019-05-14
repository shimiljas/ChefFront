/*
 * @file: SignUp3.js
 * @description: ChefSignUpStep3
 * @date: 11.07.2017
 * @author: Vishal Kumar
 * */

'use strict';
import React, { Component } from 'react';
import ReactNative,{
  AppRegistry,
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import TagInput from 'react-native-tag-input';
import _ from 'lodash';
import Constants from '../../../constants';
import Regex from '../../../utilities/Regex';
import Background from '../../../components/common/Background';
import RoundButton from '../../../components/common/RoundButton';
import InputField from '../../../components/common/InputField';
import CircularCheckbox from '../../../components/common/CircularCheckBox';
import MealsSupportedCheckboxes from '../../../components/common/MealsSupportedCheckboxes';
import TypesOfDietChef from '../../../components/common/TypesOfDietChef';
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

class SignUp3 extends Component {
  constructor(props) {
    super(props);

    this.state= {
      ratePerHour: '',
      expInYears: '',
      milesToTravel: '',

      breakfastChecked: false,
      breakfastEnable: false,
      dinnerChecked: false,
      dinnerEnable: false,
      eveningSnacksChecked: false,
      eveningSnacksEnable: false,
      lunchChecked: false,
      lunchEnable: false,
      mealSelected: mealsSupportedArray.BREAKFAST,

      breakfastArray: [],
      dinnerArray: [],
      eveningSnacksArray: [],
      lunchArray: [],

      typesOfSpecializedCooking: [],
    }

    this.renderBreakfastTypesOfDiet = this.renderBreakfastTypesOfDiet.bind(this);
    this.renderEveningSnacksTypesOfDiet = this.renderEveningSnacksTypesOfDiet.bind(this);
    this.renderDinnerTypesOfDiet = this.renderDinnerTypesOfDiet.bind(this);
    this.renderLunchTypesOfDiet = this.renderLunchTypesOfDiet.bind(this);
    //this.onTypeOfDietClick = this.onTypeOfDietClick.bind(this);
  }

  // Function adds or removes cooking specialties
  onChangeOfSpecializedCooking = (typesOfSpecializedCooking) => {
    this.setState({
      typesOfSpecializedCooking: typesOfSpecializedCooking
    });
  };

  // Function renders diet selection component for breakfast
  renderBreakfastTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.BREAKFAST,
      breakfastEnable: true,
      lunchEnable: false,
      eveningSnacksEnable: false,
      dinnerEnable: false,
    });
    ()=>this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));    
  }

  // Function renders diet selection component for lunch
  renderLunchTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.LUNCH,
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
      breakfastEnable: false,
      lunchEnable: false,
      eveningSnacksEnable: false,
      dinnerEnable: true,
    });
  }

  // Function adds or removes types of diet for Breakfast
  onChangeTypesOfDietsForBreakfast = (breakfastArray) => {
    this.setState({
      breakfastArray: breakfastArray,
      breakfastChecked: breakfastArray.length > 0 ? true : false
    });
  };

  // Function adds or removes types of diet for Lunch
  onChangeTypesOfDietsForLunch = (lunchArray) => {
    this.setState({
      lunchArray: lunchArray,
      lunchChecked: lunchArray.length > 0 ? true : false
    });
  };

  // Function adds or removes types of diet for Evening Snacks
  onChangeTypesOfDietsForEveningSnacks = (eveningSnacksArray) => {
    this.setState({
      eveningSnacksArray: eveningSnacksArray,
      eveningSnacksChecked: eveningSnacksArray.length > 0 ? true : false
    });
  };

  // Function adds or removes types of diet for Dinner
  onChangeTypesOfDietsForDinner = (dinnerArray) => {
    this.setState({
      dinnerArray: dinnerArray,
      dinnerChecked: dinnerArray.length > 0 ? true : false
    });
  };

  // Function enables selecting types of diet
  // onTypeOfDietClick(diet) {
  //   let array = [];

  //   switch(this.state.mealSelected) {
  //     case mealsSupportedArray.BREAKFAST: 
  //       array = this.state.breakfastArray;
  //       break;
  //     case mealsSupportedArray.LUNCH:
  //       array = this.state.lunchArray;
  //       break;
  //     case mealsSupportedArray.EVENINGSNACKS:
  //       array = this.state.eveningSnacksArray;
  //       break;
  //     case mealsSupportedArray.DINNER:
  //       array = this.state.dinnerArray;
  //       break;
  //   }

  //   let index = array.indexOf(diet);
  //   if(index == -1) {
  //     array.push(diet);
  //   } else {
  //     array.splice(index, 1);
  //   }
  //   let checked = array.length > 0 ? true : false;

  //   switch(this.state.mealSelected) {
  //     case mealsSupportedArray.BREAKFAST:
  //       this.setState({
  //         breakfastChecked: checked,
  //         breakfastArray: array,
  //       });
  //       break;
  //     case mealsSupportedArray.LUNCH:
  //       this.setState({
  //         lunchChecked: checked,
  //         lunchArray: array,
  //       });
  //       break;
  //     case mealsSupportedArray.EVENINGSNACKS:
  //       this.setState({
  //         eveningSnacksChecked: checked,
  //         eveningSnacksArray: array,
  //       });
  //       break;
  //     case mealsSupportedArray.DINNER:
  //       this.setState({
  //         dinnerChecked: checked,
  //         dinnerArray: array,
  //       });
  //       break;
  //   }
  // }

  // Function validates all user input and then navigates to ChefSignUpStep4
  onNextClick() {
    let {
      ratePerHour,
      expInYears,
      milesToTravel,
      breakfastEnable,
      data,
      typesOfSpecializedCooking,
      breakfastChecked,
      dinnerChecked,
      eveningSnacksChecked,
      lunchChecked
    } = this.state;

    let {
      enterExperienceInYears,
      enterValidExperienceInYears,
    } = Constants.i18n.signup;

    let {
      enterRatePerHour,
      enterValidRatePerHour,
      enterMilesWillingToTravel,
      enterValidMilesWillingToTravel,
      enterSpecializedCooking,
      selectMeal
    } = Constants.i18n.signupChef;

    let { navigate, dispatch } = this.props.navigation;

    ratePerHour=(ratePerHour.replace('$','')).trim();
    if(_.isEmpty(ratePerHour.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterRatePerHour));
      return;
    }
    if(parseFloat(ratePerHour.trim())<=0) {
      dispatch(ToastActionsCreators.displayInfo('Rate should be more than 0'));
      return;
    }
    if(!Regex.validatePrice(ratePerHour.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidRatePerHour));
      return;
    }

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

    if(_.isEmpty(milesToTravel.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterMilesWillingToTravel));
      return;
    }
    if(parseFloat(milesToTravel.trim())<=0) {
      dispatch(ToastActionsCreators.displayInfo('Miles should be more than 0'));
      return;
    }
    if(!Regex.validateDecimalNumbers(milesToTravel.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMilesWillingToTravel));
      return;
    }

    if(!(breakfastChecked || dinnerChecked || eveningSnacksChecked || lunchChecked)) {
      dispatch(ToastActionsCreators.displayInfo(selectMeal));
      return;
    }

    navigate('ChefSignUpStep4', {
      ...this.props.navigation.state.params,
      ratePerHour: ratePerHour,
      expInYears: this.state.expInYears,
      milesToTravel: this.state.milesToTravel,
      mealsSupported: {
        breakfastArray: this.state.breakfastArray,
        lunchArray: this.state.lunchArray,
        eveningSnacksArray: this.state.eveningSnacksArray,
        dinnerArray: this.state.dinnerArray
      },
      typesOfSpecializedCooking: this.state.typesOfSpecializedCooking,
    });
  }

  // Keyboard Handling
  _handleScrollView(ref) {
    //alert('1');
    let context = this;
    context.setTimeout(() => {
      let scrollResponder = context.refs.mainScrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ref,
        (Constants.BaseStyle.DEVICE_HEIGHT/100) * 25, //additionalOffset
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

  // Default render screen
  render() {
    let { goBack } = this.props.navigation;

    let {
      experienceInYears,
      enterExperienceInYears,
      mealsSupported,
    } = Constants.i18n.signup;

    let {
      ratePerHour,
      enterRatePerHour,
      milesWillingToTravel,
      enterMilesWillingToTravel,
      typesOfDiet,
      specializedCooking,
    } = Constants.i18n.signupChef;

    return (
      <Background isFaded={true}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.Colors.LightGreen}
        />
        <BackButton title={"Step 3 of 4"} containerStyle={{height:44}} onPress={()=>goBack()} />
        <View style={styles.mainView}>
          <ScrollView 
            showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='always' 
            ref="mainScrollView"
          >
            <InputField
              ref='ratePerHour'
              autoFocus={true}
              headerText={ratePerHour}
              placeHolderText={enterRatePerHour}
              placeHolderColor={Constants.Colors.White}
              secureText={false}
              keyboard='numeric'
              returnKey='next'
              isDollar={true}
              SubmitEditing={(event) => {this.refs.expInYears.focus();}}
              onChangeText={(ratePerHour)=>this.setState({ratePerHour})}
            />

            <InputField
              ref='expInYears'
              autoFocus={false}
              headerText={experienceInYears}
              placeHolderText={enterExperienceInYears}
              placeHolderColor={Constants.Colors.White}
              secureText={false}
              keyboard='numeric'
              returnKey='next'
              SubmitEditing={(event) => {this.refs.milesToTravel.focus();}}
              onChangeText={(expInYears)=>this.setState({expInYears})}
            />

            <InputField
              ref='milesToTravel'
              autoFocus={false}
              headerText={milesWillingToTravel}
              placeHolderText={enterMilesWillingToTravel}
              placeHolderColor={Constants.Colors.White}
              returnKey='next'
              keyboard='numeric'
              //SubmitEditing={(event) => this.onNextClick()}
              onChangeText={(milesToTravel)=>this.setState({milesToTravel})}
              SubmitEditing={(event) => {this._resetScrollView(ReactNative.findNodeHandle(this.refs.WillingToTravel));}}
            />

            <MealsSupportedCheckboxes

              mainView={{
                alignSelf: 'stretch',
                alignItems: 'center',
                justifyContent: 'center',
              }}

              checkboxesStyle={{
                justifyContent: 'center',
                marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100
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

            {
              this.state.breakfastEnable &&
              <View
                style={{
                  alignSelf: 'stretch',
                  borderBottomWidth: 0.5,
                  borderBottomColor: Constants.Colors.Gray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100
                }}
              >
                <Text
                  style={{
                    ...Constants.Fonts.normal,
                    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                    color:Constants.Colors.Gray,
                    backgroundColor: 'transparent',
                  }}
                >
                  {typesOfDiet}
                </Text>
            
                <TagInput
                  ref={"typesOfDiets"}
                  autoFocus={true}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                  value={this.state.breakfastArray}
                  onChange= { this.onChangeTypesOfDietsForBreakfast }
                  placeholderText={this.state.breakfastArray.length>0?"":"Enter here"}
                  alertText={"Enter a valid type of diet"}
                  tagTextStyle={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.White,
                  }}
                  tagContainerStyle={{
                    borderColor: Constants.Colors.Gray,
                    borderWidth: 0.5,
                    padding: Constants.BaseStyle.DEVICE_WIDTH*2/100,
                  }}
                  textInput={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.White,
                  }}
                  tagColor="transparent"
                  tagTextColor={Constants.Colors.White}
                  inputColor={Constants.Colors.White}
                  placeholderTextColor={Constants.Colors.White}
                />
              </View>
            }

            {
              this.state.lunchEnable &&

              <View
                style={{
                  alignSelf: 'stretch',
                  borderBottomWidth: 0.5,
                  borderBottomColor: Constants.Colors.Gray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100
                }}
              >
                <Text
                  style={{
                    ...Constants.Fonts.normal,
                    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                    color:Constants.Colors.Gray,
                    backgroundColor: 'transparent',
                  }}
                >
                  {typesOfDiet}
                </Text>
            
                <TagInput
                  ref={"typesOfDiets"}
                  autoFocus={false}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                  value={this.state.lunchArray}
                  onChange= {this.onChangeTypesOfDietsForLunch}
                  placeholderText={this.state.lunchArray.length>0?"":"Enter here"}
                  alertText={"Enter a valid type of diet"}
                  tagTextStyle={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.White,
                  }}
                  tagContainerStyle={{
                    borderColor: Constants.Colors.Gray,
                    borderWidth: 0.5,
                    padding: Constants.BaseStyle.DEVICE_WIDTH*2/100,
                  }}
                  textInput={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.White,
                  }}
                  tagColor="transparent"
                  tagTextColor={Constants.Colors.White}
                  inputColor={Constants.Colors.White}
                  placeholderTextColor={Constants.Colors.White}
                />
              </View>
            }

            {
              this.state.eveningSnacksEnable &&

              <View
                style={{
                  alignSelf: 'stretch',
                  borderBottomWidth: 0.5,
                  borderBottomColor: Constants.Colors.Gray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100
                }}
              >
                <Text
                  style={{
                    ...Constants.Fonts.normal,
                    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                    color:Constants.Colors.Gray,
                    backgroundColor: 'transparent',
                  }}
                >
                  {typesOfDiet}
                </Text>
              
                <TagInput
                  ref={"typesOfDiets"}
                  autoFocus={false}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                  value={this.state.eveningSnacksArray}
                  onChange= { this.onChangeTypesOfDietsForEveningSnacks }
                  placeholderText={this.state.eveningSnacksArray.length>0?"":"Enter here"}
                  alertText={"Enter a valid type of diet"}
                  tagTextStyle={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.White,
                  }}
                  tagContainerStyle={{
                    borderColor: Constants.Colors.Gray,
                    borderWidth: 0.5,
                    padding: Constants.BaseStyle.DEVICE_WIDTH*2/100,
                  }}
                  textInput={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.White,
                  }}
                  tagColor="transparent"
                  tagTextColor={Constants.Colors.White}
                  inputColor={Constants.Colors.White}
                  placeholderTextColor={Constants.Colors.White}
                />
              </View>
            }

            {
              this.state.dinnerEnable &&

              <View
                style={{
                  alignSelf: 'stretch',
                  //borderBottomWidth: 0.5,
                  //borderBottomColor: Constants.Colors.Gray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                  borderWidth: 1,
                  borderColor: 'red'
                }}
              >
                <Text
                  style={{
                    ...Constants.Fonts.normal,
                    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                    color:Constants.Colors.Gray,
                    backgroundColor: 'transparent',
                  }}
                >
                  {typesOfDiet}
                </Text>
            
                <TagInput
                  ref={"typesOfDiets"}
                  autoFocus={false}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                  value={this.state.dinnerArray}
                  onChange= { this.onChangeTypesOfDietsForDinner }
                  placeholderText={this.state.dinnerArray.length>0?"":"Enter here"}
                  alertText={"Enter a valid type of diet"}
                  tagTextStyle={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.White,
                  }}
                  tagContainerStyle={{
                    borderColor: Constants.Colors.Gray,
                    borderWidth: 0.5,
                    padding: Constants.BaseStyle.DEVICE_WIDTH*2/100,
                  }}
                  textInput={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.White,
                  }}
                  tagColor="transparent"
                  tagTextColor={Constants.Colors.White}
                  inputColor={Constants.Colors.White}
                  placeholderTextColor={Constants.Colors.White}
                />
              </View>
            }

            {/*
              this.state.breakfastEnable &&
              <TypesOfDietChef

                mainView={{
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}

                headingStyle={{
                  marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                }}

                checkboxesStyle={{
                  justifyContent: 'center',
                  marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                }}

                onTypeOfDietClick={this.onTypeOfDietClick}
                typeOfDietSelectedArray={this.state.breakfastArray}
              />
            }
            {
              this.state.lunchEnable &&
              <TypesOfDietChef

                mainView={{
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}

                headingStyle={{
                  marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                }}

                checkboxesStyle={{
                  justifyContent: 'center',
                  marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                }}

                onTypeOfDietClick={this.onTypeOfDietClick}
                typeOfDietSelectedArray={this.state.lunchArray}
              />
            }
            {
              this.state.eveningSnacksEnable &&
              <TypesOfDietChef

                mainView={{
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}

                headingStyle={{
                  marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                }}

                checkboxesStyle={{
                  justifyContent: 'center',
                  marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                }}

                onTypeOfDietClick={this.onTypeOfDietClick}
                typeOfDietSelectedArray={this.state.eveningSnacksArray}
              />
            }
            {
              this.state.dinnerEnable &&
              <TypesOfDietChef

                mainView={{
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}

                headingStyle={{
                  marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                }}

                checkboxesStyle={{
                  justifyContent: 'center',
                  marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                }}

                onTypeOfDietClick={this.onTypeOfDietClick}
                typeOfDietSelectedArray={this.state.dinnerArray}
              />
            */}

            <View
              style={{
                alignSelf: 'stretch',
                borderBottomWidth: 0.5,
                borderBottomColor: Constants.Colors.Gray,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100
              }}
            >
              <Text
                style={{
                  ...Constants.Fonts.normal,
                  marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                  height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                  color:Constants.Colors.Gray,
                  backgroundColor: 'transparent',
                }}
              >
                {specializedCooking}
              </Text>

              <TagInput
                ref={"typesOfSpecializedCooking"}
                autoFocus={false}
                onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfSpecializedCooking));}}
                onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfSpecializedCooking));}}
                value={this.state.typesOfSpecializedCooking}
                onChange= { this.onChangeOfSpecializedCooking }
                placeholderText={this.state.typesOfSpecializedCooking.length>0?"":"Enter here"}
                alertText={"Enter a valid specialised cooking"}
                tagTextStyle={{
                  ...Constants.Fonts.normal,
                  color: Constants.Colors.White,
                }}
                tagContainerStyle={{
                  borderColor: Constants.Colors.Gray,
                  borderWidth: 0.5,
                  padding: Constants.BaseStyle.DEVICE_WIDTH*2/100,
                }}
                textInput={{
                  ...Constants.Fonts.normal,
                  color: Constants.Colors.White,
                }}
                tagColor="transparent"
                tagTextColor={Constants.Colors.White}
                inputColor={Constants.Colors.White}
                placeholderTextColor={Constants.Colors.White}
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
    backgroundColor: Constants.Colors.Transparents
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    alignItems: 'center'
  },
  button: {
    height: 40,
    width: 40
  }
});

ReactMixin(SignUp3.prototype, TimerMixin);
module.exports = SignUp3;
