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
        startAngle:PropTypes.number.isRequired,
        unitAngleRotation:PropTypes.number.isRequired,
        mouseover : PropTypes.func,
        mouseout : PropTypes.func,
        path : PropTypes.string
	}

    constructor(props) {
        super(props);
    }

    componentDidUpdate(){
        const startAngleOffset= 90+this.props.startAngle;
        d3.select('g.needle')
                        .transition()
                        .duration(2000)
                        .attr('transform',`rotate(${startAngleOffset+(this.props.unitAngleRotation*this.props.value)})`);
        
    }

    componentWillMount() {
        const start = `${this.props.pivotPoint.x},${this.props.pivotPoint.y}`;
        const end = `${-1*this.props.needleLength} 0`
        const arc = `5,5 0 0,0 ${this.props.pivotPoint.x} ${this.props.pivotPoint.y-5}`
        this.path = this.props.path || `M${this.props.pivotPoint.x} ${this.props.pivotPoint.y+5} A${arc} L${end} z`
    }

    componentDidMount(){
        const angle=90+this.props.startAngle+(this.props.unitAngleRotation*this.props.value)
        d3.select('g.needle')
        .attr('transform',`rotate(${angle})`);
    }

    render() {
        return (
            <g className={'needle'}>
                <path shapeRendering={'geometricPrecision'}
                d={this.path} 
                fill={this.props.color} 
                onMouseOver={this.props.mouseover}
                onMouseOut={this.props.mouseout}
                />
            </g>
        )
    }
}
