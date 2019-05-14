/*
 * @file: ChefProfileOverview.js
 * @description: Overview details of chef/caterer.
 * @date: 17.07.2017
 * @author: Vishal Kumar
 * */

'use-strict';
import React, { Component } from 'react';
import { ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import Constants from "../../../constants";
import Avatar from "../../../components/common/Avatar";
import StarRating from '../../../components/common/StarRating';
import RoundButton from "../../../components/common/RoundButton";
import Reviews from "../../../components/bookings/Reviews";
import NavigationBar  from "react-native-navbar"
import TextField from '../../../components/common/TextField';
import BackButton  from "../../../components/common/BackButton";
import DatePicker from "../../../components/common/Datepicker";
import { currentTime , nextTime} from '../../../utilities/TimeSlots';
import _ from "lodash";
import moment from "moment";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastActionsCreators } from 'react-native-redux-toast';
import * as userActions from '../../../redux/modules/user';
import * as bookingActions from '../../../redux/modules/bookings';
import * as locationActions from '../../../redux/modules/bookings';

class ViewBooking extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fromDate: currentTime(Constants.TimeConfig.start),
      fromDateCopy: currentTime(Constants.TimeConfig.start),
      toDate: currentTime(Constants.TimeConfig.end),
      toDateCopy: currentTime(Constants.TimeConfig.end),
      showTimePicker1: false,
      showTimePicker2: false,
    }

    //console.log("review ",this.props.navigation.state.params.userDetails.review)
  }

  // Renders diets
  renderServices(item, i) {
    return(
      <View
        key={i}
        style={{
        paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
        marginTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
        marginRight: Constants.BaseStyle.DEVICE_WIDTH*2/100,
        borderRadius: Constants.BaseStyle.DEVICE_WIDTH*5/100,
        borderColor: Constants.Colors.Gray,
        borderWidth: 1,
        height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        <Text style={{...Constants.Fonts.tinyMedium,color:Constants.Colors.Gray,}}>
          {item.capitalizeFirstLetter()}
        </Text>
      </View>
    )
  }

  // Renders individual service categories
  renderServiceCategory(category, data){
    let context = this;
    let serviceData = category==="Specialized"? context.props.navigation.state.params.userDetails.typesOfSpecializedCooking :context.props.navigation.state.params.userDetails.mealsSupported[data];
    return(
      <View style={{marginTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100,}} >
        <View style={{flexDirection:"row",alignItems:"center"}}>
          <Icons 
            name={"circle"}
            color={Constants.Colors.HeaderGreen}
          />
          <Text style={styles.category}>
            {category}
          </Text>
        </View>
        <View style={{flexDirection: 'row',flexWrap: 'wrap',}}>
          {
            _.map(serviceData,function(data, i){
              return context.renderServices(data, i)
            })
          }
        </View>
      </View>
    )
  }

  // Renders reviews
  renderReviews({item,index}) {
    return (
      <Reviews
        data = {item}
      />
    );
  }

  // Hides the datepicker and resets 'to' and 'from' times
  onCancel() {
    this.setState({
      showTimePicker1: false,
      showTimePicker2: false,
      fromDate: currentTime(Constants.TimeConfig.start),
      fromDateCopy: currentTime(Constants.TimeConfig.start),
      toDate: currentTime(Constants.TimeConfig.end),
      toDateCopy: currentTime(Constants.TimeConfig.end),
    });
  }

  // Submits the data
  onSubmit() {
    let { navigate, dispatch } = this.props.navigation;

    let {
      earliestBookingAtleastTwoHoursFromNow, endDateShouldBeAfterStartDate, hourlyDifferenceBetweenSelectedTimes
    } = Constants.i18n.explore;
    
    /*let timeTwoHoursFromNow = new Date().setHours(new Date().getHours() + 2);
    if(new Date(this.state.fromDate) < new Date(timeTwoHoursFromNow)) {
      dispatch(ToastActionsCreators.displayInfo(earliestBookingAtleastTwoHoursFromNow));
      return;
    }*/

    if(new Date(this.state.fromDate) >= new Date(this.state.toDate)) {
      dispatch(ToastActionsCreators.displayInfo(endDateShouldBeAfterStartDate));
      return;
    }

    if(this.state.fromDate.getMinutes() != this.state.toDate.getMinutes()) {
      this.setState({
        showTimePicker2: true,
      });
      dispatch(ToastActionsCreators.displayInfo(hourlyDifferenceBetweenSelectedTimes));
      return;
    }

    // this.props.locationActions.selectLocation(null);

    navigate('Booking', {
      starts_on: this.state.fromDate,
      ends_on: this.state.toDate,
      ...this.props.navigation.state.params.userDetails,
      isExplore : false
    });

  }

  /**
  * Assign id to list items.
  */

  _keyExtractor = (item, index) => index;

  // Default render function
  render() {
    let { goBack, navigate, dispatch } = this.props.navigation;

    let {
      mobile,
      fullAddress,
      favouriteFoods,
      addDetails,
    } = Constants.i18n.common;

    let {
      description,
      price,
      service,
      reviews,
      viewFullProfile
    } = Constants.i18n.bookings;

    let {
      earliestBookingAtleastTwoHoursFromNow, endDateShouldBeAfterStartDate, hourlyDifferenceBetweenSelectedTimes, enterValidTime
    } = Constants.i18n.explore;

    const titleConfig = {
      title: "Profile",
      tintColor: "#fff",
      style: {
        ...Constants.Fonts.content
      }
    };

    return (
      <View style={styles.mainView}>
        <NavigationBar
          title={titleConfig}
          leftButton={<BackButton onPress={()=>goBack()} />}
        />
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  style={styles.container}>
            <View style={styles.details}>
              <View style={styles.profile}>
                <View style={{
                  width: Constants.BaseStyle.DEVICE_WIDTH/100*27,
                }}>
                  <Avatar
                    user={this.props.navigation.state.params.userDetails}
                    placeholderStyle = {styles.placeholderStyle}
                    avatarStyle = {styles.avatarStyle}
                  />
                </View>
                <View style={{
                  width: Constants.BaseStyle.DEVICE_WIDTH/100*27,
                }}>
                  <TouchableOpacity 
                    onPress={()=>this.props.navigation.navigate('ChefReviewProfile', {
                      userDetails: this.props.navigation.state.params.userDetails,
                      status: 1
                    })}
                    style={{
                      width: Constants.BaseStyle.DEVICE_WIDTH/100*24,
                      alignItems: 'center',
                    }}>
                    <Text 
                      style={{
                        ...Constants.Fonts.tinyMedium,
                        paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                        color: Constants.Colors.Green,
                        backgroundColor:Constants.Colors.Transparent
                      }}
    
                    >
                      {viewFullProfile}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{flex: 2.5}}>
                <Text style={styles.name}>
                  {this.props.navigation.state.params.userDetails.fullName.capitalizeEachLetter()}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <StarRating
                    editable={false}
                    rating={this.props.navigation.state.params.userDetails.rating.avgRating}
                    style={{alignSelf: 'flex-start',marginLeft:-2}}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.address}>
                    {this.props.navigation.state.params.userDetails.position.address.capitalizeFirstLetter()}
                  </Text>
                  <Text style={{
                    ...Constants.Fonts.tiny,
                    alignSelf: 'flex-end'
                  }}>
                    {this.props.navigation.state.params.userDetails.distanceCalculated.toFixed(2) + " km"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100}}>
              {
                this.props.navigation.state.params.userDetails.describeYourself.length > 0 &&
                <TextField
                  headerText={description}
                  dataText={this.props.navigation.state.params.userDetails.describeYourself}
                  headerStyle={{
                    ...Constants.Fonts.bold,
                  }}
                  dataStyle={{
                    ...Constants.Fonts.tinyBold,
                    color:Constants.Colors.Gray,
                  }}
                />
              }

              <View style={{
                paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                justifyContent: 'center',
                borderBottomColor: Constants.Colors.GhostWhite,
                borderBottomWidth: 1,
              }}>
                <Text style={{
                  ...Constants.Fonts.bold,
                  color: Constants.Colors.Black,
                }}>
                  {service}
                </Text>

                {
                  this.props.navigation.state.params.userDetails.mealsSupported.breakfastArray.length>0 &&
                  this.renderServiceCategory("Breakfast", "breakfastArray")
                }
                {
                  this.props.navigation.state.params.userDetails.mealsSupported.lunchArray.length>0 &&
                  this.renderServiceCategory("Lunch", "lunchArray")
                }
                { this.props.navigation.state.params.userDetails.mealsSupported.eveningSnacksArray.length>0 &&
                  this.renderServiceCategory("Evening Snacks", "eveningSnacksArray")
                }
                {
                  this.props.navigation.state.params.userDetails.mealsSupported.dinnerArray.length>0 &&
                  this.renderServiceCategory("Dinner", "dinnerArray")
                }
                {
                  this.props.navigation.state.params.userDetails.typesOfSpecializedCooking.length>0 &&
                  this.renderServiceCategory("Specialized")
                }

              </View>

              <View style={{
                paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                justifyContent: 'center',
                borderBottomColor: Constants.Colors.GhostWhite,
                borderBottomWidth: 1,
              }}>
                <Text style={{
                  ...Constants.Fonts.bold,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                  color:Constants.Colors.Black,
                }}>
                  {price}
                </Text>
                <Text style={{
                  ...Constants.Fonts.normal,
                  color:Constants.Colors.Gray,
                }}>
                  ${this.props.navigation.state.params.userDetails.ratePerHour}<Text style={{...Constants.Fonts.tiny}}>/hr</Text>
                </Text>
              </View>

              {
                (this.props.navigation.state.params.userDetails.review &&
                this.props.navigation.state.params.userDetails.review.length > 0) &&
                <View style={{
                  paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                }}>
                  <Text style={{
                    ...Constants.Fonts.bold,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    color: Constants.Colors.Black,
                  }}>
                    {reviews}
                  </Text>

                  <FlatList
                    data={this.props.navigation.state.params.userDetails.review}
                    renderItem={({item,index})=>this.renderReviews({item,index})}
                    keyExtractor={this._keyExtractor}
                  />

                </View>
              }

            </View>
          </ScrollView>

          <RoundButton
            text={"BOOK NOW"}
            buttonStyle={styles.bookNowButtonStyle}
            _Press={() => {
              this.onCancel();
              this.setState({showTimePicker1: true});
            }}
          />

          {
            this.state.showTimePicker1 &&
            <DatePicker
              onDateChange={(date) => this.setState({ fromDate: date })}
              type={"booking"}
              onCancel={() => this.onCancel()}
              label="Next"
              mode="datetime"
              from={true}
              date={this.state.fromDate}
              fromTime={this.state.fromDate}
              minimumDate={currentTime(Constants.TimeConfig.start)}
              Press={() => {
                var date1 = new Date(this.state.fromDate);
                if (date1 < new Date()) {
                  dispatch(ToastActionsCreators.displayInfo(enterValidTime));
                  return;
                }

                this.setState({
                  showTimePicker1: false,
                  showTimePicker2: true,
                  toDate: new Date(new Date(this.state.fromDate).setHours(this.state.fromDate.getHours() + 1)),
                });
                
              }}
            />
          }

          {
            this.state.showTimePicker2 &&
            <DatePicker
              onDateChange={(date) => this.setState({ toDate: date })}
              type={"booking"}
              onCancel={() => this.onCancel()}
              label="Done"
              mode="datetime"
              from={true}
              date={this.state.toDate}
              fromTime={new Date(this.state.fromDate)}
              dateTime={new Date(new Date(this.state.fromDate).setHours(this.state.fromDate.getHours() + 1))}
              minimumDate={new Date((new Date(this.state.fromDate).setHours(this.state.fromDate.getHours() + 1)))}
              to={true}
              Press={() => {
                if (!(new Date(this.state.toDate) > new Date(this.state.fromDate))) {
                  dispatch(ToastActionsCreators.displayInfo(endDateShouldBeAfterStartDate));
                  return;
                }
                this.setState({ 
                  showTimePicker2: false,
                });

                this.onSubmit();
              }}
            />
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Constants.Colors.White,
  },
  container: {
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*4.5/100,
  },
  details: {
    flexDirection: 'row',
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1
  },
  profile: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: Constants.BaseStyle.DEVICE_WIDTH*5/100,
  },
  photo: {
    alignSelf: 'flex-start',
    width: Constants.BaseStyle.DEVICE_HEIGHT*12/100,
    height: Constants.BaseStyle.DEVICE_HEIGHT*12/100,
  },
  rating: {
    borderWidth: 3
  },
  name: {
    ...Constants.Fonts.contentBold,
    color: Constants.Colors.Black,
  },
  address: {
    flex: 3,
    ...Constants.Fonts.tinyLarge,
    color:Constants.Colors.Gray,
  },
  placeholderStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*22,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*22,
    borderRadius: null,
  },
  avatarStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*24,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*24,
    borderRadius: null,
  },

  bookNowButtonStyle:{
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    bottom: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    alignSelf: "center",
    borderRadius: null,
  },
  category:{
    ...Constants.Fonts.tinyMedium,
    color:Constants.Colors.Gray,
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*1,
  }
});

ViewBooking.defaultProps = {
  img: '',
  name: '',
  description: '',
  address: '',
  distance: '',
  services: [],
  rating: 0,
  ratingCounts: 0,
  price: 0,
  reviews: [],
};

ReactMixin(ViewBooking.prototype, TimerMixin);

const mapStateToProps = state => ({
  user : state.user
})

const mapDispatchToProps = dispatch =>({
  locationActions : bindActionCreators(locationActions,dispatch),
});

export default connect(mapStateToProps, null)(ViewBooking);