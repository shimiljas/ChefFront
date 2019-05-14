/*
 * @file: ModalTimePicker.js
 * @description: Contains time picker modal.
 * @date: 06.07.2017
 * @author: Vishal Kumar
 * */

'use strict';

import React, { Component } from 'react';

import
{
	View,
	PickerIOS,
	StyleSheet,
	Modal,
	TouchableOpacity,
	Text,
	Platform,
	DatePickerIOS
} from 'react-native';

import Constants from '../../constants';

export default class ModalTimePicker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: new Date(),
			openTimePicker: this.props.openTimePicker,
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({openTimePicker: nextProps.openTimePicker})
	}

 	// Default render function
	render() {

		// console.log("Props")
		// console.log(this.props)

		return (

			<View style={styles.mainViewContainer}>
				<View style={styles.modalContainer}>

					<View style={styles.modalButtonsContainer}>
						<TouchableOpacity style={{flex:1}}
							onPress={()=>this.props.onHideModalTimePicker()}
						>
							<Text style={styles.cancelButton}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity style={{flex:1}}
							onPress={()=>{
								this.props.onTimeModalValueChange(this.state.date);
								this.props.onHideModalTimePicker();
							}}
						>
							<Text style={styles.doneButton}>Done</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.picker}>
						{
							(Platform.OS === 'ios') ?
							<DatePickerIOS
								date={this.state.date}
								mode="time"
								timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
								onDateChange={(date)=>this.setState({date: date})}
								minuteInterval={10}
							/>
							:
							<TimePickerAndroid
								date={this.state.date}
								mode="time"
								timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
								onDateChange={(date)=>this.setState({date: date})}
								minuteInterval={10}
							/>
						}
					</View>
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
