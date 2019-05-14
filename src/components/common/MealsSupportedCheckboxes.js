/*
 * @file: MealsSupportedCheckboxes.js
 * @description: Contains supported meals checkboxes.
 * @date: 06.07.2017
 * @author: Vishal Kumar
 * */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import CircularCheckbox from './CircularCheckBox';
import Constants from '../../constants';

let {
  mealsSupported,
} = Constants.i18n.signup;

const mealsSupportedArray = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  EVENINGSNACKS: 'Evening Snacks',
  DINNER: 'Dinner',
};

export default class MealsSupportedCheckboxes extends Component {
   
  // Default render function
  render() {

    return (
      <View style={[styles.mainView, this.props.mainView]}>
        <Text style={[styles.headingStyle, this.props.headingStyle]}
        >
          {mealsSupported}
        </Text>
        <View style={[styles.checkboxesStyle, this.props.checkboxesStyle]}>
          <View style={{flex: 1}}>
            <CircularCheckbox
              isChecked={this.props.breakfastArray.length > 0 ? true : false}
              label={mealsSupportedArray.BREAKFAST}
              onClick={()=>{
                this.props.renderBreakfastTypesOfDiet();
                }
              }
            />
            <CircularCheckbox
              isChecked={this.props.eveningSnacksArray.length > 0 ? true : false}
              label={mealsSupportedArray.EVENINGSNACKS}
              onClick={()=>{
                this.props.renderEveningSnacksTypesOfDiet();
                }
              }
            />
          </View>

          <View style={{flex : 1}}>
            <CircularCheckbox
              isChecked={this.props.dinnerArray.length > 0 ? true : false}
              label={mealsSupportedArray.DINNER}
              onClick={()=>{
                this.props.renderDinnerTypesOfDiet();
                }
              }
            />
            <CircularCheckbox
              isChecked={this.props.lunchArray.length > 0 ? true : false}
              label={mealsSupportedArray.LUNCH}
              onClick={()=>{
                this.props.renderLunchTypesOfDiet();
                }
              }
            />
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.Colors.Gray,
  },
  headingStyle: {
    ...Constants.Fonts.normal,
    color:Constants.Colors.Gray,
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    backgroundColor : Constants.Colors.Transparent,
  },
  checkboxesStyle: {
    flex: 1,
    flexDirection: 'row',
  },
});
