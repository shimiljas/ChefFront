/* *
 * @file: AppointmentList.js
 * @description: List of appointments acc to single day.
 * @date: 04.07.2017
 * @author: Manish Budhiraja
 * */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  InteractionManager,
  Platform,
  Alert,
  FlatList,
  Text
} from 'react-native'
import Constants from '../../constants';
import NoRecord from "../../components/common/NoRecord";
import ChefAvailability  from "../../components/bookings/ChefAvailability";

export default class AppointmentsList extends Component{
  /* *
   * @constructor: Default constructor
   * */
  constructor(props){
    super(props);
  }

  /* *
   * @function: renders each booking
   * */
  renderItem(item) {
    return (
      <View>
        <ChefAvailability
          item={item} 
        /> 
      </View>
    );
  }

  /* *
   * @function: Default render function
   * */
  render(){
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.data}
          renderItem={({item}) => this.renderItem(item)}
          ListEmptyComponent={()=><NoRecord textStyle={styles.textStyle} />}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: Constants.Colors.White,
  },
  textStyle:{
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*12,
  }
});

