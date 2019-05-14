
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  DatePickerIOS,
  Text,
  Button,
  TouchableOpacity,
  View,
  Image,
  Alert
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Avatar from '../common/Avatar';
import Constants from '../../constants';
import StarRating from '../common/StarRating';
import { ScrollableTabView } from 'react-native-scrollable-tab-view';
import DatepickerHeader from "../common/DatepickerHeader";
import FormSubmitButton from "../common/FormSubmitButton";

export default class ChefAvailability  extends Component {
  constructor(props){
    super(props);
  }

  // Default render function
  render() {
    let { item } = this.props;
    return (
              <View style={styles.container}>
                 <View style={{ flex: 1 ,flexDirection:'row', }} > 
                  <View style={{flex:2,}}>
                      <Avatar 
                          user={this.props.item}
                          avatarStyle={{margin:10}}/>
                  </View>
                  <View style={{flex:8}}>
                     <View style={styles.nameContainer}>
                        <View style={{flex:3}}>
                          <Text style={{...Constants.Fonts.contentBold}}>{item.fullName}</Text>
                        </View>
                        <View style={{flex:1.5,flexDirection:'row'}}>
                          <Text style={{...Constants.Fonts.tinyLargeBold,color:Constants.Colors.Gray}}>Date: 
                          <Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.Gray}}>{item.date}</Text></Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'column'}}>
                        <View>
                          <Text style={styles.timeContainer} >Time: 
                          <Text style={{...Constants.Fonts.tinyMedium }}>{item.timeFrom} to {item.timeTo}</Text></Text>
                        </View>
                        <View>
                          <Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.Gray}}>{item.address}</Text>
                        </View>
                    </View>
                  </View>
                 </View> 
             </View>
      )
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    backgroundColor:Constants.Colors.White,
    marginTop:4,
    borderBottomWidth:0.5,
    paddingBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*1,  
    borderBottomColor:Constants.Colors.Gray
  },
  nameContainer:{
    flexDirection:'row',
    marginBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*1.2,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*1
  },
  timeContainer:{
    ...Constants.Fonts.tinyLargeBold,
    marginBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*0.5,
    color:Constants.Colors.Gray
  }
 
});