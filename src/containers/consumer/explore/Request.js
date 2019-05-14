/*
 * @file: Request.js
 * @description: List of requests recevied by chef/caterer.
 * @date: 17.07.2017
 * @author: Vishal Kumar
 * */

'use-strict';
import React, { Component } from 'react';
import { 
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert  
} from 'react-native';
import syncServerTime from "../../../utilities/SyncServerTime";
import Constants from "../../../constants";
import Avatar from "../../../components/common/Avatar";
import StarRating from '../../../components/common/StarRating';
import RoundButton from "../../../components/common/RoundButton";
import NavigationBar  from "react-native-navbar"
import BackButton  from "../../../components/common/BackButton";
import Timer  from "../../../components/common/Timer";
import * as bookingsActions from "../../../redux/modules/bookings";
import * as conversationsActions from  "../../../redux/modules/conversations";
import _ from "lodash"; 
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastActionsCreators } from 'react-native-redux-toast';
import moment from 'moment';
import { telephone } from "../../../utilities/Linking";
import { getSocketClient } from "../../../utilities/SocketClient";
import Regex from "../../../utilities/Regex";

class Request extends Component {

  constructor(props) {
    super(props);
    this.state = {
      otherDetailsToggle : false,
      additionalCostToggle : false,
      diffSecs : -1
    };
    this.getServerTime();
  }

  /**
  * Fetch server time and calculate  difference in seconds. 
  */
  getServerTime=()=>{
    let context = this;
    getSocketClient().fetchServerTime().then(()=>{
      var a = moment(context.props.listing.serverTime);
      var b = moment(context.props.navigation.state.params.updated_at);
      context.secondsDiff =    a.diff(b, 'seconds');
      // console.log("difference calculate ", context.secondsDiff );
      if(context.secondsDiff<Constants.TimeConfig.Duration){
        context.diffSecs = Constants.TimeConfig.Duration-parseInt(context.secondsDiff);
        // console.log("secondsDiff=> " , (Constants.TimeConfig.Duration-parseInt(context.secondsDiff)) )
      }
      context.setState({
        diffSecs:context.diffSecs
      });
    });
  }

  /*
  * Called when response is over.
  */
  timeUp=()=>{
    this.props.navigation.dispatch(ToastActionsCreators.displayInfo("Response time is over. Booking request auto declined."));
    this.props.navigation.goBack();
  }

  // render food preferences
  renderPreferences(item,i) {
    return (
      <View key={i} style={{
        paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
        marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
        marginRight: Constants.BaseStyle.DEVICE_WIDTH*2/100,
        borderRadius: Constants.BaseStyle.DEVICE_WIDTH*5/100,
        borderColor: Constants.Colors.Gray,
        borderWidth: 1,
        height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start'
      }}>
        <Text style={{
          ...Constants.Fonts.tinyMedium,
          color: Constants.Colors.Gray,
        }}>{item}</Text>
      </View>
    );
  }

  /**
  * Deline chef request. 
  */

  onDeclineRequest=()=>{
    let context = this;
    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject the booking request?",
      [
        {text: 'Yes', onPress: () => context.declineRequest() },
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
      { cancelable: false }
    )
  }

  /**
  * Request for booking cancellation.
  */

  onRequestForCancellation=()=>{
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel the booking? Please read cancellation policy carefully.",
      [
        {text: 'Yes', onPress: () => this.cancelRequest()},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
      { cancelable: false }
    )
  }

  /**
  * Cancellation Confirmation.
  */

  onAcceptCancelRequest=()=>{
    Alert.alert(
      "Accept Cancellation Request",
      "Once you confirm, you'll receive your booking amount refund.",
      [
        {text: 'Yes', onPress: () => this.acceptRequest()},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
      { cancelable: false }
    )
  }

  /**
  * Get Chat history
  */

  onChatPress(){
    let context = this;
    this.props.conversationsActions.getChatHistory({
      token:this.props.user.auth.token,
      userId:this.props.user.userId,
      receiverId:this.props.navigation.state.params.user.userId,
      receiverName:this.props.navigation.state.params.user.fullName
    });
  }

  /**
  * Hire chef
  */

  onHire=()=>{
    let context = this;
    let { navigate } = context.props.navigation;
    if(context.props.payments.cardsList.length>0 || context.props.user.defaultCard){
      let requestObject = {
        token  : context.props.user.auth.token,
        userId : context.props.user.userId,
        bookingNumber:context.props.navigation.state.params.booking_number
      }
      context.props.bookingsActions.hireChef(requestObject,(success)=>{
        if(success){
          if(_.isFunction(context.props.navigation.state.params.callBack)){
            context.props.navigation.state.params.callBack();
          }
        }
      });
    }else{
      Alert.alert(
        "Add Credit/Debit Card.",
        "Please add credit/debit card before hiring chef.",
        [
          {text: 'Continue', onPress: () => navigate("RegisterCreditDebitCards")},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
        ],
        { cancelable: false }
      )
    }
  }

  /**
  * Decline Booking Request 
  */
  declineRequest = () =>{
    let context = this;
    let requestObject = {
      bookingStatus:5,
      token:context.props.user.auth.token,
      userId:context.props.user.userId,
      bookingNumber:context.props.navigation.state.params.booking_number
    };
    context.props.bookingsActions.declineRequest(requestObject,(success)=>{
      if(success){
        if(_.isFunction(context.props.navigation.state.params.callBack)){
          context.props.navigation.state.params.callBack();
        }
      }
    });
  }

  /**
  * Cancelation request.
  */
  cancelRequest = () => {
    let context = this;
    let requestObject = {
      token  : this.props.user.auth.token,
      userId : this.props.user.userId,
      bookingNumber:this.props.navigation.state.params.booking_number
    }
    context.props.bookingsActions.requestCancelBooking(requestObject,(success)=>{
      if(success){
        if(_.isFunction(context.props.navigation.state.params.callBack)){
          context.props.navigation.state.params.callBack();
        }
      }
    });
  };


  /**
  * Accept cancelation request.
  */
  acceptRequest = () => {
    let context = this;
    let requestObject = {
      token  : context.props.user.auth.token,
      userId : context.props.user.userId,
      bookingNumber:context.props.navigation.state.params.booking_number
    }
    context.props.bookingsActions.acceptCancallationRequest(requestObject,(success)=>{
      if(success){
        if(_.isFunction(context.props.navigation.state.params.callBack)){
          context.props.navigation.state.params.callBack();
        }
      }
    });
  };

  /**
  * Render Cancel booking button when booking is accepted. 
  */
  renderCancelRequestButton=()=>{
    return(
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <RoundButton
          text={"REQUEST FOR CANCELLATION"}
          buttonStyle={styles.reqCancelButton}
          textStyle ={[Constants.Fonts.normal, {color: Constants.Colors.Magenta}]}
          _Press={this.onRequestForCancellation}
        />
      </View>
    );
  };

  /**
  * Render accept booking cancelation button when booking is confirmed. 
  */
  renderAcceptCancelRequest=()=>{
    return(
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <RoundButton
          text={"ACCEPT REQUEST FOR CANCELLATION"}
          buttonStyle={styles.reqCancelButton}
          textStyle ={[Constants.Fonts.normal, {color: Constants.Colors.Magenta}]}
          _Press={this.onAcceptCancelRequest}
        />
      </View>
    )
  };

  /**
  * Render Hire Chef or Reject Request Buttons
  */
  renderButtons(){
    let context = this;
    return(
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <RoundButton
          text={"Reject"}
          buttonStyle={styles.rejectButtonStyle}
          textStyle={{color: Constants.Colors.Magenta}}
          _Press={this.onDeclineRequest}
        />
        <RoundButton
          text={"Hire"}
          buttonStyle={styles.acceptButtonStyle}
          textStyle={{color: Constants.Colors.Green}}
          _Press={this.onHire}
        />
      </View>
    )
  }

  // Default render function
  render() {
    let { goBack, navigate } = this.props.navigation;
    let {
      otherDetails,
      preference,
      addtionalCost,
      addAddtionalCost,
      additionalDescription,
      description,
      enterDescription,
      costDollar,
      viewFullProfile,
      totalCost,
      additionalDetails
    } = Constants.i18n.bookings;

    const titleConfig = {
      title: "Requests",
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
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  style={[styles.container,{marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*4.5/100,}]}>
          <View style={styles.details}>
            <View style={styles.profile}>
              <Avatar
                user = {this.props.navigation.state.params.user}
                placeholderStyle = {styles.placeholderStyle}
                avatarStyle = {styles.avatarStyle}
              />

              <View style={{
                width: Constants.BaseStyle.DEVICE_WIDTH/100*24,
              }}>
                <StarRating
                  style={styles.rating}
                  editable={false}
                  rating={this.props.navigation.state.params.user.rating.avgRating}
                />
              </View>

              <TouchableOpacity 
                onPress={()=>navigate("ChefReviewProfile",{
                  userDetails:this.props.navigation.state.params.user,
                  status : this.props.navigation.state.params.status
                })}
                style={{
                  width: Constants.BaseStyle.DEVICE_WIDTH/100*24,
                  alignItems: 'center'
                }}>
                <Text
                  style={{
                    ...Constants.Fonts.tiny,
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    color: Constants.Colors.Green
                  }}
                >
                  {viewFullProfile}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{flex: 2.5}}>
              <Text style={styles.name}>
                {this.props.navigation.state.params.user.fullName.capitalizeEachLetter()}
              </Text>
              <Text style={styles.address}>
                {this.props.navigation.state.params.user.position.address.capitalizeFirstLetter()}
              </Text>
              <Text style={styles.dateTime}>
                {"Date: " + moment(this.props.navigation.state.params.starts_on,"x").format("DD MMM")}
              </Text>
              <Text style={styles.dateTime}>
                { "Time: From " + moment(this.props.navigation.state.params.starts_on,"x").format("DD MMM hh:mm a") +
                " to " + moment(this.props.navigation.state.params.ends_on,"x").format("DD MMM hh:mm a")
                }
              </Text>
              {
                this.props.navigation.state.params.status!==5 &&  this.props.navigation.state.params.status!==9 && 
                this.props.navigation.state.params.status!==1 && this.props.navigation.state.params.status!==2 &&
                <View style={{
                  flexDirection: 'row',
                  paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100
                }}>
                  <TouchableOpacity onPress={()=>this.onChatPress()}>
                    <Image
                      source={Constants.Images.caterer.message_gray}
                      style={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                        marginRight: Constants.BaseStyle.DEVICE_WIDTH*4/100
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>telephone(this.props.navigation.state.params.user.phoneNum)}>
                    <Image
                      source={Constants.Images.caterer.call_gray}
                      style={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              }
            </View>
          </View>

          {
            (this.props.navigation.state.params.foodPreference.length > 0 ||
            this.props.navigation.state.params.requestDescription.trim() != "") &&
            <View style={styles.otherDetailsContainer}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={()=>this.setState({otherDetailsToggle: !this.state.otherDetailsToggle})}
              >
                <View style={{flex: 1}}>
                  <Text style={styles.otherDetailsText}>{otherDetails}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                  {
                    this.state.otherDetailsToggle ?
                    <Image
                      source={Constants.Images.caterer.arrow_down}
                      style={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      }}
                    /> :
                    <Image
                      source={Constants.Images.caterer.arrow_right}
                      style={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      }}
                    />
                  }
                </View>
              </TouchableOpacity>
              <View>
                {
                  this.state.otherDetailsToggle && this.props.navigation.state.params.foodPreference.length > 0 &&
                  <View style={{paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100}}>
                    <Text style={styles.text}>{preference}</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {
                        _.map(this.props.navigation.state.params.foodPreference,
                          (item, i)=>{
                            return this.renderPreferences(item, i);
                          })
                      }
                    </View>
                  </View>
                }
                {
                  this.state.otherDetailsToggle &&
                  this.props.navigation.state.params.hasOwnProperty("requestDescription") && 
                  this.props.navigation.state.params.requestDescription.trim() != "" &&
                  <View style={{paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100}}>
                    <Text 
                      style={[{paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100}, Constants.Fonts.tinyLargeBold]}>
                      {description}
                    </Text>
                    <Text style={{
                      ...Constants.Fonts.tinyMedium,
                      color: Constants.Colors.Gray,
                      paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100
                    }}>
                      {this.props.navigation.state.params.requestDescription}
                    </Text>
                  </View>
                }
              </View>
            </View>
          }
          { 
            this.props.navigation.state.params.hasOwnProperty("additionalCost") && 
            (this.props.navigation.state.params.additionalCost>0 || 
              this.props.navigation.state.params.additionalDescription.length>0 ) &&
            <View style={styles.additionalCostContainer}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={()=>this.setState({additionalCostToggle: !this.state.additionalCostToggle})}
              >
                <View style={{flex: 1}}>
                  <Text style={[styles.additionalCostText, styles.text]}>{additionalDetails}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                  {
                    this.state.additionalCostToggle ?
                    <Image
                      source={Constants.Images.caterer.arrow_down}
                      style={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      }}
                    /> :
                    <Image
                      source={Constants.Images.caterer.arrow_right}
                      style={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      }}
                    />
                  }
                </View>
              </TouchableOpacity>
              {
                this.state.additionalCostToggle &&
                (parseFloat(this.props.navigation.state.params.additionalCost) != 0 ||
                this.props.navigation.state.params.additionalDescription.trim().length>0) &&
                <View style={{paddingBottom:10}}>
                  {
                    this.state.additionalCostToggle &&
                    parseFloat(this.props.navigation.state.params.additionalCost) != 0 &&
                    <View>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{
                            color: Constants.Colors.Black,
                            ...Constants.Fonts.tinyLargeBold,
                            marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                          }}>
                            {addtionalCost}
                          </Text>
                        </View>
                        <View style={{
                          flex: 1,
                          alignItems: 'flex-end'
                        }}>
                          <Text style={{
                            color: Constants.Colors.Black,
                            ...Constants.Fonts.tinyLarge,
                            marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                          }}>
                            {"$"+
                              Regex.removeTrailingZeros(parseFloat(this.props.navigation.state.params.additionalCost).toFixed(2))
                            }
                          </Text>
                        </View>
                      </View>
                    </View>
                  }
                  {
                    this.state.additionalCostToggle &&
                    this.props.navigation.state.params.additionalDescription.trim().length>0 &&
                    <View>
                      <Text style={[styles.text, ...Constants.Fonts.tinyLargeBold]}>{additionalDescription}</Text>
                      <Text style={styles.additionalTexts}>{this.props.navigation.state.params.additionalDescription}</Text>
                    </View>
                  }
                </View>
              }
            </View>
          }
          {
            this.props.navigation.state.params.hasOwnProperty("totalCost") &&
            parseFloat(this.props.navigation.state.params.totalCost) != 0 &&
            <View style={[styles.additionalCostContainer]}>
              <View>
                <View style={{
                  flexDirection: 'row',
                  borderTopWidth: 1,
                  borderTopColor: Constants.Colors.GhostWhite
                }}>
                  <View style={{flex: 2}}>
                    <Text style={{
                      color: Constants.Colors.Black,
                      marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2.3/100,
                      ...Constants.Fonts.tinyLargeBold,
                    }}>
                      {totalCost}
                    </Text>
                  </View>
                  <View style={{flex: 3, alignItems: 'flex-end'}}>
                    <Text style={{
                      color: Constants.Colors.Black,
                      marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2.3/100,
                      ...Constants.Fonts.tinyLarge,
                    }}>
                      {"$"+
                        Regex.removeTrailingZeros(parseFloat(this.props.navigation.state.params.totalCost).toFixed(2))
                      +" (Including all fees)"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          }
          {this.props.navigation.state.params.hasOwnProperty("refundAmount") &&
            <View style={[styles.additionalCostContainer]}>
              <View>
                <View style={{
                  flexDirection: 'row',
                  borderTopWidth: 1,
                  borderTopColor: Constants.Colors.GhostWhite
                }}>
                  <View style={{flex: 2}}>
                    <Text style={{
                      color: Constants.Colors.Black,
                      marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2.3/100,
                      ...Constants.Fonts.tinyLargeBold,
                    }}>
                      {"Refund"}
                    </Text>
                  </View>
                  <View style={{flex: 3, alignItems: 'flex-end'}}>
                    <Text style={{
                      color: Constants.Colors.Black,
                      marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2.3/100,
                      ...Constants.Fonts.tinyLarge,
                    }}>
                      {"$"+
                      Regex.removeTrailingZeros(parseFloat(this.props.navigation.state.params.refundAmount).toFixed(2))
                    }
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          }
          { 
            (this.diffSecs-1) > 1 && this.props.navigation.state.params.status===2 &&
            <View style={styles.timerConstainer}>
            <Timer
              startTime={this.diffSecs}
              timeUp={()=>this.timeUp()}
            />
            </View>
          }
          <View style={{paddingBottom: 25}} />
        </ScrollView>
        {this.props.navigation.state.params.status===2 && this.renderButtons()}
        {this.props.navigation.state.params.status===3 && this.renderCancelRequestButton()}
        {this.props.navigation.state.params.status===4 && this.renderAcceptCancelRequest()}
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
    backgroundColor: Constants.Colors.White,
  },
  details: {
    flexDirection: 'row',
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
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
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
    justifyContent: 'center',
  },
  name: {
    ...Constants.Fonts.contentBold,
    color:Constants.Colors.Black,
  },
  address: {
    ...Constants.Fonts.tinyLarge,
    color:Constants.Colors.Gray,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100,
  },
  dateTime: {
    ...Constants.Fonts.tiny,
    color:Constants.Colors.Gray,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100,
  },
  placeholderStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*22,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*22,
    borderRadius:null,
  },
  avatarStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*24,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*24,
    borderRadius:null,
  },
  rejectButtonStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH*30/100,
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
    marginRight: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
    bottom: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    backgroundColor: Constants.Colors.White,
    borderWidth: 1,
    borderColor: Constants.Colors.Magenta,
    borderRadius: null,
  },
  acceptButtonStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH*50/100,
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
    marginRight: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
    bottom: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    backgroundColor: Constants.Colors.White,
    borderWidth: 1,
    borderColor: Constants.Colors.Green,
    borderRadius: null,
  },
  otherDetailsContainer: {
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
  },
  otherDetailsText: {
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    color: Constants.Colors.Black,
    ...Constants.Fonts.tinyLargeBold,
  },
  additionalCostContainer: {
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
  },
  additionalCostText: {
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    color: Constants.Colors.Black,
    ...Constants.Fonts.tinyLarge,
  },
  reqCancelButton:{
    backgroundColor: Constants.Colors.White,
    borderWidth: 1,
    borderColor: Constants.Colors.Magenta,
    borderRadius: null,
    bottom: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
  },
  timerConstainer: {
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*5/100
  },
  additionalTexts:{
    color: Constants.Colors.Black,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*0.3/100,
    ...Constants.Fonts.tinyLarge,
  },
  text:{
    color: Constants.Colors.Black,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*0.3/100,
    marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*0.2/100,
    ...Constants.Fonts.tinyLargeBold,
  }
});

Request.defaultProps={
  img: '',
  rating: 0,
  name: '',
  address: '',
  date: '',
  timeFrom: '',
  timeTo: '',
  timer:0,
  otherDetailsToggle: false,
  additionalCostToggle: false,
  preferences: [],
  requestDescription: "",
  addtionalCostDescription: "",
  cost: "",
  isAccepted:false
}

const mapStateToProps = state => ({
  user : state.user.userDetails,
  payments : state.payments,
  listing : state.listing
})

const mapDispatchToProps = dispatch =>({
  bookingsActions : bindActionCreators(bookingsActions,dispatch),
  conversationsActions : bindActionCreators(conversationsActions,dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Request);