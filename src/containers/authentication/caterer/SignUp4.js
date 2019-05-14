/*
 * @file: SignUp4.js
 * @description: ChefSignUpStep4
 * @date: 11.07.2017
 * @author: Vishal Kumar
 * */

'use strict';
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  ListView,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import _ from 'lodash';
import moment from 'moment';
import { ToastActionsCreators } from 'react-native-redux-toast';
import BackButton  from "../../../components/common/BackButton";
import Constants from '../../../constants';
import Regex from '../../../utilities/Regex';
import Background from '../../../components/common/Background';
import RoundButton from '../../../components/common/RoundButton';
import InputField from '../../../components/common/InputField';
import CircularCheckbox from '../../../components/common/CircularCheckBox';
import ModalDayPicker from '../../../components/common/ModalDayPicker';
import ModalTimePicker from '../../../components/common/ModalTimePicker';
import ImagePicker from 'react-native-image-crop-picker';
import ThumbnailGenerator from 'react-native-thumbnail';

let week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let startTime = '';
let closeTime = '';

export default class SignUp4 extends Component {
  constructor(props) {
    super(props);
    this.state= {
      eventCateringEnable: false,
      costPerPerson: '',
      minGuestCount: '',
      maxGuestCount: '',

      dropOffCateringEnable: false,
      deliveryFees: '',

      pickupEnable: false,

      dayFrom: 'From',
      dayTo: 'To',
      timeFrom: 'From',
      timeTo: 'To',
      open: false,
      openTimePicker: false,
      type: '',
      workImages: [],
      maxNumberOfImages: 3,
      maxNumberOfVideos: 1,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    }
    this.onDayModalValueChange=this.onDayModalValueChange.bind(this);
    this.onTimeModalValueChange=this.onTimeModalValueChange.bind(this);
    this.checkEventCatering=this.checkEventCatering.bind(this);
    this.checkDropOffCatering=this.checkDropOffCatering.bind(this);
    this.checkPickup=this.checkPickup.bind(this);
  }

  // Function navigates to terms and condition screen
  onTermsOfServiceClick() {
    let { service } = Constants.i18n.about;
    this.props.navigation.navigate("WebView", {title: service,url:"terms"});
  }

  // Function validates all user input and signs up
  onFinishClick() {
    let {
      eventCateringEnable,
      costPerPerson,
      minGuestCount,
      maxGuestCount,
      dropOffCateringEnable,
      deliveryFees,
      pickupEnable,
      dayFrom,
      dayTo,
      timeFrom,
      timeTo,
    } = this.state;

    let {
      enterCostPerPerson,
      enterValidCostPerPerson,
      enterMinGuestCount,
      enterValidMinGuestCount,
      enterMaxGuestCount,
      enterValidMaxGuestCount,
      enterDeliveryFees,
      enterValidDeliveryFees,
      enterOpeningDay,
      enterClosingDay,
      selectAny,
    } = Constants.i18n.signupCaterer;

    let { navigate, dispatch } = this.props.navigation;

    if(!(eventCateringEnable || dropOffCateringEnable || pickupEnable)) {
      dispatch(ToastActionsCreators.displayInfo(selectAny));
      return;
    }

    if(eventCateringEnable) {
      if(_.isEmpty(costPerPerson.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterCostPerPerson));
        return;
      }
      if(!Regex.validateNumbers(costPerPerson.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterValidCostPerPerson));
        return;
      }

      if(_.isEmpty(maxGuestCount.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterMaxGuestCount));
        return;
      }
      if(!Regex.validateNumbers(maxGuestCount.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterValidMaxGuestCount));
        return;
      }
      if(_.isEmpty(minGuestCount.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterMinGuestCount));
        return;
      }
      if(!Regex.validateNumbers(minGuestCount.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterValidMinGuestCount));
        return;
      }
    }

    if(dropOffCateringEnable) {
      if(_.isEmpty(deliveryFees.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterDeliveryFees));
        return;
      }
      if(!Regex.validateNumbers(deliveryFees.trim())) {
        dispatch(ToastActionsCreators.displayInfo(enterValidDeliveryFees));
        return;
      }
    }

    // Validation for day
    let dayFromIndex = week.indexOf(dayFrom);
    let dayToIndex = week.indexOf(dayTo);

    if(dayFromIndex == -1) {
      dispatch(ToastActionsCreators.displayInfo("Enter opening day"));
      return;
    }
    if(dayToIndex == -1) {
      dispatch(ToastActionsCreators.displayInfo("Enter closing day"));
      return;
    }

    if(dayFromIndex > dayToIndex) {
      if(dayFromIndex < 6) {
        dispatch(ToastActionsCreators.displayInfo("Closing days can only range from " + week[dayFromIndex+1] + " to " + week[6]));
      } else {
        dispatch(ToastActionsCreators.displayInfo("Closing day can only be Sunday"));
      }
      return;
    }

    if(timeFrom === "From") {
      dispatch(ToastActionsCreators.displayInfo("Enter opening time"));
      return;
    }
    if(timeTo === "To") {
      dispatch(ToastActionsCreators.displayInfo("Enter closing time"));
      return;
    }

    // Validation for time
    if(startTime >= closeTime) {
      dispatch(ToastActionsCreators.displayInfo("Opening time shall be less than closing time"));
      return;
    }
  }

  // Function shows or hides day picker
  showModal(type){
    //console.log("type", type)
    this.setState({openTimePicker: false, open: !this.state.open, type: type});
    //console.log("Open state", this.state.open)
  }

  // Function shows or hides time picker
  showTimePickerModal(type) {
    //console.log("type", type)
    this.setState({open: false, openTimePicker: !this.state.openTimePicker, type: type});
    //console.log("Open state", this.state.openTimePicker)
  }

  // Function sets the value of day
  onDayModalValueChange(itemValue, itemIndex) {
    let context = this;
    //console.log("itemValue", itemValue);
    let type = context.state.type;
    //console.log("type", type);
    if(type === "dayFrom") {
      //console.log("******")
      this.setState({ dayFrom: itemValue});
    } else {
      this.setState({ dayTo: itemValue});
    }
  }

  // Function sets the value of time
  onTimeModalValueChange(date) {
    let context = this;
    let hour = date.getHours();
    let min = date.getMinutes();
    //console.log("hour", hour);
    //console.log("min", min);
    let type = context.state.type;
    //console.log("type", type);

    let time = (hour>12?(hour-12):hour) + ":" + min + " " + (hour>12? "PM" : "AM");
    //console.log("Time", time)
    if(type === "timeFrom") {
      this.setState({ timeFrom: time});
      startTime = moment(date).format('LT');
      //console.log("startTime: ", startTime);
    } else {
      this.setState({ timeTo: time});
      closeTime = moment(date).format('LT');
      //console.log("closeTime: ", closeTime);
    }
  }

  // Function checks or unchecks event catering
  checkEventCatering() {
    //console.log("State: " + this.state.eventCateringEnable);
    this.setState({eventCateringEnable: !this.state.eventCateringEnable});
    //console.log("State: " + this.state.eventCateringEnable);
  }

  // Function checks or unchecks drop off catering
  checkDropOffCatering() {
    this.setState({dropOffCateringEnable: !this.state.dropOffCateringEnable});
  }

  // Function checks or unchecks pickup catering
  checkPickup() {
    //console.log("State: " + this.state.pickupEnable);
    this.setState({pickupEnable: !this.state.pickupEnable});
  }

  // Opens option for uploading photos and videos
  openOptionPicker() {
    let context = this;
    let BUTTONS = [
      'Open Photo Gallery',
      'Open Video Gallery',
      'Cancel'
    ];
    let DESTRUCTIVE_INDEX = 2;
    let CANCEL_INDEX = 2;

    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
      destructiveButtonIndex: DESTRUCTIVE_INDEX,
    },
    (index) => {
      if(index===0){
        let arr = this.state.maxNumberOfImages;
        //alert(this.state.maxNumberOfImages);
        if(arr>0){
          context.openPhotoGallery();} else { alert('Maximum three images are allowed'); }
      }else if(index===1){

        if(this.state.maxNumberOfVideos>0) {
          context.openVideoGallery();
        } else {
          alert('Only one video is allowed');
        }
      }
    });
  }

  // Function opens photo gallery for capturing images for uploading
  openPhotoGallery(){
    let { dispatch } = this.props.navigation;
    let context = this;
    let arr = this.state.workImages;
    let customArray={};
    ImagePicker.openPicker({
      showCropGuidelines :false,
      multiple:true,
      maxFiles:this.state.maxNumberOfImages,
      mediaType:"photo"
    }).then(images => {
      for (let item of images) {
       item.id=Math.random();
       item.isVideo=false;
       arr.push(item);
      }
      this.setState({
        workImages: arr
      })

      this.setState({maxNumberOfImages:(3-arr.length)})
      this.setState({
        dataSource:this.state.dataSource.cloneWithRows(arr)
      });
    }).catch(e => {
      if(e.code==="ERROR_PICKER_UNAUTHORIZED_KEY"){
        dispatch(ToastActionsCreators.displayInfo("Cannot access images. Please allow access if you want to be able to select images."));
        return;
      }
      if(e.code==="ERROR_PICKER_NO_CAMERA_PERMISSION"){
        dispatch(ToastActionsCreators.displayInfo("Cannot access camera. Please allow access if you want to be able to click images."));
        return;
      }
    });
  }

  // Function opens video gallery for capturing video for uploading
  openVideoGallery(){
    let { dispatch } = this.props.navigation;
    let context = this;
    let arr = this.state.workImages;
    ImagePicker.openPicker({
      showCropGuidelines :false,
      maxFiles:this.state.maxNumberOfVideos,
      mediaType:"video"
    }).then(images => {
      let source=null;
      if (Platform.OS === 'ios') {
        source = {uri: images.path.replace('file://', ''), isStatic: true};
      } else {
        source = {uri: images.path, isStatic: true};
      }
      ThumbnailGenerator.get(source.uri).then((result) => {
        let imageClone = context.state.workImages;
        result.isVideo=true;
        result.id=Math.random();
        imageClone.push(result);
        this.setState({ maxNumberOfVideos : 0 }) ;
        this.setState({
          dataSource:this.state.dataSource.cloneWithRows(imageClone)
        });
      })
    }).catch(e => {
      if(e.code==="ERROR_PICKER_UNAUTHORIZED_KEY"){
        dispatch(ToastActionsCreators.displayInfo("Cannot access images. Please allow access if you want to be able to select images."));
        return;
      }
      if(e.code==="ERROR_PICKER_NO_CAMERA_PERMISSION"){
        dispatch(ToastActionsCreators.displayInfo("Cannot access camera. Please allow access if you want to be able to click images."));
        return;
      }
    });
  }

  // Function deletes images and video from uploaded list
  deleteItemFromDataSource(item){
    let arr=this.state.workImages;
    console.log('will delete',arr);
    for( let i=arr.length-1; i>=0; i--) {
        if(arr[i].id == item.id) arr.splice(i,1);
    }
    console.log('did delete workImages',arr);
    let updatedData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.setState({
      dataSource:updatedData.cloneWithRows(arr)
    });

    if(item.isVideo==false){
      this.setState({ maxNumberOfImages: (this.state.maxNumberOfImages+1)  });
    }else {
      this.setState({ maxNumberOfVideos: 1 });
    }
  }

  // Function render images and video list and deletes them on long press
  renderImageList(item){
    if(item.isVideo==true){
      return(
        <TouchableOpacity onLongPress ={(e)=>{ this.deleteItemFromDataSource(item) }} >
            <Image
              style={{
              height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              marginLeft:Constants.BaseStyle.DEVICE_HEIGHT*2/100}}
              source={{ uri : item.path }}
              >
              <Image
                  style={{
                    height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
                    width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
                  }}
                  source={Constants.Images.caterer.right_arrow }
                />
           </Image>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity onLongPress ={(e)=>{ this.deleteItemFromDataSource(item) }} >
        <Image
          style={{
          height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
          width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
          marginLeft:Constants.BaseStyle.DEVICE_HEIGHT*2/100}}
          source={{ uri : item.path }}
        />
     </TouchableOpacity>
   );
  }

  // Default render function
  render() {
    let { goBack } = this.props.navigation;

    let {
      workHistory,
      workHistoryPlaceHolder,

      bankDetails,
      skip,
      TnCText,
      TnCLink
    } = Constants.i18n.signup;

    let {
      cateringType,

      eventCatering,
      costPerPerson,
      minGuestCount,
      maxGuestCount,

      dropOffCatering,
      deliveryFees,

      pickup,
      daysOpenOn,
      timeOpenOn,
      from,
      to,
    } = Constants.i18n.signupCaterer;

    let context = this;

    return (
      <Background isFaded={true}>
        <BackButton title={"Step 4 of 4"} containerStyle={{height:44}} onPress={()=>goBack()} />
        <View style={styles.mainView}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always'>
            <KeyboardAvoidingView behavior='padding'>
              <View style={styles.container}>
                <View
                  style={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    borderBottomWidth: 1,
                    borderBottomColor: Constants.Colors.Gray,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
                  }}
                >

                  <Text style={styles.headerText}>
                    {cateringType}
                  </Text>

                  <CircularCheckbox
                    isChecked={this.state.eventCateringEnable}
                    label={eventCatering}
                    onClick={this.checkEventCatering}
                  />

                    {
                      this.state.eventCateringEnable &&
                      <View style={{width:Constants.BaseStyle.DEVICE_WIDTH, paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', }}>
                          <Text style={{flex: 1, color: Constants.Colors.White}}>{costPerPerson} :</Text>
                          <View
                            style={{flex: 2, height: Constants.BaseStyle.DEVICE_HEIGHT*5/100, borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,}}
                          >
                            <TextInput
                              style={{
                                ...Constants.Fonts.tinyLarge,
                                color: Constants.Colors.White,
                                height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                              }}
                              keyboardType='numeric'
                              onChangeText={(costPerPerson) => this.setState({costPerPerson})}
                              value={this.state.costPerPerson}
                            />
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{flex: 1, color: Constants.Colors.White}}>{maxGuestCount} :</Text>
                          <View
                            style={{flex: 2, height: Constants.BaseStyle.DEVICE_HEIGHT*5/100, borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,}}
                          >
                            <TextInput
                              style={{
                                ...Constants.Fonts.tinyLarge,
                                color: Constants.Colors.White,
                                height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                              }}
                              autoFocus={false}
                              keyboardType='numeric'
                              onChangeText={(maxGuestCount) => this.setState({maxGuestCount})}
                              value={this.state.maxGuestCount}
                            />
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{flex: 1, color: Constants.Colors.White}}>{minGuestCount} : </Text>
                          <View
                            style={{flex: 2, height: Constants.BaseStyle.DEVICE_HEIGHT*5/100, borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,}}
                          >
                            <TextInput
                              style={{
                                ...Constants.Fonts.tinyLarge,
                                color: Constants.Colors.White,
                                height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                              }}
                              autoFocus={false}
                              keyboardType='numeric'
                              onChangeText={(minGuestCount) => this.setState({minGuestCount})}
                              value={this.state.minGuestCount}
                            />
                          </View>
                        </View>
                      </View>
                    }

                  <CircularCheckbox
                    isChecked={this.state.dropOffCateringEnable}
                    label={dropOffCatering}
                    onClick={this.checkDropOffCatering}
                  />
                  {
                    this.state.dropOffCateringEnable &&
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{flex: 1, color: Constants.Colors.White}}>{deliveryFees} :</Text>
                      <View
                        style={{flex: 2, height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,}}
                      >
                        <TextInput
                          style={{
                            ...Constants.Fonts.tinyLarge,
                            color: Constants.Colors.White,
                            height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                          }}
                          autoFocus={false}
                          keyboardType='numeric'
                          onChangeText={(deliveryFees) => this.setState({deliveryFees})}
                          value={this.state.deliveryFees}
                        />
                      </View>
                    </View>
                  }
                  <CircularCheckbox
                    isChecked={this.state.pickupEnable}
                    label={pickup}
                    onClick={this.checkPickup}
                  />
                </View>

                <View
                  style={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={styles.headerText}>{daysOpenOn}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Constants.BaseStyle.DEVICE_HEIGHT*3/100}}>
                    <View style={{
                      flex: 1,
                      borderBottomWidth: 1,
                      borderColor: Constants.Colors.Gray,
                      marginRight: Constants.BaseStyle.DEVICE_WIDTH*2/100
                    }}
                    >
                      <TouchableOpacity
                        onPress={()=>this.showModal("dayFrom")}
                      >
                        <Text
                          style={{
                              ...Constants.Fonts.tinyLarge,
                              color: Constants.Colors.White,
                              textAlign: 'center',
                              padding: Constants.BaseStyle.DEVICE_WIDTH*2/100
                          }}
                        >
                          {context.state.dayFrom}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        borderColor: Constants.Colors.Gray,
                        marginLeft: Constants.BaseStyle.DEVICE_WIDTH*2/100
                      }}
                    >
                      <TouchableOpacity
                        onPress={()=>this.showModal("dayTo")}>
                        <Text
                          style={{
                              ...Constants.Fonts.tinyLarge,
                              color: Constants.Colors.White,
                              textAlign: 'center',
                              padding: Constants.BaseStyle.DEVICE_WIDTH*2/100
                          }}
                        >
                          {context.state.dayTo}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.headerText}>{timeOpenOn}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View
                      style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        borderColor: Constants.Colors.Gray,
                        marginRight: Constants.BaseStyle.DEVICE_WIDTH*2/100
                      }}
                    >
                      <TouchableOpacity
                        onPress={()=>this.showTimePickerModal("timeFrom")}>
                        <Text
                          style={{
                              ...Constants.Fonts.tinyLarge,
                              color: Constants.Colors.White,
                              textAlign: 'center',
                              padding: Constants.BaseStyle.DEVICE_WIDTH*2/100
                          }}
                        >
                          {context.state.timeFrom}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        borderColor: Constants.Colors.Gray,
                        marginLeft: Constants.BaseStyle.DEVICE_WIDTH*2/100
                      }}
                    >
                      <TouchableOpacity
                        onPress={()=>this.showTimePickerModal("timeTo")}
                      >
                        <Text
                          style={{
                              ...Constants.Fonts.tinyLarge,
                              color: Constants.Colors.White,
                              textAlign: 'center',
                              padding: Constants.BaseStyle.DEVICE_WIDTH*2/100
                          }}
                        >
                          {context.state.timeTo}
                        </Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                </View>

                </View>

                <View
                  style={{
                    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Constants.Colors.Gray,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*3/100,
                  }}
                >
                  <Text
                    style={{
                      ...Constants.Fonts.normal,
                      color:Constants.Colors.Gray,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {workHistory}
                  </Text>
                  <View  style={{ flexDirection: 'row', alignSelf: 'stretch', paddingTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100 }} >
                    <TouchableOpacity  onPress={()=> this.openOptionPicker()  } >
                     <Image
                      style={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
                      }}
                      source={Constants.Images.caterer.add_work_image }
                    />
                    </TouchableOpacity>

                    <ListView
                      dataSource= {this.state.dataSource}
                      horizontal={true}
                      enableEmptySections={true}
                      renderRow={(rowData) =>this.renderImageList(rowData)}
                    />

                  </View>
                  <View style={{ flexDirection: 'row', alignSelf: 'stretch', }}>
                  <Text style= { styles.imageVideoSelector}>maximum 3 images and 1 video</Text>
                  </View>
                </View>

              </View>
              <View style={styles.footer}>
                <Text style={styles.grayText}>
                  {TnCText}
                </Text>
                <Text style={styles.greenLinkText}
                  onPress={()=>this.onTermsOfServiceClick()}
                >
                  {TnCLink}
                </Text>
                <Text></Text>

                <RoundButton text="Finish"
                  _Press={()=>this.onFinishClick()}
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
        {
          this.state.open &&
          <ModalDayPicker
            type={this.state.type}
            open={this.state.open}
            onHideModalDayPicker={()=>this.setState({open: !this.state.open})}
            onDayModalValueChange={this.onDayModalValueChange}
          />
        }
        {
          this.state.openTimePicker &&
          <ModalTimePicker
            type={this.state.type}
            openTimePicker={this.state.openTimePicker}
            onHideModalTimePicker={()=>this.setState({openTimePicker: !this.state.openTimePicker})}
            onTimeModalValueChange={this.onTimeModalValueChange}
          />
        }
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Constants.Colors.Transparent
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    alignItems: 'center',
  },
  button: {
    height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    width: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
  },
  greenLinkText: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Green,
    textDecorationLine: 'underline',
  },
  grayText: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Gray,
  },
  headerText: {
    ...Constants.Fonts.normal,
    color:Constants.Colors.Gray,
  },
  imageVideoSelector:{
    color:'white',
    alignSelf:'flex-start',
    fontSize:Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,
    paddingTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100
  }
});
