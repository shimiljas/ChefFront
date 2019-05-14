/*
 * @file: ViewProfile.js
 * @description: Chef can view profile of their profile.
 * @date: 18.07.2017
 * @author: Vishal Kumar
 * */

'use-strict';
import React, { Component } from 'react';
import { ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ListView,
  ActionSheetIOS,
  Platform,
  findNodeHandle,
  KeyboardAvoidingView
} from 'react-native';

import Connection from "../../../config/Connection";
import Constants from "../../../constants";
import Regex from '../../../utilities/Regex';
import Avatar from "../../../components/common/Avatar";
import StarRating from '../../../components/common/StarRating';
import RoundButton from "../../../components/common/RoundButton";
import Reviews from "../../../components/bookings/Reviews";
import TextField from '../../../components/common/TextField';
import InputField2 from '../../../components/common/InputField2';
import BackButton from "../../../components/common/BackButton";
import EditButton  from "../../../components/common/EditButton";
import Switch from '../../../components/common/Switch';
import AddressField from '../../../components/common/AddressField';
import MealsSupportedCheckboxes from '../../../components/common/MealsSupportedCheckboxes';
import TypesOfDietChef from '../../../components/common/TypesOfDietChef';
import NavigationBar from "react-native-navbar"
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../../redux/modules/user';
import TagInput from 'react-native-tag-input';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import ImagePicker from 'react-native-image-crop-picker';
import ThumbnailGenerator from 'react-native-thumbnail';
import { ToastActionsCreators } from 'react-native-redux-toast';
import * as locationActions from '../../../redux/modules/location';

let inputFieldProperties = {
  autoFocus: true,
  keyboardType: 'default'
}

const mealsSupportedArray = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  EVENINGSNACKS: 'Evening Snacks',
  DINNER: 'Dinner',
};

class EditProfile extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state={
      img: this.props.user.userDetails.profilePic,
      name: this.props.user.userDetails.fullName.capitalizeEachLetter(),
      email: this.props.user.userDetails.email,
      address: this.props.user.userDetails.position.address,
      mobileNumber: this.props.user.userDetails.phoneNum.toString(),
      rating: 4.5,
      ratePerHour: this.props.user.userDetails.ratePerHour.toString(),
      expInYears: this.props.user.userDetails.expInYears.toString(),
      milesWillingToTravel: this.props.user.userDetails.milesToTravel.toString(),
      
      breakfastArray: this.props.user.userDetails.mealsSupported.breakfastArray,
      lunchArray: this.props.user.userDetails.mealsSupported.lunchArray,
      eveningSnacksArray: this.props.user.userDetails.mealsSupported.eveningSnacksArray,
      dinnerArray: this.props.user.userDetails.mealsSupported.dinnerArray,
      
      typesOfSpecializedCooking: this.props.user.userDetails.typesOfSpecializedCooking,
      minGuaranteedGuests: this.props.user.userDetails.minGuestCount.toString(),
      maxGuaranteedGuests: this.props.user.userDetails.maxGuestCount.toString(),
      //crimeConvicted: this.props.user.userDetails.criminalCase,
      description: this.props.user.userDetails.describeYourself,
      // workingOnHolidays: false,
      // certifiedExp: '',
      // skillAcquiredFrom: '',
      // loveForCooking: '',
      // facebookAddress: '',
      // instagramAddress: '',
      breakfastChecked: this.props.user.userDetails.mealsSupported.breakfastArray.length > 0 ? true : false,
      breakfastEnable: false,
      lunchChecked: this.props.user.userDetails.mealsSupported.lunchArray.length > 0 ? true : false,
      lunchEnable: false,
      eveningSnacksChecked: this.props.user.userDetails.mealsSupported.eveningSnacksArray.length > 0 ? true : false,
      eveningSnacksEnable: false,
      dinnerChecked: this.props.user.userDetails.mealsSupported.dinnerArray.length > 0 ? true : false,
      dinnerEnable: false,
      mealSelected: mealsSupportedArray.BREAKFAST,
      workImages: [...this.props.user.userDetails.workHistory],
      maxNumberOfImages: 3,
      maxNumberOfVideos: 1,
      dataSource: ds.cloneWithRows([...this.props.user.userDetails.workHistory]),
    }

    this.renderBreakfastTypesOfDiet = this.renderBreakfastTypesOfDiet.bind(this);
    this.renderEveningSnacksTypesOfDiet = this.renderEveningSnacksTypesOfDiet.bind(this);
    this.renderDinnerTypesOfDiet = this.renderDinnerTypesOfDiet.bind(this);
    this.renderLunchTypesOfDiet = this.renderLunchTypesOfDiet.bind(this);
    // this.onTypeOfDietClick = this.onTypeOfDietClick.bind(this);
  }

  componentWillMount() {
    let array = [...this.props.user.userDetails.workHistory];
    let imagesCount = 0, videosCount = 0;

    for(let i = 0; i < array.length; i++) {
      if(array[i].type == "thumbnail") {
        videosCount++;
      } else if(array[i].type == "image") {
        imagesCount++;
      }
    }

    this.setState({
      maxNumberOfImages: parseInt(3-imagesCount),
      maxNumberOfVideos: parseInt(1-videosCount)
    });
  }

  // Function adds or removes cooking specialties
  onChangeOfSpecializedCooking = (typesOfSpecializedCooking) => {
    this.setState({
      typesOfSpecializedCooking: typesOfSpecializedCooking
    });
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

  // Function renders diet selection component for breakfast
  renderBreakfastTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.BREAKFAST,
      breakfastEnable: true,
      lunchEnable: false,
      eveningSnacksEnable: false,
      dinnerEnable: false,
    });
  }

  // Function renders diet selection component for lunch
  renderLunchTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.LUNCH,
      breakfastEnable: false,
      lunchEnable: true,
      eveningSnacksEnable: false,
      dinnerEnable: false,
    });
  }

  // Function renders diet selection component for evening snacks
  renderEveningSnacksTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.EVENINGSNACKS,
      breakfastEnable: false,
      lunchEnable: false,
      eveningSnacksEnable: true,
      dinnerEnable: false,
    });
  }

  // Function renders diet selection component for dinner
  renderDinnerTypesOfDiet() {
    this.setState({
      mealSelected: mealsSupportedArray.DINNER,
      breakfastEnable: false,
      lunchEnable: false,
      eveningSnacksEnable: false,
      dinnerEnable: true,
    });
  }

  // Function adds or removes types of diet for Breakfast
  onChangeTypesOfDietsForBreakfast = (breakfastArray) => {
    this.setState({
      breakfastArray: breakfastArray,
      breakfastChecked: breakfastArray.length > 0 ? true : false
    });
  };

  // Function adds or removes types of diet for Lunch
  onChangeTypesOfDietsForLunch = (lunchArray) => {
    this.setState({
      lunchArray: lunchArray,
      lunchChecked: lunchArray.length > 0 ? true : false
    });
  };

  // Function adds or removes types of diet for Evening Snacks
  onChangeTypesOfDietsForEveningSnacks = (eveningSnacksArray) => {
    this.setState({
      eveningSnacksArray: eveningSnacksArray,
      eveningSnacksChecked: eveningSnacksArray.length > 0 ? true : false
    });
  };

  // Function adds or removes types of diet for Dinner
  onChangeTypesOfDietsForDinner = (dinnerArray) => {
    this.setState({
      dinnerArray: dinnerArray,
      dinnerChecked: dinnerArray.length > 0 ? true : false
    });
  };

  // Function enables selecting types of diet
  // onTypeOfDietClick(diet) {
  //   let array = [];
  //   switch(this.state.mealSelected) {
  //     case mealsSupportedArray.BREAKFAST:
  //       array = [...this.state.breakfastArray];
  //       break;
  //     case mealsSupportedArray.LUNCH:
  //       array = [...this.state.lunchArray];
  //       break;
  //     case mealsSupportedArray.EVENINGSNACKS:
  //       array = [...this.state.eveningSnacksArray];
  //       break;
  //     case mealsSupportedArray.DINNER:
  //       array = [...this.state.dinnerArray];
  //       break;
  //   }

  //   let index = array.indexOf(diet);
  //   if(index == -1) {
  //     array.push(diet);
  //   } else {
  //     array.splice(index, 1);      
  //   }
  //   let checked = array.length > 0 ? true : false;

  //   switch(this.state.mealSelected) {
  //     case mealsSupportedArray.BREAKFAST:
  //       this.setState({
  //         breakfastChecked: checked,
  //         breakfastArray: array,
  //       });
  //     break;
  //     case mealsSupportedArray.LUNCH:
  //       this.setState({
  //         lunchChecked: checked,
  //         lunchArray: array,
  //       });
  //     break;
  //     case mealsSupportedArray.EVENINGSNACKS:
  //       this.setState({
  //         eveningSnacksChecked: checked,
  //         eveningSnacksArray: array,
  //       });
  //     break;
  //     case mealsSupportedArray.DINNER:
  //       this.setState({
  //         dinnerChecked: checked,
  //         dinnerArray: array,
  //       });
  //     break;
  //   }
  // }

  // Opens option for uploading photos and videos
  openOptionPicker() {
    let { navigate, dispatch } = this.props.navigation;
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
        if(arr>0){
          context.openPhotoGallery();
        } else {
          dispatch(ToastActionsCreators.displayInfo("You can't upload more than 3 images. Long press to delete images."));
        }
      }else if(index===1){
        if(this.state.maxNumberOfVideos>0){
          context.openVideoGallery();
        }else {
          dispatch(ToastActionsCreators.displayInfo("You can't upload more than 1 video. Long press to delete the current video."));
        }
      }
    });
  }

  // Function render images and video list
  renderImageList(item){
    if(item.type == "thumbnail"){
      return(
        <TouchableOpacity onLongPress ={(e)=>{ this.deleteItemFromDataSource(item) }} >
          <Image
            style={{
              justifyContent:"center",
              alignItems:"center",
              height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              marginRight:Constants.BaseStyle.DEVICE_WIDTH*2/100,
              backgroundColor: Constants.Colors.GhostWhite,
            }}
            source={{uri : Connection.getMedia(item._id)}}
          >
            <Image
              style={{
                alignSelf:"center",
                height: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
                width: Constants.BaseStyle.DEVICE_HEIGHT*4/100,
              }}
              source={Constants.Images.user.play_icon}
            />
           </Image>
        </TouchableOpacity>
      )
    } else if(item.type == "image") {
      return (
        <TouchableOpacity onLongPress ={(e)=>{ this.deleteItemFromDataSource(item) }} >
          <Image
            style={{
              height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              marginRight:Constants.BaseStyle.DEVICE_WIDTH*2/100,
              backgroundColor: Constants.Colors.GhostWhite,
            }}
            source={{ uri : Connection.getMedia(item._id) }}  
          />
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }

  // Function opens photo gallery for capturing images for uploading
  openPhotoGallery(){
    let { dispatch } = this.props.navigation;
    let context = this;
    let arr = context.state.workImages;
    let customArray={};
    
    ImagePicker.openPicker({
      showCropGuidelines: false,
      multiple: true,
      maxFiles: context.state.maxNumberOfImages,
      mediaType: "photo"
    }).then(images => {
      let newImages = [];
      for (let item of images) {
        item.id = Math.random();
        item.isVideo = false;
        newImages.push(item);
      }
     
      context.props.userActions.uploadImages(newImages, function(data) {
        let newImages = _.map(data,function(image) {
          let type = "image";
          if(image.url.includes("video")){
            type = "video";
          }
          if(image.url.includes("thumbnail")){
            type = "thumbnail";
          }
          return { _id:image._id, type:type };
        });

        let finalWorkHistory = [...newImages, ...arr];

        context.setState({
          workImages: finalWorkHistory,
          dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(finalWorkHistory),
          maxNumberOfImages: 3-finalWorkHistory.length
        });
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
      showCropGuidelines: false,
      maxFiles: this.state.maxNumberOfVideos,
      mediaType: "video"
    }).then(images => {
      let source = {uri: images.path.replace('file://', ''), isStatic: true};

      ThumbnailGenerator.get(source.uri).then((result) => {

        let video = [{
          isVideo: true,
          id: Math.random(),
          videoPath: images.path,
          path: result.path
        }];

        context.props.userActions.uploadImages(video, function(data) {
          let arr = _.map(data,function(video) {
            let type = "video";
            if(video.url.includes("image")){
              type = "image";
            }
            if(video.url.includes("thumbnail")){
              type = "thumbnail";
            }
            return { _id: video._id, type: type };
          });

          let finalWorkHistory = [...context.state.workImages, ...arr];

          context.setState({
            workImages: finalWorkHistory,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(finalWorkHistory),
            maxNumberOfVideos: 0
          });

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
    let arr = this.state.workImages;
    let context = this;

    for(let i=0; i<arr.length; i++) {
      if(arr[i] == item) {
        arr.splice(i, 1);
        break;
      }
    }

    if(item.type == "thumbnail") {
      for(let i=0; i<arr.length; i++) {
        if(arr[i].type == "video") {
          arr.splice(i, 1);
          break;
        }
      }
    }

    if(item.type == "image") {
      context.setState({
        maxNumberOfImages: (context.state.maxNumberOfImages+1),
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(arr),
        workImages: arr
      });
    } else {
      context.setState({
        maxNumberOfVideos: 1,
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(arr),
        workImages: arr
      });
    }
  }
  
  // Save changes
  onSubmit() {
    let { dispatch } = this.props.navigation;

    let {
      ratePerHour,
      expInYears,
      milesWillingToTravel,
      breakfastEnable,
      data,
      typesOfSpecializedCooking,
      breakfastChecked,
      dinnerChecked,
      eveningSnacksChecked,
      lunchChecked,
      minGuaranteedGuests,
      maxGuaranteedGuests,
      description
    } = this.state;

    let {
      enterExperienceInYears,
      enterValidExperienceInYears,
    } = Constants.i18n.signup;

    let {
      enterRatePerHour,
      enterValidRatePerHour,
      enterMilesWillingToTravel,
      enterValidMilesWillingToTravel,
      selectMeal,
      enterMinGuaranteedGuests,
      enterValidMinGuaranteedGuests,
      enterMaxGuaranteedGuests,
      enterValidMaxGuaranteedGuests,
      enterDescription,
      enterSpecializedCooking
    } = Constants.i18n.signupChef;

    ratePerHour=(ratePerHour.replace('$','')).trim();
    if(_.isEmpty(ratePerHour.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterRatePerHour));
      return;
    }
    if(parseFloat(ratePerHour) <= 0) {
      dispatch(ToastActionsCreators.displayInfo('Rate should be more than 0'));
      return;
    }
    if(!Regex.validatePrice(ratePerHour.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidRatePerHour));
      return;
    }

    if(_.isEmpty(expInYears.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterExperienceInYears));
      return;
    }
    if(!Regex.validateNumbers(expInYears.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidExperienceInYears));
      return;
    }

    if(_.isEmpty(milesWillingToTravel.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterMilesWillingToTravel));
      return;
    }
     if(parseFloat(milesWillingToTravel.trim()) <= 0) {
      dispatch(ToastActionsCreators.displayInfo('Miles should be more than 0'));
      return;
    }
    if(!Regex.validateDecimalNumbers(milesWillingToTravel.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMilesWillingToTravel));
      return;
    }

    if(!(breakfastChecked || dinnerChecked || eveningSnacksChecked || lunchChecked)) {
      dispatch(ToastActionsCreators.displayInfo(selectMeal));
      return;
    }

    if(_.isEmpty(minGuaranteedGuests.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterMinGuaranteedGuests));
      return;
    }
    if(!Regex.validateNumbers(minGuaranteedGuests.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMinGuaranteedGuests));
      return;
    }
    if(parseInt(minGuaranteedGuests) <= 0) {
       dispatch(ToastActionsCreators.displayInfo("Minimum guest count should be greater than 0"));
      return;
    }

    if(_.isEmpty(maxGuaranteedGuests.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterMaxGuaranteedGuests));
      return;
    }
    if(parseInt(maxGuaranteedGuests) <= 0) {
      dispatch(ToastActionsCreators.displayInfo("Maximum guest count should be greater than 0"));
      return;
    }
    if(!Regex.validateNumbers(maxGuaranteedGuests.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMaxGuaranteedGuests));
      return;
    }

    if(parseInt(minGuaranteedGuests) > parseInt(maxGuaranteedGuests)) {
      dispatch(ToastActionsCreators.displayInfo("Minimum guest count should be less than maximum guest count"));
      return;
    }

    let position = {};

    if(!this.props.location.selectedLocation) {
      position = this.props.user.userDetails.position;
    }
    if(this.props.location.selectedLocation) {
      position.lat = this.props.location.selectedLocation.position?this.props.location.selectedLocation.position.lat:this.props.location.selectedLocation.geometry.location.lat;
      position.long = this.props.location.selectedLocation.position?this.props.location.selectedLocation.position.lng:this.props.location.selectedLocation.geometry.location.lng;
      position.address  = this.props.location.selectedLocation.formatted_address?this.props.location.selectedLocation.formatted_address:this.props.location.selectedLocation.formattedAddress;
    }

    this.props.userActions.chefEditProfile({
      token: this.props.user.userDetails.auth.token,
      userId: this.props.user.userDetails.userId,
      position,
      ratePerHour: this.state.ratePerHour,
      expInYears: this.state.expInYears,
      milesToTravel: this.state.milesWillingToTravel,
      mealsSupported: {
        breakfastArray: this.state.breakfastArray,
        lunchArray: this.state.lunchArray,
        eveningSnacksArray: this.state.eveningSnacksArray,
        dinnerArray: this.state.dinnerArray
      },
      typesOfSpecializedCooking: this.state.typesOfSpecializedCooking,
      minGuestCount: this.state.minGuaranteedGuests,
      maxGuestCount: this.state.maxGuaranteedGuests,
      //criminalCase: this.state.crimeConvicted,
      describeYourself: this.state.description,
      workHistory: this.state.workImages
    });
  }

  // Default render function
  render() {
    
    let { goBack, navigate } = this.props.navigation;
    let {
      fullAddress,
    } = Constants.i18n.common;

    let {
      price,
      service,
      reviews,
      viewFullProfile
    } = Constants.i18n.bookings;

    let {
      addDetail,
      email,
      mobileNumber,
      anyCertifiedExpInCooking,
      whereTheSkillsAcquiredFrom,
      whyYouLoveToCook,
      doYouWorkOnHolidays,
      facebookAddress,
      instagramAddress,
    } = Constants.i18n.profile;

    let {
      ratePerHour,
      enterRatePerHour,
      milesWillingToTravel,
      typesOfDiet,
      specializedCooking,
      minGuaranteedGuests,
      maxGuaranteedGuests
    } = Constants.i18n.signupChef;

    let {
      experienceInYears,
      enterExperienceInYears,
      mealsSupported,
      description,
      crimeConvicted,
      workHistory,
      workHistoryPlaceHolder,
      enterFullAddress
    } = Constants.i18n.signup;

    let {
      breakfastArray, lunchArray, eveningSnacksArray, dinnerArray
    } = this.state;
    let typesOfDietData = "";
    for (let i = 0; i < breakfastArray.length; i++) {
      typesOfDietData += breakfastArray[i] + "(Breakfast), "
    }
    for (let i = 0; i < lunchArray.length; i++) {
      typesOfDietData += lunchArray[i] + "(Lunch), "
    }
    for (let i = 0; i < eveningSnacksArray.length; i++) {
      typesOfDietData += eveningSnacksArray[i] + "(Evening snacks), "
    }
    for (let i = 0; i < dinnerArray.length; i++) {
      typesOfDietData += dinnerArray[i] + "(Dinner), "
    }

    let mealsSupportedData = (this.state.breakfastArray.length > 0 ? "Breakfast, " : "") +
                      (this.state.lunchArray.length > 0 ? "Lunch, " : "") +
                      (this.state.eveningSnacksArray.length > 0 ? "Evening snacks, " : "") +
                      (this.state.dinnerArray.length > 0 ? " Dinner, " : "");

    return (
      <View style={styles.mainView}>
        <NavigationBar
          leftButton={<BackButton 
            onPress={ ()=>{
              this.props.locationActions.selectLocation(null);;
              goBack();
            }} />
          }
          rightButton={<EditButton title={"Save"} onPress={()=>this.onSubmit()} />}
        />
          <ScrollView 
            ref="mainScrollView" 
            showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
            keyboardDismissMode={Platform.OS==='ios' ? 'on-drag' : 'interactive'}
            style={styles.container}
          >
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.details}>
                <View style={styles.profile}>
                  <Avatar
                    user ={{profilePic: this.state.img}}
                    placeholderStyle = {styles.placeholderStyle}
                    avatarStyle = {styles.avatarStyle} 
                  />
                  <StarRating
                    style={styles.rating}
                    editable={false}
                    rating={this.state.rating}
                    style={styles.star}
                  />
                </View>
                <View style={{flex: 6, flexDirection: 'column', justifyContent: 'center'}}>
                  <View style={{flex: 1}}>
                    <Text numberOfLines={1} style={styles.name}>
                      {this.state.name.capitalizeEachLetter()}
                    </Text>
                  </View>
                  <View style={{flex: 5}}>
                    <Text numberOfLines={4} style={styles.address}>
                      {this.state.address.capitalizeFirstLetter()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*1/100}}>
                <TextField
                  headerText={email}
                  viewStyle={styles.hideLine}
                  headerStyle={[Constants.Fonts.bold]}
                  dataText={this.state.email}
                />

                <TextField
                  headerText={mobileNumber}
                  viewStyle={styles.hideLine}
                  headerStyle={[Constants.Fonts.bold]}
                  dataText={this.state.mobileNumber}
                />

                <AddressField
                  viewStyle={{
                    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                    borderBottomColor: Constants.Colors.GhostWhite,
                    borderBottomWidth: 1,
                  }}

                  headerStyle={{
                    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    color: Constants.Colors.Black,
                    ...Constants.Fonts.bold
                  }}

                  inputStyle={{
                    color: Constants.Colors.Gray,
                    textAlign: 'left',
                  }}

                  headerText={fullAddress}
                  placeHolderText={enterFullAddress}
                  placeHolderColor={Constants.Colors.Gray}
                  SubmitEditing={(event) => this.onNextClick()}
                  //onChangeText={()=>this.setState({newAddress: this.props.location})}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.fullAddress));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.fullAddress));}}
                  dataText={this.props.location.selectedLocation?this.props.location:this.props.user.userDetails.position}
                  _onPress={()=>{
                    this.props.navigation.navigate('Location');
                    this.setState({newAddress: this.props.location});
                  }}
                />

                <InputField2
                  ref='ratePerHour'
                  headerText={ratePerHour}
                  headerStyle={Constants.Fonts.bold}
                  placeHolderText={enterRatePerHour}
                  value={this.state.ratePerHour.toString()}
                  properties={{
                    autoFocus: false,
                    keyboardType: 'numeric'
                  }}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.ratePerHour));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.ratePerHour));}}
                  onChangeText={(ratePerHour)=>this.setState({ratePerHour})}
                />

                <InputField2
                  ref='experienceInYears'
                  headerText={experienceInYears}
                  headerStyle={Constants.Fonts.bold}
                  placeHolderText={enterExperienceInYears}
                  value={this.state.expInYears.toString()}
                  properties={{
                    keyboardType: 'numeric'
                  }}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.experienceInYears));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.experienceInYears));}}
                  onChangeText={(expInYears)=>this.setState({expInYears})}
                />

                <InputField2
                  ref='milesWillingToTravel'
                  headerText={milesWillingToTravel}
                  headerStyle={Constants.Fonts.bold}
                  placeHolderText={addDetail}
                  value={this.state.milesWillingToTravel.toString()}
                  properties={{
                    keyboardType: 'numeric'
                  }}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.milesWillingToTravel));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.milesWillingToTravel));}}
                  onChangeText={(milesWillingToTravel)=>this.setState({milesWillingToTravel})}
                />

                <MealsSupportedCheckboxes

                  mainView={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                    borderBottomColor: Constants.Colors.GhostWhite,
                    borderBottomWidth: 1,
                  }}

                  headingStyle={{
                    ...Constants.Fonts.bold,
                    color: Constants.Colors.Black,
                    marginVertical: 0,
                  }}

                  checkboxesStyle={{
                  }}

                  breakfastArray={this.state.breakfastArray}
                  lunchArray={this.state.lunchArray}
                  eveningSnacksArray={this.state.eveningSnacksArray}
                  dinnerArray={this.state.dinnerArray}

                  renderBreakfastTypesOfDiet={this.renderBreakfastTypesOfDiet}
                  renderLunchTypesOfDiet={this.renderLunchTypesOfDiet}
                  renderEveningSnacksTypesOfDiet={this.renderEveningSnacksTypesOfDiet}
                  renderDinnerTypesOfDiet={this.renderDinnerTypesOfDiet}
                />

                {
                  this.state.breakfastEnable && 
                  <View style={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                    justifyContent: 'center',
                    borderBottomColor: Constants.Colors.GhostWhite,
                    borderBottomWidth: 1,
                  }}>
                    <Text style={{
                      ...Constants.Fonts.bold,
                      color:Constants.Colors.Black,
                    }}>
                      {typesOfDiet}
                    </Text>

                    <TagInput
                      ref={"typesOfDiets"}
                      autoFocus={false}
                      onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                      onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                      value={this.state.breakfastArray}
                      onChange= { this.onChangeTypesOfDietsForBreakfast }
                      placeholderText={this.state.breakfastArray.length>0?"":"Enter here"}
                      alertText={"Enter a valid type of diet"}
                      tagTextStyle={{
                        ...Constants.Fonts.normal,
                        color: Constants.Colors.Gray
                      }}
                      tagContainerStyle={{
                        borderColor: Constants.Colors.Gray,
                        borderWidth: 1,
                        paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*0.5/100,
                        paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*2/100,

                      }}
                      textInput={{
                        ...Constants.Fonts.normal,
                        color: Constants.Colors.Gray
                      }}
                      placeholderTextColor={Constants.Colors.Gray}
                      tagColor="transparent"
                      tagTextColor={Constants.Colors.Gray}
                      inputColor={Constants.Colors.Gray}
                    />
                  </View>
                }

                {
                  this.state.lunchEnable && 
                  <View style={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                    justifyContent: 'center',
                    borderBottomColor: Constants.Colors.GhostWhite,
                    borderBottomWidth: 1,
                  }}>
                    <Text style={{
                      ...Constants.Fonts.bold,
                      color:Constants.Colors.Black,
                    }}>
                      {typesOfDiet}
                    </Text>

                    <TagInput
                      ref={"typesOfDiets"}
                      autoFocus={false}
                      onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                      onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                      value={this.state.lunchArray}
                      onChange= { this.onChangeTypesOfDietsForLunch }
                      placeholderText={this.state.lunchArray.length>0?"":"Enter here"}
                      alertText={"Enter a valid type of diet"}
                      tagTextStyle={{
                        ...Constants.Fonts.normal,
                        color: Constants.Colors.Gray
                      }}
                      tagContainerStyle={{
                        borderColor: Constants.Colors.Gray,
                        borderWidth: 1,
                        paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*0.5/100,
                        paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*2/100,
                      }}
                      textInput={{
                        ...Constants.Fonts.normal,
                        color: Constants.Colors.Gray
                      }}
                      placeholderTextColor={Constants.Colors.Gray}
                      tagColor="transparent"
                      tagTextColor={Constants.Colors.Gray}
                      inputColor={Constants.Colors.Gray}
                    />
                  </View>
                }

                {
                  this.state.eveningSnacksEnable && 
                  <View style={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                    justifyContent: 'center',
                    borderBottomColor: Constants.Colors.GhostWhite,
                    borderBottomWidth: 1,
                  }}>
                    <Text style={{
                      ...Constants.Fonts.bold,
                      color:Constants.Colors.Black,
                    }}>
                      {typesOfDiet}
                    </Text>

                    <TagInput
                      ref={"typesOfDiets"}
                      autoFocus={false}
                      onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                      onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                      value={this.state.eveningSnacksArray}
                      onChange= { this.onChangeTypesOfDietsForEveningSnacks }
                      placeholderText={this.state.eveningSnacksArray.length>0?"":"Enter here"}
                      alertText={"Enter a valid type of diet"}
                      tagTextStyle={{
                        ...Constants.Fonts.normal,
                        color: Constants.Colors.Gray
                      }}
                      tagContainerStyle={{
                        borderColor: Constants.Colors.Gray,
                        borderWidth: 1,
                        paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*0.5/100,
                        paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*2/100,

                      }}
                      textInput={{
                        ...Constants.Fonts.normal,
                        color: Constants.Colors.Gray
                      }}
                      placeholderTextColor={Constants.Colors.Gray}
                      tagColor="transparent"
                      tagTextColor={Constants.Colors.Gray}
                      inputColor={Constants.Colors.Gray}
                    />
                  </View>
                }

                {
                  this.state.dinnerEnable && 
                  <View style={{
                    paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                    justifyContent: 'center',
                    borderBottomColor: Constants.Colors.GhostWhite,
                    borderBottomWidth: 1,
                  }}>
                    <Text style={{
                      ...Constants.Fonts.bold,
                      color:Constants.Colors.Black,
                    }}>
                      {typesOfDiet}
                    </Text>

                    <TagInput
                      ref={"typesOfDiets"}
                      autoFocus={false}
                      onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                      onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.typesOfDiets));}}
                      value={this.state.dinnerArray}
                      onChange= { this.onChangeTypesOfDietsForDinner }
                      placeholderText={this.state.dinnerArray.length>0?"":"Enter here"}
                      alertText={"Enter a valid type of diet"}
                      tagTextStyle={{
                        ...Constants.Fonts.normal,
                        color: Constants.Colors.Gray
                      }}
                      tagContainerStyle={{
                        borderColor: Constants.Colors.Gray,
                        borderWidth: 1,
                        paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*0.5/100,
                        paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*2/100,

                      }}
                      textInput={{
                        ...Constants.Fonts.normal,
                        color: Constants.Colors.Gray
                      }}
                      placeholderTextColor={Constants.Colors.Gray}
                      tagColor="transparent"
                      tagTextColor={Constants.Colors.Gray}
                      inputColor={Constants.Colors.Gray}
                    />
                  </View>
                }

                {/*
                  this.state.breakfastEnable &&
                  <TypesOfDietChef

                    mainView={{
                      paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                      marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                      borderBottomColor: Constants.Colors.GhostWhite,
                      borderBottomWidth: 1,
                    }}

                    headingStyle={{
                      ...Constants.Fonts.bold,
                      color: Constants.Colors.Black,
                      marginVertical: 0,
                    }}

                    onTypeOfDietClick={this.onTypeOfDietClick}
                    typeOfDietSelectedArray={this.state.breakfastArray}
                  />
                }
                {
                  this.state.lunchEnable &&
                  <TypesOfDietChef

                    mainView={{
                      paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                      marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                      borderBottomColor: Constants.Colors.GhostWhite,
                      borderBottomWidth: 1,
                    }}

                    headingStyle={{
                      ...Constants.Fonts.bold,
                      color: Constants.Colors.Black,
                      marginVertical: 0,
                    }}

                    onTypeOfDietClick={this.onTypeOfDietClick}
                    typeOfDietSelectedArray={this.state.lunchArray}
                  />
                }
                {
                  this.state.eveningSnacksEnable &&
                  <TypesOfDietChef

                    mainView={{
                      paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                      marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                      borderBottomColor: Constants.Colors.GhostWhite,
                      borderBottomWidth: 1,
                    }}

                    headingStyle={{
                      ...Constants.Fonts.bold,
                      color: Constants.Colors.Black,
                      marginVertical: 0,
                    }}

                    onTypeOfDietClick={this.onTypeOfDietClick}
                    typeOfDietSelectedArray={this.state.eveningSnacksArray}
                  />
                }
                {
                  this.state.dinnerEnable &&
                  <TypesOfDietChef

                    mainView={{
                      paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                      marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                      borderBottomColor: Constants.Colors.GhostWhite,
                      borderBottomWidth: 1,
                    }}

                    headingStyle={{
                      ...Constants.Fonts.bold,
                      color: Constants.Colors.Black,
                      marginVertical: 0,
                    }}

                    onTypeOfDietClick={this.onTypeOfDietClick}
                    typeOfDietSelectedArray={this.state.dinnerArray}
                  />
                */}

                <View style={{
                  paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  justifyContent: 'center',
                  borderBottomColor: Constants.Colors.GhostWhite,
                  borderBottomWidth: 1,
                }}>
                  <Text style={{
                    ...Constants.Fonts.bold,
                    color:Constants.Colors.Black,
                  }}>
                    {specializedCooking}
                  </Text>

                  <TagInput
                    ref={"specializedCooking"}
                    onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.specializedCooking));}}
                    onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.specializedCooking));}}
                    value={this.state.typesOfSpecializedCooking}
                    onChange={this.onChangeOfSpecializedCooking}
                    placeholderText={this.state.typesOfSpecializedCooking.length>0?"":"Enter here"}
                    alertText={"Enter a valid specialised cooking"}
                    tagTextStyle={{
                      ...Constants.Fonts.normal,
                      color: Constants.Colors.Gray
                    }}
                    tagContainerStyle={{
                      borderColor: Constants.Colors.Gray,
                      borderWidth: 1,
                      paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*0.5/100,
                      paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*2/100,

                    }}
                    textInput={{
                      ...Constants.Fonts.normal,
                      color: Constants.Colors.Gray
                    }}
                    placeholderTextColor={Constants.Colors.Gray}
                    tagColor="transparent"
                    tagTextColor={Constants.Colors.Gray}
                    inputColor={Constants.Colors.Gray}
                  />
                </View>

                <InputField2
                  ref='minGuaranteedGuests'
                  headerText={minGuaranteedGuests}
                  headerStyle={Constants.Fonts.bold}
                  placeHolderText={addDetail}
                  value={this.state.minGuaranteedGuests.toString()}
                  properties={{
                    keyboardType: 'numeric'
                  }}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.minGuaranteedGuests));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.minGuaranteedGuests));}}
                  onChangeText={(minGuaranteedGuests)=>this.setState({minGuaranteedGuests})}
                />

                <InputField2
                  ref='maxGuaranteedGuests'
                  headerText={maxGuaranteedGuests}
                  placeHolderText={addDetail}
                  headerStyle={Constants.Fonts.bold}
                  value={this.state.maxGuaranteedGuests.toString()}
                  properties={{
                    keyboardType: 'numeric'
                  }}
                  onChangeText={(maxGuaranteedGuests)=>this.setState({maxGuaranteedGuests})}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.maxGuaranteedGuests));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.maxGuaranteedGuests));}}
                />

                {/*<View style={{
                  paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  justifyContent: 'center',
                  borderBottomColor: Constants.Colors.GhostWhite,
                  borderBottomWidth: 1,
                }}>
                  <Text style={{
                    ...Constants.Fonts.bold,
                    color:Constants.Colors.Black,
                  }}>
                    {crimeConvicted}
                  </Text>
                  <Switch
                    properties={{disabled: true}}
                    isSwitchOn={this.state.crimeConvicted}
                    onClick={()=>{
                      this.setState({crimeConvicted: !this.state.crimeConvicted});
                    }}
                    icon={{
                      height: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      width: Constants.BaseStyle.DEVICE_WIDTH*7/100
                    }}
                  />
                </View>*/}

                <InputField2
                  ref='description'
                  headerText={description}
                  multiline={true}
                  headerStyle={Constants.Fonts.bold}
                  dataStyle={{height: Math.max(35, this.state.height)}}
                  placeHolderText={addDetail}
                  value={this.state.description}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.description));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.description));}}
                  onChangeText={(description)=>this.setState({description})}
                />
                
                {/*
                <View style={{
                  paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  justifyContent: 'center',
                  borderBottomColor: Constants.Colors.GhostWhite,
                  borderBottomWidth: 1,
                }}>
                  <Text style={{
                    ...Constants.Fonts.normal,
                    //paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                    color:Constants.Colors.Black,
                    //backgroundColor: 'transparent',
                  }}>
                    {doYouWorkOnHolidays}
                  </Text>
                  <Switch
                    isSwitchOn={this.state.workingOnHolidays}
                    onClick={()=>{
                      this.setState({workingOnHolidays: !this.state.workingOnHolidays});
                    }}
                    icon={{
                      height: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                      width: Constants.BaseStyle.DEVICE_WIDTH*7/100
                    }}
                  />
                </View>

                <InputField2
                  ref='anyCertifiedExpInCooking'
                  headerStyle={Constants.Fonts.bold}
                  headerText={anyCertifiedExpInCooking}
                  placeHolderText={this.state.certifiedExp == "" ? addDetail : this.state.certifiedExp}
                  dataText={this.state.certifiedExp}
                  onChangeText={(certifiedExp)=>this.setState({certifiedExp})}
                />

                <InputField2
                  ref='whereTheSkillsAcquiredFrom'
                  headerText={whereTheSkillsAcquiredFrom}
                  headerStyle={Constants.Fonts.contentBold}
                  placeHolderText={this.state.skillAcquiredFrom == "" ? addDetail : this.state.skillAcquiredFrom}
                  dataText={this.state.skillAcquiredFrom}
                  onChangeText={(skillAcquiredFrom)=>this.setState({skillAcquiredFrom})}
                />

                <InputField2
                  ref='whyYouLoveToCook'
                  headerText={whyYouLoveToCook}
                  headerStyle={Constants.Fonts.bold}
                  placeHolderText={this.state.loveForCooking == "" ? addDetail : this.state.loveForCooking}
                  dataText={this.state.loveForCooking}
                  onChangeText={(loveForCooking)=>this.setState({loveForCooking})}
                />

                <InputField2
                  ref='facebookAddress'
                  headerText={facebookAddress}
                  headerStyle={Constants.Fonts.bold}
                  placeHolderText={this.state.facebookAddress == "" ? addDetail : this.state.facebookAddress}
                  dataText={this.state.facebookAddress}
                  onChangeText={(facebookAddress)=>this.setState({facebookAddress})}
                />

                <InputField2
                  ref='instagramAddress'
                  headerText={instagramAddress}
                  headerStyle={Constants.Fonts.bold}
                  placeHolderText={this.state.instagramAddress == "" ? addDetail : this.state.instagramAddress}
                  dataText={this.state.instagramAddress}
                  onChangeText={(instagramAddress)=>this.setState({instagramAddress})}
                />
                */}

                <View style={{
                  paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                  paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  justifyContent: 'center',
                  borderBottomColor: Constants.Colors.GhostWhite,
                  borderBottomWidth: 1,
                }}>
                  <Text style={{
                    ...Constants.Fonts.bold,
                    color:Constants.Colors.Black,
                  }}>
                    {workHistory}
                  </Text>

                  <View style={{
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    paddingTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100
                  }}>
                    <TouchableOpacity  onPress={()=> this.openOptionPicker()  } >
                      <Image
                        style={{
                          height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
                          width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
                          marginRight: Constants.BaseStyle.DEVICE_WIDTH*2/100
                        }}
                        source={Constants.Images.caterer.add_work_image}
                      />
                    </TouchableOpacity>
                    <ListView
                      dataSource={this.state.dataSource}
                      horizontal={true}
                      enableEmptySections={true}
                      renderRow={(rowData) =>this.renderImageList(rowData)}
                    />
                  </View>

                  <Text style={{
                    ...Constants.Fonts.tinyMedium,
                    color:Constants.Colors.Gray,
                  }}>
                    {workHistoryPlaceHolder}
                  </Text>
                </View>

              </View>
            </KeyboardAvoidingView>
          </ScrollView>

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

  },
  details: {
    flexDirection: 'row',
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT*2/100,
  },
  profile: {
    flex: 3,
    flexDirection: 'column',
  },
  rating: {
    borderWidth: 3
  },
  name: {
    ...Constants.Fonts.contentBold,
    color:Constants.Colors.Black,
  },
  address: {
    flex: 3,
    ...Constants.Fonts.tinyLarge,
    color:Constants.Colors.Gray,
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

  bookNowButtonStyle:{
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    bottom: Constants.BaseStyle.DEVICE_HEIGHT / 100 *2,
    alignSelf:"center",
    borderRadius: null,
  },
  hideLine:{
    borderBottomColor: Constants.Colors.Transparent,
    borderBottomWidth: 0,
  }
});

ReactMixin(EditProfile.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user,
  location: state.location
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
  locationActions: bindActionCreators(locationActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
