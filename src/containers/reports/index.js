/*
 * @file: index.js
 * @description: App's root file to connect redux store with app
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity,Picker } from 'react-native';
import Constants from "../../constants";
import Background from '../../components/common/Background';
import BackButton from '../../components/common/BackButton';
import FormTextInput from '../../components/common/FormTextInput';
import NavigationBar  from "react-native-navbar";
import BarChart from './BarChart';
import AppointmentLine from './AppointmentLine';
import SubmitButton from '../../components/common/RoundButton';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Idx from '../../utilities/Idx';
import * as ReportAction from '../../redux/modules/reports';

let items = [{
  name : "Weekly",value : 7, key :"Weekly",
},{
   name : "Monthly",value : 4, key :"Monthly",
},{
  name : "SixMonths",value : 6, key :"Six months",
},{
  name : "Yearly",value : 12, key :"Yearly",
},{
   name : "LifeTime",value : 6, key :"Life time",
},]; 

let token,userId;

class Chef extends Component {
  
  constructor(props) {
    super(props);
    if(Idx(this.props,_ => _.user.userDetails.auth.token)){
      token = this.props.user.userDetails.auth.token;
      userId = this.props.user.userDetails.userId;
    }
    this.state = {
      showPicker : false,
      select : 4,
      days :new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate(),
      selectindex : 0,
      currentIndex : 0,
      duration : "Weekly"
    }
  }
  componentDidMount() {
    setTimeout(()=>{
      this.props.ReportAction.getReports({token : token,userId : userId,duration : items[this.state.selectindex].name})
      console.log("dayssss",this.state.days)
    },250);
  }

  done(){
    this.setState({
      showPicker:false, 
      currentIndex : this.state.selectindex,
      duration : items[this.state.selectindex].name
    });
    this.props.ReportAction.getReports({token : token,userId : userId,duration : items[this.state.selectindex].name})  
  }

  /*This function display picker items */
  getBrPickerItems() {
    let itemsPicker=[]; 
    items.map((item,i)=>{
      itemsPicker.push(
        <Picker.Item 
          style={{...Constants.Fonts.normal,}}
          key={i} 
          label={item.key} 
          value={item.name} />
      )
    });
    return itemsPicker;
  }

  /*This function is called when picker is selected */
  onValueChange = (itemValue, itemIndex) => {
    this.setState({
      select: itemValue,
      selectindex :itemIndex
    });
  }

  // Default Render Function
  render() {
    let { report, appointment, revenue , my_revenue, demand } = Constants.i18n.reports;
    let { goBack } = this.props.navigation;
    const titleConfig = {
      title: report,
      tintColor: "#fff",
      style:{
        ...Constants.Fonts.content
      }
    };
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<BackButton onPress={()=>goBack()} />}
          title={titleConfig} />
         <View style={styles.filter}>
           <Text style={styles.textStyle}>
              Filter
           </Text>
         </View>
       <View style={{flex: 0.15}}>
           <View style={styles.pickerButton}>
               <TouchableOpacity activeOpacity={0.9} onPress={()=>this.setState({showPicker:true})} style={styles.pickerInternal}>
                   <Text style={styles.textStyle}>
                 {items[this.state.currentIndex].key}
                   </Text>
                   <Image
                      style={{height: 10, width: 10}}
                      source={Constants.Images.caterer.right_arrow}
                   />
              </TouchableOpacity>
           </View>
       </View>
       <View style={styles.appointments}>
          <Text style={styles.textStyle}>My appointments</Text>
       </View>
         <View style={{flex: 0.30}}>
               <View style={{flex: 0.10}}>
               </View>
               <View style={{flex: 0.75}}>
                   <AppointmentLine 
                     duration={this.state.duration} 
                     data={this.props.reports.reports} 
                     select={this.state.select} 
                     days={this.state.days}/>
              </View>
               <View style={{flex: 0.10}}>
               </View>
         </View>
       <View style={styles.revenue}>
            <Text style={styles.textStyle}>My revenue</Text>
       </View>
       <View style={styles.revenueInternal}>
             <View style={styles.revenueBlank}>
             </View>
              <View style={styles.revenueMain}>
               <BarChart 
                 duration={this.state.duration} 
                 data={this.props.reports.reports} 
                 select={this.state.select} 
                 days={this.state.days}/>
              </View>
       </View>
           {this.state.showPicker == false ? null :
          <View 
           style={styles.pickerShowUpper}>
             <View style={styles.pickerShow}>
                <TouchableOpacity 
                  onPress={()=>this.setState({showPicker:false})}
                  activeOpacity={0.9} style={{alignItems:"flex-end",
                  alignSelf:"flex-end"}} hitSlop={{top:5,right:5,left:5,bottom:5}}>
                  <Text style={styles.cancelStyle}>Cancel</Text>
                </TouchableOpacity>
                <Picker
                  selectedValue={this.state.select}
                  onValueChange={this.onValueChange}
                 >
                  {this.getBrPickerItems()}
                </Picker>
                <View style={styles.buttonCenter}>
                     <SubmitButton
                      text={"Done"}
                      _Press={() => {this.done()}} />
                </View>
             </View>
          </View>
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Constants.Colors.GhostWhite
  },
  filter: {
    flex: 0.05,
    backgroundColor :'#ffffff',
    justifyContent : 'center',
    paddingLeft : 10},
  pickerButton:{
    margin : 20,
    flex: 1,
    justifyContent : "center"
  }, 
  buttonCenter:{
  justifyContent : "center",
  alignItems:"center"
  }, 
  pickerInternal:{
    height : 30,
    backgroundColor :"#ffffff",
    flexDirection : "row",
    justifyContent : "space-between",
    alignItems:"center",
    padding : 10},
  appointments : {
    flex: 0.05,
    backgroundColor :'#ffffff',
    justifyContent : 'center',
    paddingLeft : 10},
  revenue :{
    flex: 0.05,
    backgroundColor :'#ffffff',
    justifyContent : 'center',
    paddingLeft : 10
  },
  revenueInternal :{
    flex: 0.40,
    backgroundColor :'transparent'
  },
  revenueBlank:{
    flex : 0.15
  },
  revenueMain:{
    flex :.85
  },
  pickerShow:{
    position: 'absolute',
    backgroundColor:"white",
    bottom:0,
    left:0,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    height:Constants.BaseStyle.DEVICE_HEIGHT/100*55,
    shadowColor:"gray",
    shadowOffset: {width: 2, height: 2},
    shadowOpacity:0.9,
    shadowRadius:10
  },
  pickerShowUpper:{
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
    width:Constants.BaseStyle.DEVICE_WIDTH,
    height:Constants.BaseStyle.DEVICE_HEIGHT
  },
  textStyle : {
    ...Constants.Fonts.normal,
    color : Constants.Colors.Black
  },
  cancelStyle:{
    alignSelf:"flex-end", 
    margin:5,
    ...Constants.Fonts.normal,
    color : Constants.Colors.Black
  }
});


const mapStateToProps = state => ({
  user: state.user,
  reports : state.reports,
});

const mapDispatchToProps = dispatch => ({
  ReportAction: bindActionCreators(ReportAction,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Chef);