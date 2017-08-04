import React from 'react'
import SICKComponent from '../SICKComponent'
import * as d3 from 'd3'

export class Sensor extends SICKComponent {


  componentDidUpdate () {
    const data = this.props.data
    const color = this.props.color
  }

  render () {
    const key = this.props.key
    const cx = this.props.cx
    const cy = this.props.cy
    const fill = this.props.fill

    let circleSensor
    return (
      <circle  key={key} cx={cx} cy={cy} r="10" fill={fill}/>
    )
  }
}

export default Sensor