import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import SICKComponent from '../SICKComponent'

export default class Needle extends SICKComponent {

	static PropTypes = {
        pivotPoint : PropTypes.objectOf(PropTypes.shape({
            x:PropTypes.number.isRequired,
            y:PropTypes.number.isRequired
        })).isRequired,
        needleLength:PropTypes.number.isRequired,
        color:PropTypes.string.isRequired,
        value:PropTypes.number.isRequired,
        unitAngleRotation:PropTypes.number.isRequired,
        mouseover : PropTypes.func,
        mouseout : PropTypes.func,
        path : PropTypes.string
	}

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const start = `${this.props.pivotPoint.x} ${this.props.pivotPoint.y}`;
        const end = `${this.props.pivotPoint.x} 0`
        const arc = `C${this.props.needleLength/5},{this.props.needleLength/5} 0 0,0 ${this.props.pivotPoint.x} ${this.props.pivotPoint.y+5}`
        this.path = this.props.path || `M${this.props.pivotPoint.x} ${this.props.pivotPoint.y-5} A${arc} L${end} z`
        this.transform = `rotate(${this.props.unitAngleRotation*this.props.value} ${start})`;
    }

    render() {
        return (
            <path 
            d={this.props.path} 
            fill={this.props.color} 
            transform={this.transform}
            mouseover={this.props.mouseover}
            mouseout={this.props.mouseout}
            />
        )
    }
}

