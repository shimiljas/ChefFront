/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

  import React, { Component } from 'react';
  import {
    AppRegistry,
    StyleSheet,
    Text,Button,Dimensions,Image,TouchableOpacity,
    View
  } from 'react-native';
  import { StackNavigator } from 'react-navigation';
  import Avatar from '../common/Avatar';
  import Constants from '../../constants';
  import StarRating from '../common/StarRating';
  import { ScrollableTabView } from 'react-native-scrollable-tab-view';


const dimension=Dimensions.get('screen');
export default class CatererTabComponent extends Component {

  constructor(){
    super();
  }
  

  render(){
    return(
      <View> 
        <View style={styles.container}> 
          <View style={{flex:1}}>
            <Avatar avatarStyle={{marginLeft:10,marginTop:20}} />
            <View style={{flex:1.1,paddingTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100}}>
              <StarRating rating={3} iconStyle={{height:Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,width:Constants.BaseStyle.DEVICE_HEIGHT*1.5/100}} />
            </View>           
          </View>
          <View style={{flex:3 , marginLeft:(dimension.width/100)*2 }}>
            <View style={{flexDirection:'row',flex:1}}>
              <View style={{justifyContent:'flex-end',flex:3.5}}>
                <Text style={{...Constants.Fonts.contentBold}} >Nishant Saraswat </Text>
              </View>                 
          </View>
          <View style={{marginTop:(dimension.width/100)*3}}>
            <Text style={{...Constants.Fonts.tinyLarge,color:Constants.Colors.Gray}}>32 Crown Street, near Hotel Grandeur, London</Text>
          </View>
         <View style={{flexDirection:'row',marginTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100}}>
            <View style={{flex:1,flexDirection:'row',}}>
              <Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.Gray}}>Price per person:</Text><Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.LightGreen}}>$4</Text>
            </View>
            <View style={{flex:1,alignItems:'flex-end',flexDirection:'row'}}>  
              <Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.Gray}}>Delivery Charges:</Text><Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.LightGreen}}>$22</Text>
            </View>   
         </View>
        </View>
      </View>
      <View style={{flex: 1,flexDirection:'row',marginHorizontal: (dimension.width/100)*5,}}>
        <View style={{flex:3,flexDirection:'row', alignItems: 'center'}}>
          <View style={{flex:1,alignItems:'flex-end'}}>
            <TouchableOpacity onPress={ ()=> this.props.showCatererCal() } >
              <Text  style={{...Constants.Fonts.normal,color:Constants.Colors.Magenta}}>Book Now</Text>
            </TouchableOpacity> 
          </View>
        </View>
      </View>
      <View style={{borderBottomWidth:(dimension.width/100)*0.2,borderBottomColor:Constants.Colors.Gray,marginTop:(dimension.width/100)*5  }}>
    </View>
 </View>


    
    )
  }

}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection:'row',
      backgroundColor:Constants.Colors.White,
      marginHorizontal: (dimension.width/100)*5,
      marginVertical: (dimension.width/100)*5,
    },
  });