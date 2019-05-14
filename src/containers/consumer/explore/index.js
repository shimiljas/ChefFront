import React, { Component } from "react";
import {
  ScrollView,
  VirtualizedList,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Animated,
  listener,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../../redux/modules/user";
import * as locationActions from "../../../redux/modules/location";
import * as bookingActions from "../../../redux/modules/bookings";
import Idx from "../../../utilities/Idx";
import ComingSoon from "../../../components/common/ComingSoon";
import AddressField from "../../../components/common/AddressField";
import { currentTime , nextTime} from '../../../utilities/TimeSlots';
import DatePicker from "../../../components/common/Datepicker";
import ScrollableTabView, {
  ScrollableTabBar,
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Chef from "./ChefsList";
import Caterer from "./CaterersList";
import Constants from "../../../constants";
import DatepickerHeader from "../../../components/common/DatepickerHeader";
import FormSubmitButton from "../../../components/common/FormSubmitButton";
import _ from "lodash";
import { ToastActionsCreators } from 'react-native-redux-toast';
import Permissions from 'react-native-permissions';
import * as notificationActions from '../../../redux/modules/notifications';
import { checkPermissions }from "../../../utilities/Locations";

class Explore extends Component {
  
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(0);
    this.isEndReached = false;
    this.userToken="";
    this.userId="";
    this.filtersCount = 0;
    this.isLoggedIn = false;
    if (Idx(this.props, _ => _.user.userDetails.auth.token)) {
      this.isLoggedIn = true;
      this.userToken = this.props.user.userDetails.auth.token;
      this.userId = this.props.user.userDetails.userId;
    }
         
    this.state = {
      canScroll: false,
      caterer: false,
      flag: false,
      bookFilter: false,
      dayFilter: false,
      chefBookCal: false,
      catererBookCal: false,
      bookChefDate: currentTime(Constants.TimeConfig.start),
      bookChefDateCopy: currentTime(Constants.TimeConfig.start),
      nextBookChefDate: currentTime(Constants.TimeConfig.end),
      nextBookChefDateCopy: currentTime(Constants.TimeConfig.end),
      bookCatererDate: new Date(),
      filterDate: "",
      anyTimeDate: new Date(),
      nextChefBookCal: false,
      nextCatererBookCal: false,
      nextAnyTimeCal: false,
      anyDay: "",
      disableAnyday: false,
      animatedValue: new Animated.Value(Constants.BaseStyle.DEVICE_HEIGHT / 2.9),
      userId:this.userId,
      token:this.userToken,
      cheflistInc : 1,
      starts_on : moment(new Date()).toDate(),
      ends_on : moment(new Date()).seconds(59).minute(59).hours(23).toDate(),
      skip:0,
      limit:10,
      total:0,
      isRefreshing: false,
      isFooterVisible : false,
      isDateSelected : false,
      isTimeSelected : false,
      position : {
        lat : 0,
        long : 0,
        address : ""
      },
      isLocationEnabled : true,
    };
    this.interval = 0;
    this.animateDown = this.animateDown.bind(this);
    this.animateUp = this.animateUp.bind(this);
    this.clearfilters=this.clearfilters.bind(this);

  }

  /**
  * Call Notification API for its count
  */

  componentWillMount() {
    this.getNotificationsCount();
  }

  /**
  * Call Rest API on componentDidMount
  */

  componentDidMount(){
    this.setState({isRefreshing:true});
    this.getData(true);
  }

  componentWillUnmount(){
    this.clearInterval(this.interval);
  }

  /**
  * Tab Nviagtor Icon
  */

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={Constants.Images.user.bottom_explore_active}
        style={[styles.icon, { tintColor: tintColor }]}
      />
  };

  /**
  * Animate Filters Downwords 
  */

  animateDown() {
    if (!this.state.caterer) {
      Animated.timing(this.state.animatedValue, {
        toValue: Constants.BaseStyle.DEVICE_HEIGHT / 10,
        duration: 500
      }).start();
      this.setState({ caterer: true, flag: true });
    } else {
      this.animateUp();
    }
  }

  /**
  * Animate Filters Upwords 
  */

  animateUp() {
    Animated.timing(this.state.animatedValue, {
      toValue: Constants.BaseStyle.DEVICE_HEIGHT / 2.9,
      duration: 500
    }).start();
    this.setState({ caterer: false, flag: false });
  }

  /**
  *  Close Date Pickers
  */

  cancelBookCal() {
    this.setState({ bookFilter: false });
  }
  
  cancelFilterCal() {
    this.setState({ dayFilter: false, filterDate: this.state.anyDay });
  }

  cancelChefCal() {
    this.setState({ 
      chefBookCal: false, 
      nextChefBookCal: false,
      bookChefDate: currentTime(Constants.TimeConfig.start),
      bookChefDateCopy: currentTime(Constants.TimeConfig.start),
      nextBookChefDate: currentTime(Constants.TimeConfig.end),
      nextBookChefDateCopy: currentTime(Constants.TimeConfig.end),
    });
  }
  
  cancelCatererCal() {
    this.setState({ catererBookCal: false });
  }
  
  cancelAnyTimeCal() {
    this.setState({ AnyTimeCal: false, nextAnyTimeCal: false });
  }

  /**
  * Request Object to fetch list of data.
  */

  getData(isIntialLoad){
    let context = this;
    if(isIntialLoad){
      context.setTimeout(()=>{
        if(context.props.location.currentLocation != null){
          let requestObject = {
            position:{
              lat : context.props.location.currentLocation.position.lat,
              long : context.props.location.currentLocation.position.lng,
              address : context.props.location.currentLocation.formattedAddress
            },
            role : 1,
            starts_on: context.state.starts_on,
            ends_on: context.state.ends_on,
            skip:context.state.skip,
            limit:context.state.limit
          }
          context.setState({
            position:{
              lat : context.props.location.currentLocation.position.lat,
              long : context.props.location.currentLocation.position.lng,
              address : context.props.location.currentLocation.formattedAddress
            }
          });
          context.props.bookingActions.chefList(requestObject,function(count) {
            context.isEndReached = false;
            if(count){
              context.setState({
                total:count,
                isFooterVisible:false,
                isRefreshing:false
              });
            }else{
              context.setState({
                isFooterVisible:false,
                isRefreshing:false
              });
            }
          });
        }else{
          if(context.props.location.isError){
            context.setState({
              isFooterVisible:false,
              isRefreshing:false,
              isLocationEnabled:false
            });
            context.setTimeout(()=>{
              Alert.alert(
                "Location Permissions", 
                "We need to access your location. Please go to Settings > Privacy > Location to allow Upstrom to access your location.", 
                [{
                  text: "Enable",
                  onPress:()=>{Permissions.openSettings()}
                },{
                  text: "Cancel",
                  onPress:()=>{console.log("Cancel")}
                }],
                {cancelable: false}
              );
            },700);
          }else{
            context.getData(true);
          }
        }
      },500);
    }else{
      let requestObject = {
        position:{
          lat : context.state.position.lat,
          long : context.state.position.long,
          address : context.state.position.address,
        },
        role : 1,
        starts_on: context.state.starts_on,
        ends_on: context.state.ends_on,
        skip:context.state.skip,
        limit:context.state.limit
      }
      context.props.bookingActions.chefList(requestObject,function(count) {
        context.isEndReached = false;
        if(count){
          context.setState({
            total:count,
            isFooterVisible:false,
            isRefreshing:false
          });
        }else{
          context.setState({
            isFooterVisible:false,
            isRefreshing:false
          });
        }
      });
    }
  }

  /**
  * onRefresh
  */

  chefListRefresh(){
    let context = this;
      context.setState({skip:0,isRefreshing:true});
    if(context.props.location.isError){
      checkPermissions({
        dispatch : context.props.navigation.dispatch
      });
      context.setTimeout(()=>context.getData(false),1000);
    }else{
      context.setTimeout(()=>context.getData(false),1000);
    }
  }

  /**
  * onEndReached
  */

  chefListonReachedEnd(){
    let context = this;
    if(!context.isEndReached  && context.state.skip<context.state.total){
      context.isEndReached = true;
      context.setState({
        skip:context.state.skip+10,
        isFooterVisible : true
      });
      context.setTimeout(()=>context.getData(false),1000);
    }
  }

  /**
  * Clear all applied filters 
  */
  
  clearfilters(){
    this.props.locationActions.selectLocation(null);
    //this.props.bookingActions.clearChefList();
    this.setState({
      isRefreshing : true,
      bookFilter: false,
      dayFilter: false,
      chefBookCal: false,
      catererBookCal: false,
      bookChefDate: currentTime(Constants.TimeConfig.start),
      bookChefDateCopy: currentTime(Constants.TimeConfig.start),
      nextBookChefDate: currentTime(Constants.TimeConfig.end),
      nextBookChefDateCopy: currentTime(Constants.TimeConfig.end),
      bookCatererDate: new Date(),
      filterDate: "",
      anyTimeDate: new Date(),
      nextChefBookCal: false,
      nextCatererBookCal: false,
      nextAnyTimeCal: false,
      anyDay: "",
      disableAnyday: false,
      anyTimeStart:'',
      anyTimeEnd:'',
      starts_on : moment(new Date()).toDate(),
      ends_on : moment(new Date()).seconds(59).minute(59).hours(23).toDate(),
      cheflistInc:1,
      isLocationSelected:false,
      isFilterApplied:false,
      isDateSelected:false,
      isTimeSelected:false,
      skip:0,
      limit:10
    });
    this.filtersCount=0;
    //this.props.bookingActions.clearChefList();
    this.setTimeout(()=>this.getData(true),1000);
  }

  /**
  * Call Rest API on location change.
  */

  onLocationChange(data){
    let selectedLocation = {...this.props.location.selectedLocation};
    let address = selectedLocation ? selectedLocation.formatted_address?selectedLocation.formatted_address
                        : selectedLocation.formattedAddress
                      : "";
    let position = this.props.location.selectedLocation.position?this.props.location.selectedLocation.position:this.props.location.selectedLocation.geometry.location;
    
    if(!this.state.isLocationSelected){
      this.filtersCount++;
    }

    this.setState({
      isRefreshing:true,
      isFilterApplied:true,
      isLocationSelected:true,
      skip:0,
      limit:10,
      role : 1,
      position:{
        lat : position.lat,
        long : position.lng,
        address : address
      },
      starts_on: moment(this.state.starts_on).toDate(),
      ends_on : moment(this.state.starts_on).seconds(59).minute(59).hours(23).toDate(),
    });
    this.setTimeout(()=>{
      this.props.locationActions.selectLocation(null);
      this.getData(false)
    },1000);
  }

  /**
  * Call Rest API on date change.
  */

  onDateChange(){
    if(!this.state.isDateSelected){
      this.filtersCount++;
    }
    let sele = moment(this.state.starts_on).seconds(0).minute(0).hours(0).toDate();    
    let currentDate = moment(new Date()).seconds(0).minute(0).hours(0).toDate();
    this.setState({
      isRefreshing:true,
      skip:0,
      limit:10,
      isDateSelected:true,
      isFilterApplied:true,
      starts_on: moment(this.state.starts_on).seconds(0).minute(1).hours(0).toDate(),
      ends_on:moment(this.state.starts_on).seconds(0).minute(58).hours(23).toDate(),
      isSameDate : moment(moment(sele)).diff(moment(moment(currentDate)), 'd')==0
    });

    this.setTimeout(()=>this.getData(false),1000);
  }

  /**
  * Call Rest API on Date and time selection.
  */
  onTimeChange(){
    let context = this;
    if(!context.state.isTimeSelected){
      context.filtersCount++;
    }
    if(context.state.isDateSelected){
      let startDate = moment(context.state.starts_on).format("DD MM YYYY");
      startDate = startDate+" "+moment(context.state.anyTimeStart).format("hh:mm a");
      let endTimeDate = moment(context.state.starts_on).hours(23).format("DD MM YYYY");
      endTimeDate = endTimeDate+" "+moment(context.state.nextAnyTimeDate).format("hh:mm a");
      
      context.setState({
        isRefreshing:true,
        skip:0,
        limit:10,
        isFilterApplied:true,
        isTimeSelected : true,
        starts_on : moment(startDate,"DD MM YYYY hh:mm a").toDate(),
        ends_on : moment(endTimeDate,"DD MM YYYY hh:mm a").toDate(),
      });
      let x = moment(startDate,"DD MM YYYY hh:mm a").toDate();
      let y = moment(endTimeDate,"DD MM YYYY hh:mm a").toDate();
    }else{
      context.setState({
        isRefreshing:true,
        skip:0,
        limit:10,
        isFilterApplied:true,
        isTimeSelected : true,
        starts_on : moment(context.state.anyTimeDate).toDate(),
        ends_on : moment(context.state.nextAnyTimeDate).toDate(),
      });
    }
    context.setTimeout(()=>context.getData(false),1000);
  }


  /**
  * Check Login Status and continue to Notifications Page.
  */

  checkUserStatus(){
    if(this.isLoggedIn){
      this.props.navigation.navigate("Notifications");
    }else{
      Alert.alert(
        "Sign in Required",
        "Please sign in to use this feature.",
        [
          {text: 'Cancel',  onPress: () => console.log('Cancel Pressed')},
          {text: 'Sign in', onPress: () =>{ this.props.navigation.navigate("LoginSignup", { 
            userType: "customer",
            initialIndex:1
          })}},
        ],
      { cancelable: false }
      )
    }
  }

  /**
  * Fetches unread notification count 
  */

  getNotificationsCount = () => {
    let context = this;
    if(context.props.user.userDetails){
      let requestObject = {
        token   : context.props.user.userDetails.auth.token,
        userId  : context.props.user.userDetails.userId,
      }
      context.props.notificationActions.getNotificationsList(requestObject);
      context.interval = context.setInterval(()=>{
        context.props.notificationActions.getNotificationsList(requestObject);
      },1000*1*10);
    }
  }

  /**
  * Default Render 
  */

  render() {
    let { dispatch } = this.props.navigation;
    let { fullAddress } = Constants.i18n.common;
    let { enterFullAddress } = Constants.i18n.signup;
    let {
      earliestBookingAtleastTwoHoursFromNow, endDateShouldBeAfterStartDate, hourlyDifferenceBetweenSelectedTimes, enterValidTime
    } = Constants.i18n.explore;

    let selectedLocation = {...this.props.location.selectedLocation};
    selectedLocation = selectedLocation ? selectedLocation.formatted_address? selectedLocation.formatted_address
                        : selectedLocation.formattedAddress
                      : "Anywhere";

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.filterContainer,
            {
              height: this.state.animatedValue,
              transform: [
                {
                  translateY: this._deltaY.interpolate({
                    inputRange: [-130, -50],
                    outputRange: [-33, 0],
                    extrapolateRight: "clamp"
                  })
                }
              ]
            }
          ]}
        >
          <Animated.View
            style={[
              styles.filterTop,
              {
                opacity: this._deltaY.interpolate({
                  inputRange: [-90, -20],
                  outputRange: [0, 1],
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp"
                })
              }
            ]}
          >
            {!this.state.flag
              ? <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 6 }}>
                    <TouchableOpacity hitSlop={{top:5,bottom:5,right:5,left:5}} onPress={this.animateDown}>
                      <Image
                        style={styles.filterUp}
                        source={Constants.Images.user.menu_arrow}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{justifyContent:"flex-end",
                    alignItems:"flex-end", flex: 2.5  , flexDirection:'row' ,marginTop: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5 }}>
                    {
                      this.state.isFilterApplied &&
                      <TouchableOpacity style={{alignItems:"flex-end"}} 
                      hitSlop={{top:5,bottom:5,right:5,left:5}} onPress={this.clearfilters}>
                        <Text style={{alignSelf:"flex-end",color: Constants.Colors.White,...Constants.Fonts.normal,}}>Clear Filter</Text>
                      </TouchableOpacity>
                    }
                  </View>

                  <View
                    style={{
                      flex: 0.5,
                      marginHorizontal:
                        Constants.BaseStyle.DEVICE_WIDTH / 100 * 4
                    }}
                  >
                    <TouchableOpacity
                      hitSlop={{top:5,bottom:5,right:5,left:5}}
                      onPress={()=>this.checkUserStatus()}
                      style={{ alignItems: "flex-end" }}
                    >
                      <Image
                        style={styles.noti_icon}
                        source={Constants.Images.user.noti_icon}
                      />
                      {
                        this.props.notifications.unreadCount > 0 &&
                        <View style={styles.notificationCountView}>
                          <Text style={styles.notifyTextStyle}>
                            {this.props.notifications.unreadCount > 9 ? "9+" : this.props.notifications.unreadCount}
                          </Text>
                        </View>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              : <View style={styles.filterManage} />}

            {this.state.flag &&
              <TouchableOpacity hitSlop={{top:5,bottom:5,right:5,left:5}} onPress={this.animateUp}>
                <View style={[styles.filterField]}>
                  <Image
                    style={styles.searchIcon}
                    source={Constants.Images.user.searchIcon}
                  />
                  <Text
                    style={[
                      styles.filterFieldText,
                      ...Constants.Fonts.tinyMedium
                    ]}
                  >
                    {this.state.isFilterApplied?
                      this.filtersCount===1?this.filtersCount+" Filter Applied":this.filtersCount+" Filters Applied"
                    :"Anywhere . Anyday . Anytime"}
                  </Text>
                </View>
              </TouchableOpacity>
            }
          </Animated.View>
          {!this.state.flag &&
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Location",{callBack:this.onLocationChange.bind(this)});
                }}
              >
                <View style={styles.filterField}>
                  <Image
                    style={styles.filterFiledImg}
                    source={Constants.Images.user.anywhere_filter}
                  />
                  <Text
                    numberOfLines={2}
                    style={[styles.filterFieldText, { marginRight: 50 }]}
                  >
                    {this.state.isLocationSelected?this.state.position.address:"Anywhere"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if(this.state.disableAnyday){
                    this.props.navigation.dispatch(ToastActionsCreators.displayInfo("You have already selected multiple date filter. Please clear all filters to use particular date filter."))
                  }else{
                    this.setState({ dayFilter: true });
                  }
                }}
              >
                <Animated.View
                  style={[
                    styles.filterField,
                    {
                      opacity: this._deltaY.interpolate({
                        inputRange: [-70, -50],
                        outputRange: [0, 1],
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp"
                      })
                    }
                  ]}
                >
                  <Image
                    style={styles.filterFiledImg}
                    source={Constants.Images.user.anyday_filter}
                  />
                  <Text style={styles.filterFieldText}>
                    {this.state.anyDay
                      ? moment(this.state.anyDay).format("DD-MM-YYYY")
                      : "Anyday"}
                  </Text>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ AnyTimeCal: true, anyTimeDate: new Date() });
                }}
              >
                <Animated.View
                  style={[
                    styles.filterField,
                    {
                      opacity: this._deltaY.interpolate({
                        inputRange: [-20, 0],
                        outputRange: [0, 1],
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp"
                      })
                    }
                  ]}
                >
                  <Image
                    style={styles.filterFiledImg}
                    source={Constants.Images.user.anytime_filter}
                  />
                  {this.state.disableAnyday &&
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.filterFieldText,
                        { width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 60 }
                      ]}
                    >
                      {
                        this.state.anyTimeStart && this.state.anyTimeEnd
                        ? moment(this.state.anyTimeStart).format(
                            "DD-MM-YYYY, h:mm: a"
                          ) +
                          " to " +
                          moment(this.state.anyTimeEnd).format(
                            "DD-MM-YYYY, h:mm: a"
                          )
                        : "Anytime"
                      }
                    </Text>}
                  {!this.state.disableAnyday &&
                    <Text style={styles.filterFieldText}>
                      {this.state.anyTimeStart && this.state.anyTimeEnd
                        ? moment(this.state.anyTimeStart).format("h:mm a") +
                          "-" +
                          moment(this.state.anyTimeEnd).format("h:mm a")
                        : "Anytime"}
                    </Text>}
                </Animated.View>
              </TouchableOpacity>
            </View>}
        </Animated.View>
        <ScrollableTabView
          tabBarUnderlineStyle={{ backgroundColor: Constants.Colors.White }}
          initialPage={0}
          tabBarActiveTextColor={Constants.Colors.White}
          tabBarBackgroundColor={Constants.Colors.HeaderGreen}
          tabBarInactiveTextColor={Constants.Colors.GhostWhite}
          renderTabBar={() => <DefaultTabBar isCustom={true} />}
        >
          <Chef  
            {...this.props}
            tabLabel="CHEF" 
            isLoggedIn = {this.isLoggedIn}
            data = {this.props.bookings.chefList.length!==0 ? this.props.bookings.chefList :  null}
            chefListRefresh={()=>this.chefListRefresh()}
            chefListonReachedEnd={()=>this.chefListonReachedEnd()}
            isRefreshing = {this.state.isRefreshing}
            isFooterVisible = {this.state.isFooterVisible}
            showChefCal={(data) => {
              this.setState({chefBookCal:true,chefDetails:data});
            }}
            onCancel={() => this.cancelChefCal()}
          />
          <Caterer  
            {...this.props}
            isLoggedIn = {this.isLoggedIn}
            tabLabel="CATERER" 
            showCatererCal={() => {this.setState({catererBookCal: true});}}
          />
        </ScrollableTabView>
        { /**
          * Chef Booking Picker for start date.
          */
          this.state.chefBookCal &&
          <DatePicker
            onDateChange={(date) => this.setState({ bookChefDate: date })}
            type={"booking"}
            onCancel={() => this.cancelChefCal()}
            label="Next"
            mode="datetime"
            from={true} 
            date={this.state.bookChefDate}
            fromTime={this.state.bookChefDate}
            minimumDate={currentTime(Constants.TimeConfig.start)}
            Press={() => {
              let date1 = this.state.bookChefDate;
              if (date1 < new Date()) {
                dispatch(ToastActionsCreators.displayInfo(enterValidTime));
                return;
              }
              this.setState({ 
                chefBookCal: false,
                nextChefBookCal: true,
                nextBookChefDate: new Date(moment(this.state.bookChefDate).add(1, 'hours')),
              });
            }}
          />
        }
        {/**
          * Chef Booking Picker for end date.
          */
          this.state.nextChefBookCal &&
          <DatePicker
            onDateChange={(date) => this.setState({ nextBookChefDate: date })}
            type={"booking"}
            onCancel={() => this.cancelChefCal()}
            label="Done"
            mode="datetime"
            from={true}
            date={this.state.nextBookChefDate}
            fromTime={new Date(this.state.bookChefDate)}
            minimumDate={new Date((new Date(this.state.bookChefDate).setHours(this.state.bookChefDate.getHours() + 1)))}
            to={true}
            Press={() => {
              var date1 = new Date(this.state.nextBookChefDate);
              var date2 = new Date(this.state.bookChefDate);
              
              if (!(date1 > date2)) {
                dispatch(ToastActionsCreators.displayInfo(endDateShouldBeAfterStartDate));
                return;
              }
              if (date2.getMinutes() != date1.getMinutes()) {
                dispatch(ToastActionsCreators.displayInfo(hourlyDifferenceBetweenSelectedTimes));
                return;
              }
              
              this.setState({nextChefBookCal: false});

              this.props.locationActions.selectLocation(null);
              
              this.props.navigation.navigate('Booking', {
                ...this.state.chefDetails,
                starts_on: date2,
                ends_on: date1,
                isExplore : true
              });
            }}
          />
        }
        {
          this.state.catererBookCal &&
          <DatePicker
            onDateChange={date => this.setState({ bookCatererDate: date })}
            type={"booking"}
            onCancel={() => {
              this.cancelCatererCal();
            }} 
            label="Next"
            mode="datetime"
            from={true}
            fromTime={this.state.bookCatererDate}
            Press={() => {
              var date1 = new Date(this.state.bookCatererDate);
              if (!(date1 > new Date())) {
                dispatch(ToastActionsCreators.displayInfo("Enter a valid time."));
                return;
              }
              this.setState({
                catererBookCal: false,
                nextCatererBookCal: true,
                nextBookCatererDate: date1
              });
            }}
          />
        }
        {
          this.state.nextCatererBookCal &&
          <DatePicker
            onDateChange={date => this.setState({ nextBookCatererDate: date })}
            type={"booking"}
            onCancel={() => {}}
            label="Finish"
            mode="datetime"
            from={true}
            fromTime={this.state.bookCatererDate}
            minimumDate={this.state.bookCatererDate}
            to={true}
            Press={() => {
              var date1 = new Date(this.state.nextBookCatererDate);
              var date2 = new Date(this.state.bookCatererDate);
              if (!(date1 > date2)) {
                dispatch(ToastActionsCreators.displayInfo("End date should be after start date."));
                return;
              }
              this.setState({ nextCatererBookCal: false });
            }}
          />
        }
        {
          this.state.dayFilter &&
          <DatePicker
            onDateChange={(date) => {
              this.setState({filterDate: date, starts_on:date});
            }}
            date={this.state.filterDate}
            type={"filter"}
            onCancel={() => {
              this.cancelFilterCal();
            }}
            label="Done"
            mode="date"
            minimumDate={new Date()}
            Press={() => {
              this.setState({ 
                dayFilter: false, 
                anyDay: this.state.filterDate? this.state.filterDate : new Date(),
              });
              this.setTimeout(()=>this.onDateChange(),250);
            }}
          />
        }
        {
          this.state.AnyTimeCal &&
          <DatePicker
            onDateChange={date => {
              this.setState({ anyTimeDate: date });
            }}
            type={"booking"}
            onCancel={() => {
              this.cancelAnyTimeCal();
            }}
            label="Next"
            mode={this.state.anyDay ? "time" : "datetime"}
            from={true}
            fromTime={this.state.anyTimeDate}
            minimumDate={!this.state.isSameDate && this.state.isDateSelected  ? this.state.starts_on : new Date()}
            date={this.state.anyDay}
            Press={() => {
              var date1 = new Date(this.state.anyTimeDate);
              if (!(date1 > new Date())) {
                dispatch(ToastActionsCreators.displayInfo("Enter a valid time."));
                return;
              }
              this.setState({
                AnyTimeCal: false,
                nextAnyTimeCal: true,
                nextAnyTimeDate: date1,
              });
            }}
          />
        }
        {
          this.state.nextAnyTimeCal &&
          <DatePicker
            onDateChange={date => {
              this.setState({ nextAnyTimeDate: date,});
            }}
            type={"booking"}
            onCancel={() => {}}
            label="Finish"
            mode={this.state.anyDay ? "time" : "datetime"}
            date={this.state.nextAnyTimeDate}
            from={true}
            fromTime={this.state.anyTimeDate}
            minimumDate={this.state.anyTimeDate}
            to={true}
            onCancel={() => {
              this.cancelAnyTimeCal();
            }}
            Press={() => {
              var date1 = new Date(this.state.nextAnyTimeDate);
              var date2 = new Date(this.state.anyTimeDate);
              if (!(date1 > date2)) {
                dispatch(ToastActionsCreators.displayInfo("End date should be after start date."));
                return;
              }
              if (!this.state.anyDay) {
                this.setState({ disableAnyday: true });
              }
              this.setState({
                nextAnyTimeCal: false,
                anyTimeStart: this.state.anyTimeDate,
                anyTimeEnd: this.state.nextAnyTimeDate,
              });
              this.setTimeout(()=>this.onTimeChange(),250);
            }}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "white"
  },
  filterContainer: {
    backgroundColor: Constants.Colors.HeaderGreen
  },
  filterTop: {
    marginTop: Platform.OS === "ios" ? 10 : 5,
    height: Platform.OS === "ios" ? Constants.BaseStyle.DEVICE_HEIGHT / 100 * 7 : Constants.BaseStyle.DEVICE_HEIGHT / 100 * 10
  },
  filterUp: {
    marginTop: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5,
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5,
    height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 2.5,
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5
  },
  filterManage: {
    marginTop: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5,
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5,
    height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 0,
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 5
  },
  filterField: {
    height: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 6,
    backgroundColor: Constants.Colors.HeaderLightGreen,
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH / 100 * 4,
    marginBottom: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 2,
    flexDirection: "row",
    alignItems: "center"
  },
  filterFieldText: {
    color: Constants.Colors.White,
    ...Constants.Fonts.normal,
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH / 100 * 2
  },
  filterFiledImg: {
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
    height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 8,
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 8
  },
  content: {
    backgroundColor: "white",
    height: Constants.BaseStyle.DEVICE_HEIGHT
  },
  icon: {
    width: 26,
    height: 26
  },
  noti_icon:{
    height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 6,
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 6,
    marginTop:15
  },
  searchIcon:{
    height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 6,
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 6,
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
  },
  notificationCountView: {
    position: 'absolute',
    backgroundColor: Constants.Colors.Magenta,
    borderRadius: Constants.BaseStyle.DEVICE_WIDTH*2.5/100,
    height: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    width: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    alignItems: 'center',
    justifyContent: 'center',
    right: -Constants.BaseStyle.DEVICE_WIDTH*1.5/100,
    bottom: Constants.BaseStyle.DEVICE_WIDTH*2.5/100,
  },
  notifyTextStyle: {
    ...Constants.Fonts.tiny,
    color: Constants.Colors.White,
    backgroundColor:Constants.Colors.Transparent
  }
});

ReactMixin(Explore.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user,
  location: state.location,
  bookings: state.bookings,
  notifications : state.notifications
});

const mapDispatchToProps = dispatch => ({
  locationActions     : bindActionCreators(locationActions, dispatch),
  userActions         : bindActionCreators(userActions, dispatch),
  bookingActions      : bindActionCreators(bookingActions, dispatch),
  notificationActions : bindActionCreators(notificationActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
