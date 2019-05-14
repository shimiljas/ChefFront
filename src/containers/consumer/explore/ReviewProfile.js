/*
 * @file: ReviewProfile.js
 * @description: Consumer can view Chef/Caterer profile.
 * @date: 18.07.2017
 * @author: Vishal Kumar
 * */

'use-strict';
import React, { Component } from 'react';
import { ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity
} from 'react-native';

import Connection from "../../../config/Connection";
import Constants from "../../../constants";
import Avatar from "../../../components/common/Avatar";
import StarRating from '../../../components/common/StarRating';
import RoundButton from "../../../components/common/RoundButton";
import Reviews from "../../../components/bookings/Reviews";
import TextField from '../../../components/common/TextField';
import BackButton from "../../../components/common/BackButton";
import EditButton  from "../../../components/common/EditButton";
import Switch from '../../../components/common/Switch';
import NavigationBar from "react-native-navbar"
import _ from "lodash"; 
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../../redux/modules/user';
import PhotoView from 'react-native-photo-view';
import Modal from 'react-native-simple-modal'; 

class ChefReviewProfile extends Component {
  constructor(props) {
    super(props);
    this.state={
      rating : 4.5,
      modalVisible : false,
      currentImage : null,
    }
    //console.log("props**--", this.props.navigation.state.params)
    this.video = null;
    this.show = this.show.bind(this);
  }

  // Navigates to video player screen
  onVideoPress(){
    let context = this;
    let files = [...context.props.navigation.state.params.userDetails.workHistory] 
    let thumbnail = _.remove(files, {type: "thumbnail"});
    context.props.navigation.navigate("VideoPlayer",{
      video:Connection.getMedia(context.video[0]._id),
      thumbnail:Connection.getMedia(thumbnail[0]._id),
    });
  }

  // Show images on modal
  show(image){
    this.setState({
      currentImage : Connection.getMedia(image._id),
      modalVisible : true
    });
  }

  // Function render images and video list and deletes them on long press
  renderImageList(item){
    if(item.type==="thumbnail"){
      return(
        <TouchableOpacity onPress={()=>this.onVideoPress(item)}>
          <Image
            style={{
              justifyContent:"center",
              alignItems:"center",
              height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              marginRight:Constants.BaseStyle.DEVICE_WIDTH*2/100,
              backgroundColor: Constants.Colors.GhostWhite
            }}
            source={{uri: Connection.getMedia(item._id)}}
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
    } else if (item.type==="image"){
      return (
        <TouchableOpacity onPress={()=>this.show(item)}>
          <Image
            style={{
              height: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              width: Constants.BaseStyle.DEVICE_HEIGHT*8/100,
              marginRight:Constants.BaseStyle.DEVICE_WIDTH*2/100,
              backgroundColor: Constants.Colors.GhostWhite
            }}
            source={{uri: Connection.getMedia(item._id)}}  
          />
        </TouchableOpacity>
      )
    }else{
      <View />
    }
  }

  // Render Image Modal
  renderModal(){
    let context = this;
    return(
      <Modal
        open={this.state.modalVisible}
        offset={0}
        disableOnBackPress={true}
        overlayBackground={'rgba(0, 0, 0, 0.8)'}
        animationDuration={200}
        animationTension={40}
        closeOnTouchOutside={true}
        containerStyle={{
          justifyContent: 'center',
          backgroundColor:Constants.Colors.Transparent
        }}
        modalStyle={{
          backgroundColor:Constants.Colors.Transparent
        }}
        modalDidClose={() => this.setState({modalVisible: false})}
      >
        <PhotoView
          resizeMode={'contain'}
          source={{uri: context.state.currentImage}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          minimumZoomScale={0.5}
          maximumZoomScale={3}
          androidScaleType="center"
          onLoad={() => console.log("loaded")}
          style={styles.photoview} 
        /> 
      </Modal>
    )
  }

  // default render function
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
      milesWillingToTravel,
      typesOfDiet,
      specializedCooking,
      minGuaranteedGuests,
      maxGuaranteedGuests
    } = Constants.i18n.signupChef;

    let {
      experienceInYears,
      mealsSupported,
      description,
      workHistory,
      workHistoryPlaceHolder,
      crimeConvicted,
    } = Constants.i18n.signup;

    let {
      breakfastArray, lunchArray, eveningSnacksArray, dinnerArray
    } = this.props.navigation.state.params.userDetails.mealsSupported;
    let typesOfDietData = "";

    typesOfDietData = breakfastArray.join("(Breakfast), ");
    
    if((breakfastArray.length) && (lunchArray.length || eveningSnacksArray.length || dinnerArray.length)) {
      typesOfDietData += "(Breakfast), ";
    } else if(breakfastArray.length > 0) {
      typesOfDietData += "(Breakfast)";
    }

    typesOfDietData += lunchArray.join("(Lunch), ");
    if((lunchArray.length) && (eveningSnacksArray.length || dinnerArray.length)) {
      typesOfDietData += "(Lunch), ";
    } else if(lunchArray.length > 0) {
      typesOfDietData += "(Lunch)";
    }
    
    typesOfDietData += eveningSnacksArray.join("(Evening snacks), ");
    if(eveningSnacksArray.length && dinnerArray.length) {
      typesOfDietData += "(Evening snacks), ";
    } else if(eveningSnacksArray.length > 0) {
      typesOfDietData += "(Evening snacks)";
    }
    
    typesOfDietData += dinnerArray.join("(Dinner), ");
    if(dinnerArray.length > 0) {
      typesOfDietData += "(Dinner)";
    }

    let mealsSupportedData = "";

    if((breakfastArray.length) && (lunchArray.length || eveningSnacksArray.length || dinnerArray.length)) {
      mealsSupportedData = "Breakfast, ";
    } else if(breakfastArray.length) {
      mealsSupportedData = "Breakfast";
    }

    if((lunchArray.length) && (eveningSnacksArray.length || dinnerArray.length)) {
      mealsSupportedData += "Lunch, ";
    } else if(lunchArray.length) {
      mealsSupportedData += "Lunch";
    }

    if(eveningSnacksArray.length && dinnerArray.length) {
      mealsSupportedData += "Evening snacks, ";
    } else if(eveningSnacksArray.length) {
      mealsSupportedData += "Evening snacks";
    }

    if(dinnerArray.length) {
      mealsSupportedData += "Dinner";
    }

    let workHistoryArr = [...this.props.navigation.state.params.userDetails.workHistory] ;
    this.video = _.remove(workHistoryArr, {type: "video"});

    const titleConfig = {
      title: this.props.navigation.state.params.userDetails.fullName.capitalizeEachLetter(),
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
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  style={styles.container}>
          <View style={styles.details}>
            <View style={styles.profile}>
              <Avatar
                user ={this.props.navigation.state.params.userDetails}
                placeholderStyle = {styles.placeholderStyle}
                avatarStyle = {styles.avatarStyle} 
              />
              <StarRating
                editable={false}
                rating={this.props.navigation.state.params.userDetails.rating.avgRating}
                style={styles.star}
              />
            </View>
            <View style={{flex: 6, flexDirection: 'column', justifyContent: 'center'}}>
              <View style={{flex: 1}}>
                <Text numberOfLines={1} style={styles.name}>
                  {this.props.navigation.state.params.userDetails.fullName.capitalizeEachLetter()}
                </Text>
              </View>
              <View style={{flex: 5}}>
                <Text numberOfLines={4} style={styles.address}>
                  {this.props.navigation.state.params.userDetails.position.address.capitalizeFirstLetter()}
                </Text>
              </View>
            </View>
          </View>

          <View style={{paddingTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100}}>
            { this.props.navigation.state.params.status!==5 && this.props.navigation.state.params.status!==9 && 
              this.props.navigation.state.params.status!==1 && this.props.navigation.state.params.status!==2 &&
              <View>
                <TextField
                  headerText={email}
                  headerStyle={Constants.Fonts.bold}
                 dataText={this.props.navigation.state.params.userDetails.email}
                />
                <TextField
                  headerText={mobileNumber}
                  headerStyle={Constants.Fonts.bold}
                  dataText={this.props.navigation.state.params.userDetails.phoneNum}
                />
              </View>
            }

            <TextField
              headerText={fullAddress}
              headerStyle={Constants.Fonts.bold}
              dataText={this.props.navigation.state.params.userDetails.position.address}
            />

            <TextField
              headerText={ratePerHour}
              headerStyle={Constants.Fonts.bold}
              dataText={"$ " + this.props.navigation.state.params.userDetails.ratePerHour}
            />

            <TextField
              headerText={experienceInYears}
              headerStyle={Constants.Fonts.bold}
              dataText={this.props.navigation.state.params.userDetails.expInYears}
            />

            <TextField
              headerText={milesWillingToTravel}
              headerStyle={Constants.Fonts.bold}
              dataText={this.props.navigation.state.params.userDetails.milesToTravel}
            />

            <TextField
              headerText={mealsSupported}
              headerStyle={Constants.Fonts.bold}
              dataText={mealsSupportedData}
            />

            <TextField
              headerText={typesOfDiet}
              headerStyle={Constants.Fonts.bold}
              dataText={typesOfDietData}
            />

            {
              this.props.navigation.state.params.userDetails.typesOfSpecializedCooking.join(', ').length > 0 &&
              <TextField
                headerText={specializedCooking}
                headerStyle={Constants.Fonts.bold}
                dataText={this.props.navigation.state.params.userDetails.typesOfSpecializedCooking.join(', ')}
              />
            }

            <TextField
              headerText={minGuaranteedGuests}
              headerStyle={Constants.Fonts.bold}
              dataText={this.props.navigation.state.params.userDetails.minGuestCount}
            />

            <TextField
              headerText={maxGuaranteedGuests}
              headerStyle={Constants.Fonts.bold}
              dataText={this.props.navigation.state.params.userDetails.maxGuestCount}
            />

            {/*
              <TextField
                headerText={crimeConvicted}
                headerStyle={Constants.Fonts.bold}
                dataText={this.props.navigation.state.params.userDetails.criminalCase?"Yes":"No"}
              />
              */
            }

            {
                this.props.navigation.state.params.userDetails.describeYourself.length > 0 && 
                <TextField
                    headerText={description}
                    headerStyle={Constants.Fonts.bold}
                    dataText={this.props.navigation.state.params.userDetails.describeYourself}
                />
            }
            
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
                ...Constants.Fonts.bold,
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

            <TextField
              headerText={anyCertifiedExpInCooking}
              headerStyle={Constants.Fonts.bold}
              dataText={this.state.certifiedExp == '' ? addDetail : this.state.certifiedExp}
            />

            <TextField
              headerText={whereTheSkillsAcquiredFrom}
              headerStyle={Constants.Fonts.bold}
              dataText={this.state.skillAcquiredFrom == '' ? addDetail : this.state.skillAcquiredFrom}
            />

            <TextField
              headerText={whyYouLoveToCook}
              headerStyle={Constants.Fonts.bold}
              dataText={this.state.loveForCooking == '' ? addDetail : this.state.loveForCooking}
            />

            <TextField
              headerText={facebookAddress}
              headerStyle={Constants.Fonts.bold}
              dataText={this.state.facebookAddress == '' ? addDetail : this.state.facebookAddress}
            />

            <TextField
              headerText={instagramAddress}
              headerStyle={Constants.Fonts.bold}
              dataText={this.state.instagramAddress == '' ? addDetail : this.state.instagramAddress}
            />
            */}
            {
              workHistoryArr.length>0 && 
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
                  //paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT*1/100,
                  color:Constants.Colors.Black,
                  //backgroundColor: 'transparent',
                }}>
                  {workHistory}
                </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    paddingTop:Constants.BaseStyle.DEVICE_HEIGHT*1/100
                  }}>
                    <ListView
                      dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(workHistoryArr)}
                      horizontal={true}
                      enableEmptySections={true}
                      renderRow={(rowData) =>this.renderImageList(rowData)}
                    />  
                  </View>
              </View>
            }
          </View>
        </ScrollView>
        { this.state.modalVisible && this.renderModal()}
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
    borderRadius: null,
  },
  avatarStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*24,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*24,
    borderRadius: null,
  },
  bookNowButtonStyle:{
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT/100*2,
    bottom: Constants.BaseStyle.DEVICE_HEIGHT/100*2,
    alignSelf: "center",
    borderRadius: null,
  },
  photoview:{
    height:Constants.BaseStyle.DEVICE_WIDTH,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    borderWidth:0,
    backgroundColor:Constants.Colors.Transparent,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:"center"
  },
  star:{
    alignSelf : 'flex-start',
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*1.5,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*0.5,
  }
});
 
ChefReviewProfile.DefaultProps={
  userDetails:{}
}


ReactMixin(ChefReviewProfile.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChefReviewProfile);
