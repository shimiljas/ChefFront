/*
 * @file: SignUp2.js
 * @description: Consumer second signup screen
 * @date: 13.07.2017
 * @author: Vishal Kumar
 * */

'use strict';

import React, { Component } from 'react';
import ReactNative,{
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
  StatusBar
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import _ from 'lodash';
import Constants from '../../../constants';
import Background from '../../../components/common/Background';
import RoundButton from '../../../components/common/RoundButton';
import InputField from '../../../components/common/InputField';
import AddressField from '../../../components/common/AddressField';
import Location from '../../../components/common/Location';
import BackButton  from "../../../components/common/BackButton";
import { ToastActionsCreators } from 'react-native-redux-toast';
import Regex from '../../../utilities/Regex';
import { locationSelector } from '../../../utilities/Selectors';
import ImagePicker from 'react-native-image-crop-picker';
import TagInput from 'react-native-tag-input';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as locationActions from '../../../redux/modules/location';
import * as userActions from '../../../redux/modules/user';
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
    this.navigation = this.props.navigation;

    this.state= {
      fullName: '',
      fullAddress: this.props.userLocation?this.props.userLocation.address:"Please enable you location",
      lat: 0,
      lng: 0,
      favouriteFoods: [],
      imageUrl: '',
      userImage: null,
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

  openPhotoGallery(){
    let context = this;
    ImagePicker.openPicker({
      cropping:true,
      cropperCircleOverlay:true,
      showCropGuidelines :false,
    }).then(images => {
      let source = {uri: images.path, isStatic: true};
      context.props.userActions.uploadImages([images],function(data){
        context.setState({
          userImage : source,
          imageUrl  : data[0]._id
        });
      }); 
    }).catch(e => {
      if(e.code==="ERROR_PICKER_NO_CAMERA_PERMISSION"){
        context.navigation.dispatch(ToastActionsCreators.displayInfo("Cannot access camera. Please allow access if you want to be able to click images."));
        return;
      }
      if(e.code==="ERROR_PICKER_UNAUTHORIZED_KEY"){
        context.navigation.dispatch(ToastActionsCreators.displayInfo("Cannot access images. Please allow access if you want to be able to select images."));
        return;
      }
    });
  }

  openCamera() {
    let context = this;
    ImagePicker.openCamera({
      cropping : true,
      cropperCircleOverlay : true,
      showCropGuidelines :false,
      multiple:true,
      maxFiles:1,
    }).then(images => {
      let source = {uri: images.path, isStatic: true};
      context.props.userActions.uploadImages([images],function(data) {
        context.setState({
          userImage : source,
          imageUrl  : data[0]._id
        });
      });
    }).catch(e => {
      if(e.code==="ERROR_PICKER_NO_CAMERA_PERMISSION"){
        context.navigation.dispatch(ToastActionsCreators.displayInfo("Cannot access camera. Please allow access if you want to be able to click images."));
        return;
      }
      if(e.code==="ERROR_PICKER_UNAUTHORIZED_KEY"){
        context.navigation.dispatch(ToastActionsCreators.displayInfo("Cannot access images. Please allow access if you want to be able to select images."));
        return;
      }
    });
  }

  onChangeFavFood = (favouriteFoods) => {
    this.setState({
      favouriteFoods: favouriteFoods
    });
  }

  onFinishClick() {
    let { navigate } = this.props.navigation, userLocation={};
    let { fullName, fullAddress, favouriteFoods } = this.state;
    let { dispatch } = this.props.navigation;
    let { enterFullName, enterFullAddress, enterFavouriteFoods, enterValidFullName } = Constants.i18n.signup;

    if(_.isEmpty(fullName.trim())) {
      this.navigation.dispatch(ToastActionsCreators.displayInfo(enterFullName));
      return;
    }
    if(Regex.validateEmoji(fullName.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidFullName));
      return;
    }

    if(!Regex.validateString(fullName.trim())) {
      this.navigation.dispatch(ToastActionsCreators.displayInfo(enterValidFullName));
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

    this.props.userActions.consumerSignup({
      ...this.state,...this.props.navigation.state.params,...userLocation
    });
  }

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

  render() {
    let { enterFullName, enterFullAddress, enterFavouriteFoods } = Constants.i18n.signup;
    let { fullName, fullAddress, favouriteFoods } = Constants.i18n.common;
    let { goBack } = this.props.navigation;

    return (
      <Background isFaded={true}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.Colors.LightGreen}
        />
        <BackButton title={"Step 2 of 2"} containerStyle={{height:44}} onPress={()=>goBack()} />
        <View style={styles.mainView}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' ref='mainScrollView'>
            <KeyboardAvoidingView behavior="padding">
              <TouchableOpacity onPress={()=>this.showActionSheet()} hitSlop={{top:15,bottom:15,right:15,left:15}} style={[styles.imageContainer]}>
                <Image
                  style={styles.imageStyle}
                  source={this.state.userImage?this.state.userImage:Constants.Images.caterer.add_image}
                />
              </TouchableOpacity>
              <View style={[styles.container]}>

                <InputField
                  ref='fullName'
                  autoFocus={true}
                  headerText={fullName}
                  placeHolderText={enterFullName}
                  placeHolderColor={Constants.Colors.White}
                  secureText={false}
                  returnKey='next'
                  SubmitEditing={(event) => {this.refs.favouriteFoods.focus();}}
                  onChangeText={(fullName)=>this.setState({fullName})}
                />

                <AddressField
                  headerStyle={{alignSelf:"center"}}
                  headerText={fullAddress}
                  placeHolderText={enterFullAddress}
                  placeHolderColor={Constants.Colors.White}
                  dataText={this.props.location}
                  _onPress={()=>{
                    this.props.navigation.navigate('Location');
                  }}
                />

                <View
                  style={styles.favFoodContainer}
                >
                  <Text style={styles.headerStyle}>
                    {favouriteFoods}
                  </Text>
                  <TagInput
                    ref="favouriteFoods"
                    onFocus={()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.favouriteFoods));}}
                    onBlur={()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.favouriteFoods));}}
                    value={this.state.favouriteFoods}
                    onChange={this.onChangeFavFood}
                    placeholderText={this.state.favouriteFoods.length>0?"":"Enter here"}
                    alertText={"Enter a valid favourite food."}
                    tagColor="transparent"
                    tagTextColor={Constants.Colors.White}
                    inputColor={Constants.Colors.White}
                    tagTextStyle={{
                      ...Constants.Fonts.normal,
                    }}
                    placeholderTextColor={Constants.Colors.White}
                  />
                </View>

              </View>
              <View style={styles.footer}>
                <RoundButton text="Finish"
                  _Press={()=>this.onFinishClick()}
                />
              </View>
            </KeyboardAvoidingView>
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
    flex:1
  },
  footer: {
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
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
  },
  favFoodContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: Constants.Colors.Gray,
    borderBottomWidth: 0.5,
    paddingHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100
  },
  headerStyle:{
    ...Constants.Fonts.normal,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    color:Constants.Colors.Gray,
    backgroundColor: 'transparent'
  }
});

ReactMixin(SignUp2.prototype, TimerMixin);

const mapStateToProps = state => ({
  location: state.location
})

const mapDispatchToProps = dispatch => ({
  LocationActions: bindActionCreators(locationActions, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp2);
