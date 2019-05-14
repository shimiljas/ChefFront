/* *
 * @file: index.js
 * @description: Chef/Caterer Appointments Management
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
  Text,
} from 'react-native'
import Constants from '../../constants';
import AppointmentsList from './AppointmentsList';
import NavigationBar  from "react-native-navbar";
import BackButton from "../../components/common/BackButton";
import Switch from "../../components/common/SwitchSettings";
import Calendar from 'react-native-calendar';
import _ from 'lodash';
import moment from "moment";
import CalendarStyle from './CalendarStyle'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as availabilityActions from '../../redux/modules/availability';

class Availability extends Component {
  /* *
   * @constructor: Default constructor
   * */
  constructor(props) {
    super(props);
    this.state = {
      availability    : false,
      dateIndex       : 0 , 
      isPastDate      : false,
      starts_on       : moment(new Date()).seconds(0).minute(0).hours(0).toISOString(),
      ends_on         : moment(new Date()).seconds(59).minute(59).hours(23).toISOString(),
      local           : moment(new Date()).seconds(0).minute(0).hours(1).toISOString(),
      monthsTraversed : [moment().format('MM-YYYY')],
    }
    this.currentDate = new Date();
    this.setAvailability = this.setAvailability.bind(this);
  }

  /* *
   * @componentWillMount: Set availability of current date
   * */
  componentWillMount() {
    let context = this;
    let leaves = [...this.props.availability.leaves];
   
    let index = _.findIndex(leaves, function(o) {
      let date1 = moment(o.starts_on).format("X");
      let date2 = moment(context.state.starts_on).format("X");
     
      return date1 == date2;
    });

    this.setState({ availability: index < 0 ? true : false });
  }

  /**
  * Get Data Based on Selected Date.
  */
  requestOnDate(date) {
    let context = this;
    let starts_on = moment(date).seconds(0).minute(0).hours(0).toISOString(), 
      ends_on = moment(date).seconds(59).minute(59).hours(23).toISOString(),
      currentDate = moment(new Date()).seconds(0).minute(0).hours(0).toISOString();

    if(moment(starts_on).format("X")<moment(currentDate).format("X")) {
      context.setState({
        isPastDate  : true,
        starts_on   : starts_on,
        ends_on     : ends_on
      });
    } else {
      let leaves = [...this.props.availability.leaves];
      let index = _.findIndex(leaves, function(o) {
        let date2 = moment(starts_on).add(1,'h');
        let date1 = moment(o.starts_on).format("X");
        date2 = moment(date2).format("X");
        return date1 == date2;
      });
      let local = moment(starts_on).add(1,'h');
      context.setState({
        isPastDate    : false,
        starts_on     : starts_on,
        ends_on       : ends_on,
        availability  : index < 0 ? true : false,
        local         : local
      });
    }
  }

  /**
  * Set Availability
  */
  setAvailability() {
    let context = this;
    let requestObject = {
      availabilityStatus: context.state.availability ? 0 : 1,
      starts_on : context.state.starts_on,
      ends_on : context.state.ends_on,
      token: context.props.user.userDetails.auth.token,
      userId: context.props.user.userDetails.userId,
      local : context.state.local
    }

    context.props.availabilityActions.setAvailablity(requestObject, (success)=>{
      if(success) {
        context.setState({
          availability : !context.state.availability 
        })
      }
    });

  }

  /**
  * Get Next/Prev Month Data on Calendar Change.
  */
  calendarData(data, place, setDate) {
    let context = this;
    if(setDate) {
      context.currentDate = data._d;
    }
    let gotDate = moment(data._d).format('MM-YYYY'),
      currentDate = moment().format('MM-YYYY');
    let monthsTraversed = context.state.monthsTraversed;
    monthsTraversed = [...monthsTraversed,...[gotDate]];
    context.setState({monthsTraversed,numberOfBookings:0});
    if(monthsTraversed.findIndex(each => each == gotDate) != -1){
      // api call
    }
  }

  /**
  * renders availability and appointments according to selected date
  */
  renderAvailability() {
    return (
      <View style={styles.switchView}>
        <Text style={styles.titleTextStyle}>Availability</Text>
        <Switch 
          isSwitchOn={this.state.availability}
          onClick={this.setAvailability}
        />
      </View>
    );
  }

  /* *
   * @function: Default render function
   * */

  render() {
    let { navigate, goBack } = this.props.navigation;
    const titleConfig = {
      title: "Availability",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    let { months, days} = Constants.i18n.calendar;

    let bookings = _.map([...this.props.availability.upcoming,...this.props.availability.past],(element, i)=>{
      return moment(element.starts_on).format("YYYY-MM-DD");
    });

    let leaves = _.map([...this.props.availability.leaves],(element, i)=>{
      return moment(element.starts_on).format("YYYY-MM-DD");
    });
    
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<BackButton onPress={()=>goBack()} />}
          title={titleConfig} 
        />
      	<View style={styles.calendar}>
          <Calendar
            ref="calendar"
            showEventIndicators
            customStyle={CalendarStyle}
            eventDates={bookings}
            bookingFullDates={leaves}
            scrollEnabled
            showControls
            dayHeadings={days}
            monthNames={months}
            titleFormat={'MMMMYY'}
            prevButtonText={'<'}
            nextButtonText={'>'}
            onDateSelect={(date) => this.requestOnDate(date)}
            onTouchPrev={(e) => this.calendarData(e,'prev',1)}
            onTouchNext={(e) => this.calendarData(e,'next',1)}
          />
        </View>
        { !this.state.isPastDate && this.renderAvailability()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.White,
  },
  calendar:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*45,
    backgroundColor:Constants.Colors.White
  },
  switchView:{
    paddingHorizontal:(Constants.BaseStyle.DEVICE_HEIGHT/100)*2.5,
    marginVertical:(Constants.BaseStyle.DEVICE_HEIGHT/100)*10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  titleTextStyle:{
    color:Constants.Colors.Black,
    ...Constants.Fonts.normal
  },
});

const mapStateToProps = state => ({
  user : state.user,
  availability : state.availability
});

const mapDispatchToProps = dispatch => ({
  availabilityActions : bindActionCreators(availabilityActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Availability);