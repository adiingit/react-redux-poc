import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import theme from '../../../tests/theme'
import { connect } from '../../SICKPlatform'
import SICKComponent from '../SICKComponent'
import {renderCurrentReading,removeCurrentReading,fetchCurrentReading} from '../../ducks/gauge'
import {getPointOnCircle} from '../../utils/shape'

const mapStateToProps = (state) => {
    return {
        max: state.config.gauge?Math.max(...state.config.gauge.get('range').map((r)=>r.max)):100,
        min : state.config.gauge?Math.min(...state.config.gauge.get('range').map((r)=>r.min)):0,
        rangeData : state.config.gauge?state.config.gauge.get('range'):[],
        buttonData : state.gauge.get('raisedButton'),
        currentValue : state.gauge.get('currentValue')
    }
}

const mapDispatchToProps = {renderCurrentReading,removeCurrentReading,fetchCurrentReading};

const palette = theme.palette;

const divStyle = {
    textAlign: 'center',
    marginTop: 50,
    overflowY:'hidden',
    height:266
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
	height: 250,
    width: 500,
    radius:250,
    innerRadius:100,
    marginTop : 15
};

export class GaugeWidget extends SICKComponent {

	static PropTypes ={
        max:PropTypes.number.isRequired,
        currentValue:PropTypes.number
	}

    constructor(props) {
        super(props);
        const currentValue = this.props.min;
        this.showValue = this.showValue.bind(this);
        this.buttonData = undefined;
        this.rendered = false;
        this.updateReading = this.updateReading.bind(this); 
    }

    updateReading(){
        this.props.fetchCurrentReading(`${baseUrl}:3000/gauge/reading`).then(()=>{
            
            const perUnitAngle = 180/this.props.max;
            const angle = this.props.currentValue * perUnitAngle;
            const needle=d3.select("#needle")

            needle.transition()
                .duration(2000)
                .attr('transform',`rotate(${angle})`);
        });
        
    }

    showValue(){
        
        this.props.renderCurrentReading({x:d3.event.pageX,y:d3.event.pageY,label:this.props.currentValue || this.props.min});
    }

    componentDidUpdate(){
        
        this.buttonData = this.props.buttonData;
    }
    
    componentWillMount(){
        setInterval(this.updateReading,10000);
    }

    componentDidMount() {
        
        const pi = Math.PI;
        const perUnitAngle = 180/this.props.max;
        const angle = this.props.min * perUnitAngle;
        const colors = [palette.accentBlue,palette.accentGreen,palette.accentYellow,palette.accentRed];
        const rangeData = Array.isArray(this.props.rangeData)?this.props.rangeData:this.props.rangeData.toArray();
        const data = rangeData.map((range,i)=>{
            return {
                value : range.max - range.min,
                color : colors[i]
            }
        });

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

        needle.on('mouseout',this.showValue);
        needle.on('mouseover',this.props.removeCurrentReading); 

        

        

    }


    render() {
        return ( 
        	<div id="gauge-widget" style={divStyle}>
            	<Paper circle = {true} style={pageStyle} zDepth={2}>
            		<svg style={svgStyle}/>
                    {this.buttonData && 
                        <RaisedButton 
                        style={{position:'absolute',top:this.buttonData.y,left:this.buttonData.x}}
                        label={this.buttonData.label}/>}
            	</Paper> 
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GaugeWidget);
