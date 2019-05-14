/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
	AppRegistry,
	View,
	Text,
	ScrollView,
	Dimensions,
	StyleSheet,
	KeyboardAvoidingView,
	FlatList,
	DatePickerIOS
} from "react-native";

import _ from "lodash";
import moment from "moment";
import { StackNavigator } from "react-navigation";
import Icons from "react-native-vector-icons/FontAwesome";
import Constants from "../../constants";
import DatepickerHeader from "../common/DatepickerHeader";
import RoundButton from "../common/RoundButton";

const dimension = Dimensions.get("screen");
export default class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
	  		date: this.props.date?this.props.date:new Date()
		};
	}

	/**
	*  on Date Change
	*/
	onDateChange(date) {
		if(this.props.onDateChange){
			this.props.onDateChange(date);
		}
		this.setState({
	      date: date
	    });
  	}
  	
	render() {
		const dimension = Dimensions.get("window");
		return (
			<View
				style={styles.container}
			>
				<View
					style={{
						width: Constants.BaseStyle.DEVICE_WIDTH,
						position: "absolute",
						bottom: 0,
						backgroundColor: 'white',
						shadowColor:"gray",
						shadowOffset: {width: 2, height: 2},
						shadowOpacity:0.9,
						shadowRadius:10
					}}  
				>
					<DatepickerHeader
						title={this.props.type=='filter'?"":'Schedule Booking'}
						dateTime={this.props.date ? this.props.date:this.state.date}     
						from={this.props.from} 
						to={this.props.to}
						fromTime={this.props.fromTime}
						cancel={()=>{ this.props.onCancel(); }}
					/>
					<DatePickerIOS
						date={this.state.date}
						mode={this.props.mode}
						minuteInterval={15}
						minimumDate={this.props.minimumDate}
						maximumDate={this.props.maximumDate}
						onDateChange={(date) => this.onDateChange(date)}
					/>
					<RoundButton
						text={this.props.label}
						_Press={() => this.props.Press()}
						buttonStyle={styles.buttonStyle}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		    top:0,
    bottom:0,
    left:0,
    right:0,
    position:"absolute",
    backgroundColor:'rgba(0,0,0,0)'
	},
	welcome: {
		fontSize: 20,
		textAlign: "center",
		margin: 10
	},
	instructions: {
		textAlign: "center",
		color: "#333333",
		marginBottom: 5
	},

	datePicker: {
		borderTopWidth: 1,
		position: "relative",
		bottom: 0,
		right: 0,
		left: 0,
		borderColor: "#CCC",
		backgroundColor: "#FFF"
	},
	buttonStyle: {
		marginVertical: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 2,
		alignSelf: "center",
		borderRadius: null
	}
});
