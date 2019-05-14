/*
 * @file: TypesOfDietChef.js
 * @description: Contains types of diet checkboxes.
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
  typesOfDiet,
} = Constants.i18n.signupChef;

const typesOfDietArray = {
  VEGETARIAN: 'Vegetarian',
  VEGAN: 'Vegan',
  PESCETARIANS: 'Pescetarians',
  OTHER: 'Other',
}

export default class TypesOfDiet extends Component {

  // Default render function
  render() {
    return (
      <View style={[styles.mainView, this.props.mainView]}>
        <Text style={[styles.headingStyle, this.props.headingStyle]}>
          {typesOfDiet}
        </Text>
        <View style={[styles.checkboxesStyle, this.props.checkboxesStyle]}>
          <View>
            <CircularCheckbox
              isChecked={this.props.typeOfDietSelectedArray.indexOf(typesOfDietArray.VEGETARIAN) == -1 ? false : true}
              label={typesOfDietArray.VEGETARIAN}
              onClick={()=>{
                this.props.onTypeOfDietClick(typesOfDietArray.VEGETARIAN);
              }}
            />
            <CircularCheckbox
              isChecked={this.props.typeOfDietSelectedArray.indexOf(typesOfDietArray.PESCETARIANS) == -1 ? false : true}
              label={typesOfDietArray.PESCETARIANS}
              onClick={()=>{
                this.props.onTypeOfDietClick(typesOfDietArray.PESCETARIANS);
              }}
            />
          </View>

          <View>
            <CircularCheckbox
              isChecked={this.props.typeOfDietSelectedArray.indexOf(typesOfDietArray.VEGAN) == -1 ? false : true}
              label={typesOfDietArray.VEGAN}
              onClick={()=>{
                this.props.onTypeOfDietClick(typesOfDietArray.VEGAN);
              }}
            />
            <CircularCheckbox
              isChecked={this.props.typeOfDietSelectedArray.indexOf(typesOfDietArray.OTHER) == -1 ? false : true}
              label={typesOfDietArray.OTHER}
              onClick={()=>{
                this.props.onTypeOfDietClick(typesOfDietArray.OTHER);
              }}
            />
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    // alignSelf: 'stretch',
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.Colors.Gray,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  headingStyle: {
    ...Constants.Fonts.normal,
    color: Constants.Colors.Gray,
    // marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
  },
  checkboxesStyle: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
  }
});
