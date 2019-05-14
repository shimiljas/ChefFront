import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity, Platform } from 'react-native';
import Constants from "../../constants";
import Background from '../../components/common/Background';
import NavigationBar  from "react-native-navbar";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as listingActions from '../../redux/modules/listing';
import * as availabilityActions from '../../redux/modules/availability';
import * as notificationActions from '../../redux/modules/notifications';
import { getSocketClient } from "../../utilities/SocketClient";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import Idx from "../../utilities/Idx";
import _ from 'lodash';
import moment from 'moment';
import { cancelAllLocalNotifications, scheduleNotifications,getScheduleNotifications } from "../../utilities/PushNotification";

class ChefDashboard extends Component {
  
  constructor(props) {
    super(props);
    let token='', userId='';
    if (Idx(this.props, _ => _.user.userDetails.auth.token)) {
      userId  = this.props.user.userDetails.userId;
      token   = this.props.user.userDetails.auth.token;
    }
    this.state = {
      token: token,
      userId: userId,
      skip: 0,
      limit: 10,
      isInitialLoad : true
    }
    this.interval = 0;
  }

  componentWillMount(){
    this.getNotificationsCount();
    this.props.availabilityActions.getAvailablilyList({...this.state,...{isLoading:true}});
    this.getUpcomingList();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.availability != nextProps.availability){
      let context = this;
      getScheduleNotifications("data",function(data){
        let setvalue = [];
        let items  = _.filter(nextProps.availability, function(item,i){
          let check = false;
          _.find(data, function(o) { 
              if(o.id == item.id){
                check = true;
              }
          });
          if(check == false){
            setvalue.push(item)
          }   
        });
        if (Idx(context.props, _ => _.user.userDetails.reminder.status)) {
          let upcomingnew = [];
          _.map(setvalue,(element, i)=>{
            let duration = moment.duration(moment(new Date(element.starts_on)).diff(moment(new Date())));
            if(duration._data.hours >= context.props.user.userDetails.reminder.hours || duration._data.days > 0 || duration._data.months > 0 || duration._data.years > 0){
              upcomingnew.push(element);
            }
          });
          if(upcomingnew.length != 0){
              upcomingnew = _.sortBy(upcomingnew,'starts_on');
             _.each(upcomingnew,(element, i)=>{
                scheduleNotifications({
                  date  : moment(new Date(element.starts_on)).subtract(context.props.user.userDetails.reminder.hours,"h"),
                  hours : context.props.user.userDetails.reminder.hours,
                  id : element.id,
                });
             });
          }
        }
      });
    }
  }

  getUpcomingList = () => {
    let context = this;
    context.props.listingActions.getUpcomingBookingList(context.state,function(count){});
  }

  getAvailablilyList = () => {
   this.props.availabilityActions.getAvailablilyList({...this.state,...{isLoading:false}});
  }

  // Fetches unread notification count
  getNotificationsCount = () => {
    let context = this;
    if(context.props.user.userDetails){
      let requestObject = { 
        token   : context.props.user.userDetails.auth.token,
        userId  : context.props.user.userDetails.userId,
      };
      context.props.notificationActions.getNotificationsList(requestObject);
      context.interval = context.setInterval(()=>{
        context.props.notificationActions.getNotificationsList(requestObject);
      },1000*1*10);
    }
  }

  // Default Render Function
  render() {
    let context = this;
    let { welcome, request, appointment, report, availability, messages, profile } = Constants.i18n.chef_caterer_dashboard;
    let { navigate } = context.props.navigation;
    let appointmentsCount = context.props.listing.upcoming.length; 
    let msgUnreadCount = 0;
    Object.keys(context.props.conversations).map((rooms)=> {
      msgUnreadCount += context.props.conversations[rooms].unreadCount;
    });

    const titleConfig = {
      title: welcome +" "+ (context.props.user.userDetails?context.props.user.userDetails.fullName.split(" ")[0].capitalizeEachLetter():""),
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    
    return (
      <Background isFaded={true}>
        <NavigationBar 
          rightButton={
            <TouchableOpacity
              style={styles.notificationIcon}
              activeOpacity={0.9} onPress={()=>navigate("Notifications")}
            >
              <Image style={{height:20,width:20}} source={Constants.Images.user.noti_icon}/>
              {
                this.props.notifications.unreadCount>0 &&
                <View style={styles.notificationCountView}>
                  <Text style={styles.notifyTextStyle}>
                    {this.props.notifications.unreadCount > 9 ? "9+" : this.props.notifications.unreadCount}
                  </Text>
                </View>
              }
            </TouchableOpacity>
          }
          title={titleConfig} 
        />
        <View style={styles.container}>
          <View style={styles.box}>
            <TouchableOpacity onPress={()=>navigate("ChefRequest")} activeOpacity={0.9} style={styles.boxLeftStyle}>
              <Image style={styles.requestIcon} source={Constants.Images.caterer.request}  />
              <Text style={styles.text}>{request}</Text>
              {
                this.props.listing.active.length>0 &&
                <View style={styles.notificationView}>
                  <Text style={styles.notifyText}>
                    {this.props.listing.active.length>9?"9+":this.props.listing.active.length}
                  </Text>
                </View>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigate("Bookings",{initialIndex:1})} activeOpacity={0.9} style={styles.boxRightStyle}>
              <Image style={styles.appointmentIcon} source={Constants.Images.caterer.appointment}  />
              <Text style={styles.text}>{appointment}</Text>
              {
                appointmentsCount>0 &&
                <View style={styles.notificationView}>
                  <Text style={styles.notifyText}>
                    {appointmentsCount>9?"9+":appointmentsCount}
                  </Text>
                </View>
              }
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <TouchableOpacity onPress={()=>navigate("Reports")} activeOpacity={0.9} style={styles.boxLeftStyle}>
              <Image style={styles.reportIcon} source={Constants.Images.caterer.reports}  />
              <Text style={styles.text}>{report}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigate("ChefProfile")} activeOpacity={0.9} style={styles.boxRightStyle}>
              <Image style={styles.profileIcon} source={Constants.Images.caterer.profile}  />
              <Text style={styles.text}>{profile}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.getAvailablilyList} style={styles.boxLeftStyle}>
              <Image style={styles.availabilityIcon} source={Constants.Images.caterer.availability}  />
              <Text style={styles.text}>{availability}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigate("Messages",{isConsumer:false})} activeOpacity={0.9} style={styles.boxRightStyle}>
              <Image style={styles.messagesIcon} source={Constants.Images.caterer.messages}  />
              <Text style={styles.text}>{messages}</Text>
              {
                msgUnreadCount>0 &&
                <View style={styles.notificationView}>
                  <Text style={styles.notifyText}>
                    {msgUnreadCount>9?"9+":msgUnreadCount}
                  </Text>
                </View>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Background>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"rgba(0,0,0,.4)"
  },
  box:{
    flexDirection:'row'
  },
  boxLeftStyle: {
    flex:1,
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*31.1,
    borderBottomWidth:.5,
    borderRightWidth:.5,
    borderColor:'rgba(255,255,255,.5)', 
    alignItems:'center', 
    justifyContent:'center'
  },
  boxRightStyle: {
    flex:1,
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*31.1,
    borderBottomWidth:.5,
    borderColor:'rgba(255,255,255,.5)', 
    alignItems:'center', 
    justifyContent:'center'
  },
  text: {
    color:Constants.Colors.Gray,
    backgroundColor:'transparent',
    ...Constants.Fonts.normal
  },
  requestIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*14,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  appointmentIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*12,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  profileIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*8,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  availabilityIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*13,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  reportIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*15,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*15,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3,
    marginBottom  : Constants.BaseStyle.DEVICE_WIDTH/100*0
  },
  messagesIcon:{
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*11,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*11.7,
    margin  : Constants.BaseStyle.DEVICE_WIDTH/100*3
  },
  notificationView:{
    backgroundColor:Constants.Colors.HeaderGreen,
    height  : Constants.BaseStyle.DEVICE_WIDTH/100*6,
    width   : Constants.BaseStyle.DEVICE_WIDTH/100*6,
    borderRadius : Constants.BaseStyle.DEVICE_WIDTH/100*3,
    alignItems:"center",
    justifyContent:"center",
    position:"absolute",
    top:Constants.BaseStyle.DEVICE_HEIGHT/100*15,
    left:Constants.BaseStyle.DEVICE_WIDTH/100*29.5, 
    zIndex:1
  },
  notifyText:{
    color:Constants.Colors.White,
    backgroundColor:'transparent',
    ...Constants.Fonts.tinyLarge,
    alignSelf:"center",
    textAlign:"center"
  },
  notificationIcon: {
    justifyContent: 'flex-end',
    marginRight: Constants.BaseStyle.DEVICE_WIDTH*3/100,
    bottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    ...Platform.select({
      ios:{
        width : Constants.BaseStyle.DEVICE_WIDTH*6/100
      },
      android:{
        width : Constants.BaseStyle.DEVICE_WIDTH*6/100
      }
    }),
  },
  notificationCountView: {
    position: 'absolute',
    backgroundColor: Constants.Colors.Magenta,
    borderRadius: Constants.BaseStyle.DEVICE_WIDTH*2.5/100,
    height: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    width: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios:{
        right : -Constants.BaseStyle.DEVICE_WIDTH*1.5/100
      },
      android:{
        right : 0
      }
    }),
    bottom: Constants.BaseStyle.DEVICE_WIDTH*2.3/100
  },
  notifyTextStyle: {
    ...Constants.Fonts.tiny,
    color: Constants.Colors.White,
    backgroundColor: Constants.Colors.Transparent
  }
});

ReactMixin(ChefDashboard.prototype, TimerMixin);

const mapStateToProps = state => ({
  user     : state.user,
  listing  : state.listing,
  conversations : state.conversations,
  availability : state.availability.upcoming,
  notifications : state.notifications
});

const mapStateToDispatch = dispatch =>({
  listingActions      : bindActionCreators(listingActions,dispatch),
  availabilityActions : bindActionCreators(availabilityActions,dispatch),
  notificationActions : bindActionCreators(notificationActions, dispatch)
});

export default connect(mapStateToProps, mapStateToDispatch)(ChefDashboard);
