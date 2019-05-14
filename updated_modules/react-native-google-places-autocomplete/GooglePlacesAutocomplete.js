import React, {
  PropTypes
} from 'react';
import {
  TextInput,
  View,
  ListView,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
  PixelRatio,
  TouchableOpacity
} from 'react-native';
import Qs from 'qs';
import debounce from 'lodash.debounce';
import Constants from '../../src/constants'

const WINDOW = Dimensions.get('window');

const defaultStyles = {
  container: {
    flex: 1,
  },
  textInputContainer: {
    height: 44,
    flexDirection: 'row',
  },
  textInput: {
    height: 28,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7.5,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    flex: 1,
    color:Constants.Colors.White
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  powered: {},
  listView: {
    // flex: 1,
  },
  row: {
    padding: 13,
    paddingTop:Constants.BaseStyle.DEVICE_HEIGHT/100*4,
    paddingLeft:6,
    height: Constants.BaseStyle.DEVICE_HEIGHT/100*10,
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,
    borderBottomColor: Constants.Colors.White,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
  description: {
    width:(WINDOW.width/100)*80,
  },
  loader: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  androidLoader: {
    marginRight: -15,
  },
  currentContainer:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*10,
    borderBottomColor: Constants.Colors.White,
    borderBottomWidth: 0.5,
    justifyContent:"center",
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,
  },
  locationIcon:{
    height:Constants.BaseStyle.DEVICE_WIDTH/100*6,
    width:Constants.BaseStyle.DEVICE_WIDTH/100*6,
  }
};

const GooglePlacesAutocomplete = React.createClass({

  propTypes: {
    placeholder: React.PropTypes.string,
    placeholderTextColor: React.PropTypes.string,
    underlineColorAndroid: React.PropTypes.string,
    onPress: React.PropTypes.func,
    onNotFound: React.PropTypes.func,
    onFail: React.PropTypes.func,
    minLength: React.PropTypes.number,
    fetchDetails: React.PropTypes.bool,
    autoFocus: React.PropTypes.bool,
    autoFillOnNotFound: React.PropTypes.bool,
    getDefaultValue: React.PropTypes.func,
    timeout: React.PropTypes.number,
    onTimeout: React.PropTypes.func,
    query: React.PropTypes.object,
    GoogleReverseGeocodingQuery: React.PropTypes.object,
    GooglePlacesSearchQuery: React.PropTypes.object,
    styles: React.PropTypes.object,
    textInputProps: React.PropTypes.object,
    enablePoweredByContainer: React.PropTypes.bool,
    predefinedPlaces: React.PropTypes.array,
    currentLocation: React.PropTypes.bool,
    currentLocationLabel: React.PropTypes.string,
    nearbyPlacesAPI: React.PropTypes.string,
    enableHighAccuracyLocation: React.PropTypes.bool,
    filterReverseGeocodingByTypes: React.PropTypes.array,
    predefinedPlacesAlwaysVisible: React.PropTypes.bool,
    enableEmptySections: React.PropTypes.bool,
    renderDescription: React.PropTypes.func,
    renderRow: React.PropTypes.func,
    renderLeftButton: React.PropTypes.func,
    renderRightButton: React.PropTypes.func,
    listUnderlayColor: React.PropTypes.string,
    debounce: React.PropTypes.number,
    isRowScrollable: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      placeholder: 'Search',
      placeholderTextColor: '#A8A8A8',
      isRowScrollable: true,
      underlineColorAndroid: 'transparent',
      onPress: () => {},
      onNotFound: () => {},
      onFail: () => {},
      minLength: 0,
      fetchDetails: false,
      autoFocus: false,
      autoFillOnNotFound: false,
      keyboardShouldPersistTaps: 'always',
      getDefaultValue: () => '',
      timeout: 20000,
      onTimeout: () => console.warn('google places autocomplete: request timeout'),
      query: {
        key: 'missing api key',
        language: 'en',
        types: 'geocode',
      },
      GoogleReverseGeocodingQuery: {},
      GooglePlacesSearchQuery: {
        rankby: 'distance',
        types: 'food',
      },
      styles: {},
      textInputProps: {},
      enablePoweredByContainer: true,
      predefinedPlaces: [],
      currentLocation: false,
      currentLocationLabel: 'Current location',
      nearbyPlacesAPI: 'GooglePlacesSearch',
      enableHighAccuracyLocation: true,
      filterReverseGeocodingByTypes: [],
      predefinedPlacesAlwaysVisible: false,
      enableEmptySections: true,
      listViewDisplayed: 'auto',
      debounce: 0
    };
  },

  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: function rowHasChanged(r1, r2) {
        if (typeof r1.isLoading !== 'undefined') {
          return true;
        }
        return r1 !== r2;
      }
    });
    return {
      text: this.props.getDefaultValue(),
      dataSource: ds.cloneWithRows(this.buildRowsFromResults([])),
      listViewDisplayed: this.props.listViewDisplayed === 'auto' ? false : this.props.listViewDisplayed,
    };
  },

  setAddressText(address) {
    this.setState({
      text: address
    })
  },

  getAddressText() {
    return this.state.text
  },

  buildRowsFromResults(results) {
    var res = null;

    if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
      res = [...this.props.predefinedPlaces];
      if (this.props.currentLocation === true) {
        res.unshift({
          description: this.props.currentLocationLabel,
          isCurrentLocation: true,
        });
      }
    } else {
      res = [];
    }

    res = res.map(function(place) {
      return {
        ...place,
        isPredefinedPlace: true,
      }
    });

    return [...res, ...results];
  },

  componentWillMount() {
    this._request = this.props.debounce
      ? debounce(this._request, this.props.debounce)
      : this._request;
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.listViewDisplayed !== 'auto') {
      this.setState({
        listViewDisplayed: nextProps.listViewDisplayed,
      });
    }
  },

  componentWillUnmount() {
    this._abortRequests();
  },

  _abortRequests() {
    for (let i = 0; i < this._requests.length; i++) {
      this._requests[i].abort();
    }
    this._requests = [];
  },

  /**
   * This method is exposed to parent components to focus on textInput manually.
   * @public
   */
  triggerFocus() {
    if (this.refs.textInput) this.refs.textInput.focus();
  },

  /**
   * This method is exposed to parent components to blur textInput manually.
   * @public
   */
  triggerBlur() {
    if (this.refs.textInput) this.refs.textInput.blur();
  },

  getCurrentLocation() {
    let options = null;

    if (this.props.enableHighAccuracyLocation) {
      options = (Platform.OS === 'android') ? {
        enableHighAccuracy: true,
        timeout: 20000
      } : {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (this.props.nearbyPlacesAPI === 'None') {
          let currentLocation = {
            description: this.props.currentLocationLabel,
            geometry: {
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
          };
          this._disableRowLoaders();
          this.props.onPress(currentLocation, currentLocation);
        } else {
          this._requestNearby(position.coords.latitude, position.coords.longitude);
        }
      },
      (error) => {
        this._disableRowLoaders();
        alert(error.message);
      },
      options
    );
  },

  _enableRowLoader(rowData) {
    let rows = this.buildRowsFromResults(this._results);
    for (let i = 0; i < rows.length; i++) {
      if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
        rows[i].isLoading = true;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rows),
        });
        break;
      }
    }
  },
  _disableRowLoaders() {
    if (this.isMounted()) {
      for (let i = 0; i < this._results.length; i++) {
        if (this._results[i].isLoading === true) {
          this._results[i].isLoading = false;
        }
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(this._results)),
      });
    }
  },
  _onPress(rowData) {
    if (rowData.isPredefinedPlace !== true && this.props.fetchDetails === true) {
      if (rowData.isLoading === true) {
        // already requesting
        return;
      }

      this._abortRequests();

      // display loader
      this._enableRowLoader(rowData);

      // fetch details
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (responseJSON.status === 'OK') {
            if (this.isMounted()) {
              const details = responseJSON.result;
              this._disableRowLoaders();
              this._onBlur();

              this.setState({
                text: this._renderDescription( rowData ),
              });

              delete rowData.isLoading;
              this.props.onPress(rowData, details);
            }
          } else {
            this._disableRowLoaders();

            if (this.props.autoFillOnNotFound) {
              this.setState({
                text: this._renderDescription( rowData ),
              });
              delete rowData.isLoading;
            }

            if (!this.props.onNotFound)
              console.warn('google places autocomplete: ' + responseJSON.status);
            else
              this.props.onNotFound(responseJSON);

          }
        } else {
          this._disableRowLoaders();

          if (!this.props.onFail)
            console.warn('google places autocomplete: request could not be completed or has been aborted');
          else
            this.props.onFail();
        }
      };
      request.open('GET', 'https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
        key: this.props.query.key,
        placeid: rowData.place_id,
        language: this.props.query.language,
      }));
      request.send();
    } else if (rowData.isCurrentLocation === true) {

      // display loader
      this._enableRowLoader(rowData);

      this.setState({
        text: this._renderDescription( rowData ),
      });
      this.triggerBlur(); // hide keyboard but not the results

      delete rowData.isLoading;

      this.getCurrentLocation();

    } else {
      this.setState({
        text: this._renderDescription( rowData ),
      });

      this._onBlur();

      delete rowData.isLoading;

      let predefinedPlace = this._getPredefinedPlace(rowData);

      // sending predefinedPlace as details for predefined places
      this.props.onPress(predefinedPlace, predefinedPlace);
    }
  },
  _results: [],
  _requests: [],

  _getPredefinedPlace(rowData) {
    if (rowData.isPredefinedPlace !== true) {
      return rowData;
    }
    for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
      if (this.props.predefinedPlaces[i].description === rowData.description) {
        return this.props.predefinedPlaces[i];
      }
    }
    return rowData;
  },

  _filterResultsByTypes(responseJSON, types) {
    if (types.length === 0) return responseJSON.results;

    var results = [];
    for (let i = 0; i < responseJSON.results.length; i++) {
      let found = false;
      for (let j = 0; j < types.length; j++) {
        if (responseJSON.results[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }
      if (found === true) {
        results.push(responseJSON.results[i]);
      }
    }
    return results;
  },

  _requestNearby(latitude, longitude) {
    this._abortRequests();
    if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);

          this._disableRowLoaders();

          if (typeof responseJSON.results !== 'undefined') {
            if (this.isMounted()) {
              var results = [];
              if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                results = this._filterResultsByTypes(responseJSON, this.props.filterReverseGeocodingByTypes);
              } else {
                results = responseJSON.results;
              }

              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(results)),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            console.warn('google places autocomplete: ' + responseJSON.error_message);
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };

      let url = '';
      if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
        // your key must be allowed to use Google Maps Geocoding API
        url = 'https://maps.googleapis.com/maps/api/geocode/json?' + Qs.stringify({
          latlng: latitude + ',' + longitude,
          key: this.props.query.key,
          ...this.props.GoogleReverseGeocodingQuery,
        });
      } else {
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + Qs.stringify({
          location: latitude + ',' + longitude,
          key: this.props.query.key,
          ...this.props.GooglePlacesSearchQuery,
        });
      }

      request.open('GET', url);
      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
      });
    }
  },

  _request(text) {
    this._abortRequests();
    if (text.length >= this.props.minLength) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (typeof responseJSON.predictions !== 'undefined') {
            if (this.isMounted()) {
              this._results = responseJSON.predictions;
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(responseJSON.predictions)),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            console.warn('google places autocomplete: ' + responseJSON.error_message);
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };
      request.open('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=' + encodeURIComponent(text) + '&' + Qs.stringify(this.props.query));
      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
      });
    }
  },

  _onChangeText(text) {
    this._request(text);
    this.setState({
      text: text,
      listViewDisplayed: true,
    });
  },

  _handleChangeText(text) {
    this._onChangeText(text);
    const onChangeText = this.props
      && this.props.textInputProps
      && this.props.textInputProps.onChangeText;
    if (onChangeText) {
      onChangeText(text);
    }
  },

  _getRowLoader() {
    return (
      <ActivityIndicator
        animating={true}
        size="small"
        color={Constants.Colors.White}
      />
    );
  },

  _renderRowData(rowData) {
    if (this.props.renderRow) {
      return this.props.renderRow(rowData);
    }

    return (
      <Text style={[{flex: 1}, defaultStyles.description, this.props.styles.description, rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
        numberOfLines={1}
      >
        {this._renderDescription(rowData)}
      </Text>
    );
  },

  _renderDescription(rowData) {
    if (this.props.renderDescription) {
      return this.props.renderDescription(rowData);
    }

    return rowData.description || rowData.formatted_address || rowData.name;
  },

  _renderLoader(rowData) {
    if (rowData.isLoading === true) {
      return (
        <View
          style={[defaultStyles.loader, this.props.styles.loader]}
        >
          {this._getRowLoader()}
        </View>
      );
    }
    return null;
  },

  _renderRow(rowData = {}, sectionID, rowID) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled={this.props.isRowScrollable}
        keyboardShouldPersistTaps={"always"}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TouchableHighlight
          style={{ minWidth: WINDOW.width }}
          onPress={() => this._onPress(rowData)}
          underlayColor={this.props.listUnderlayColor || "#c8c7cc"}
        >
          <View style={[defaultStyles.row, this.props.styles.row, rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}]}>
            {this._renderRowData(rowData)}
            {this._renderLoader(rowData)}
          </View>
        </TouchableHighlight>
      </ScrollView>
    );
  },

  _renderSeparator(sectionID, rowID) {
    if (rowID == this.state.dataSource.getRowCount() - 1) {
      return null
    }

    return (
      <View
        key={ `${sectionID}-${rowID}` }
        style={[defaultStyles.separator, this.props.styles.separator]} />
    );
  },

  _onBlur() {
    this.triggerBlur();
    this.setState({
      listViewDisplayed: false
    });
  },

  _onFocus() {
    this.setState({
      listViewDisplayed: true
    });
  },

  _shouldShowPoweredLogo() {

    if (!this.props.enablePoweredByContainer || this.state.dataSource.getRowCount() == 0) {
      return false
    }

    for (let i = 0; i < this.state.dataSource.getRowCount(); i++) {
      let row = this.state.dataSource.getRowData(0, i);

      if (!row.hasOwnProperty('isCurrentLocation') && !row.hasOwnProperty('isPredefinedPlace')) {
        return true
      }
    }

    return false
  },

  _renderLeftButton() {
    if (this.props.renderLeftButton) { 
      return this.props.renderLeftButton()
    }
  },

  _renderRightButton() {
      if (this.props.renderRightButton) {
        return this.props.renderRightButton()
      }
    },

  _renderPoweredLogo() {
    if (!this._shouldShowPoweredLogo()) {
      return null
    }

    return (
      <View
          style={[defaultStyles.row, defaultStyles.poweredContainer, this.props.styles.poweredContainer]}
        >
          <Image
            style={[defaultStyles.powered, this.props.styles.powered]}
            resizeMode={Image.resizeMode.contain}
            source={require('./images/powered_by_google_on_white.png')}
          />
        </View>
    );
  },

  _getListView() {
    if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
      return (
        <ListView
          keyboardShouldPersistTaps={"always"}
          keyboardDismissMode="on-drag"
          style={[defaultStyles.listView, this.props.styles.listView]}
          dataSource={this.state.dataSource}
          //renderSeparator={this._renderSeparator}
          automaticallyAdjustContentInsets={false}
          {...this.props}
          renderRow={this._renderRow}
          //renderFooter={this._renderPoweredLogo}
        />
      );
    }

    return null;
  },
  render() {
    let {
      onFocus,
      ...userProps
    } = this.props.textInputProps;
    return (
      <View
        style={[defaultStyles.container, this.props.styles.container]}
      >
        <View
          style={[defaultStyles.textInputContainer, this.props.styles.textInputContainer]}
        >
          <TextInput
            { ...userProps }
            ref="textInput"
            numberOfLines={2}
            multiline={true}
            autoFocus={this.props.autoFocus}
            style={[defaultStyles.textInput, this.props.styles.textInput]}
            onChangeText={this._handleChangeText}
            value={this.state.text}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholderTextColor}
            onFocus={onFocus ? () => {this._onFocus(); onFocus()} : this._onFocus}
            underlineColorAndroid={"transparent"}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={true}
          />
        </View>
        <View style={{height:Constants.BaseStyle.DEVICE_HEIGHT/100*5,
          borderBottomColor: Constants.Colors.GhostWhite,borderBottomWidth: 0.5,}} />
        <ScrollView keyboardDismissMode={"interactive"} keyboardShouldPersistTaps={"always"}>
          <TouchableOpacity onPress={()=>this.props.setCurrentLocation()} style={defaultStyles.currentContainer}>
            <Text style={this.props.styles.textStyle}>Nearby</Text>
            <View style={{flexDirection:"row"}}>
              <Text numberOfLines={1} style={[this.props.styles.textStyle,{width:Constants.BaseStyle.DEVICE_WIDTH/100*85}]}>
                {this.props.nearByLocation ? this.props.nearByLocation.formattedAddress:"Please enable your location services."}
              </Text>
              <Image style={defaultStyles.locationIcon} source={Constants.Images.user.loc} />
            </View>
          </TouchableOpacity>
          {
            this.props.isAnywhereRequired &&
            <TouchableOpacity underlayColor={"transparent"} hitSlop={{top:10}} 
              onPress={()=>this.props.anywherePress()} style={defaultStyles.currentContainer}>
              <Text style={this.props.styles.textStyle}>Anywhere</Text>
            </TouchableOpacity>
          }
          {this._getListView()}
          {this.props.children}
        </ScrollView>
      </View>
    );
  },
});

// this function is still present in the library to be retrocompatible with version < 1.1.0
const create = function create(options = {}) {
  return React.createClass({
    render() {
      return (
        <GooglePlacesAutocomplete ref="GooglePlacesAutocomplete"
          {...options}
        />
      );
    },
  });
};


module.exports = {
  GooglePlacesAutocomplete,
  create
};
