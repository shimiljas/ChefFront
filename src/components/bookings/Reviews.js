/*
 * @file: Reviews.js
 * @description: Review component for booking screens.
 * @date: 17.07.2017
 * @author: Vishal Kumar
 * */

'use-strict';
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Constants from "../../constants";
import Avatar from "../common/Avatar";
import StarRating from "../common/StarRating";

let TEXTLIMIT = 75;

export default class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state ={
      showMore : false
    }
  } 

  onshowmore=()=>{
    this.setState({
      showMore : !this.state.showMore
    })
  } 

  /**
  * render review description
  */
  renderText =() =>{
    let context = this;
    return(
      <View style={{}}>
        {!this.state.showMore && 
          <Text 
            style={styles.textStyle} ellipsizeMode={"tail"} 
            numberOfLines={2}>
              { this.props.data.review.length>=TEXTLIMIT?
                this.props.data.review.capitalizeFirstLetter().substring(0,TEXTLIMIT)+"...":
                this.props.data.review.capitalizeFirstLetter()
              }
          </Text> 
        }
        { this.state.showMore  && 
          <Text  style={styles.textStyle}>
            {this.props.data.review.capitalizeFirstLetter()}
          </Text> 
        }
        { this.props.data.review.length > TEXTLIMIT && 
          <Text style={styles.readMore} onPress={()=>this.onshowmore()} >
          {(!this.state.showMore)? "Read more": "Show less"} </Text> 
        }
      </View>
    )
  }

  render(){
    let {
      mainView,
      profilePhotoContainerStyle,
      commentContainerStyle,
      commentNameStyle,
      commentStyle,
      ratingStyle,
      img,
      name,
      rating,
      comment
    } = this.props;

    return(
      <View style={[styles.mainView, mainView]}>
        <View style={[styles.profilePhotoContainerStyle, profilePhotoContainerStyle]}>
          <Avatar style={{marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*1,}} user={this.props.data} />
        </View>
        <View>
          <Text style={[styles.commentNameStyle, commentNameStyle]}>
            {this.props.data.name.split(" ")[0].capitalizeEachLetter()}
          </Text>
          <StarRating
            editable={false}
            rating={this.props.data.rating}
            style={[styles.ratingStyle, ratingStyle]}
          />
          {this.props.data.hasOwnProperty("review") 
            && this.props.data.review.length>0 && this.renderText()}
        </View>
      </View>
    );
  }
}

Reviews.defaultProps = {
  img: "",
  name: "",
  comment: "",
  rating: 0,
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    paddingVertical: Constants.BaseStyle.DEVICE_HEIGHT*2/100,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1,
  },
  profilePhotoContainerStyle: {
    paddingRight: Constants.BaseStyle.DEVICE_WIDTH*3/100,
    borderWidth: 0,
    alignItems: 'flex-start'
  },
  commentNameStyle: {
    ...Constants.Fonts.normal,
  },
  commentStyle: {
    ...Constants.Fonts.tinyMedium,
    color: Constants.Colors.Gray
  },
  ratingStyle: {
    alignSelf: 'flex-start',
    marginLeft:-Constants.BaseStyle.DEVICE_WIDTH/100*0.5,
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*0,
  },
  textStyle:{
    ...Constants.Fonts.tiny,
    color:Constants.Colors.Gray,
    width : Constants.BaseStyle.DEVICE_WIDTH/100*73,
  },
  readMore:{
    width:80, 
    paddingVertical:1, 
    color:Constants.Colors.Magenta,
    ...Constants.Fonts.tinyMedium
  }
});
