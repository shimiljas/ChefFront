/*
 * @file: index.js
 * @description: App's root file to connect redux store with app
 * @date: 10.08.2017
 * @author: Parshant Nagpal
 * */

import React, { Component } from 'react';
import { StyleSheet, View,ScrollView,Text } from 'react-native';
import { Bar,Pie,SmoothLine,Scatterplot,StockLine,Radar,Tree } from 'react-native-pathjs-charts'
import _ from 'lodash';
import Constants from "../../constants";
const styles = StyleSheet.create({
	container: {
    flex :1,
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
  innerBar:{
    borderWidth : 1,
    borderColor : Constants.Colors.PureBlack,
    //padding : 10,
  },
  emptyView:{
    justifyContent: "center",
    alignItems: 'center',
    flex:1
  },
  textStyle:{
    ...Constants.Fonts.normal,
    color:Constants.Colors.Black,
    alignSelf:"center"
  }
});

const Year = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const Week = ["Sun","Mon","Tue","Wed","Thr","Fri","Sat"];
const Month = ["First week","Second week","Third week","Fourth week","Current week"]
let dataograph = [];
export default class BarChart extends Component {
  constructor(props) {
    super(props);
      this.state ={
      data : [],
      maxmimumData : 0,
    }
  }
 
  componentWillReceiveProps(nextProps) {
    if(this.props.data!= nextProps.data){
       this.BarData(nextProps.data,nextProps.duration);
    }
  
  }
  pushDataYearly(dataArray,daytype){
   let dummyArray = dataArray, datadummyy=[];
             let dummyArrayUpList = [];
             let dummyArrayDownList = [];
             _.map(dummyArray,(item)=>{
                      if(item._id == new Date().getFullYear()){
                      dummyArrayDownList.push(item)
                      }
                      else{
                       dummyArrayUpList.push(item) 
                      }
                 })
              dummyArrayDownList =_.sortBy(dummyArrayDownList, [function(o) { return o.month; }]);
              dummyArrayUpList =_.sortBy(dummyArrayUpList, [function(o) { return o.month; }]).reverse();
          for (var ini = 1;ini <= new Date().getMonth()+1;ini++){
               if(_.findIndex(dummyArrayDownList, { month: ini })<0){
                  dummyArrayDownList.push({_id : new Date().getFullYear(),count : 0,cost : 0,month : ini})
                 }
             }
          for (var ini = 12; ini >= new Date().getMonth()+1;ini--){
               if(_.findIndex(dummyArrayUpList, { month: ini })<0){
                  dummyArrayUpList.push({_id : new Date().getFullYear()-1,count : 0,cost : 0,month : ini})
                 }
            }
          dummyArrayDownList = _.sortBy(dummyArrayDownList,'month');
          dummyArrayUpList = _.sortBy(dummyArrayUpList,'month');
          return [...dummyArrayUpList,...dummyArrayDownList];

  }
  pushData(dataArray,daytype){
      let datadummyy = [];
          let index=1;
          _.map(dataArray,(item,i)=>{
           // console.log("weee",item._id[daytype])
          if(index == item._id[daytype]){
            datadummyy.push(item)
            index++;
          }else{
            var ind = item._id[daytype] - index;
            for (var ini = 1;ini <= ind;ini++){
            datadummyy.push({_id : {[daytype] :dataArray[i]._id[daytype]-ini } ,cost : 0})
            index=index+1;
          }
             datadummyy.push(item)
             index=index+1;
          }

          })
          if(daytype == "dayOfWeek"){
          if(datadummyy.length != 7){
            while (datadummyy.length != 7) {
                 datadummyy.push({_id : {[daytype] :datadummyy[datadummyy.length-1]._id[daytype]+1 } ,cost : 0})
                                           }
                 }

           }
          else if (daytype == "month"){
               if(datadummyy.length != 12){
                    while (datadummyy.length != 12) {
                datadummyy.push({_id : {[daytype] :datadummyy[datadummyy.length-1]._id[daytype]+1 } ,cost : 0})
                       }
                } 
          }
          dataArray = _.sortBy(datadummyy, [function(o) { return o._id[daytype]; }]);

         //  dataArray = _.sortBy(datadummyy, [function(o) { return o._id.week; }]);
         return dataArray;

  }

  concatSeperateData(dataArray,daywhat,meth){
             let dummyArray = dataArray;
             let dummyArrayUpList = [];
             let dummyArrayDownList = [];
             let checkdata;
              if(meth == "getDay"){
               checkdata = new Date().getDay();
                }
              else if(meth == "getMonth"){
                checkdata = new Date().getMonth()+1;
              } 
               _.map(dummyArray,(item)=>{
                    if(item._id[daywhat] <= checkdata){
                    dummyArrayDownList.push(item)
                    }
                    else{
                     dummyArrayUpList.push(item) 
                    }
               })
              dummyArrayDownList =_.sortBy(dummyArrayDownList, [function(o) { return o._id.dayOfWeek; }]);
              dummyArrayUpList =_.sortBy(dummyArrayUpList, [function(o) { return o._id.dayOfWeek; }]);
              dataArray = [];
              dataArray = dummyArrayUpList.concat(dummyArrayDownList);
              return dataArray;
  }
  MonthlyData(dataArray){
          let datadummyy = [];
          let index=0;
          _.map(dataArray,(item,i)=>{
              if(Month[index]==item.weekName){
                datadummyy.push(item)
                index++;
              }else{
                 while (Month[index]!=item.weekName) {
                      datadummyy.push({_id : {week :dataArray[i]._id.week-1 } ,cost : 0 ,weekName : Month[index] })
                       index=index+1;
                     }
                
                 datadummyy.push(item)
                 index=index+1;
              }

          })
          dataArray = _.sortBy(datadummyy, [function(o) { return o._id.week; }]);
          return dataArray;
  }
  BarData(dataProps,durationProps){
         dataograph[0] = [];
         let dataArray;
         if(durationProps == "Monthly"){
             if(dataProps.length == 0){
                this.setState({data : undefined})
                return
                var oneDay = 24*60*60*1000; 
                var firstDate = new Date();
               var secondDate = new Date(new Date().getFullYear(),0,1);

               var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
               Math.round(diffDays/7)
               dataProps.push({_id : {week : Math.round(diffDays/7) } ,cost : 0 ,weekName : Month[Month.length-1] })
             }
         dataArray = _.sortBy(dataProps, [function(o) { return o._id.week; }]);
         dataArray = this.MonthlyData(dataArray);
        }
        else if (durationProps == "Yearly"){
           if(dataProps.length == 0){
                this.setState({data : undefined})
             return
            
           dataProps.push({_id : {month :new Date().getMonth()+1 } ,cost : 0})
             }
          dataArray = _.sortBy(dataProps, [function(o) { return o._id; }]);
          dataArray = this.pushDataYearly(dataArray,"month");
        }
        else if (durationProps == "Weekly"){
          if(dataProps.length == 0){
             this.setState({data : undefined})
             return 
             var firstDate = new Date().getDay()+1;
             dataProps.push({_id : {dayOfWeek :firstDate } ,cost : 0})
             }
             dataArray = _.sortBy(dataProps, [function(o) { return o._id.dayOfWeek; }]);
             dataArray = this.pushData(dataArray,"dayOfWeek")
             dataArray  = this.concatSeperateData(dataArray,"dayOfWeek","getDay")
           
        }
         else if (durationProps == "LifeTime"){
           if(dataProps.length == 0){
            this.setState({data : undefined})
            return
           dataProps.push({_id : {year :new Date().getFullYear() } ,cost : 0})
             }
         dataArray = _.sortBy(dataProps, [function(o) { return o._id.year; }]);
        }
         else if (durationProps == "SixMonths"){
            if(dataProps.length == 0){
            this.setState({data : undefined})
            return
           dataProps.push({_id : {month :new Date().getMonth()+1 } ,cost : 0})
             }
           dataArray = _.sortBy(dataProps, [function(o) { return o._id.month; }]);
           dataArray = this.pushData(dataArray,"month")
           dataArray  = this.concatSeperateData(dataArray,"month","getMonth")
           dataArray.splice(0,6);
        }

         _.map(dataArray,(item)=>{
          if(durationProps == "Monthly")
          dataograph[0].push({"v" : item.cost,"name" :item.weekName.split(" ")[0]})
          else if (durationProps == "Yearly")
          dataograph[0].push({"v" : item.cost,"name" : Year[item.month-1]})
          else if (durationProps == "Weekly")
          dataograph[0].push({"v" : item.cost,"name" : Week[item._id.dayOfWeek-1]})
          else if(durationProps == "LifeTime")
          dataograph[0].push({"v" : item.cost,"name" :item._id.year})
          else if(durationProps == "SixMonths")
          dataograph[0].push({"v" : item.cost,"name" :Year[item._id.month-1]})

  })
         let maxmimumdata =_.maxBy(dataograph[0], function(o) { return o.v; });
         
          this.setState({data : dataograph,maxmimumData : maxmimumdata})
        
  }

	render() {
	

  let options = {
    width: Constants.BaseStyle.DEVICE_WIDTH*70/100,
    height: Constants.BaseStyle.DEVICE_HEIGHT*15/100,

    margin: {
      top: Constants.BaseStyle.DEVICE_HEIGHT*3/100,
      left: Constants.BaseStyle.DEVICE_WIDTH*12/100,
      right: Constants.BaseStyle.DEVICE_WIDTH*12/100,
      bottom: Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    },
    color: Constants.Colors.HeaderGreen,
    gutter: Constants.BaseStyle.DEVICE_WIDTH*4/100,
    animate: {
      type: 'oneByOne',
      duration: 200,
      fillTransition: 3
    },
    axisX: {
      showAxis: true,
      showLines: false,
      showLabels: true,
      showTicks: false,
      zeroAxis: false,
      orient: 'bottom',
      label: {
        fontFamily: 'Montserrat-Medium',
        fontSize: this.state.data != undefined ? Constants.BaseStyle.DEVICE_WIDTH*2/100 : 10  ,
        fontWeight: true,
        fill: Constants.Colors.Gray
      },
      color:Constants.Colors.HeaderGreen,
      tickColor:Constants.Colors.HeaderGreen,
    },
    axisY: {
      dataSlot : 2,
      showAxis: true,
      accurateDecimal : true,
      showLines: false,
      showLabels: true,
      enableData:false,
      showTicks: true,
      zeroAxis: false,
      days : this.state.maxmimumData.v,
      orient: 'left', 
      label: {
        fontFamily: 'Montserrat-Medium',
        fontSize: Constants.BaseStyle.DEVICE_WIDTH*2/100,
        fontWeight: true,
        fill: Constants.Colors.Gray
      },
      color:Constants.Colors.HeaderGreen,
      tickColor:Constants.Colors.HeaderGreen,
    }
  } 

  if(this.state.data==undefined || this.state.data.length==0){
    return(
      <View style={styles.emptyView}>
        <Text style={styles.textStyle}>No Records Found.</Text>
      </View>
    )
  }

  /*This component shows the bar chart*/
		return (
			<View style={styles.container}>
         <Bar data={this.state.data} options={options} accessorKey='v'/>
	    </View>
		);
	}
}