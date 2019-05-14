/*
 * @file: TypesOfDietCaterer.js
 * @description: Contains types of diet checkboxes of Caterer
 * @date: 06.07.2017
 * @author: Vishal Kumar
 * */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import Constants from '../../constants';

let {
  typesOfDiet,
} = Constants.i18n.signupChef;

const typesOfDietArray = {
  VEGAN: 'Vegan',
  VEGETARIAN: 'Vegetarian',
  NONVEGETARIAN: 'Non-vegetarian',
  PESCETARIANS: 'Pescetarians',
  OTHER: 'Other',
};

export default class TypesOfDiet extends Component {
  constructor(props) {
    super(props);
    let { typeOfDietSelectedArray } = this.props;
    this.state = {
      veganChecked: typeOfDietSelectedArray.indexOf(typesOfDietArray.VEGAN) == -1 ? false : true,
      vegetarianChecked: typeOfDietSelectedArray.indexOf(typesOfDietArray.VEGETARIAN) == -1 ? false : true,
      nonVegetarianChecked: typeOfDietSelectedArray.indexOf(typesOfDietArray.NONVEGETARIAN) == -1 ? false : true,
      pescetariansChecked: typeOfDietSelectedArray.indexOf(typesOfDietArray.PESCETARIANS) == -1 ? false : true,
      otherChecked: typeOfDietSelectedArray.indexOf(typesOfDietArray.OTHER) == -1 ? false : true
    }
  }

  onClick(type) {

    let { typeOfDietSelectedArray } = this.props;

    if(type == typesOfDietArray.VEGAN) {
      let checkedFinal = typeOfDietSelectedArray.indexOf(typesOfDietArray.VEGAN) == -1 ? false : true;
      this.setState({veganChecked: checkedFinal});

    } else if(type == typesOfDietArray.VEGETARIAN) {
      let checkedFinal = typeOfDietSelectedArray.indexOf(typesOfDietArray.VEGETARIAN) == -1 ? false : true;
      this.setState({vegetarianChecked: checkedFinal});

    } else if(type == typesOfDietArray.NONVEGETARIAN) {
      let checkedFinal = typeOfDietSelectedArray.indexOf(typesOfDietArray.NONVEGETARIAN) == -1 ? false : true;
      this.setState({nonVegetarianChecked: checkedFinal});

    } else if(type == typesOfDietArray.PESCETARIANS) {
      let checkedFinal = typeOfDietSelectedArray.indexOf(typesOfDietArray.PESCETARIANS) == -1 ? false : true;
      this.setState({pescetariansChecked: checkedFinal});

    } else {
      let checkedFinal = typeOfDietSelectedArray.indexOf(typesOfDietArray.OTHER) == -1 ? false : true;
      this.setState({otherChecked: checkedFinal});
    }
  }

  render() {
    let {
      veganChecked,
      vegetarianChecked,
      nonVegetarianChecked,
      pescetariansChecked,
      otherChecked
    } = this.state;

    return (
      <View style={styles.viewStyle}>
        {
          !this.props.veganEnabled &&
          <TouchableOpacity style={veganChecked ? styles.buttonSelected : styles.buttonUnselected} onPress={()=>
            {
              this.props.onTypeOfDietClick(typesOfDietArray.VEGAN);
              this.onClick(typesOfDietArray.VEGAN);
            }}
          >
            <Text style={styles.textWhite}>{typesOfDietArray.VEGAN}</Text>
          </TouchableOpacity>
        }

        {
          !this.props.vegetarianEnabled &&
          <TouchableOpacity style={vegetarianChecked ? styles.buttonSelected : styles.buttonUnselected} onPress={()=>
            {
              this.props.onTypeOfDietClick(typesOfDietArray.VEGETARIAN);
              this.onClick(typesOfDietArray.VEGETARIAN);
            }}
          >
            <Text style={styles.textWhite}>{typesOfDietArray.VEGETARIAN}</Text>
          </TouchableOpacity>
        }

        {
          !this.props.nonVegetarianEnabled &&
          <TouchableOpacity style={nonVegetarianChecked ? styles.buttonSelected : styles.buttonUnselected} onPress={()=>
            {
              this.props.onTypeOfDietClick(typesOfDietArray.NONVEGETARIAN);
              this.onClick(typesOfDietArray.NONVEGETARIAN);
            }}
          >
            <Text style={styles.textWhite}>{typesOfDietArray.NONVEGETARIAN}</Text>
          </TouchableOpacity>
        }

        {
          !this.props.pescetarianEnabled &&
          <TouchableOpacity style={pescetariansChecked ? styles.buttonSelected : styles.buttonUnselected} onPress={()=>
            {
              this.props.onTypeOfDietClick(typesOfDietArray.PESCETARIANS);
              this.onClick(typesOfDietArray.PESCETARIANS);
            }}
          >
            <Text style={styles.textWhite}>{typesOfDietArray.PESCETARIANS}</Text>
          </TouchableOpacity>
        }

        {
          !this.props.otherEnabled &&
          <TouchableOpacity style={otherChecked ? styles.buttonSelected : styles.buttonUnselected} onPress={()=>
            {
              this.props.onTypeOfDietClick(typesOfDietArray.OTHER);
              this.onClick(typesOfDietArray.OTHER);
            }}
          >
            <Text style={styles.textWhite}>{typesOfDietArray.OTHER}</Text>
          </TouchableOpacity>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //alignSelf: 'stretch',
    //alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.Colors.Gray,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    //paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*1/100
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
