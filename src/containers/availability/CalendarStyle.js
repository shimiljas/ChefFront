/* *
 * @file: CalendarStyle.js
 * @description: Calendar Style
 * @date: 09.08.2017
 * @author: Manish Budhiraja
 * */

import Constants from '../../constants';

module.exports = {
  calendarContainer:{
    backgroundColor:Constants.Colors.Transparent,
  },
  weekendDayText: {
    color: Constants.Colors.Black,
    ...Constants.Fonts.normal
  }, 
  weekendHeading:{
    color:Constants.Colors.Black,
    ...Constants.Fonts.normal
  },
  title:{
    color:Constants.Colors.Green,
    ...Constants.Fonts.normal
  },
  dayHeading:{
    color:Constants.Colors.Green,
    ...Constants.Fonts.normal
  },
  weekendHeading:{
    color:Constants.Colors.Green,
    ...Constants.Fonts.normal
  },
  calendarHeading:{
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  controlButtonText:{ 
    color:Constants.Colors.Green,
    ...Constants.Fonts.title
  },
  dayCircleFiller: {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:Constants.Colors.Transparent,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  currentDayCircle: {
    backgroundColor: Constants.Colors.Magenta,
  },
  currentDayText: {
    color: Constants.Colors.Magenta,
    ...Constants.Fonts.bold
  },
  eventIndicator: {
    backgroundColor: Constants.Colors.HeaderGreen,
    width: 5,
    height: 5,
    borderRadius:2.5,
  },
  eventIndicatorToday:{
    backgroundColor: Constants.Colors.White,
    width: 5,
    height: 5,
    borderRadius:2.5,
  },
  bookingFullDates:{
    backgroundColor:  Constants.Colors.Magenta,
    width: 5,
    height: 5,
    borderRadius:2.5,
  },
  day:{
    color: Constants.Colors.Black,
    ...Constants.Fonts.normal
  },
  dayButtonFiller:{
    backgroundColor: Constants.Colors.White,
    justifyContent: 'center',
    alignItems:'center',
  },
  dayButton:{
    backgroundColor: Constants.Colors.White,
    justifyContent: 'center',
    alignItems:'center',
  },
  monthContainer:{
    backgroundColor: Constants.Colors.White,
  }
};
