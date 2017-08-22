import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import SICKComponent from '../SICKComponent'

/**
 * <h3>Description:-</h3>
 * <p>GaugeSvg Component is a presentational component.</p>
 * <p>Renders an configurable arc shaped gauge that can act as a general purpose measuring gauge.</p>
 */
export default class GaugeSvg extends SICKComponent {

    /** 
    *Precondition (Static propTypes)
    *@static @type {Object} validations
            { PropTypes width number isRequired ,
              PropTypes height number isRequired ,
              PropTypes min number isRequired,
              PropTypes max number isRequired, 
              PropTypes radius number isRequired, 
              PropTypes innerRadius number, 
              PropTypes startAngle number, 
              PropTypes endAngle number, 
              PropTypes rangeData object{value:number,color:string}
              PropTypes labels array[String] isRequired, 
              PropTypes style object}
    */
    static propTypes = {
            width:PropTypes.number.isRequired,
            height:PropTypes.number.isRequired,
            min:PropTypes.number.isRequired,
            max:PropTypes.number.isRequired,
            radius:PropTypes.number.isRequired,
            innerRadius:PropTypes.number,
            startAngle:PropTypes.number,
            endAngle:PropTypes.number,
            rangeData:PropTypes.arrayOf(PropTypes.shape({
                value:PropTypes.number.isRequired,
                color:PropTypes.string.isRequired
            })).isRequired,
            labels:PropTypes.arrayOf(PropTypes.string).isRequired,
            needle:PropTypes.node.isRequired,
            style:PropTypes.object
    }

    /**
     * creates a instance of GaugeSvg.
     * @param {object} props
     */
    constructor(props) {
        super(props);
    }

    /**
     * default prop values.
     */
    static defaultProps = {
        innerRadius : 0,
        startAngle : -90,
        endAngle : 90,
        style : {}
    }

    /**
    * React lifecycle method :
    * setting initial position
    */
    componentWillMount(){
        this.transform = "translate(" + this.props.radius + "," + this.props.radius + ")";
    }

    /**
    * React lifecycle method :
    * Drawing gauge arc with labels as per the props.
    */
    componentDidMount() {
        
        const pi = Math.PI;
        const perUnitAngle = (this.props.endAngle-this.props.startAngle)/(this.props.max-this.props.min);
        const data = this.props.rangeData;

        const svg = d3.select("#gauge-widget svg")
                    .data([data])    
                    .attr("width", this.props.width)
                    .attr("height", this.props.height);
        
        const vis=svg.select('#root');
            
        const arc = d3.arc()
            .outerRadius(this.props.radius)
            .innerRadius(this.props.innerRadius);

        const pie = d3.pie()
            .value(function(d) { return d.value; })
            .startAngle(this.props.startAngle * (pi / 180))
            .endAngle(this.props.endAngle * (pi / 180))
            .sort(null);

        const arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .insert("svg:g","g.needle")
            .attr("class", "slice");

        arcs.append("svg:path")
            .attr("fill", function(d, i) {return d.data.color; })
            .attr("d", arc)
            .attr("class", "range");


        const labelsContainer = vis.append("g");

        labelsContainer.selectAll('text.label')
        .data(this.props.labels)
        .enter()
        .append("text")
        .attr('transform',function(d){
            const labelAngle = this.props.startAngle + d * perUnitAngle;
            const labelDistance = -1*(this.props.radius+10);
            return `rotate(${labelAngle}) translate(0,${labelDistance})`;
        }.bind(this))
        .text(function(d) { return d; });

    }

    /**
    * React lifecycle method :
    * Renders the component.
    * @return {ReactElement} svg Element.
    */
    render() {
        return ( 
            <svg style={this.props.style}>
                <g id="root" transform={this.transform}>
                    {this.props.needle}
                </g>
            </svg>
        )
    }
}

