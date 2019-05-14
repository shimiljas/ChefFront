/**
 * @file: Ratting .js
 * @description: Review listing.
 * @date: 22.08.2017
 * @author: Manish
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
import Avatar  from "../../../components/common/Avatar";
import StarRating  from "../../../components/common/StarRating";
import NoRecord from "../../../components/common/NoRecord";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as userActions from '../../../redux/modules/user';
import Reviews from "../../../components/bookings/Reviews";

/**
 * Component Class Begins
 */

class Ratings extends Component{
  /**
  * Default Constructor
  */
  constructor(props){
    super(props);
    this.state = {
      total : 0,
      isRefreshing : true,
    };
    this.skip = 0 ;
    this.limit = 10;
    this.isEndReached = false
  }

  componentDidMount(){
    this.getReviewsList();
  } 

  getReviewsList=()=>{
    let context = this;
    let requestObject = {
      token : context.props.user.userDetails.auth.token,
      userId : context.props.user.userDetails.userId,
    }
    context.props.userActions.getReviewsList(requestObject,function(count){
      context.setState({
        isRefreshing : false
      });
    });
  }

  /**
  * Render FlatList Items
  */
  renderRow(item:string,index:number){
    let context=this;
    return(
      <Reviews
        data = {item}
      />
    )

    return(
      <View key={index} style={[styles.rowContainer]}>
        <Avatar user={rowData} />
        <View style={styles.rightBox}>
          <Text style={styles.textRightAbove}>
            {rowData.name.capitalizeEachLetter()}
          </Text>
          <StarRating 
            editable={false}
            rating={rowData.rating}
            style={styles.star}
          /> 
          {
            rowData.hasOwnProperty("review") && rowData.review.length>0 && 
            <Text style={styles.lastTextItem}>
              {rowData.review.capitalizeFirstLetter()}
            </Text>
          }
        </View> 
     </View>
   );
  }

  onEndReached=()=>{
    let context=this;
    if(!context.isEndReached  && context.skip<context.state.total){
      context.skip = context.skip + context.limit;
      context.isEndReached = true;
      context.setState({
        isFooterVisible : true
      });
    }
  }


  /**
  * On Refresh 
  */
  
  onRefresh=()=>{
    let context=this;
    context.skip=0;
    context.setState({
      isRefreshing:true
    });
    this.setTimeout(()=>context.setState({isRefreshing:false}),1000);
    context.getReviewsList();
  }

  /**
  * Assign id to list items.
  */

  _keyExtractor = (item, index) => index;

  render(){
    let context=this;
    const titleConfig = {
      title: "Ratings",
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    let { goBack } = this.props.navigation;

    return(
      <View style={styles.mainContainer}>
        <NavigationBar
          leftButton={<BackButton onPress={()=>goBack()} />}
          title={titleConfig} />
        <FlatList
          showsHorizontalScrollIndicator = {false}
          showsVerticalScrollIndicator = {false} 
          style={{marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,}}
          data={this.props.user.reviews.length>0?this.props.user.reviews:[]}
          renderItem={({item,index}) =>this.renderRow(item,index)}
          keyExtractor={this._keyExtractor}
          onRefresh={()=>this.onRefresh()}
          refreshing={this.state.isRefreshing}
          ListEmptyComponent={()=><NoRecord />}
        />    
      </View>
    )
  }
}

/*
* UI StyleSheet
*/

const styles = StyleSheet.create({
  container:{
    flex :1,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    backgroundColor:Constants.Colors.White,
  },
  mainContainer:{
    flex :1,
    backgroundColor:Constants.Colors.White,
  },
  rowContainer:{
    backgroundColor:Constants.Colors.Transparent,
    borderBottomWidth:1,
    borderBottomColor:Constants.Colors.GhostWhite,
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH*5/100,
    flex : 1,
    flexDirection :'row',
    //marginVertical:Constants.BaseStyle.DEVICE_HEIGHT/100*3,
    paddingVertical:Constants.BaseStyle.DEVICE_HEIGHT/100*3,
  },
  leftImageBox:{
    flex : 0.3,
    justifyContent :'center',
    alignItems :'center',
  },
  rightBox:{
    flex : 0.7,
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*3,
  },
  rowTitle:{
    marginLeft:20,
    color:Constants.Colors.Green
  },
  topTextRight:{
    flex : 0.3,
    justifyContent : "center"
  },
  textRightAbove:{
    ...Constants.Fonts.normal
  },
  arrow:{
    height: Constants.BaseStyle.DEVICE_WIDTH/100*4,
    width: Constants.BaseStyle.DEVICE_WIDTH/100*3,
    paddingRight : Constants.BaseStyle.DEVICE_WIDTH/100*5,
  },
  middleStars:{
      flex : 0.3,
      flexDirection : "row"
    },
  lastText:{
    flex : 0.4
   },
  leftimage:{
    height: Constants.BaseStyle.DEVICE_WIDTH/100*15,
    width: Constants.BaseStyle.DEVICE_WIDTH/100*15,
    borderRadius : 30,
   },
  lastTextItem:{
    color: Constants.Colors.Gray
  },
  star:{
    alignSelf : 'flex-start',
    marginLeft:-Constants.BaseStyle.DEVICE_WIDTH/100*0.5,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*0,
  }
});

const mapStateToProps = state => ({
  user   : state.user
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
});

ReactMixin(Ratings.prototype, TimerMixin);
export default connect(mapStateToProps, mapDispatchToProps)(Ratings);
