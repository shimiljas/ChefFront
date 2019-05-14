'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
  findNodeHandle,
  ActionSheetIOS,
  Platform
} from 'react-native';
import _ from 'lodash';
import TagInput from 'react-native-tag-input';
import Constants from '../../../constants';
import Background from '../../../components/common/Background';
import StarRating from '../../../components/common/StarRating';
import AddressField from '../../../components/common/AddressField';
import NavigationBar  from "react-native-navbar"
import BackButton  from "../../../components/common/BackButton";
import EditButton  from "../../../components/common/EditButton";
import TextField from '../../../components/common/TextField';
import Avatar from "../../../components/common/Avatar";
import ImagePicker from 'react-native-image-crop-picker';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../../redux/modules/user';
import * as locationActions from '../../../redux/modules/location';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 2;

const options = [
  'Open Photo Gallery',
  'Open Camera',
  'Cancel'
];

let inputFieldProperties = {
  autoFocus: true,
  keyboardType: 'default'
}

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state={
      favouriteFoods : this.props.user.userDetails.favouriteFoods,
      userImage: null,
      profilePic: this.props.user.userDetails.profilePic,
      selected: ''
    }
    this.handlePress = this.handlePress.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
  }

  onChangeFavFood = (favouriteFoods) => {
    this.setState({
      favouriteFoods: favouriteFoods
    });
  };

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
      showCropGuidelines:false,
    }).then(images => {
      let source = null;
      source = {uri: images.path, isStatic: true};
      context.props.userActions.uploadImages([images],function(data){
        context.setState({
          userImage : source,
          profilePic  : data[0]._id
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
  openCamera(){
    let context=this;
    ImagePicker.openCamera({
      cropping : true,
      cropperCircleOverlay : true,
      showCropGuidelines :false,
    }).then(images => {
      let source = {uri: images.path, isStatic: true};
      context.props.userActions.uploadImages([images],function(data){
        context.setState({
          userImage : source,
          profilePic  : data[0]._id
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

  // Save changes
  onSubmit() {
    let position = {};

    if(!this.props.location.selectedLocation) {
      position = this.props.user.userDetails.position;
    }
    if(this.props.location.selectedLocation) {
      position.lat = this.props.location.selectedLocation.position?this.props.location.selectedLocation.position.lat:this.props.location.selectedLocation.geometry.location.lat;
      position.long = this.props.location.selectedLocation.position?this.props.location.selectedLocation.position.lng:this.props.location.selectedLocation.geometry.location.lng;
      position.address  = this.props.location.selectedLocation.formatted_address?this.props.location.selectedLocation.formatted_address:this.props.location.selectedLocation.formattedAddress;
    }

    this.props.userActions.consumerEditProfile({
      token: this.props.user.userDetails.auth.token,
      userId: this.props.user.userDetails.userId,
      favouriteFoods: this.state.favouriteFoods,
      position,
      profilePic: this.state.profilePic
    });
  }

  render() {
    let {
      emailAddress,
      mobile,
      fullAddress,
      favouriteFoods,
      addDetails,
    } = Constants.i18n.common;

    let {
      enterFullAddress,
      enterFavouriteFoods
    } = Constants.i18n.signup;

    let {
      email,
    } = Constants.i18n.profile;

    let { goBack, navigate } = this.props.navigation;
    return (
      <View style={styles.mainView}>
        <NavigationBar
          rightButton={<EditButton title={"Save"} onPress={()=>this.onSubmit()} />}
          leftButton={<BackButton onPress={()=>{
              this.props.locationActions.selectLocation(null);
              goBack();
            }}
          />}
        />
        <ScrollView 
          showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
          keyboardDismissMode={Platform.OS==="ios" ? 'on-drag' : 'interactive'} 
          keyboardShouldPersistTaps='always' ref='mainScrollView'
        >
          <KeyboardAvoidingView style={styles.container}>
            <View style={styles.details}>
              <View style={styles.profile}>
                <TouchableOpacity onPress={this.showActionSheet}>
                  <Avatar
                    profile = {this.state.userImage}
                    user = {this.props.user.userDetails}
                    placeholderStyle = {styles.placeholderStyle}
                    avatarStyle = {styles.avatarStyle}
                  />
                </TouchableOpacity>
                <StarRating
                  editable={false}
                  rating={this.props.user.userDetails.rating.avgRating}
                  style={styles.star}
                />
              </View>
              <View style={{flex: 6, flexDirection: 'column', justifyContent: 'center'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.name}>
                    {this.props.user.userDetails.fullName.capitalizeEachLetter()}
                  </Text>
                </View>
                <View style={{flex: 3}}>
                  <Text style={styles.address}>
                    {this.props.user.userDetails.position.address.capitalizeFirstLetter()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{marginTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100}}>
              <TextField
                headerText={emailAddress}
                viewStyle={styles.hideLine}
                headerStyle={[Constants.Fonts.bold]}
                dataText={this.props.user.userDetails.email.capitalizeFirstLetter()}
              />
              <TextField
                headerText={mobile}
                viewStyle={styles.hideLine}
                headerStyle={[Constants.Fonts.bold]}
                dataText={this.props.user.userDetails.phoneNum}
              />

              <AddressField
                headerText={fullAddress}
                headerStyle={{
                  color: Constants.Colors.Black,
                  paddingBottom: 0,
                  ...Constants.Fonts.bold
                }}
                viewStyle={{
                  borderBottomColor: Constants.Colors.GhostWhite,
                  borderBottomWidth: 1,
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                }}
                inputStyle={{
                  ...Constants.Fonts.normal,
                  //marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                  height: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
                  width: Constants.BaseStyle.DEVICE_WIDTH*90/100,
                  color: Constants.Colors.Gray,
                  textAlign: 'left',
                }}
                placeHolderText={enterFullAddress}
                placeHolderColor={Constants.Colors.Gray}
                dataText={this.props.location.selectedLocation?this.props.location:this.props.user.userDetails.position}
                _onPress={()=>{
                  this.props.navigation.navigate('Location');
                }}
              />

              <View style={styles.favFoodContainer}>
                <Text style={[styles.headerStyle,Constants.Fonts.bold]}>
                  {favouriteFoods}
                </Text>

                <TagInput
                  ref="favouriteFoods"
                  onChange={this.onChangeFavFood}
                  onFocus={Platform.OS === 'ios' ? null : ()=>{this._handleScrollView(ReactNative.findNodeHandle(this.refs.favouriteFoods));}}
                  onBlur={Platform.OS === 'ios' ? null : ()=>{this._resetScrollView(ReactNative.findNodeHandle(this.refs.favouriteFoods));}}
                  value={this.state.favouriteFoods}
                  placeholderText={this.state.favouriteFoods.length>0?"":"Enter here"}
                  alertText={"Enter a valid favourite food"}
                  tagTextStyle={{
                    ...Constants.Fonts.normal,
                    color: Constants.Colors.Gray,
                  }}
                  tagContainerStyle={{
                    borderColor: Constants.Colors.Gray,
                    borderWidth: 1,
                    padding: Constants.BaseStyle.DEVICE_WIDTH*2/100,
                  }}
                  textInput={{
                    ...Constants.Fonts.normal,
                  }}
                  tagColor="transparent"
                  tagTextColor={Constants.Colors.Gray}
                  inputColor={Constants.Colors.Gray}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title=""
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Constants.Colors.White,
    //borderWidth: 1
  },
  container: {
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
  },
  favFoodContainer: {
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    justifyContent: 'center',
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
  },
  details: {
    flexDirection: 'row',
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1
  },
  profile: {
    flex: 3,
    flexDirection: 'column',
  },
  photo: {
    alignSelf: 'flex-start',
    width: Constants.BaseStyle.DEVICE_HEIGHT*12/100,
    height: Constants.BaseStyle.DEVICE_HEIGHT*12/100,
  },
  name: {
    ...Constants.Fonts.contentBold,
    color:Constants.Colors.Black,
  },
  address: {
    ...Constants.Fonts.tinyLarge, 
    color:Constants.Colors.Gray,
  },
  headerStyle:{
    ...Constants.Fonts.normal,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
    color:Constants.Colors.Black,
    backgroundColor: 'transparent',
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
  star:{
    alignSelf : 'flex-start',
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*1.5,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*0.5,
  },
  hideLine:{
    borderBottomColor: Constants.Colors.Transparent,
    borderBottomWidth: 0,
  }
});

ReactMixin(EditProfile.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user,
  location:state.location
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
  locationActions: bindActionCreators(locationActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
