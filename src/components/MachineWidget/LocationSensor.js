import React from 'react'
import * as d3 from 'd3'
import theme from '../../../tests/theme'
import SICKComponent from '../SICKComponent'
import IconButton from 'material-ui/IconButton';
import Sensor from './Sensor'
const palette = theme.palette

export class LocationSensor extends SICKComponent {

  // constructor(props) {
  //   super(props);
  //   // this.state = { hoveredTooltip: false }
  //   this.state = {currentCount: 10}
  // }

  //
  // var InfoPage = React.createClass({
  // getInitialState: function () {
  //   return { info: {} };
  // },
  //
  // timer() {
  //   this.setState({
  //     currentCount: this.state.currentCount - 1
  //   })
  //   if(this.state.currentCount < 1) {
  //     clearInterval(this.intervalId);
  //   }
  // }
  // componentDidMount() {
  //   this.intervalId = setInterval(this.timer.bind(this), 1000);
  //   console.log(this.intervalId)
  // }
  // componentWillUnmount(){
  //   clearInterval(this.intervalId);
  // }

  componentDidUpdate () {
    const data = this.props.data
    const color = this.props.color
    // d3.select("g").remove()

    // var tip = d3.select('#machine-widget')
    //   .append('div')
    //   .attr('class', 'tip')
    //   .style('border', '1px solid steelblue')
    //   .style('padding', '5px')
    //   .style('position', 'absolute')
    //   .style('display', 'none')
    //   .on('mouseover', function(d, i) {
    //     tip.transition().duration(0);
    //   })
    //   .on('mouseout', function(d, i) {
    //     tip.style('display', 'none');
    //   });

    // var div = d3.select('body').append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 1e-6)
    //
    // function mousemove(d) {
    //   var output = '';
    //
    //   div.style('opacity', 1)
    //     .text(d+1)
    // }

    // var vis = d3.select('#machine-widget svg')
    //   .data([data])
    //   .attr('width', 600)
    //   .attr('height', 400)
    //   .append("svg:g")
    //   .attr("transform", "translate(" + 10 + "," + 10 + ")")

    // for (var i = 0; i < data.length; i++) {
    //
    //   const circle=vis.append('circle')
    //     .attr('cx', data[i].x)
    //     .attr('cy', data[i].y)
    //     .attr('r', 10)
    //     .attr('fill', function() {
    //       if (i % 5 === 0) {
    //         { return '#9e9e9e' }
    //       }
    //       else if ((i % 2 !== 0) && (i % 3 === 0)) {
    //         { return '#00c853' }
    //       }
    //       else {
    //         if (color === 0) { return '#d50000' }
    //         else if (color > 5 && color < 10) { return '#d50000' }
    //         else { return '#00c853' }
    //       }
    //     })
    //
    //     .attr('key', [i]);
    //
    //   // (function(d){
    //   //   circle.on('mouseover', mousemove(d));
    //   // })(i);
    //
    // }

    d3.selectAll("circle")
      .data(data)
      .append("svg:title")
      .text(function(d, i) {
        if (d.state === 0 ){
          return "Sensor " + (i+1)
        }
        else{
          return "Sensor " + (i+1)
        }
      })

  }

  render () {
    const data = this.props.data
    const color = this.props.color
    let circleSensor
    return (
      <svg style={{height: '400px', width: '600px'}}>
        <g transform="translate(10,10)">
        {
          data.map((d, i) => {
            if (d.state === 0) {
              circleSensor = <Sensor  key={i} cx={d.x} cy={d.y} r="10" fill='#9e9e9e'/>
            } else {
              circleSensor = <Sensor  key={i} cx={d.x} cy={d.y} r="10" fill={color}/>
            }
            return (
              circleSensor
            )
          })
        }
        </g>
      </svg>
    )
  }
}

export default LocationSensor


