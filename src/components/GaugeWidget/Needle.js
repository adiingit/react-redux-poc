import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import SICKComponent from '../SICKComponent'

/**
* <p>Description:-</p>
 * Use to draw a NeedleComponent whoose properties(i.e. needleLength, color, path etc. ) are configurable from REST API.
 */
export default class Needle extends SICKComponent {

    /** Precondition (Static propTypes)
     * @returns { propTypes.pivotPoint object pivotPoint with x and y value isRequired ,  propTypes.needleLength needleLength value isRequired , propTypes.color  color value isRequired, propTypes.value value isRequired, propTypes.startAngle startAngle value isRequired, propTypes.unitAngleRotation unitAngleRotation value isRequired, propTypes.mouseover mouseover function isOptional, , propTypes.mouseout mouseout function isOptional, , propTypes.path path string isOptional}
     */
	static PropTypes () {
	    return{
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
	}

    /**
     * creates a instance of Needle.
     */
    constructor(props) {
        super(props);
        this.mouseHover = this.mouseHover.bind(this);
    }

    /**
    * mouse hover handler
    */
    mouseHover(event,target){
        this.props.mouseover(event,target,this.props.value);
    }

    /**
     * updating angle rotation
     */
    componentDidUpdate(){
        const startAngleOffset= 90+this.props.startAngle;
        d3.select('g.needle')
                        .transition()
                        .duration(2000)
                        .attr('transform',`rotate(${startAngleOffset+(this.props.unitAngleRotation*this.props.value)})`);
        
    }

    /**
     * setting initial values for Needle i.e. start, end, arc, path
     */
    componentWillMount() {
        const start = `${this.props.pivotPoint.x},${this.props.pivotPoint.y}`;
        const end = `${-1*this.props.needleLength} 0`
        const arc = `5,5 0 0,0 ${this.props.pivotPoint.x} ${this.props.pivotPoint.y-5}`
        this.path = this.props.path || `M${this.props.pivotPoint.x} ${this.props.pivotPoint.y+5} A${arc} L${end} z`
    }

    /**
     * setting angle rotation
     */
    componentDidMount(){
        const angle=90+this.props.startAngle+(this.props.unitAngleRotation*this.props.value)
        d3.select('g.needle')
        .attr('transform',`rotate(${angle})`);
    }

    /**
    * Renders the component.
    * @return {ReactElement} - HTML for g tag.
    */
    render() {
        return (
            <g className={'needle'}>
                <path shapeRendering={'geometricPrecision'}
                d={this.path} 
                fill={this.props.color} 
                onMouseOver={this.mouseHover}
                onMouseOut={this.props.mouseout}
                />
            </g>
        )
    }
}

