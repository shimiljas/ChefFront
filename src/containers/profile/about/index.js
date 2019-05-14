/**
 * @file: About .js
 * @description: About Application Content like terms, Privacy Policy, Report Problems.
 * @date: 22.06.2017
 * @author: Manish Budhraja
 */

'use strict';

// Import React & React Native Components, JS Libraries, Other Libraries and Modules.
import React, { Component } from 'react';
import ReactNative,{
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ListView,
  Alert,
  FlatList,
  Image
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from "../../../constants";
import DeviceInfo from 'react-native-device-info';
import BackButton  from "../../../components/common/BackButton";
 
/**
 * CLASS BEGINS
 */

class About extends Component{
  /**
  * Default Constructor
  */
  constructor(props){
    super(props);

    let {
      about,
      contact,
      policy,
      service,
    } = Constants.i18n.about;

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      data = [about,contact,policy,service];
    this.state = {
      dataSource: data,
      currentVersion:''
    };
  }

  componentWillMount(){
    this.setState({
      currentVersion:DeviceInfo.getVersion()
    });
  }

  /**
  * On ListView Item Click 
  */
  
  onRowClick = (title) => {
    let context=this;
    let { about, contact, policy, service, } = Constants.i18n.about;
    let { navigate } = this.props.navigation;
    switch(title){
      case about:
        navigate("WebView",{title:about, url:"aboutUs"});
      break;
      case contact:
        navigate("ContactSupport"); 
      break;
      case policy:
        navigate("WebView",{title:policy,url:"privacy"});
      break;
      case service:
        navigate("WebView",{title:service,url:"terms"});
      break;
    }
  };

  /**
  * Render FlatList Items
  */
  renderRow(rowData:string,index:number){
    let context=this;
    return(
      <TouchableOpacity key={index} underlayColor={Constants.Colors.Transparent} onPress={() => context.onRowClick(rowData)} 
        style={styles.rowContainer}>
          <Text style={[styles.rowTitle, Constants.Fonts.normal]}>
            {rowData}
          </Text>
          <Image style={styles.arrow} source={Constants.Images.caterer.arrow_green} />
      </TouchableOpacity>
   );
  }

  _keyExtractor = (item, index) => item;

  render(){
    let context=this;
    const titleConfig = {
      title: "About",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    let {
      version, rights
    } = Constants.i18n.about;
    let { goBack } = this.props.navigation;
    return(
      <View>
        <NavigationBar
          leftButton={<BackButton onPress={()=>goBack()} />}
          title={titleConfig} />
        <View style={styles.container}>  
          <FlatList
            style={styles.list}
            data={this.state.dataSource}
            renderItem={({item,index}) =>this.renderRow(item,index)}
            keyExtractor={this._keyExtractor}
          />
          <View style={[styles.submitButton]}>
            <View style={{flexDirection:"row"}}>
              <View style={styles.copyRight}>
                  <Text style={[styles.buttonTextStyle,{alignSelf:"center",fontSize:8}]}>C</Text>
              </View>
              <Text style={[styles.buttonTextStyle,{marginLeft:3},Constants.Fonts.normal]}>
                {Constants.i18n.about.rights}
              </Text>
            </View>  
            <Text style={[styles.buttonTextStyle,Constants.Fonts.normal]}>
              {Constants.i18n.about.version + " "+context.state.currentVersion}
            </Text>
          </View>
         </View>      
      </View>
    )
  }
}

/*
* UI StyleSheet
*/

const styles = StyleSheet.create({
  container:{
    width:Constants.BaseStyle.DEVICE_WIDTH,
    backgroundColor:Constants.Colors.White,
  },
  list:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*80,
  },
  submitButton:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*20,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    backgroundColor:Constants.Colors.Transparent,
    alignItems:"center",
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*0.2,
  },
  buttonTextStyle:{
    color:Constants.Colors.Green
  },
  rowContainer:{
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*13,
    backgroundColor:Constants.Colors.Transparent,
    alignItems:"flex-start",
    justifyContent:"center",
    borderBottomWidth:1,
    borderBottomColor:Constants.Colors.GhostWhite,
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
  },
  rowTitle:{
    marginLeft:Constants.BaseStyle.DEVICE_WIDTH*2/100,
    color:Constants.Colors.Green
  },
  arrow:{
    height: Constants.BaseStyle.DEVICE_WIDTH/100*6,
    width: Constants.BaseStyle.DEVICE_WIDTH/100*3,
    position:"absolute",
    right:Constants.BaseStyle.DEVICE_WIDTH*2/100,
  },
  copyRight:{
    borderColor:Constants.Colors.Green,
    height:Constants.BaseStyle.DEVICE_WIDTH/100*3,
    width:Constants.BaseStyle.DEVICE_WIDTH/100*3,
    borderWidth:1,
    borderRadius:Constants.BaseStyle.DEVICE_WIDTH/100*3,
    marginTop:Constants.BaseStyle.DEVICE_WIDTH/100*0.2,
    alignSelf:"center"
  }
});

module.exports = About;
