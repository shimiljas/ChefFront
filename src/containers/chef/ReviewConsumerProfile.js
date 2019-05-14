/*
 * @file: ViewProfile.js
 * @description: Consumer view profile
 * @date: 10.07.2017
 * @author: Vishal Kumar
 * */

import React, { Component } from 'react';
import { ScrollView, VirtualizedList, StyleSheet, View, Dimensions, Image, Text, Animated, TouchableOpacity } from 'react-native';
import Constants from "../../constants";
import Avatar from "../../components/common/Avatar";
import StarRating from '../../components/common/StarRating';
import NavigationBar  from "react-native-navbar";
import BackButton  from "../../components/common/BackButton";
import TextField from '../../components/common/TextField';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import _ from "lodash";


class ReviewConsumerProfile extends React.Component {

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
      title: this.props.navigation.state.params.userDetails.fullName.capitalizeEachLetter(),
      tintColor: "#fff",
      style:{
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

            <View style={{marginTop: Constants.BaseStyle.DEVICE_HEIGHT*1/100}}>
              {this.props.navigation.state.params.status!==1 && this.props.navigation.state.params.status!==2 && 
                this.props.navigation.state.params.status!==5 && this.props.navigation.state.params.status!==9 && 
                <View>
                  <TextField
                    headerStyle={styles.headerStyle}
                    headerText={emailAddress}
                    dataText={this.props.navigation.state.params.userDetails.email.capitalizeFirstLetter()}
                  />
                  <TextField
                    headerStyle={styles.headerStyle}
                    headerText={mobile}
                    dataText={this.props.navigation.state.params.userDetails.phoneNum}
                  />
                </View>
              }
              <TextField
                headerStyle={styles.headerStyle}
                headerText={fullAddress}
                dataText={this.props.navigation.state.params.userDetails.position.address.capitalizeFirstLetter()}
              />
              
              {
                this.props.navigation.state.params.userDetails.favouriteFoods.length>0 &&
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
                      _.map(this.props.navigation.state.params.userDetails.favouriteFoods,
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

ReviewConsumerProfile.DefaultProps={
  userDetails:{}
}

ReactMixin(ReviewConsumerProfile.prototype, TimerMixin);

export default ReviewConsumerProfile;
