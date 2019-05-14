/*
Copyright 2016 Capital One Services, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

SPDX-Copyright: Copyright (c) Capital One Services, LLC
SPDX-License-Identifier: Apache-2.0
*/

import React,{Component} from 'react'
import {Text as ReactText,View,Dimensions}  from 'react-native'
var {height, width} = Dimensions.get('window');
import Svg,{ G, Path, Rect, Text,Circle } from 'react-native-svg'
import { Colors, Options, cyclic, fontAdapt } from './util'
import Axis from './Axis'
import _ from 'lodash'

export default class LineChart extends Component {

  constructor(props, chartType) {
    super(props)
    this.chartType = chartType
  }

  getMaxAndMin(chart, key, scale, chartMin, chartMax) {
    let maxValue
    let minValue
    _.each(chart.curves, function (serie) {
      let values = _.map(serie.item, function (item) {
        return item[key]
      })

      let max = _.max(values)
      if (maxValue === undefined || max > maxValue) maxValue = max
      let min = _.min(values)
      if (minValue === undefined || min < minValue) minValue = min

      maxValue = chartMax > maxValue ? chartMax : maxValue
      minValue = chartMin < minValue ? chartMin : minValue
    })

    return {
      minValue: minValue,
      maxValue: maxValue,
      min: scale(minValue),
      max: scale(maxValue)
    }
  }

  color(i) {
    let color = this.props.options.color
    if (!_.isString(this.props.options.color)) color = color.color
    let pallete = this.props.pallete || Colors.mix(color || '#9ac7f7')
    return Colors.string(cyclic(pallete, i))
  }

  render() {
    const noDataMsg = this.props.noDataMessage || 'No data available'
    if (this.props.data === undefined) return (<View style={{justifyContent : "center",alignItem :"center",padding:Math.round(height/10)}}><ReactText>{noDataMsg}</ReactText></View>)

    let options = new Options(this.props)

    let accessor = function (key) {
      return function (x) {
        return x[key]
      }
    }

    let chart = this.chartType({
      data: this.props.data,
      xaccessor: accessor(this.props.xKey),
      yaccessor: accessor(this.props.yKey),
      width: options.chartWidth,
      height: options.chartHeight,
      closed: false,
      min: options.min,
      max: options.max
    })

    let chartArea = {
      x:this.getMaxAndMin(chart,this.props.xKey,chart.xscale),
      y:this.getMaxAndMin(chart,this.props.yKey,chart.yscale,options.min,options.max),
      margin:options.margin
    }

    let showAreas = typeof(this.props.options.showAreas) !== 'undefined' ? this.props.options.showAreas : true;
    let strokeWidth = typeof(this.props.options.strokeWidth) !== 'undefined' ? this.props.options.strokeWidth : '1';
    let lines = _.map(chart.curves, function (c, i) {

      return <Path key={'lines' + i} d={ c.line.path.print() } stroke={ this.color(i) } strokeWidth={strokeWidth} fill="none"/>
    }.bind(this))
    let textStyle = fontAdapt(options.label)
   /*const points = _.map(chart.curves, function (c) {
     console.log(c)
      return _.map(c.item,function(p,h) {
  
        let render = <G key={'k' + p.y} x={p.x} y={p.y}>
                    <Circle  cx={p.x} cy={p.y} r={ 2} fillOpacity={1} />
                </G>

        return render
      },this)
    },this)*/
       const points = _.map(chart.curves, function (c) {


      return _.map(c.line.path.points(),function(p,j) {
        let render = <G key={'k' + j} x={p[0]} y={p[1]}>
                    {c.item[j].y>0 &&
                      <Text 
                        fontSize={10}
                        fontWeight={"normal"}
                        fontStyle={textStyle.fontStyle}
                        fill={"#ef3881"}
                        dy={-20}
                        dx={3}
                        fontFamily={"Montserrat-Medium"}>
                        {c.item[j].y}
                      </Text>
                    }
                    <Circle  cx={0} cy={0} r={options.r || 3} fillOpacity={1} fill="#009a0e" />
                </G>

        return render
      },this)
    },this)


    let areas = null

    if(showAreas){
      areas = _.map(chart.curves, function (c, i) {
        return <Path key={'areas' + i} d={ c.area.path.print() } fillOpacity={1} stroke="none" fill={ this.color(i) }/>
      }.bind(this))
    }

    
    let regions
    if(this.props.regions != 'undefined') {
      let styling = typeof(this.props.regionStyling) != 'undefined' ?
        this.props.regionStyling : {}
      let labelOffsetAllRegions = typeof(styling.labelOffset) != 'undefined' ?
        styling.labelOffset : {}

      regions = _.map(this.props.regions, function (c, i) {
        let x, y, height, width, y1, y2, labelX, labelY

        let labelOffset = typeof(c.labelOffset) != 'undefined' ?
          c.labelOffset : {}
        let labelOffsetLeft = typeof(labelOffsetAllRegions.left) != 'undefined'
          ? (typeof(labelOffset.left) != 'undefined'
              ?  labelOffset.left : labelOffsetAllRegions.left) : 20
        let labelOffsetTop = typeof(labelOffsetAllRegions.top) != 'undefined'
          ? (typeof(labelOffset.top) != 'undefined'
              ?  labelOffset.top : labelOffsetAllRegions.top) : 0
        let fillOpacity = typeof(styling.fillOpacity) != 'undefined'
          ? (typeof(c.fillOpacity) != 'undefined'
              ?  c.fillOpacity : styling.fillOpacity) : 1

        y1 = chart.yscale(c.from)
        y2 = chart.yscale(c.to)

        x = 0
        y = y1
        height = (y2 - y1)
        width = chartArea.x.max
 

        labelX = labelOffsetLeft
        labelY = y2 + labelOffsetTop
         
        let regionLabel = typeof(c.label) != 'undefined' ? (
          <View><Text fontFamily={textStyle.fontFamily}
                fontSize={textStyle.fontSize}
                fontWeight={textStyle.fontWeight}
                fontStyle={textStyle.fontStyle}
                fill={textStyle.fill}
                textAnchor="middle"
                x={labelX}
                y={labelY}>{ c.label }</Text></View>
        ) : null
       
          
        return (
          <G key={'region' + i}>
            <Rect key={'region' + i} x={x} y={y} width={width} height={height}
              fill={c.fill} fillOpacity={fillOpacity}/>
            {regionLabel}
          </G>
        )
      }.bind(this))
    }

    {/*let returnValue = <View style={{borderWidth : 1,width : options.width-options.margin.right,borderColor : "grey",}}><Svg width={options.width} height={options.height}>*/}
         let returnValue = <View style={{width : options.width-options.margin.right}}><Svg width={options.width} height={options.height}>
                  <G x={options.margin.left} y={options.margin.top}>
                     {points}
                        { regions }
                        {/* areas */}
                        { lines }
                      <Axis key="x" scale={chart.xscale} options={options.axisX} chartArea={chartArea}  datalen={this.props.data} optionslenght={this.props.options} />
                      <Axis key="y" scale={chart.yscale} options={options.axisY} chartArea={chartArea} datalen={null} optionslenght={null} />
                  </G>
              </Svg></View>

    return returnValue
  }
}
