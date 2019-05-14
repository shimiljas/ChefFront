/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,FlatList,
  Text,Button,Dimensions,Image,TouchableOpacity,
  View,ScrollView,DatePickerIOS,
} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import CatererTabComponent from '../../../components/bookings/CatererTabComponent';
import Constants from '../../../constants';
import NoRecord from "../../../components/common/NoRecord";

export default class CatererTab extends Component {
  render(){
  	return(
      <View style={ styles.container   }>
        <FlatList
          data={[]}
          renderItem={({item}) =>   
            <CatererTabComponent showCatererCal={ this.props.showCatererCal }/>
          }
          ListEmptyComponent={()=><NoRecord info={"Coming Soon"}  />}
        /> 
      </View>
  	)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  datePicker: {
  borderTopWidth: 1,
  position: 'relative',
  bottom:0,
  right: 0,
  left: 0,
  borderColor: '#CCC',
  backgroundColor: '#FFF',
},
 buttonStyle:{
    marginVertical:Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    alignSelf:"center",
    borderRadius:null,
  }
});
