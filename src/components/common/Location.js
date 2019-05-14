/**
 * @file: GeoLocation.js
 * @description: Search location.
 * @date: 07.07.2017
 * @author: Manish Budhraja
 */

'use strict';

// Import React & React Native Components, JS Libraries, Other Libraries and Modules.

import React, { Component } from 'react';
import {
  Image,
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  ListView,
  ScrollView
} from 'react-native';
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import Constants from '../../constants';
import BackButton from './BackButton';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as LocationActions from '../../redux/modules/location';
import { ToastActionsCreators } from 'react-native-redux-toast';
import _ from "lodash";
var { GooglePlacesAutocomplete } = require('react-native-google-places-autocomplete');

class Location extends Component {
  constructor(props){
    super(props);
  }

  render() {
    let context = this;
    let { goBack, state } = this.props.navigation;
    return (
      <View style={[defaultStyles.container,]}>
        <BackButton
          imageStyle={defaultStyles.crossIcon}
          isCross={true}
          containerStyle={{height:44}}
          onPress={()=>goBack()}/>
        <GooglePlacesAutocomplete
          placeholder='Search location'
          placeholderTextColor={Constants.Colors.White}
          minLength={2} // minimum length of text to search
          autoFocus={true}
          listViewDisplayed='auto'    // true/false/undefined
          fetchDetails={true}
          renderDescription={(row) => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            context.props.LocationActions.selectLocation(details);
            goBack();
            if( state && state.params && _.isFunction(state.params.callBack)){
              this.setTimeout(()=>state.params.callBack(),250);
            }
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: Constants.GoogleAPIKey,
            language: 'en', // language of the results
            types: '(cities)', // default: 'geocode'
          }}
          styles={{
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
            container:{
              backgroundColor : Constants.Colors.Green
            },
            description:{
              ...Constants.Fonts.normal,
              color:Constants.Colors.White,
              height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
            },
            textInputContainer:defaultStyles.inputContainer,
            textInput:defaultStyles.inputStyle,
            textStyle:defaultStyles.textStyle
          }}
          listUnderlayColor={"transparent"}
          currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food',
          }}
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          nearByLocation = {this.props.location.currentLocation}
          anywherePress = {()=>{
            context.props.LocationActions.selectLocation(null);
            goBack();
          }}
          setCurrentLocation={()=>{
            if(this.props.location.currentLocation){
              context.props.LocationActions.selectLocation(this.props.location.currentLocation);  
              goBack(); 
              if( state && state.params && _.isFunction(state.params.callBack)){
                this.setTimeout(()=>state.params.callBack(),250);
              }
              return;
            }
            context.props.navigation.dispatch(ToastActionsCreators.displayInfo("Turn on Location Services."));
          }}
          isAnywhereRequired={false}
        />
      </View>
    );
  }
}

const defaultStyles = {
  container:{
    backgroundColor:Constants.Colors.Green,
    flex:1
  },
  inputContainer:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
    width:Constants.BaseStyle.DEVICE_WIDTH,
  },
  inputStyle:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
    paddingHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*6,
    ...Constants.Fonts.subtitle_bold,
    color:Constants.Colors.White,
    backgroundColor:Constants.Colors.Transparent,
  },
  listContainer:{
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*6,
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
  },
  currentContainer:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 0.5,
    justifyContent:"center"
  },
  listStyle:{

  },
  crossIcon:{
    height:Constants.BaseStyle.DEVICE_WIDTH/100*4.2,
    width:Constants.BaseStyle.DEVICE_WIDTH/100*4,
  },
  textStyle: {
    color: Constants.Colors.White,
    ...Constants.Fonts.normal,
    paddingVertical:Constants.BaseStyle.DEVICE_HEIGHT/100*0.2,
    paddingHorizontal:Constants.BaseStyle.DEVICE_HEIGHT/100*1,
  },
  placeholderStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*12,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*12,
    alignSelf:"center",
    borderRadius: Constants.BaseStyle.DEVICE_WIDTH/100*6,
    justifyContent: 'center',
  }
};

Location.defaultProps = {
  avatarStyle: {},
  textStyle:{},
  placeholderStyle : {}
};

Location.propTypes = {
  user: React.PropTypes.object,
  avatarStyle: Image.propTypes.style,
  textStyle:  Text.propTypes.style,
  placeholderStyle : Image.propTypes.style,
};

ReactMixin(Location.prototype, TimerMixin);

const mapStateToProps = (state)=>({
   location:state.location
});

const mapDispatchToProps = dispatch => ({
    LocationActions: bindActionCreators(LocationActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Location);
