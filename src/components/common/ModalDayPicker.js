/*
 * @file: ModalDayPicker.js
 * @description: Contains day picker modal.
 * @date: 06.07.2017
 * @author: Vishal Kumar
 * */

import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Picker, StyleSheet } from 'react-native';

import Constants from '../../constants';

export default class ModalDayPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
      day: "Monday"
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({open: nextProps.open})
  }

  // makes Modal visible
  setModalVisible(visible) {
    this.setState({open: visible});
  }

  // Function calls the parent class onDayModalValueChange for setting day
  onDayModalValueChange(itemValue, itemIndex) {
    this.setState({day: itemValue});
  }

  // Default render function
  render() {
    return (
      <View style={styles.mainViewContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={{flex:1}}
              onPress={()=>this.props.onHideModalDayPicker()}
            >
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1}}
              onPress={()=>{
                this.props.onDayModalValueChange(this.state.day);
                this.props.onHideModalDayPicker();
              }}
            >
              <Text style={styles.doneButton}>Done</Text>
            </TouchableOpacity>
          </View>

          <Picker
            style={styles.picker}
            selectedValue={this.state.day}
            onValueChange={(itemValue, itemIndex) => this.onDayModalValueChange(itemValue, itemIndex)}
          >
            <Picker.Item label="Monday" value="Monday" />
            <Picker.Item label="Tuesday" value="Tuesday" />
            <Picker.Item label="Wednesday" value="Wednesday" />
            <Picker.Item label="Thursday" value="Thursday" />
            <Picker.Item label="Friday" value="Friday" />
            <Picker.Item label="Saturday" value="Saturday" />
            <Picker.Item label="Sunday" value="Sunday" />
          </Picker>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	mainViewContainer: {
		position: 'absolute',
		bottom: 0,
		width: Constants.BaseStyle.DEVICE_WIDTH,
		height: Constants.BaseStyle.DEVICE_HEIGHT
	},
	modalContainer: {
		width: Constants.BaseStyle.DEVICE_WIDTH,
		height: Constants.BaseStyle.DEVICE_HEIGHT/100*30,
		position: 'absolute',
		bottom: 0
	},
	modalButtonsContainer: {
		flexDirection:'row',
		backgroundColor: 'white'
	},
	cancelButton: {
		textAlign: "left",
		marginLeft:15
	},
	doneButton: {
		textAlign: "right",
		marginRight:15
	},
	picker: {
		backgroundColor: Constants.Colors.White,
	},
});
