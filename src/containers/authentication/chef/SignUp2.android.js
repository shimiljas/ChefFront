/*
 * @file: SignUp2.js
 * @description: ChefSignUpStep2
 * @date: 11.07.2017
 * @author: Vishal Kumar
 * */

'use strict';
import React, { Component } from 'react';
import ReactNative,{
  AppRegistry,
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ActionSheetIOS,
  Platform,
  StatusBar
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import _ from 'lodash';
import Constants from '../../../constants';
import Regex from '../../../utilities/Regex';
import Background from '../../../components/common/Background';
import RoundButton from '../../../components/common/RoundButton';
import InputField from '../../../components/common/InputField';
import AddressField from '../../../components/common/AddressField';
import { ToastActionsCreators } from 'react-native-redux-toast';
import BackButton  from "../../../components/common/BackButton";
import ImagePicker from 'react-native-image-crop-picker';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as locationActions from '../../../redux/modules/location';
import * as userActions from '../../../redux/modules/user';
import { locationSelector } from '../../../utilities/Selectors';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 2;

const options = [
  'Open Photo Gallery',
  'Open Camera',
  'Cancel'
];

class SignUp2 extends Component {
  constructor(props) {
    super(props);

    let dataText = this.props.location;
    let location = '';
    if(dataText) {
      if(dataText.selectedLocation) {
        if(dataText.selectedLocation.description) {
          location = dataText.selectedLocation.description;
        }
      } else if(dataText.currentLocation) {
        if(dataText.currentLocation.formattedAddress) {
          location = dataText.currentLocation.formattedAddress;
        }
      } else {
        location = Constants.i18n.signup.enterFullAddress;
      }
    }

    this.state= {
      fullName: '',
      fullAddress: location,
      userImage : null,
      navProps: this.props.navigation.state.params,
      imageUrl:'',
      selected: ''
    }
    this.handlePress = this.handlePress.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
  }

  // Function opens option menu for uploading profile picture
  showActionSheet() {
    this.ActionSheet.show();
  }

  handlePress(i) {
    let context = this;
    context.setState({
      selected: i
    });

    if(i===0) { 
      context.openPhotoGallery();
    } else if(i===1) {
      context.openCamera();
    }
  }

  // Function open gallery for selecting profile picture
  openPhotoGallery(){
    let context = this;
    ImagePicker.openPicker({
      cropping:true,
      cropperCircleOverlay:true,
      showCropGuidelines :false,
    }).then(images => {
      let source = {uri: images.path.replace('file://', ''), isStatic: true};
      context.props.userActions.uploadImages([images],function(data) {
        context.setState({
          userImage : source,
          imageUrl  : data[0]._id
        });
      });
    }).catch(e => {
      console.log("err ", e)
      if(e.code==="ERROR_PICKER_UNAUTHORIZED_KEY"){
        alert("Cannot access images. Please allow access if you want to be able to select images.");
      }
      if(e.code==="ERROR_PICKER_NO_CAMERA_PERMISSION"){
        alert("Cannot access camera. Please allow access if you want to be able to click images.");
      }
    });
  }

  // Function opens camera for capturing profile picture
  openCamera() {
    let context=this;
    ImagePicker.openCamera({
      cropping : true,
      cropperCircleOverlay : true,
      showCropGuidelines :false,
    }).then(images => {
      let source = {uri: images.path.replace('file://', ''), isStatic: true};
      context.props.userActions.uploadImages([images],function(data) {
        context.setState({
          userImage : source,
          imageUrl  : data[0]._id
        });
      });
    }).catch(e => {
        if(e.code==="ERROR_PICKER_NO_CAMERA_PERMISSION"){
          alert("Cannot access camera. Please allow access if you want to be able to click images.");
        }
        if(e.code==="ERROR_PICKER_UNAUTHORIZED_KEY"){
          alert("Cannot access images. Please allow access if you want to be able to select images.");
        }
    });
  }

  // Function validates all the input and then navigates to ChefSignUpStep3
  onNextClick() {
    let { fullName, fullAddress } = this.state, userLocation = {};
    let { enterFullName, enterFullAddress, enterValidFullName } = Constants.i18n.signup;
    let { navigate, dispatch } = this.props.navigation;
    if(!this.state.userImage) {
      dispatch(ToastActionsCreators.displayInfo('Please select your profile picture.'));
      return;
    }

    if(_.isEmpty(fullName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterFullName));
      return;
    }

    if(Regex.validateEmoji(fullName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidFullName));
      return;
    }

    if(!Regex.validateString(fullName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidFullName));
      return;
    }

    if(!this.props.location.currentLocation && !this.props.location.selectedLocation) {
      this.navigation.dispatch(ToastActionsCreators.displayInfo(enterFullAddress));
      return;
    }

    if(this.props.location.currentLocation && !this.props.location.selectedLocation){
      userLocation.address = this.props.location.currentLocation.formattedAddress;
      userLocation.position = this.props.location.currentLocation.position;
    }

    if(this.props.location.selectedLocation) {
      userLocation.position = this.props.location.selectedLocation.position?this.props.location.selectedLocation.position:this.props.location.selectedLocation.geometry.location;
      userLocation.address  = this.props.location.selectedLocation.formatted_address?this.props.location.selectedLocation.formatted_address:this.props.location.selectedLocation.formattedAddress;
    }

    let { params } = this.props.navigation.state;

    navigate('ChefSignUpStep3', {
      email: params.email,
      password: params.password,
      phoneNum: params.mobile,
      profilePic: this.state.imageUrl,
      fullName: this.state.fullName,
      position: {
        lat : userLocation.position.lat,
        long : userLocation.position.lng,
        address : userLocation.address,
      }
    ,...params});
  }

  // Keyboard Handling
  _handleScrollView(ref) {
      //alert('1');
      let context = this;
      context.setTimeout(() => {
        let scrollResponder = context.refs.mainScrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          ref,
          (Constants.BaseStyle.DEVICE_HEIGHT/100) * 30, //additionalOffset
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

  // Default render function
  render() {
    let context = this ;
    let { enterFullName, enterFullAddress } = Constants.i18n.signup;
    let { fullName, fullAddress } = Constants.i18n.common;
    let { goBack } = this.props.navigation;
    return (
      <Background isFaded={true}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.Colors.LightGreen}
        />
        <BackButton title={"Step 2 of 4"} 
          containerStyle={{height: 44}} 
          onPress={()=>{
            this.props.locationActions.selectLocation(null);
            goBack();
          }} 
        />
        <View style={styles.mainView}>
          <ScrollView 
            showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
            keyboardDismissMode={Platform.OS==='ios' ? 'on-drag' : 'interactive'}
            keyboardShouldPersistTaps='always' 
            ref='mainScrollView'
          >
            <KeyboardAvoidingView behavior="padding">
              <TouchableOpacity onPress={()=>this.showActionSheet()} hitSlop={{top:15,bottom:15,right:15,left:15}} style={[styles.imageContainer]}>
                <Image
                  style={styles.imageStyle}
                  source={this.state.userImage?this.state.userImage:Constants.Images.caterer.add_image}
                />
              </TouchableOpacity>
              <View style={styles.container}>
                <InputField
                  ref='fullName'
                  autoFocus={true}
                  headerText={fullName}
                  placeHolderText={enterFullName}
                  placeHolderColor={Constants.Colors.White}
                  secureText={false}
                  returnKey='done'
                  onChangeText={(fullName)=>this.setState({fullName})}
                />

                <AddressField
                  viewStyle={{
                    alignItems: 'center',
                  }}

                  headerText={fullAddress}
                  placeHolderText={enterFullAddress}
                  placeHolderColor={Constants.Colors.White}
                  dataText={this.props.location}
                  _onPress={()=>{
                    this.props.navigation.navigate('Location');
                  }}
                />

              </View>
            </KeyboardAvoidingView>
            <View style={styles.footer}>
              <RoundButton text="Next"
                _Press={()=>this.onNextClick()}
              />
            </View>
          </ScrollView>
        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title=""
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />
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
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*26/100,
    marginBottom: Platform.OS==="ios" ? 0 : Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    alignItems: 'center'
  },
  imageContainer:{
    height: Constants.BaseStyle.DEVICE_WIDTH*21/100,
    width: Constants.BaseStyle.DEVICE_WIDTH*21/100,
    borderRadius:Constants.BaseStyle.DEVICE_WIDTH*10.5/100,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    alignSelf:'center'
  },
  imageStyle: {
    height: Constants.BaseStyle.DEVICE_WIDTH*20/100,
    width: Constants.BaseStyle.DEVICE_WIDTH*20/100,
    borderRadius:Constants.BaseStyle.DEVICE_WIDTH*10/100
  }
});


const mapStateToProps = state =>({
  location:state.location
})

const mapDispatchToProps = dispatch => ({
  locationActions: bindActionCreators(locationActions, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
});

ReactMixin(SignUp2.prototype, TimerMixin);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp2);
