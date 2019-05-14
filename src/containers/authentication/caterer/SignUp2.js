/*
 * @file: SignUp2.js
 * @description: CatererSignUpStep2
 * @date: 11.07.2017
 * @author: Vishal Kumar
 * */

'use strict';
import React, { Component } from 'react';
import ReactNative , {
  findNodeHandle,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ActionSheetIOS,
  Platform
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
import * as LocationActions from '../../../redux/modules/location';

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
      describeYourself: '',
      userImage : null
    }
  }

  // Function opens option menu for uploading profile picture
  openOptionPicker() {
    let context = this;
    let BUTTONS = [
      'Open Photo Gallery',
      'Open Camera',
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
        context.openPhotoGallery();
      }else if(index===1){
        context.openCamera();
      }
    });
  }

  // Function open gallery for selecting profile picture
  openPhotoGallery(){
    let context = this;
    ImagePicker.openPicker({
      cropping:true,
      cropperCircleOverlay:true,
      showCropGuidelines :false
    }).then(images => {
      let source=null;
      if (Platform.OS === 'ios') {
          source = {uri: images.path.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: images.path, isStatic: true};
        }
        context.setState({
          userImage: source
        });
        console.log("source ", source,images)
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
  openCamera(){
    let context=this;
    ImagePicker.openCamera({
      cropping : true,
      cropperCircleOverlay : true,
      showCropGuidelines :false
    }).then(images => {
      let source=null;
      if (Platform.OS === 'ios') {
          source = {uri: images.path.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: images.path, isStatic: true};
        }
        context.setState({
          userImage: source
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
    let { fullName, fullAddress, describeYourself } = this.state;
    let { enterFullName, enterFullAddress, description, enterDescription, enterValidFullName } = Constants.i18n.signup;

    let { navigate, dispatch } = this.props.navigation;

    if(_.isEmpty(fullName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterFullName));
      return;
    }

    if(!Regex.validateString(fullName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidFullName));
      return;
    }

    if((fullAddress.trim() === "") || (fullAddress.trim() === enterFullAddress)) {
      dispatch(ToastActionsCreators.displayInfo(enterFullAddress));
      return;
    }

    let position = this.props.location.currentLocation.position;

    navigate('CatererSignUpStep3', {
      fullName: this.state.fullName,
      describeYourself: this.state.describeYourself,
      profilePic: this.state.userImage,
      position: {...position, address: this.state.fullAddress}
    });
  }

  // Keyboard Handling
  _handleScrollView(ref) {
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
        0, //(Screen.height/100) * 50, //additionalOffset
        true
      );
    }, 100);
  }

  // Default render function
  render() {
    let { enterFullName, enterFullAddress, description, enterDescription, enterValidDescription } = Constants.i18n.signup;
    let { fullName, fullAddress } = Constants.i18n.common;
    let { goBack } = this.props.navigation;
    return (
      <Background isFaded={true}>
        <BackButton title={"Step 2 of 4"} containerStyle={{height:44}} onPress={()=>goBack()} />
        <View style={styles.mainView}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' ref='mainScrollView'>
              <TouchableOpacity onPress={()=>this.openOptionPicker()} hitSlop={{top:15,bottom:15,right:15,left:15}} style={[styles.imageContainer]}>
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
                  returnKey='next'
                  SubmitEditing={(event) => {this.refs.description.focus();}}
                  onChangeText={(fullName)=>this.setState({fullName})}
                />

                <AddressField
                  viewStyle={{
                    alignItems: 'center',
                  }}

                  headerText={fullAddress}
                  placeHolderText={enterFullAddress}
                  placeHolderColor={Constants.Colors.White}
                  SubmitEditing={(event) => this.onNextClick()}
                  onChangeText={(fullAddress)=>this.setState({fullAddress})}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.fullAddress));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.fullAddress));}}
                  dataText={this.props.location}
                  _onPress={()=>{
                    this.props.navigation.navigate('Location');
                  }}
                />

                <InputField
                  ref='description'
                  autoFocus={false}
                  headerText={description}
                  multiline={true}
                  placeHolderText={enterDescription}
                  placeHolderColor={Constants.Colors.White}
                  secureText={false}
                  returnKey='next'
                  SubmitEditing={ (event) => this.onNextClick() }
                  onChangeText={(describeYourself)=>this.setState({describeYourself})}
                  onChange={(event) => {
                    this.setState({
                      height: event.nativeEvent.contentSize.height,
                    });
                  }}
                  inputStyle={{height: Math.max(35, this.state.height)}}
                  onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.description));}}
                  onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.description));}}
                />

              </View>
              <View style={styles.footer}>
                <RoundButton text="Next"
                  _Press={()=>this.onNextClick()}
                />
              </View>
          </ScrollView>
        </View>

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
    alignItems: 'center',
    //borderWidth: 2,
  },
  footer: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*10/100,
    alignItems: 'center',
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
    borderRadius:Constants.BaseStyle.DEVICE_WIDTH*10/100,
  }
});

const mapStateToProps = (state)=>({
   location: state.location
});

const mapDispatchToProps = dispatch => ({
    LocationActions: bindActionCreators(LocationActions, dispatch)
});

ReactMixin(SignUp2.prototype, TimerMixin);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp2);
