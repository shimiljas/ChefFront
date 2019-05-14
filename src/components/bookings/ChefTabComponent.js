
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

export default class ChefTabComponent extends Component {
  constructor(props){
    super(props);
    this.onBookPress = this.onBookPress.bind(this);
    this.onItemPress = this.onItemPress.bind(this);
  }
  
  onBookPress(data){
    if(this.props.isLoggedIn) {
      this.props.showChefCal(this.props.item);
    }else{
      Alert.alert(
        "Sign in Required",
        "Please sign in to use this feature",
        [
          {text: 'Cancel',  onPress: () => console.log('Cancel Pressed')},
          {text: 'Sign in', onPress: () =>{ this.props.navigation.navigate("LoginSignup", { 
            userType: "customer" ,
            initialIndex:1
          })}},
        ],
      { cancelable: false }
      );
    }
  }

  onItemPress(){
    if(this.props.isLoggedIn) {
      this.props.navigation.navigate('ViewBooking', {userDetails: this.props.item});
    }else{
      Alert.alert(
        "Sign in Required",
        "Please sign in to use this feature",
        [
          {text: 'Cancel',  onPress: () => console.log('Cancel Pressed')},
          {text: 'Sign in', onPress: () =>{ this.props.navigation.navigate("LoginSignup", { 
            userType: "customer" ,
            initialIndex:1
          })}},
        ],
      { cancelable: false }
      );
    }
  }

  render(){
    return(
      <TouchableOpacity onPress={this.onItemPress} activeOpacity={0.9} style={styles.main}> 
        <View style={styles.container}> 
          <View style={{flex: 1}}>
            <Avatar 
              user={this.props.item}
              avatarStyle={{marginLeft:0, marginTop:20}}/>          
          </View>
          <View style={{flex: 4, marginLeft: (Constants.BaseStyle.DEVICE_WIDTH/100)*2}}>
            <View style={{flexDirection:'row',}}>
              <View style={{justifyContent:'flex-end',flex:3.5}}>
                <Text style={styles.name} >
                  {this.props.item.fullName.showFullName().capitalizeEachLetter()}
                </Text>
              </View>
              <View style={{flexDirection: 'row',flex:1.5,justifyContent: 'flex-end'}}>
                  <View style={{bottom: 0}}>
                    <Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.LightGreen}}>$</Text>
                  </View>
                  <Text style={{...Constants.Fonts.title,color:Constants.Colors.LightGreen}}>
                    {this.props.item.ratePerHour}<Text style={{...Constants.Fonts.tinyMedium}}>/hr
                    </Text>
                  </Text>
              </View>
            </View>
            <View style={{marginTop:(Constants.BaseStyle.DEVICE_WIDTH/100)*3}}>
              <Text style={{...Constants.Fonts.tinyLarge,color:Constants.Colors.Gray}}>
                {this.props.item.position.address.capitalizeEachLetter()}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1,flexDirection:'row',marginHorizontal: (Constants.BaseStyle.DEVICE_WIDTH/100)*3,}}>
          <View style={{flex:1.1}}> 
            <StarRating 
              editable = {false}
              rating={this.props.item && this.props.item.rating ? this.props.item.rating.avgRating : 0} 
              iconStyle={{
                height:Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,
                width:Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,
              }} />
          </View> 
          <View style={{flex:3.8,flexDirection:'row', alignItems: 'center'}}>
            <View style={{flex:3.5}} >
              <Text style={{...Constants.Fonts.tiny,color:Constants.Colors.Gray}}>
                {this.props.item && this.props.item.distanceCalculated>=0 ?(this.props.item.distanceCalculated===0?this.props.item.distanceCalculated : this.props.item.distanceCalculated.toFixed(2)): null} km
              </Text>
            </View>
          <View>
            <TouchableOpacity activeOpacity={0.9}
              onPress={()=>{
                this.props.onCancel();
                this.onBookPress(this.props.item);
              }}
            >
              <Text style={styles.bookNowText}>Book now</Text>
            </TouchableOpacity> 
         </View>
         </View>
        </View>
      </TouchableOpacity>
  )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    marginHorizontal: (Constants.BaseStyle.DEVICE_WIDTH/100)*5,
    marginVertical: (Constants.BaseStyle.DEVICE_WIDTH/100)*5,
    backgroundColor:Constants.Colors.White,
  },
  bookNowText:{
    ...Constants.Fonts.bold,
    color:Constants.Colors.Magenta,
  },
  name:{
    ...Constants.Fonts.contentBold,
    color:Constants.Colors.Black
  },
  main:{
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
    backgroundColor:Constants.Colors.White,
    paddingBottom:(Constants.BaseStyle.DEVICE_WIDTH/100)*5,
  }
});