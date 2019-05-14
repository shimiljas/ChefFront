/*
 * @file: index.js
 * @description: App's root file to connect redux store with app
 * @date: 10.08.2017
 * @author: Parshant Nagpal
 * */
 
import React, { Component } from 'react';
import { StyleSheet, View,ScrollView, Text } from 'react-native';
import { Bar,Pie,SmoothLine,Scatterplot,StockLine,Radar,Tree } from 'react-native-pathjs-charts'
import Constants from "../../constants";
import _ from 'lodash';
let lifeTimeDataValues=[]
const Year = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const Week = ["Sun","Mon","Tue","Wed","Thr","Fri","Sat"];
const Month = ["First week","Second week","Third week","Fourth week","Current week"]
let dataograph = [];
const styles = StyleSheet.create({
	container: {
     justifyContent: "center",
		 alignItems: 'center',
		 backgroundColor: 'transparent',
	},
  innerContainer:{
      padding : 10,
      borderWidth : 1,
      borderColor : Constants.Colors.PureBlack,
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

export default class AppointmentLine extends Component {
    constructor(props) {
    super(props);
      this.state ={
      data : [],
      maxmimumData : 0,
      enableData : false,
      slots : 7
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.data!= nextProps.data){
        switch(nextProps.duration){
          case "Weekly":
            this.setState({
              duration : 7
             })
          break;
          case "Monthly":
          this.setState({
            duration : 4
           })
          break;
          case "SixMonths":
            this.setState({
              duration : 6
             })
          break;
          case "Yearly":
            this.setState({
              duration : 12
             });
          break;
          case "LifeTime":
            this.setState({
              duration : 2
             });
          break;
        }
       this.AppointmentData(nextProps.data,nextProps.duration);
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
            datadummyy.push({_id : {[daytype] :dataArray[i]._id[daytype]-ini } ,count : 0})
            index=index+1;
          }
             datadummyy.push(item)
             index=index+1;
          }

          })
          if(daytype == "dayOfWeek"){
          if(datadummyy.length != 7){
            while (datadummyy.length != 7) {
                 datadummyy.push({_id : {[daytype] :datadummyy[datadummyy.length-1]._id[daytype]+1 } ,count : 0})
                                           }
                 }

           }
          else if (daytype == "month"){
               if(datadummyy.length != 12){
                    while (datadummyy.length != 12) {
                datadummyy.push({_id : {[daytype] :datadummyy[datadummyy.length-1]._id[daytype]+1 } ,count : 0})
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
                      datadummyy.push({_id : {week :dataArray[i]._id.week-1 } ,count : 0 ,weekName : Month[index] })
                       index=index+1;
                     }
                
                 datadummyy.push(item)
                 index=index+1;
              }

          })
          dataArray = _.sortBy(datadummyy, [function(o) { return o._id.week; }]);

          return dataArray;
  }
    AppointmentData(dataProps,durationProps){
    //  console.log("dataProps",dataProps)
         dataograph[0] = [];
         let dataArray;
         if(durationProps == "Monthly"){
             if(dataProps.length == 0){
                this.setState({data : undefined})
                return
             }
         dataArray = _.sortBy(dataProps, [function(o) { return o._id.week; }]);
         dataArray = this.MonthlyData(dataArray);
        }
        else if (durationProps == "Yearly"){
           if(dataProps.length == 0){
                this.setState({data : undefined})
             return
            
           dataProps.push({_id : {month :new Date().getMonth()+1 } ,count : 0})
             }
          dataArray = _.sortBy(dataProps, [function(o) { return o._id; }]);
          dataArray = this.pushDataYearly(dataArray,"month");
        }
        else if (durationProps == "Weekly"){
          if(dataProps.length == 0){
             this.setState({data : undefined})
             return 
             var firstDate = new Date().getDay()+1;
             dataProps.push({_id : {dayOfWeek :firstDate } ,count : 0})
             }
             dataArray = _.sortBy(dataProps, [function(o) { return o._id.dayOfWeek; }]);
             dataArray = this.pushData(dataArray,"dayOfWeek")
             dataArray  = this.concatSeperateData(dataArray,"dayOfWeek","getDay")
           
        }
         else if (durationProps == "LifeTime"){
           if(dataProps.length == 0){
            this.setState({data : undefined})
            return
            dataProps.push({_id : {year :new Date().getFullYear() } ,count : 0})
             }
           dataArray = _.sortBy(dataProps, [function(o) { return o._id.year; }]);
        }
         else if (durationProps == "SixMonths"){
            if(dataProps.length == 0){
            this.setState({data : undefined})
            return
           dataProps.push({_id : {month :new Date().getMonth()+1 } ,count : 0})
             }
           dataArray = _.sortBy(dataProps, [function(o) { return o._id.month; }]);
           dataArray = this.pushData(dataArray,"month")
           dataArray  = this.concatSeperateData(dataArray,"month","getMonth")
           dataArray.splice(0,6);
        }

         _.map(dataArray,(item,i)=>{
          if(durationProps == "Monthly")
          {
          dataograph[0].push({"y" : item.count,"name" :item.weekName.replace(" week",""),"x":i+1})
          }
          else if (durationProps == "Yearly")
          dataograph[0].push({"y" : item.count,"xy" : item.month,"name" : Year[item.month-1],"x":i+1 })
          else if (durationProps == "Weekly")
          dataograph[0].push({"y" : item.count,"xy" : item._id.dayOfWeek,"name" : Week[item._id.dayOfWeek-1],"x":i+1})
          else if(durationProps == "LifeTime"){
          dataograph[0].push({"y" : item.count,"xy" :item._id.year,"name" :item._id.year,"x":i+1, lifetime:true})   
        }
          else if(durationProps == "SixMonths")
          dataograph[0].push({"y" : item.count,"xy" : item._id.month,"name" :Year[item._id.month-1],"x":i+1})

  })

   if(durationProps == "LifeTime" && dataograph[0].length==1){
      dataograph[0][0].x = 2;
      dataograph[0].push({"y" : 0,"xy" :dataograph[0][0].xy-1,"name" :dataograph[0][0].xy-1,"x":dataograph[0][0].x-1,lifetime:true})
      dataograph[0] = _.sortBy(dataograph[0], [function(o) { return o.x; }]);
    }
    let maxmimumdata =_.maxBy(dataograph[0], function(o) { return o.y; });
    this.setState({data : dataograph,maxmimumData : maxmimumdata})
    this.setState({enableData : true});
    lifeTimeDataValues = _.map(dataograph[0],function(data,i){
      return { value:i+1 };
    });
  }
	render() {

  let options = {
    width: Constants.BaseStyle.DEVICE_WIDTH*80/100,
    height: Constants.BaseStyle.DEVICE_HEIGHT*15/100,
    color: Constants.Colors.HeaderGreen,
    chartWidth : 350,

   margin: {
      top: Constants.BaseStyle.DEVICE_WIDTH*5/100,
      left: Constants.BaseStyle.DEVICE_WIDTH*8/100,
      bottom:Constants.BaseStyle.DEVICE_WIDTH*4/100,
      right:Constants.BaseStyle.DEVICE_WIDTH*5/100,
    },
    animate: {
      type: 'delayed',
      duration: 200,
      fillTransition:3,
    },
    axisX: {
      showAxis: true,
      dataSlot : this.state.data !== undefined && this.state.data.length !=0 ? this.state.data[0].length : 1,
      days :  this.state.data !== undefined && this.state.data.length !=0 ? this.state.data[0].length : 1,
      showLines: false,
      showLabels: this.state.enableData,
      showTicks: false,
      enableData:this.state.enableData,
      dataX: this.state.data !== undefined && this.state.data.length !=0 ? this.state.data[0] : [],
      zeroAxis: false,
      orient: 'top',
      tickValues: this.state.data !== undefined && this.state.data.length !=0 && this.props.duration==="LifeTime"?lifeTimeDataValues:[] ,
      label: {
        fontFamily: 'Montserrat-Medium',
        fontSize: Constants.BaseStyle.DEVICE_WIDTH*2/100,
        fontWeight: true,
        fill: Constants.Colors.Gray,
      },
      color:Constants.Colors.HeaderGreen,
      tickColor:Constants.Colors.HeaderGreen,
    },
    axisY: {
      showAxis: true,
      showLines: false,
      dataSlot :2,
      days : this.state.maxmimumData !== undefined ? this.state.maxmimumData.y : 1,
      showLabels: true,
      showTicks: true,
      accurateDecimal : true,
      zeroAxis: false,
      enableData:false,
      orient: 'left',
      tickValues: [],
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

/*This component shows the appointment graph */	
		return (
			<View style={styles.container}>
        <StockLine data={this.state.data} options={options} xKey='x' yKey='y' />
			</View>
		);
	}
}