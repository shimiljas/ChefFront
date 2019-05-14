/*
 * @file: ViewProfile.js
 * @description: Consumer view profile
 * @date: 10.07.2017
 * @author: Vishal Kumar
 * */

import React, { Component } from 'react';
import { ScrollView, VirtualizedList, StyleSheet, View, Dimensions, Image, Text, Animated, TouchableOpacity } from 'react-native';
import Constants from "../../../constants";
import Avatar from "../../../components/common/Avatar";
import StarRating from '../../../components/common/StarRating';
import NavigationBar  from "react-native-navbar"
import TextField from '../../../components/common/TextField';
import BackButton  from "../../../components/common/BackButton";
import EditButton  from "../../../components/common/EditButton";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../../../redux/modules/user';
import _ from "lodash";

class ViewProfile extends React.Component {

  constructor(props) {
    super(props);
  }

  // Function renders the favourite foods array items
  renderFavouriteFoods(item,i) {
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
        alignSelf: 'center'
      }}>
        <Text style={{
          ...Constants.Fonts.tinyMedium,
          color:Constants.Colors.Gray,
        }}>{item}</Text>
      </View>
    )
  }

  // Default render function
  render() {
    let { goBack, navigate } = this.props.navigation;
    let {
      emailAddress,
      mobile,
      fullAddress,
      favouriteFoods,
      addDetails,
    } = Constants.i18n.common;
    let {
      email,
    } = Constants.i18n.profile;

    const titleConfig = {
      title: "Profile",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    return (
      <View style={styles.mainView}>
        <NavigationBar
          rightButton={
            <EditButton title={"Edit"} onPress={()=>navigate("ConsumerEditProfile")} />
          }
          leftButton={<BackButton onPress={()=>goBack()} />} 
        />
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  style={styles.container}>
            <View style={styles.details}>
              <View style={styles.profile}>
                <Avatar
                  user ={this.props.user.userDetails}
                  placeholderStyle = {styles.placeholderStyle}
                  avatarStyle = {styles.avatarStyle} 
                />
                <StarRating
                  editable={false}
                  rating={this.props.user.userDetails.rating.avgRating}
                  style={styles.star}
                />
              </View>
              <View style={{flex: 6, flexDirection: 'column', justifyContent: 'center'}}>
                <View style={{flex: 1}}>
                  <Text numberOfLines={1} style={styles.name}>
                    {this.props.user.userDetails.fullName.capitalizeEachLetter()}
                  </Text>
                </View>
                <View style={{flex: 5}}>
                  <Text numberOfLines={4} style={styles.address}>
                    {this.props.user.userDetails.position.address.capitalizeFirstLetter()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{marginTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100}}>
              <TextField
                headerStyle={styles.headerStyle}
                headerText={emailAddress}
                dataText={this.props.user.userDetails.email.capitalizeFirstLetter()}
              />
              <TextField
                headerStyle={styles.headerStyle}
                headerText={mobile}
                dataText={this.props.user.userDetails.phoneNum}
              />
              <TextField
                headerStyle={styles.headerStyle}
                headerText={fullAddress}
                dataText={this.props.user.userDetails.position.address.capitalizeFirstLetter()}
              />
              
              {
                this.props.user.userDetails.favouriteFoods.length>0 &&
                <View style={{
                  paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
                  marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
                  borderBottomColor: Constants.Colors.GhostWhite,
                  borderBottomWidth: 1,
                }}>
                  <Text style={{
                    ...Constants.Fonts.bold,
                    color:Constants.Colors.Black,  
                  }}>
                    {favouriteFoods}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                    {
                      _.map(this.props.user.userDetails.favouriteFoods,
                        (item,i)=>{
                          return this.renderFavouriteFoods(item,i);
                        })
                    }
                  </View>
                </View>
              }              
            </View>
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
    backgroundColor: Constants.Colors.White,
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
  photo: {
    alignSelf: 'flex-start',
    width: Constants.BaseStyle.DEVICE_HEIGHT*12/100,
    height: Constants.BaseStyle.DEVICE_HEIGHT*12/100,
  },
  rating: {
    alignItems: 'center'
  },
  name: {
    ...Constants.Fonts.contentBold,
    color:Constants.Colors.Black,
  },
  address: {
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
  headerStyle:{
    ...Constants.Fonts.bold
  },
  star:{
    alignSelf : 'flex-start',
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*1.5,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*0.5,
  }
});

ReactMixin(ViewProfile.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
