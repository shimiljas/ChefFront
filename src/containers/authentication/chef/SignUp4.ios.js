/*
 * @file: SignUp4.js
 * @description: ChefSignUpStep4
 * @date: 11.07.2017
 * @author: Vishal Kumar
 * */

'use strict';
import React, { Component } from 'react';
import ReactNative, {
  AppRegistry,
  ActionSheetIOS,
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,ListView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import _ from 'lodash';
import Constants from '../../../constants';
import Regex from '../../../utilities/Regex';
import Background from '../../../components/common/Background';
import RoundButton from '../../../components/common/RoundButton';
import InputField from '../../../components/common/InputField';
//import Switch from '../../../components/common/Switch';
import { ToastActionsCreators } from 'react-native-redux-toast';
import BackButton  from "../../../components/common/BackButton";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import ImagePicker from 'react-native-image-crop-picker';
import ThumbnailGenerator from 'react-native-thumbnail';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../../redux/modules/user';

class SignUp4 extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state= {
      minGuestCount: '',
      maxGuestCount: '',
      describeYourself: '',
      workImages: [],
      maxNumberOfImages: 3,
      maxNumberOfVideos: 1,
      dataSource: ds.cloneWithRows([]),
      // isConvicted: false,
      // navProps: this.props.navigation.state.params
    }
  }

  // Function navigates to terms and condition screen
  onTermsOfServiceClick() {
    let { service } = Constants.i18n.about;
    this.props.navigation.navigate("WebView", {title: service,url:"terms"});
  }

  // Function validates all user input and signs up
  onFinishClick() {
    let context = this ;
    let {
      minGuestCount,
      maxGuestCount,
      describeYourself,
    } = this.state;

    let {
      enterMinGuaranteedGuests,
      enterValidMinGuaranteedGuests,
      enterMaxGuaranteedGuests,
      enterValidMaxGuaranteedGuests,
      enterDescription,
    } = Constants.i18n.signupChef;

    let { navigate, dispatch } = this.props.navigation;

    if(_.isEmpty(minGuestCount.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterMinGuaranteedGuests));
      return;
    }
    if(!Regex.validateNumbers(minGuestCount.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMinGuaranteedGuests));
      return;
    }
    if(parseInt(minGuestCount)<=0) {
       dispatch(ToastActionsCreators.displayInfo("Minimum guest count should be greater than zero"));
      return;
    }

    if(_.isEmpty(maxGuestCount.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterMaxGuaranteedGuests));
      return;
    }
    if(parseInt(maxGuestCount)<=0) {
      dispatch(ToastActionsCreators.displayInfo("Maximum guest count should be greater than zero"));
      return;
    }
    if(!Regex.validateNumbers(maxGuestCount.trim())) {
      dispatch(ToastActionsCreators.displayInfo(enterValidMaxGuaranteedGuests));
      return;
    }

    if(parseInt(minGuestCount.trim())>parseInt(maxGuestCount.trim())) {
      dispatch(ToastActionsCreators.displayInfo("Minimum guest count should be less than maximum guest count"));
      return;
    }

    if(context.state.workImages.length>0 ){
      context.props.userActions.uploadImages(context.state.workImages,function(data){
        let images = _.map(data,function(image){
          let type = "image";
          if(image.url.includes("video")){
            type = "video";
          }
          if(image.url.includes("thumbnail")){
            type = "thumbnail";
          }
          return { _id:image._id, type:type };
        });
        context.props.userActions.chefSignup({
          ...context.props.navigation.state.params,
          minGuestCount: context.state.minGuestCount,
          maxGuestCount: context.state.maxGuestCount,
          //criminalCase: context.state.isConvicted,
          describeYourself: context.state.describeYourself,
          workHistory: images
        });
      });
    }else{
      context.props.userActions.chefSignup({
        ...context.props.navigation.state.params,
        minGuestCount: context.state.minGuestCount,
        maxGuestCount: context.state.maxGuestCount,
        //criminalCase: context.state.isConvicted,
        describeYourself: context.state.describeYourself,
        workHistory: []
      });
    }
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
        0,
        true
      );
    }, 100);
  }

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

  // Function opens photo gallery for capturing images for uploading
  openPhotoGallery(){
    let context = this;
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    let { dispatch } = context.props.navigation;
    let arr = context.state.workImages;
    let customArray={};
    ImagePicker.openPicker({
      showCropGuidelines :false,
      multiple:true,
      maxFiles:context.state.maxNumberOfImages,
      mediaType:"photo"
    }).then(images => {
      for (let item of images) {
       item.id=Math.random();
       item.isVideo=false;
       arr.push(item);
      }
      context.setState({
        maxNumberOfImages:(context.state.maxNumberOfImages-images.length),
        dataSource:ds.cloneWithRows(arr),
        workImages: arr
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
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    let context = this;
    let { dispatch } = context.props.navigation;
    let arr = context.state.workImages;
    ImagePicker.openPicker({
      showCropGuidelines :false,
      maxFiles:context.state.maxNumberOfVideos,
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
        result.isVideo = true;
        result.videoPath = images.path;
        result.id = Math.random();
        imageClone.push(result);
        context.setState({
          maxNumberOfVideos:0,
          dataSource:ds.cloneWithRows(imageClone)
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
    for(let i=arr.length-1; i>=0; i--) {
      if( arr[i].id == item.id) arr.splice(i,1);
    }
    let updatedData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.setState({
      dataSource:updatedData.cloneWithRows(arr)
    });
    if(item.isVideo==false){
      this.setState({ maxNumberOfImages: (this.state.maxNumberOfImages+1)  });
    }else {
      this.setState({ maxNumberOfVideos: 1  });
    }
  }

  // Function render images and video list and deletes them on long press
  renderImageList(item){
    if(item.isVideo){
      return(
        <TouchableOpacity onLongPress ={(e)=>{ this.deleteItemFromDataSource(item) }} >
          <Image
            style={{
            justifyContent:"center",
            alignItems:"center",
            height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
            width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
            marginLeft:Constants.BaseStyle.DEVICE_HEIGHT*2/100}}
            source={{ uri : item.path }}
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
    }else {
      return (
        <TouchableOpacity onLongPress ={(e)=>{ this.deleteItemFromDataSource(item) }} >
          <Image
            style={{
              height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              marginLeft:Constants.BaseStyle.DEVICE_HEIGHT*2/100
            }}
            source={{ uri : item.path }}
          />
        </TouchableOpacity>
      )
    }
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
      minGuaranteedGuests,
      enterMinGuaranteedGuests,
      enterValidMinGuaranteedGuests,

      maxGuaranteedGuests,
      enterMaxGuaranteedGuests,
      enterValidMaxGuaranteedGuests,
    } = Constants.i18n.signupChef;

    let {
      crimeConvicted,

      description,
      enterDescription,
    } = Constants.i18n.signup;

    return (
      <Background isFaded={true}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.Colors.LightGreen}
        />
        <BackButton title={"Step 4 of 4"} containerStyle={{height:44}} onPress={()=>goBack()} />
        <View style={styles.mainView}>
          <ScrollView 
            showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} 
            keyboardDismissMode={Platform.OS==='ios' ? 'on-drag' : 'interactive'}
            keyboardShouldPersistTaps='always' 
            ref="mainScrollView"
          >
              <KeyboardAvoidingView behavior="padding" style={styles.container}>

                <InputField
                  ref='minGuaranteedGuests'
                  autoFocus={true}
                  headerText={minGuaranteedGuests}
                  placeHolderText={enterMinGuaranteedGuests}
                  placeHolderColor={Constants.Colors.White}
                  secureText={false}
                  keyboard='numeric'
                  returnKey='next'
                  SubmitEditing={(event) => {this.refs.maxGuaranteedGuests.focus();}}
                  onChangeText={(minGuestCount)=>this.setState({minGuestCount})}
                />

                <InputField
                  ref='maxGuaranteedGuests'
                  autoFocus={false}
                  headerText={maxGuaranteedGuests}
                  placeHolderText={enterMaxGuaranteedGuests}
                  placeHolderColor={Constants.Colors.White}
                  returnKey='next'
                  keyboard='numeric'
                  SubmitEditing={(event) => {this.refs.description.focus();}}
                  onChangeText={(maxGuestCount)=>this.setState({maxGuestCount})}
                />

                {/*<View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Constants.Colors.Gray,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      ...Constants.Fonts.normal,
                      color:Constants.Colors.Gray,
                      backgroundColor: 'transparent',
                      width: Constants.BaseStyle.DEVICE_WIDTH*70/100,
                    }}
                  >
                    {crimeConvicted}
                  </Text>
                  <Switch
                    isSwitchOn={this.state.isConvicted}
                    onClick={()=>{
                      this.setState({isConvicted: !this.state.isConvicted});
                    }}
                  />

                </View>*/}

                <InputField
                  ref='description'
                  autoFocus={false}
                  headerText={description}
                  multiline={true}
                  placeHolderText={enterDescription}
                  placeHolderColor={Constants.Colors.White}
                  secureText={false}
                  returnKey='next'
                  SubmitEditing={ (event) => this.onFinishClick() }
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

                  <View style={{ flexDirection: 'row', alignSelf: 'stretch', paddingTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100 }}>
                    <TouchableOpacity  onPress={()=> this.openOptionPicker()  } >
                    <Image
                      style={{
                        height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
                        width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
                      }}
                      source={Constants.Images.caterer.add_work_image}
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
              </KeyboardAvoidingView>

              <View style={styles.footer}>
                <Text style={styles.grayText}>
                  {TnCText+" "}
                  <Text style={styles.greenLinkText}
                    onPress={()=>this.onTermsOfServiceClick()}
                  >
                    {TnCLink}
                  </Text>
                </Text>
                <RoundButton text="Finish"
                  buttonStyle={{ marginTop: Constants.BaseStyle.DEVICE_HEIGHT*5/100,}}
                  _Press={()=>this.onFinishClick()}
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    alignItems: 'center'
  },
  button: {
    height: 40,
    width: 40
  },
  greenLinkText: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Green,
    textDecorationLine: 'underline',
  },
  grayText: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Gray,
    marginHorizontal: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
    alignItems:"center",
    alignSelf:"center",
    textAlign:"center"
  },
  imageVideoSelector:{
    color:'white',
    alignSelf:'flex-start',
    fontSize:Constants.BaseStyle.DEVICE_HEIGHT*1.5/100,
    paddingTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100
  }
});

ReactMixin(SignUp4.prototype, TimerMixin);

const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)
});

export default connect(null, mapDispatchToProps)(SignUp4);
