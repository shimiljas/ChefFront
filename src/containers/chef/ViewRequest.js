/*
 * @file: ViewRequest.js
 * @description: Details of request received by Chef/Caterer.
 * @date: 14.08.2017
 * @author: Manish Budhiraja
 * */

'use-strict';
import React, { Component } from 'react';
import  ReactNative ,{ ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  findNodeHandle
} from 'react-native';
import { telephone } from "../../utilities/Linking";
import syncServerTime from "../../utilities/SyncServerTime";
import Constants from "../../constants";
import Avatar from "../../components/common/Avatar";
import StarRating from '../../components/common/StarRating';
import RoundButton from "../../components/common/RoundButton";
import NavigationBar  from "react-native-navbar"
import BackButton  from "../../components/common/BackButton"; 
import Timer  from "../../components/common/Timer"; 
import * as bookingsActions from '../../redux/modules/bookings';
import * as conversationsActions from '../../redux/modules/conversations';
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastActionsCreators } from 'react-native-redux-toast';
import moment from 'moment';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { getSocketClient } from "../../utilities/SocketClient";
import Regex from "../../utilities/Regex";

class ViewRequest extends Component {

  constructor(props) {
    super(props);
    this.diffSecs = null;
    this.time = null;
    let bookingHours = moment(this.props.navigation.state.params.ends_on).diff(moment(this.props.navigation.state.params.starts_on), 'h')
    this.state = {
      otherDetailsToggle : false,
      additionalCostToggle : false,
      additional_cost : "",
      additionalDescription : '',
      height : 35,
      totalCost : this.props.navigation.state.params.rate_charged,
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
      var b = moment(context.props.navigation.state.params.created_at);
      context.secondsDiff =    a.diff(b, 'seconds');
      // console.log("difference calculate ", context.secondsDiff )
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
    this.props.navigation.dispatch(ToastActionsCreators.displayInfo("Response time is over. Booking Request auto declined."));
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
          color:Constants.Colors.Gray,
        }}>
          {item}
        </Text>
      </View>
    )
  }

  /**
  * Accept the consumer request and share details.
  */
  onRequestAccept=()=>{
    let context = this;
    let { navigate } = context.props.navigation;
    if(!context.props.user.isStripeVerified) {
      Alert.alert(
        "Add Bank Details.",
        "Please add bank details before accepting request.",
        [
          {text: 'Continue', onPress: () => navigate("RegisterBank")},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
        ],
        { cancelable: false }
      )
    } else {
      let requestObject = {
        bookingStatus:2,
        token:context.props.user.auth.token,
        userId:context.props.user.userId,
        bookingNumber:context.props.navigation.state.params.booking_number,
        addition_cost:context.state.additional_cost===""? 0 : parseFloat(context.state.additional_cost).toFixed(2),
        additionalDescription:context.state.additionalDescription
      }
      context.props.bookingsActions.acceptConsumerRequest(requestObject,(success)=>{
        if(success){
          if(_.isFunction(context.props.navigation.state.params.callBack)){
            context.props.navigation.state.params.callBack();
          }
        }
      });
    }
  } 

  /**
  * Reject the consumer request.
  */

  onRequestDecline=()=>{
    let context = this;
    let requestObject = {
      bookingStatus:5,
      token:context.props.user.auth.token,
      userId:context.props.user.userId,
      bookingNumber:context.props.navigation.state.params.booking_number
    }
    context.props.bookingsActions.declineRequest(requestObject,(success)=>{
      if(success){
        if(_.isFunction(context.props.navigation.state.params.callBack)){
          context.props.navigation.state.params.callBack();
        }
      }
    });
  }

  /**
  * Cancel the booking.
  */

  onCancelBooking=()=>{
    let context = this;
    let requestObject = {
      token:context.props.user.auth.token,
      userId:context.props.user.userId,
      bookingNumber:context.props.navigation.state.params.booking_number
    }
    context.props.bookingsActions.cancelBooking(requestObject,(success)=>{
      if(success){
        if(_.isFunction(context.props.navigation.state.params.callBack)){
          context.props.navigation.state.params.callBack();
        }
      }
    });
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
  * Reject the consumer request. 
  */

  onRequestReject=()=>{
    let context = this;
    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject the booking request?",
      [
        {text: 'Yes', onPress: () => context.onRequestDecline()},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
      { cancelable: false }
    )
  }


  onRequestForCancellation=()=>{
    let context = this;
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel booking?",
      [
        {text: 'Yes', onPress: () => context.onCancelBooking()},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
      { cancelable: false }
    )
  }

  renderButtons=()=>{
    return(
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <RoundButton
          text={"REJECT"}
          buttonStyle={styles.rejectButtonStyle}
          textStyle={{color: Constants.Colors.Magenta}}
          _Press={this.onRequestReject}
        />
        <RoundButton
          text={"ACCEPT"}
          buttonStyle={styles.acceptButtonStyle}
          textStyle={{color: Constants.Colors.Green}}
          _Press={this.onRequestAccept}
        />
      </View>
    );
  }

  renderCancelRequestButton=()=>{
    return(
      <RoundButton
        text={"REQUEST FOR CANCELLATION"}
        buttonStyle={styles.reqCancelButton}
        textStyle ={[Constants.Fonts.normal, {color: Constants.Colors.Magenta}]}
        _Press={this.onRequestForCancellation}
      />
    );
  };

  // Keyboard Handling
 _handleScrollView(ref) {
    let context = this;
    context.setTimeout(() => {
      let scrollResponder = context.refs.mainScrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ref,
        (Constants.BaseStyle.DEVICE_HEIGHT/100) * 35,
        true
      );
    }, 100);
  }

  _resetScrollView(ref) {
    let context = this;
    context.setTimeout(() => {
      let scrollResponder = context.refs.mainScrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ref,
        0,
        true
      );
    }, 100);
  }


  /**
  * Handle on change description 
  */
  onChange=(event) => {
    this.setState({
      height: event.nativeEvent.contentSize.height,
    });
  }

  renderAdditionalFields(){
    let context = this;   
    let {
      otherDetails,
      preference,
      addAddtionalCost,
      description,
      enterDescription,
      costDollar,
      viewFullProfile,
      totalCost
    } = Constants.i18n.bookings;  

    let cost = this.state.additional_cost.trim()==="" ? parseFloat(this.state.totalCost).toFixed(2) : (parseFloat(this.state.totalCost) + parseFloat(this.state.additional_cost)).toFixed(2);

    return(
      <View style={styles.additionalCostContainer}>
        <TouchableOpacity activeOpacity={0.9}
          onPress={()=>this.setState({additionalCostToggle: !this.state.additionalCostToggle})}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={[styles.additionalCostText,styles.text]}>{addAddtionalCost}</Text>
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
          </View>
        </TouchableOpacity>
        {
          this.state.additionalCostToggle && 
          <View>
            <TextInput
              ref= "description"
              style={{
                marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                height: Math.max(35, this.state.height),
                ...Constants.Fonts.normal
              }}
              placeholder={enterDescription}
              placeholderTextColor={Constants.Colors.Gray}
              returnKeyType='next'
              multiline={true}
              numberOfLines={4}
              maxLength={250}
              value = {this.state.additionalDescription}
              onChangeText={(additionalDescription) => this.setState({additionalDescription})}
              onChange={(event) => context.onChange(event)}
              onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.description));}}
              onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.description));}}
            />
            <TextInput
              ref = "cost"
              style={{
                marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                ...Constants.Fonts.normal
              }}
              placeholder={costDollar}
              placeholderTextColor={Constants.Colors.Gray}
              keyboardType='numeric'
              returnKeyType='done'
              value = {this.state.additional_cost}
              onChangeText={(additional_cost) => this.setState({additional_cost})}
              onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.cost));}}
              onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.cost));}}
            />
          </View>
        }
        <View style={{flexDirection: 'row', borderTopWidth: 1, borderTopColor: Constants.Colors.GhostWhite }}>
          <View style={{flex: 2}}>
            <Text style={{color: Constants.Colors.Black,marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,...Constants.Fonts.tinyLargeBold,}}>
              {totalCost}
            </Text>
          </View>
          <View style={{flex: 3, alignItems: 'flex-end'}}>
            <Text style={{color: Constants.Colors.Black,marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,...Constants.Fonts.tinyLarge,}}>
              {"$"+cost}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  /**
  * Render Contact View
  */
  renderContact(){
    let context = this;
    let { navigate } = this.props.navigation;
    return(
      <View style={{flexDirection: 'row',paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100}}>
        <TouchableOpacity activeOpacity={0.9} onPress={()=>this.onChatPress()}>
          <Image
            source={Constants.Images.caterer.message_gray}
            style={{
              height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
              width: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
              marginRight: Constants.BaseStyle.DEVICE_WIDTH*4/100
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={()=>telephone(this.props.navigation.state.params.user.phoneNum)}>
          <Image
            source={Constants.Images.caterer.call_gray}
            style={{
              height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
              width: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  /**
  * Render Other Details View
  */
  renderOtherFileds(){
    let context = this;
    let {
      additionalDetails,
      otherDetails,
      preference,
      addtionalCost,
      addAddtionalCost,
      addtionalDescription,
      description,
      enterDescription,
      costDollar,
      viewFullProfile,
      totalCost
    } = Constants.i18n.bookings;

    return(
      <View style={styles.otherDetailsContainer}>
        <TouchableOpacity activeOpacity={0.9} onPress={()=>this.setState({otherDetailsToggle: !this.state.otherDetailsToggle})}>
          <View style={{flexDirection: 'row'}}>
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
          </View>
        </TouchableOpacity>
        {this.state.otherDetailsToggle &&
          <View>
            <View style={{paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100}}>
              <Text style={styles.text}>{preference}</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {
                  _.map(this.props.navigation.state.params.foodPreference,
                    (item,i)=>{
                      return this.renderPreferences(item,i);
                    })
                }
              </View>
            </View>
          { this.props.navigation.state.params.requestDescription.trim() !== "" &&
            <View style={{paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100}}>
              <Text style={[{paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100,}, styles.text, ...Constants.Fonts.tinyLargeBold,]}>{description}</Text>
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
        }
      </View>
    );
  }

  /**
  * Render Total Cost View
  */
  renderAdditionalCost() {
    let context = this;
    let {
      additionalDetails,
      otherDetails,
      preference,
      addtionalCost,
      addAddtionalCost,
      addtionalDescription,
      description,
      enterDescription,
      costDollar,
      viewFullProfile,
      totalCost
    } = Constants.i18n.bookings;

    return(
      <View style={{marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,borderTopWidth: 0.5,borderTopColor: Constants.Colors.GhostWhite}}>
        <TouchableOpacity activeOpacity={0.9}
          onPress={()=>this.setState({additionalCostToggle: !this.state.additionalCostToggle})}
        >
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={[styles.additionalCostText,styles.text]}>{additionalDetails}</Text>
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
          </View>
        </TouchableOpacity>
        { 
          this.state.additionalCostToggle &&
          <View style={{paddingBottom:10}}>
            { parseInt(this.props.navigation.state.params.additionalCost)>0 &&
            <View>
                <View style={{
                  flexDirection: 'row',
                  //borderTopWidth: 1,
                  //borderTopColor: "red"
                }}>
                  <View style={{
                    flex: 1,
                  }}>
                    <Text style={{
                      color: Constants.Colors.Black,
                      marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      ...Constants.Fonts.tinyLargeBold,
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
                      marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      ...Constants.Fonts.tinyLarge,
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
              this.props.navigation.state.params.additionalDescription.length>0 &&
              <View>
                <Text style={[styles.text, ...Constants.Fonts.tinyLargeBold]}>{addtionalDescription}</Text>
                <Text style={styles.additionalTexts}>{this.props.navigation.state.params.additionalDescription}</Text>
              </View>
            }
          </View>
        }
      </View>
    );
  }

  /**
  * Render Total Cost View
  */
  renderTotalCost() {
    let context = this;
    let {
      additionalDetails,
      otherDetails,
      preference,
      addtionalCost,
      addAddtionalCost,
      addtionalDescription,
      description,
      enterDescription,
      costDollar,
      viewFullProfile,
      totalCost
    } = Constants.i18n.bookings;
    let finalCost = (parseFloat(this.props.navigation.state.params.totalCost)-parseFloat(this.props.navigation.state.params.adminCost)).toFixed(2);
    return (
      <View style={{marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100, flexDirection: 'row', borderTopWidth: 1, borderTopColor: Constants.Colors.GhostWhite}}>
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
            { "$"+ 
            Regex.removeTrailingZeros(finalCost)
            }
          </Text>
        </View>
      </View>
    );
  }

  renderRefundedCost(){
    let context = this;
    let {
      additionalDetails,
      otherDetails,
      preference,
      addtionalCost,
      addAddtionalCost,
      addtionalDescription,
      description,
      enterDescription,
      costDollar,
      viewFullProfile,
      totalCost
    } = Constants.i18n.bookings;

    return (
      <View style={{marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100, flexDirection: 'row', borderTopWidth: 1, borderTopColor: Constants.Colors.GhostWhite}}>
        <View style={{flex: 3}}>
          <Text style={{
            color: Constants.Colors.Black,
            marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
            marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2.3/100,
            ...Constants.Fonts.tinyLargeBold,
          }}>
            {"Refund to consumer"}
          </Text>
        </View>
        {/*<View style={{flex: 3, alignItems: 'flex-end'}}>
            <Text style={{
              color: Constants.Colors.Black,
              marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
              marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2.3/100,
              ...Constants.Fonts.tinyLarge,
            }}>
              {
                "$"+
                (parseFloat(this.props.navigation.state.params.totalCost)
                -parseFloat(this.props.navigation.state.params.adminCost)).toFixed(2)
              }
            </Text>
          </View>*/}
      </View>
    );
  }

  // Default render function
  render() {
    let { goBack, navigate } = this.props.navigation;
    let {
      additionalDetails,
      otherDetails,
      preference,
      addtionalCost,
      addAddtionalCost,
      addtionalDescription,
      description,
      enterDescription,
      costDollar,
      viewFullProfile,
      totalCost
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
        <ScrollView 
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          ref='mainScrollView'
          keyboardDismissMode='on-drag' 
          keyboardShouldPersistTaps='always' 
          style={[styles.container,{marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*4.5/100,}]}
        >
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
                  alignItems: 'center',
                  backgroundColor:Constants.Colors.Transparent
                }}>
                <Text
                  style={{
                    ...Constants.Fonts.tiny,
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    color: Constants.Colors.Green,
                    backgroundColor:Constants.Colors.Transparent
                  }}
                  onPress={()=>navigate("ReviewConsumerProfile",{
                    userDetails:this.props.navigation.state.params.user,
                    status : this.props.navigation.state.params.status
                  })}
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
                this.props.navigation.state.params.status!==5 && this.props.navigation.state.params.status!==9 && 
                this.props.navigation.state.params.status!==1 && this.props.navigation.state.params.status!==2 &&
                this.renderContact()
              }
            </View>
          </View>
          {this.renderOtherFileds()}
          {this.props.navigation.state.params.status===1 && this.renderAdditionalFields()}
          {
            this.props.navigation.state.params.hasOwnProperty("additionalCost") && 
            (this.props.navigation.state.params.additionalCost>0 || 
              this.props.navigation.state.params.additionalDescription.length>0 ) &&
            this.renderAdditionalCost()
          }
          {
            this.props.navigation.state.params.totalCost &&
            this.renderTotalCost()
          }
          {
            this.props.navigation.state.params.refundAmount &&
            this.renderRefundedCost()
          }
          { 
            (this.state.diffSecs-1) > 1 && this.props.navigation.state.params.status===1 &&
            <View style={styles.timerConstainer}>
              <Timer
                startTime={this.diffSecs}
                timeUp={()=>this.timeUp()}
              />
            </View>
          }
          <View style={{paddingBottom:25}} />
        </ScrollView>
        {this.props.navigation.state.params.status===1 && this.renderButtons()}
        {this.props.navigation.state.params.status===3 && this.renderCancelRequestButton()}
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
  reqCancelButton:{ 
    backgroundColor: Constants.Colors.White,
    borderWidth: 1,
    borderColor: Constants.Colors.Magenta,
    borderRadius: null,
    bottom: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
    marginRight: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
    alignSelf:"center"
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
  timerConstainer: {
    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*5/100
  },
  text:{
    color: Constants.Colors.Black,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*0.3/100,
    marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*0.2/100,
    ...Constants.Fonts.tinyLargeBold,
  }
});


const mapStateToProps = state => ({
  user : state.user.userDetails,
  payments : state.payments, 
  listing : state.listing
});

const mapDispatchToProps = dispatch => ({
  bookingsActions : bindActionCreators(bookingsActions,dispatch),
  conversationsActions : bindActionCreators(conversationsActions,dispatch),
});

ReactMixin(ViewRequest.prototype, TimerMixin);

export default connect(mapStateToProps, mapDispatchToProps)(ViewRequest);
