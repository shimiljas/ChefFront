/*
 * @file: Setting.js
 * @description: Chef/Caterer Setting Page.
 * @date: 01.08.2017
 * @author: Manish Budhiraja
 * */

'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Picker
} from 'react-native';
import Constants from '../../constants';
import BackButton  from "../../components/common/BackButton";
import Switch from '../../components/common/SwitchSettings';
import FormTextInput from '../../components/common/FormTextInput';
import NavigationBar  from "react-native-navbar";
import SubmitButton from '../../components/common/RoundButton';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastActionsCreators } from 'react-native-redux-toast';
import * as paymentsActions from '../../redux/modules/payments';
import * as userActions from "../../redux/modules/user";
import { scheduleNotifications, getScheduleNotifications, cancelAllLocalNotifications }from "../../utilities/PushNotification";
import moment from 'moment';
import Idx from '../../utilities/Idx';
import _ from 'lodash';
let token,userId;
class Settings extends Component {
  constructor(props){
    super(props);
     if(Idx(this.props,_ => _.user.userDetails.auth.token)){
      token = this.props.user.userDetails.auth.token;
      userId = this.props.user.userDetails.userId;
    }
    this.state={
      swithValue : false,
      hours : this.props.user.userDetails.reminder?this.props.user.userDetails.reminder.hours:1,
      showPicker : false,
      reminderStatus : this.props.user.userDetails.reminder?this.props.user.userDetails.reminder.status===0?false:true:false,
      notificationSwitch : this.props.user.userDetails.getNotification===0?false:true,
      token:this.props.user.userDetails.auth.token,
      userId:this.props.user.userDetails.userId,
    }
  }
 
 componentDidMount() {
   console.log("this.props.upcoming",this.props.upcoming)
    
   console.log("this.props.upcoming",this.props.upcoming)
     getScheduleNotifications("jkhjkfjk",function(data){
           console.log("notification21",data)
          });


 }

  /**
  * On Save Setting. 
  */
  onSavePress = () => {
   let {dispatch } = this.props.navigation; 
  //cancelAllLocalNotifications();
   if(this.state.reminderStatus == false){
    cancelAllLocalNotifications();
    }
   if(this.state.reminderStatus && this.props.upcoming.length > 0 && this.state.swithValue){
     cancelAllLocalNotifications();
      let upcoming = [...this.props.upcoming];
      let upcomingnew = [];
      _.map(upcoming,(element, i)=>{
        var duration = moment.duration(moment(new Date(element.starts_on)).diff(moment(new Date())));
        if(duration._data.hours >= this.state.hours || duration._data.days > 0 || duration._data.months > 0 || duration._data.years > 0){
         upcomingnew.push(element);
        }
      });
      if(upcomingnew.length != 0){
          upcomingnew = _.sortBy(upcomingnew,'starts_on');
         _.each(upcomingnew,(element, i)=>{
            scheduleNotifications({
              date  : moment(new Date(element.starts_on)).subtract(this.state.hours,"h"),
              hours : this.state.hours,
              id : element._id,
            });
         });
     
      }else{
        //dispatch(ToastActionsCreators.displayInfo("No bookings Availaible"));
      }
    }
    let requestObj = {
      hours :this.state.hours,
      status : this.state.reminderStatus?1:0,
      getNotification : this.state.notificationSwitch?1:0,
      token : token, userId: userId
    };
    this.props.userActions.updateSettings(requestObj)
  }

  /**
  * create picker items. 
  */

  getBrPickerItems(limit,interval) {
    let items = [];
    for(var i = 1; i <= limit; i=i+interval) {
      items.push(<Picker.Item key={i} label={`${i}`} value={i} />)
    }
    return items;
  }

  /**
  * Set State on picker value change.
  */

  onValueChange = (user) => {
    this.setState({
      hours : user,
      swithValue : true,
    })

  }

  /**
  * Fetch Bank Details or Insert Bank Details.
  */

  onBankDetailsPress=()=>{
    if(this.props.payments.bankDetails){
      this.props.navigation.navigate('RegisterBankDetails');
    }else{
      this.props.paymentsActions.fetchSavedBankDetails(this.state);
    }
   }

  render() {
    let context = this;
    let { navigate, goBack } = this.props.navigation;
    const titleConfig = {
      title: "Settings",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    return (
      <View style={[styles.container,{position :"relative"}]}>
        <NavigationBar 
          leftButton={<BackButton onPress={()=>goBack()} />} 
          title={titleConfig} />
        <View style={styles.appointmentContainer}>
          <Text style={styles.leftItem} >Appointment reminder</Text> 
          <Switch
            isSwitchOn={this.state.reminderStatus}
            onClick={()=>{
              this.setState({reminderStatus: !this.state.reminderStatus,swithValue : true});
            }}
          />
        </View>
        <View style={styles.secondText}>
         <Text style={styles.leftItem} >Remind me before</Text> 
        </View>
         <TouchableOpacity onPress={()=>{
          if(this.state.reminderStatus){
            this.setState({showPicker:true});
          }
         }} style={styles.thirdPicker}>
          <FormTextInput
            ref='newPass'
            placeHolderText={this.state.hours==1?this.state.hours+" hr": this.state.hours+" hrs"}
            secureText={true}
            autoFocus={false}
            editable={false}
            returnKey='next'
            isPassword={true}
            style={styles.formInput}
          />
        </TouchableOpacity>
       <View style={styles.notification}>
         <Text style={styles.leftItem} >Push Notifications</Text> 
         <Switch
            isSwitchOn={this.state.notificationSwitch}
            onClick={()=>{
              this.setState({notificationSwitch: !this.state.notificationSwitch});
            }}
          />
       </View>
       <TouchableOpacity  onPress={this.onBankDetailsPress} style={styles.bankDetail}>
         <Text style={styles.leftItem}>
          {"Add Bank Account / View Bank Details"}
         </Text> 
          <Image
             style={styles.imageArrow}
             source={Constants.Images.caterer.arrow_green}
           />
       </TouchableOpacity>
       <View style={styles.below}>
        <View style={{bottom:Constants.BaseStyle.DEVICE_HEIGHT/100*5}}>
          <SubmitButton
            buttonStyle={styles.buttonStyle}
            text={Constants.i18n.password.save.toUpperCase()}
            _Press={this.onSavePress} />
        </View>
       </View>
        {this.state.showPicker == false ? null :
          <View 
           style={{position:'absolute',top:0,bottom:0,left:0,width:Constants.BaseStyle.DEVICE_WIDTH,height:Constants.BaseStyle.DEVICE_HEIGHT}}>
             <View style={{position: 'absolute',backgroundColor:"white",bottom:0,left:0,width:Constants.BaseStyle.DEVICE_WIDTH,
             height:Constants.BaseStyle.DEVICE_HEIGHT/100*50}}>
                <Picker
                  selectedValue={this.state.hours}
                  onValueChange = {this.onValueChange}
                 >
                  {this.getBrPickerItems(24,1)}
                </Picker>
                <SubmitButton
                  buttonStyle={styles.buttonStyle}
                  text={"Done"}
                  _Press={() => this.setState({showPicker:false})} />
             </View>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Constants.Colors.White
  },
  appointmentContainer:{
    flexDirection:"row",
    alignItems:"center", 
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
    justifyContent:"space-between",
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,
    paddingLeft:Constants.BaseStyle.DEVICE_WIDTH/100*2,
    paddingRight:Constants.BaseStyle.DEVICE_WIDTH/100*2,
    flex : 0.1
  },
  below:{
    flex: 0.46,
    justifyContent : 'flex-end',
    alignItems : 'center'

  },
  textStyle:{
    ...Constants.Fonts.normal,
    color:Constants.Colors.GhostWhite
  },
  leftItem:{
    ...Constants.Fonts.normal,
    color:Constants.Colors.Gray,
    backgroundColor: Constants.Colors.Transparent,
  },
  secondText:{
    flex: 0.01,
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,
    paddingLeft:Constants.BaseStyle.DEVICE_WIDTH/100*2,
    paddingRight:Constants.BaseStyle.DEVICE_WIDTH/100*2,

  },
  thirdPicker:{
    flex: 0.17,

  },
  formInput:{
    borderBottomColor : Constants.Colors.HeaderGreen,
    borderBottomWidth :1,
    paddingLeft:Constants.BaseStyle.DEVICE_WIDTH/100*2,
    paddingRight:Constants.BaseStyle.DEVICE_WIDTH/100*2,
  },
  notification:{
    flex: 0.13,
    borderTopWidth:1,
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,
    borderTopColor: Constants.Colors.SettingLightGray, 
    flexDirection:"row",
    alignItems:"center", 
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
    justifyContent:"space-between",
    paddingLeft:Constants.BaseStyle.DEVICE_WIDTH/100*2,
    paddingRight:Constants.BaseStyle.DEVICE_WIDTH/100*2,
  },
  bankDetail:{
    flexDirection:"row",
    alignItems:"center", 
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
    justifyContent:"space-between",
    borderTopWidth:1,
    borderBottomWidth:1,
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,
    borderTopColor: Constants.Colors.SettingLightGray,
    borderBottomColor: Constants.Colors.SettingLightGray,
    paddingLeft:Constants.BaseStyle.DEVICE_WIDTH/100*2,
    paddingRight:Constants.BaseStyle.DEVICE_WIDTH/100*2,  
    flex : 0.13
  },
  buttonStyle:{
    borderRadius:null,
    alignSelf:"center",
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2/100,
  },
  imageArrow:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*3,
    width:Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
});

const mapStateToProps = state => ({
  payments : state.payments,
  user : state.user,
  upcoming : state.listing.upcoming
});

const mapDispatchToProps = dispatch => ({
  paymentsActions: bindActionCreators(paymentsActions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),

});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
