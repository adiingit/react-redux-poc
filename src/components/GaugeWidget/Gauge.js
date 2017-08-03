import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import Paper from 'material-ui/Paper'
import theme from '../../../tests/theme'
import { connect } from '../../SICKPlatform'
import SICKComponent from '../SICKComponent'
import {getPointOnCircle} from '../../utils/shape'

const mapStateToProps = (state) => {
    return {
        max: state.appbar.size?state.appbar.get('systems').size:100,
        currentValue : state.appbar.size?Number(state.appbar.get('selectedSystem').get('systemName'))||0:0,
        previousValue : (state.appbar.size && state.appbar.get('prvSelectedSystem'))?Number(state.appbar.get('prvSelectedSystem').get('systemName'))||0:0,
        rangeData : state.config.gauge?state.config.gauge.get('range'):[]
    }
}

const palette = theme.palette;

const divStyle = {
    textAlign: 'center',
    marginTop: 50
};
const pageStyle = {
    height: 500,
    width: 500,
    textAlign: 'center',
    display: 'inline-block'
};

const svgStyle = {
    overflow:'visible'
}

const gaugeStyle = {
	height: 500,
    width: 500,
    radius:250,
    innerRadius:100
};

export class GaugeWidget extends SICKComponent {

	static PropTypes ={
        max:PropTypes.number.isRequired,
        currentValue:PropTypes.number,
        previousValue:PropTypes.number
	}

   /* static defaultProps = {
        rangeData : [{"min": 0 ,'max':20,'color':palette.accentBlue},
            { "min": 20 ,'max':70,'color':palette.accentYellow},
            { "min": 70 ,'max':100,'color':palette.accentRed}
        ]
    }*/

    constructor(props) {
        super(props);
        this.showValue = this.showValue.bind(this);
    }

    componentDidUpdate(){
        const perUnitAngle = 180/this.props.max;
        const angle = this.props.currentValue * perUnitAngle;

        const pointer=d3.select("g.pointer")
        const needle=pointer.select("#needle")

        needle.transition()
            .duration(2000)
            .attr('transform',`rotate(${angle})`);

        needle.on('mouseover',this.showValue);

        needle.on('mouseout',function(){
            pointer.select('text').remove();
        });    
    }

    showValue(){
        const currentValue = this.props.currentValue;
        const perUnitAngle = 180/this.props.max;
        d3.select("g.pointer")
        .append('text')
        .attr("x",function(d){return getPointOnCircle(gaugeStyle.radius,0,0,(-180+currentValue*perUnitAngle)).x})
        .attr("dy",function(d){return getPointOnCircle(gaugeStyle.radius,0,0,(-180+currentValue*perUnitAngle)).y})
        .text(currentValue)
        .attr("stroke",palette.textColor);
    }

    componentDidMount() {
        
        const pi = Math.PI;
        const perUnitAngle = 180/this.props.max;
        const angle = this.props.currentValue * perUnitAngle;
        const colors = [palette.accentBlue,palette.accentGreen,palette.accentYellow,palette.accentRed];
        const rangeData = Array.isArray(this.props.rangeData)?this.props.rangeData:this.props.rangeData.toArray();
        const data = rangeData.map((range,i)=>{
            return {
                value : range.max - range.min,
                color : colors[i]
            }
        });/*[{"value": 25 ,'color':palette.accentBlue},
            { "value": 25 ,'color':palette.accentGreen},
            { "value": 25 ,'color':palette.accentYellow},
            { "value": 25 ,'color':palette.accentRed}
        ];*/

        

        var vis = d3.select("#gauge-widget svg")
            .data([data])
            .attr("width", gaugeStyle.width)
            .attr("height", gaugeStyle.height)
            .append("svg:g")
            .attr("transform", "translate(" + gaugeStyle.radius + "," + gaugeStyle.radius + ")")

        var arc = d3.arc()
            .outerRadius(gaugeStyle.radius)
            .innerRadius(gaugeStyle.innerRadius);

        var pie = d3.pie()
            .value(function(d) { return d.value; })
            .startAngle(-90 * (pi / 180))
            .endAngle(90 * (pi / 180))
            .padAngle(0.02)
            .sort(null);

        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice");

        arcs.append("svg:path")
            .attr("fill", function(d, i) { return d.data.color; })
            .attr("d", arc)
            .attr("class", "range")
            .attr("id",function(d,i){return `range-${i}`});

        var needle = vis.append('g')
            .attr('class','pointer')
            .append("path")
            .attr("id","needle")
            .attr("d", "M0 0 L-240 0")
            .attr("stroke-width",2)
            .attr("stroke",palette.textColor)

        vis.append("circle")
        	.attr('cx',0)
        	.attr('cy',0)   
        	.attr('r',3) 
        	.attr("stroke-width",3)
            .attr("stroke",palette.textColor);


        if(rangeData.length){
            arcs.data(rangeData)
            .append("text")
            .attr("x",function(d){return getPointOnCircle(gaugeStyle.radius,0,0,(-180+d.min*perUnitAngle)).x})
            .attr("dy",function(d){return getPointOnCircle(gaugeStyle.radius,0,0,(-180+d.min*perUnitAngle)).y})
            .attr("class", "range-text")
            .text(function(d) { return d.min; })
            .attr("stroke",palette.textColor);

            arcs.data(rangeData)    
            .append("text")
            .attr("x",function(d){return getPointOnCircle(gaugeStyle.radius,0,0,(-180+d.max*perUnitAngle)).x})
            .attr("dy",function(d){return getPointOnCircle(gaugeStyle.radius,0,0,(-180+d.max*perUnitAngle)).y})
            .attr("class", "range-text")
            .text(function(d) { return d.max; })
            .attr("stroke",palette.textColor);
        }    

        

    }


    render() {
        return ( 
        	<div id="gauge-widget" style={divStyle}>
            	<Paper circle = {true} style={pageStyle} zDepth={2}>
            		<svg style={svgStyle}/>
            	</Paper> 
                
            </div>
        )
    }
}

export default connect(mapStateToProps, {})(GaugeWidget);
