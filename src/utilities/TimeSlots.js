/*
 * @file: TimeSlots.js
 * @description: Handle Time Slots.
 * @date: 23.Aug.2017
 * @author: Manish Budhiraja
 * */

 
import moment from 'moment';

export function currentTime(slot){
  let currentDate = new Date();

  switch(slot) {
    case 0:
      currentDate = new Date(new Date(new Date().setHours(new Date().getHours() + 0)).setMinutes(Math.ceil(new Date().getMinutes()/15)*15));
      break;
    case 1:
      currentDate = new Date(new Date(new Date().setHours(new Date().getHours() + 1)).setMinutes(Math.ceil(new Date().getMinutes()/15)*15));
      break;
    case 2:
      currentDate = new Date(new Date(new Date().setHours(new Date().getHours() + 2)).setMinutes(Math.ceil(new Date().getMinutes()/15)*15));
      break;
    case 3:
      currentDate = new Date(new Date(new Date().setHours(new Date().getHours() + 3)).setMinutes(Math.ceil(new Date().getMinutes()/15)*15));
      break;
    case 4:
      /**
      * Returns minimum time.
      */
      currentDate = new Date(new Date(new Date().setHours(new Date().getHours() + 0)).setMinutes(Math.ceil(new Date().getMinutes()/15)*15));
      break;
    default:
      currentDate = new Date(new Date(new Date().setHours(new Date().getHours() + 2)).setMinutes(Math.ceil(new Date().getMinutes()/15)*15))
      break;
  }

  return currentDate;
}

export function nextTime(params){

}