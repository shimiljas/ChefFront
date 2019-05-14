/*
 * @file: SocketClient.js
 * @description: ddp socket class 
 * @date: 04.08.2017
 * @author: Lancy Goyal
 * */

import Connection from '../config/Connection';
import { NetInfo, Alert, Platform } from 'react-native';
import Meteor from 'react-native-meteor';
import { mongoid } from 'mongoid-js';
import { ToastActionsCreators } from 'react-native-redux-toast';
import FCM from 'react-native-fcm';
import * as ConversationActions from "../redux/modules/conversations";
import * as listingActions from "../redux/modules/listing";
import * as availabilityActions from "../redux/modules/availability";
import _ from "lodash";

class SocketClient {

    constructor(endpoint, store) {
        this.endpoint = endpoint;
        this.store = store;
        this.connected = false;

        //Events fired from client side
        this.register               = this.register.bind(this);
        this.subscribe              = this.subscribe.bind(this);
        this.sendMessage            = this.sendMessage.bind(this);
        this.markMessageAsRead      = this.markMessageAsRead.bind(this);
        this.markRoomAsRead         = this.markRoomAsRead.bind(this);
        this.fetchServerTime        = this.fetchServerTime.bind(this);
        this.handleBookingChanges   = this.handleBookingChanges.bind(this);
        this.setupMeteor.bind(this)();
    }
 

    /**
    * Setup DDP Client.
    */

    setupMeteor() {

        //Meteor connect with endpoint client side
        Meteor.connect(this.endpoint); //do this only once
        this.meteor = Meteor;
        this.ddpClient = Meteor.ddp;

        Meteor.waitDdpConnected(() => {

            this.connected = true;
            this.subscribe();
            this.register();

        });

    }

    /**
    * Subscribe to collections
    */

    subscribe() {
        if(this.store.getState().user.userDetails){
            this.subscribeCustomer = this.meteor.subscribe('subscribeCustomer',this.store.getState().user.userDetails.auth.token,this.store.getState().user.userDetails.userId);
            this.subscribeProvider = this.meteor.subscribe('subscribeProvider',this.store.getState().user.userDetails.auth.token ,this.store.getState().user.userDetails.userId);
            this.subscribeChats = this.meteor.subscribe('subscribeChats',this.store.getState().user.userDetails.auth.token,this.store.getState().user.userDetails.userId);
            this.subscribeMessages = this.meteor.subscribe('subscribeMessages',this.store.getState().user.userDetails.auth.token ,this.store.getState().user.userDetails.userId);
        }
    }

    /**
    * Register DDP Events. 
    */

    register() {
        this.ddpClient.on("connected", () => {
            this.connected = true;
            //console.log("************ SocketClient connected");
        });

        this.ddpClient.on("disconnected", () => {
            this.connected = false;
            //console.log("************ SocketClient disconnected");
        });

        this.ddpClient.on('ready', (result) => {
            //console.log("************ ready", result);
        });

        this.ddpClient.on("added", (result) => {
            switch (result.collection) {
                case 'Chat':
                    //console.log("************ added chat room", result);
                    this.store.dispatch(ConversationActions.insertRoom(result.id, result.fields));
                break;
                case 'Message':
                    let senderId = this.store.getState().user.userDetails?this.store.getState().user.userDetails.userId:"";
                    if(currentPage=='Chat' && result.fields.created_by!=senderId && currentRoom == result.fields.roomId){
                        console.log("Updating Message Manish **** ");
                        this.markMessageAsRead(result.fields.messageId);
                    }
                    console.log("************ added Message", result);
                    this.store.dispatch(ConversationActions.insertMessage(result.id, result.fields.roomId, result.fields));
                break;
                case 'Customer':
                    let bookingDetails = {_id:result.id,...result.fields};
                    if(result.fields.status===1 || result.fields.status===2){
                        this.store.dispatch(listingActions.insertNewBooking([bookingDetails]));
                    }
                break;
                case 'Provider':
                    let providerBookingDetails = {_id:result.id,...result.fields};
                    if(result.fields.status===1 || result.fields.status===2){
                        this.store.dispatch(listingActions.insertNewBooking([providerBookingDetails]));
                    }
                break;
                default:
                    //console.log("************ added", result.collection);
                break;
            }
        });

        this.ddpClient.on("changed", (result) => {
            switch (result.collection) {
                case 'Chat':
                    //console.log("************ changed Chat Room", result);
                    this.store.dispatch(ConversationActions.updateRoom(result.id, result.fields));
                break;
                case 'Message':
                    //console.log("************ changed Message", result);
                    this.store.dispatch(ConversationActions.insertMessage(result.id, result.fields.roomId, result.fields));
                break;
                case 'Customer':
                    //console.log("************ changed Customer", result);
                    let changes = {_id:result.id,...result.fields};
                    if(changes.providerRating){
                        console.log("slsssgg")
                        this.store.dispatch(listingActions.addReview(changes));
                    }else if(changes.customerRating){
                        this.store.dispatch(listingActions.addReview(changes));
                    }else if(changes.customerDispute){
                        changes = {...changes,...{status:7}}
                        this.store.dispatch(listingActions.disputeRaised(changes));
                    }else if(changes.providerDispute){
                        changes = {...changes,...{status:7}}
                        this.store.dispatch(listingActions.disputeRaised(changes));
                    }else{
                        this.handleBookingChanges(changes);
                    }
                break;
                case 'Provider':
                    //console.log("************ changed Provider", result);
                    let chefChanges = {_id:result.id,...result.fields};
                     if(chefChanges.status && (chefChanges.status==4 || chefChanges.status==9)){
                        FCM.cancelLocalNotification(chefChanges._id)
                    }
                    if(chefChanges.status===4){
                        // Remove local registered notification.
                        FCM.cancelLocalNotification(result._id);
                    }
                    if(chefChanges.providerRating){
                        this.store.dispatch(listingActions.addReview(chefChanges));
                    }else if(chefChanges.customerRating){
                        this.store.dispatch(listingActions.addReview(chefChanges));
                    }else if(chefChanges.customerDispute){
                        chefChanges = {...chefChanges,...{status:7}}
                        this.store.dispatch(listingActions.disputeRaised(chefChanges));
                    }else if(chefChanges.providerDispute){
                        chefChanges = {...chefChanges,...{status:7}}
                        this.store.dispatch(listingActions.disputeRaised(chefChanges));
                    }else{
                        this.handleBookingChanges(chefChanges);
                    }
                break;
                default:
                    //console.log("************ changed", result);
                break;
            }
        });

        this.ddpClient.on("removed", (result) => {
            switch (result.collection) {
                case 'Customer':
                    //console.log("************ changed Customer", result);
                break;
                case 'Provider':
                   //console.log("************ changed Provider", result);
                break;
                default: 
                   //console.log("************ removed", result);
                break;
            }
        });

    }


    /**
    * Update store on changes in booking collection.
    */

    handleBookingChanges(result){
        let context = this;
        console.log("handleChanges => ", result);
        switch(result.status){
            case 2 :
                // Chef accepted booking request.
                context.store.dispatch(listingActions.updateExitingBooking(result));
            break;
            case 3 :
                // FCM (result._id) add local
           
                if(context.store.getState().listing.active.length>0){
                    let activeListing = context.store.getState().listing.active;
                    let index = _.findIndex(activeListing, {_id: result._id});
                    if(index>-1){
                        let dates= [{
                            starts_on   :activeListing[index].starts_on,
                            ends_on     :activeListing[index].ends_on,
                            id : activeListing[index]._id,
                        }];
                        context.store.dispatch(availabilityActions.addBooking(dates));
                    }
                }
                // Chef hired by consumer.
                context.store.dispatch(listingActions.insertUpcoming(result));
            break;
            case 4 :
                // Chef request for cancellation. 
                // FCM (result._id) remove local
                context.store.dispatch(listingActions.requestCancel(result));
            break;
            case 5 :
                // Booking request declined. // By chef or consumer
                context.store.dispatch(listingActions.removeBooking(result)); 
            break;
            case 6 :
                // Job(Booking) Done. // Payment transfered to chef.
                context.store.dispatch(listingActions.paymentReleased(result));
            break;
            case 7 :
                // Dispute raised.
                context.store.dispatch(listingActions.disputeRaised(result));
            break;
            case 8 :
                // Refunded for each (Dispute close by chef , cancellation request accepted by consumer)
                context.store.dispatch(listingActions.refundBookingFee(result));
            break;
            case 9 :
                // FCM (result._id) remove local
                // Cancelled(cancellation request accepted by customer , cancellation after time over , cancelled by consumer)
                context.store.dispatch(listingActions.bookingCancelled(result));
            break;
            case 10 :
                // Dispute Resolved // by admin
                context.store.dispatch(listingActions.disputeResolved(result));
            break;
            case 11 :
                // Booking Auto Completed.
                context.store.dispatch(listingActions.bookingComplete(result));
            break;
            default:
                console.log("handleChanges => ", result);
            break;
        }
    }

    /**
    * Method to fetch server time
    */
    fetchServerTime(){
        let context = this;
        return new Promise(function(fulfill, reject) {
            context.meteor.call('serverTime',function(error,result){
                console.log('ServerTime=>'," error=> " , error ," result=> ", result);
                if(!error){
                    context.store.dispatch(listingActions.getServerTime(result));
                    fulfill();
                }
            });
        });
    }

    /**
    * Send messages through socket.
    */

    sendMessage(receiverId, text, roomId ,callabck) {
        let context = this;
        let token       = context.store.getState().user.userDetails.auth.token,
            senderId    = context.store.getState().user.userDetails.userId,
            messageId   = mongoid();
        context.meteor.call('sendMessage', token, messageId , senderId, receiverId, text, function(error, result) {
            console.log('sendMessage'," error=> " , error ," result=> ",result);
            if(result){
                result.messageId = result._id; 
                if(roomId){
                    context.store.dispatch(ConversationActions.insertMessage(result._id, result.roomId, result));
                }else{
                    callabck(result.roomId);
                    setTimeout(()=>{
                        context.store.dispatch(ConversationActions.insertMessage(result._id, result.roomId, result));
                    },250);
                }
            }else{
                if(error.reason && error.reason==='Your account has been suspended'){
                    context.store.dispatch(ToastActionsCreators.displayInfo(error.reason))
                }
            }
        });

    }

    /**
    * Mark message as read.
    */
    markMessageAsRead(messageId){
        console.log("markMessageAsRead **** => ", messageId);
        let context = this;
        let token       = context.store.getState().user.userDetails.auth.token,
            userId    = context.store.getState().user.userDetails.userId;
        context.meteor.call('markMessageRead', token, userId, messageId);
    } 

    /**
    * Mark room as read.
    */
    markRoomAsRead(roomId){
        let context = this;
        let token   = context.store.getState().user.userDetails.auth.token,
            userId  = context.store.getState().user.userDetails.userId;
        context.meteor.call('markRoomRead', token, userId, roomId);
    }


    /**
    * Handle Actions
    */

    handleActions(action) {
        switch (action.type) {
            case "SEND_MESSAGE":
                {
                    this.sendMessage(action.receiverId, action.text);
                    break;
                }
        }
    }

}

let socketClient = null;

/**
* Configure socket.
*/
export default function configureClient(store) {
    if (!socketClient){
        socketClient = new SocketClient(Connection.getSocketResturl(), store);
    }
    return socketClient;

};

/**
* Get socket client object.
*/

export const getSocketClient = () => socketClient;

/**
* Get Socket action handler.
*/

export const getActionHandler = () => socketClient.handleActions.bind(socketClient);

/**
* Destroy socket client.
*/
export const destroySocketClient = () => {
    if(socketClient){
        socketClient.subscribeMessages.stop();
        socketClient.subscribeChats.stop();
        socketClient.subscribeProvider.stop();
        socketClient.subscribeCustomer.stop();
        Meteor.disconnect();
        socketClient = null;
    }
};
