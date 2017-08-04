import React from 'react'
import * as d3 from 'd3'
import Paper from 'material-ui/Paper'
import SICKComponent from '../SICKComponent'
import {GridList, GridTile} from 'material-ui/GridList'
import Sensor from './Sensor'

export class Grid extends SICKComponent {

  componentDidUpdate(){
    const backgroundImage = this.props.image
    const data = this.props.locationArray

    var vis = d3.select("#machine-widget svg")
      .data([data])
      .attr("width", 600)
      .attr("height", 400)
      .append("svg:g")
      .attr("transform", "translate(" + 10 + "," + 10 + ")")
    for (var i = 0; i < data.length; i++) {
      vis.append("circle")
        .attr('cx',data[i].x)
        .attr('cy',data[i].y)
        .attr('r',10)
        .attr("fill",'red')
        .attr("key",[i])
    }
  }




  render () {
    const backgroundImage = this.props.image
    const locations = this.props.locationArray

    return (
      <div id="machine-widget">
        <Paper style={{
          backgroundImage: "url(" +backgroundImage+")",
          backgroundColor: '#cccccc',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          width: '600px',
          height: '400px',
          marginTop: '150px',
          marginLeft: '330px'}} >
          <svg/>
        </Paper>
      </div>
    )
  }
}

export default Grid
