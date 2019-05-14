/*
 * @file: SyncServerTime.js
 * @description: Time synchronization between client and server. 
 * @date: 22.Aug.2017
 * @author: Manish Budhiraja
 * */

 
import moment from 'moment';

/* *
 * Sync server time 
 * @param created_at (date) when job is created
 * @param server_time (date) received from server
 * @return real server time after adding time difference between created_at and current time 
 * */
export default syncServerTime = (created_at , serverTime) => {
	let currentTime = Date.now();
	
	let serverTimestamp = Date.parse(new Date(serverTime).toISOString());
    
    let serverClientRequestDiffTime = serverTimestamp - currentTime;
    
    let nowTimeStamp  = Date.parse(new Date().toISOString());
    
    let serverClientResponseDiffTime = nowTimeStamp - serverTimestamp;
    
    let responseTime = (serverClientRequestDiffTime - nowTimeStamp + currentTime - serverClientResponseDiffTime )/2;
    
    let serverTimeOffset = (serverClientResponseDiffTime - responseTime);
    
    let date = new Date();
    
    date.setTime(date.getTime() + serverTimeOffset);

    //console.log("serverTimeOffset=> ",serverTimeOffset , "date => ", date , "created_at=> ", new Date(created_at), "serverTime", new Date(serverTime))

    return Date.parse(date);
};