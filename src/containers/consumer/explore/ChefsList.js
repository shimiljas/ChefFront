/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  DatePickerIOS,
  ActivityIndicator
} from 'react-native';

import _ from 'lodash';
import moment from 'moment';
import { StackNavigator } from 'react-navigation';
import Icons from 'react-native-vector-icons/FontAwesome';
import ChefTabComponent from '../../../components/bookings/ChefTabComponent';
import Constants from '../../../constants';
import DatepickerHeader from "../../../components/common/DatepickerHeader";
import RoundButton from "../../../components/common/RoundButton";
import DatePicker from "../../../components/common/Datepicker";
import NoRecord from "../../../components/common/NoRecord";


export default class ChefTab extends Component {
  constructor(props){
    super(props);
    this.renderItem   = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  /**
  * Render Footer
  */
  renderFooter(){
    let context=this;
    return(
      <View style={this.props.isFooterVisible?styles.paginationView:{height:0,width:0}}>
        { this.props.isFooterVisible &&
          <ActivityIndicator
            style={{alignSelf:"center"}} 
            size={"large"} 
            color={Constants.Colors.Black}/>
        }
      </View>
    )
  }

  /**
  * Extract Item Key
  */
  _keyExtractor = (item, index) => item._id;

  renderItem({item, index}){
    let context = this;
    return(
      <ChefTabComponent 
        showChefCal={this.props.showChefCal}
        isLoggedIn={this.props.isLoggedIn}
        navigation={this.props.navigation}
        item={item}
        onCancel={this.props.onCancel}
      />
    );
  }

  render(){
  	return(
      <View style={[styles.container]}>
        <FlatList
          data={this.props.data}
          onRefresh={()=>this.props.chefListRefresh()}
          refreshing={this.props.isRefreshing}
          onEndReachedThreshold={0.8}
          onEndReached={()=>this.props.chefListonReachedEnd()}
          keyExtractor={(item, index)=>this._keyExtractor(item, index)}
          enableEmptySections={true}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={()=><NoRecord />}
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
  },
  paginationView:{
    height:50,
    backgroundColor:Constants.Colors.Transparent,
    justifyContent:"center"
  },
});

