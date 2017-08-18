import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import SICKComponent from '../SICKComponent'

/**
* <h3>Description:-</h3>
* Needle is a presentational component.
* Needle Component renders a svg element that represents a rotatable marker/pointer on a circular scale.
*/
export default class Needle extends SICKComponent {

    /** 
    *Precondition (propTypes)
    *@static
    *@returns {object} validations
        { 
            propTypes pivotPoint object{x:number,y:number} isRequired ,  
            propTypes needleLength number isRequired , 
            propTypes color string isRequired, 
            propTypes value number isRequired, 
            propTypes startAngle number isRequired, 
            propTypes unitAngleRotation number isRequired, 
            propTypes mouseover function mouseover, 
            propTypes mouseout function mouseout, 
            propTypes path path 
        }
    */
	static propTypes () {
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
    * @param {object} props
    */
    constructor(props) {
        super(props);
        this.mouseHover = this.mouseHover.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }

    /**
    * mouse hover handler
    */
    mouseHover(event,target){
        this.props.mouseover({x:event.pageX,y:event.pageY,label:this.props.value});
    }

    /**
    * mouse out handler
    */
    mouseOut(event,target){
        this.props.mouseout();
    }

    /**
    * React lifecycle method :
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
    * React lifecycle method :   
    * setting initial values for Needle i.e. start, end, arc, path
    */
    componentWillMount() {
        const start = `${this.props.pivotPoint.x},${this.props.pivotPoint.y}`;
        const end = `${-1*this.props.needleLength} 0`
        const arc = `5,5 0 0,0 ${this.props.pivotPoint.x} ${this.props.pivotPoint.y-5}`
        this.path = this.props.path || `M${this.props.pivotPoint.x} ${this.props.pivotPoint.y+5} A${arc} L${end} z`
    }

    /**
    * React lifecycle method : 
    * initial angle rotation
    */
    componentDidMount(){
        const angle=90+this.props.startAngle+(this.props.unitAngleRotation*this.props.value)
        d3.select('g.needle')
        .attr('transform',`rotate(${angle})`);
    }

    /**
    * React lifecycle method :
    * Renders the component.
    * @returns {ReactElement} - svg Element.
    */
    render() {
        return (
            <g className={'needle'}>
                <path shapeRendering={'geometricPrecision'}
                d={this.path} 
                fill={this.props.color} 
                onMouseOver={this.mouseHover}
                onMouseOut={this.mouseOut}
                />
            </g>
        )
    }
}

