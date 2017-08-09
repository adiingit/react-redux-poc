import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import theme from '../../../tests/theme'
import { connect } from '../../SICKPlatform'
import SICKComponent from '../SICKComponent'
import {renderCurrentReading,fetchCurrentReading} from '../../ducks/gauge'
import {getPointOnCircle} from '../../utils/shape'

const mapStateToProps = (state) => {
    return {
        max: state.config.gauge?Math.max(...state.config.gauge.get('range').map((r)=>r.max)):100,
        min : state.config.gauge?Math.min(...state.config.gauge.get('range').map((r)=>r.min)):0,
        rangeData : state.config.gauge?state.config.gauge.get('range'):[],
        raisedButton : state.gauge.get('raisedButton'),
        currentValue : state.gauge.get('currentValue')
    }
}

const mapDispatchToProps = {renderCurrentReading,fetchCurrentReading};

const palette = theme.palette;

const divStyle = {
    textAlign: 'center',
    marginTop: 50,
    overflowY:'hidden',
    height:335
};
const pageStyle = {
    height: 600,
    width: 600,
    textAlign: 'center',
    display: 'inline-block',
    paddingTop : 50,
    marginTop:10
};

const svgStyle = {
    overflow:'visible'
}

const gaugeStyle = {
	height: 250,
    width: 500,
    radius:250,
    innerRadius:100
    
};

export class GaugeWidget extends SICKComponent {

	static PropTypes ={
        min:PropTypes.number.isRequired,
        max:PropTypes.number.isRequired,
        rangeData:PropTypes.array.isRequired
	}

    constructor(props) {
        super(props);
        const currentValue = this.props.min;
        this.showValue = this.showValue.bind(this);
        this.hideValue = this.hideValue.bind(this);
        this.updateReading = this.updateReading.bind(this); 
    }

    updateReading(){
        this.props.fetchCurrentReading(`${baseUrl}:3000/gauge/reading`).then(()=>{
            
            const perUnitAngle = 180/(this.props.max-this.props.min);
            const angle = this.props.currentValue * perUnitAngle;
            const needle=d3.select("#needle")

            needle.transition()
                .duration(2000)
                .attr('transform',`rotate(${angle})`);
        });
        
    }

    showValue(){
        this.buttonData={x:d3.event.pageX,y:d3.event.pageY,label:this.props.currentValue||this.props.min};
        this.props.renderCurrentReading();
    }

    hideValue(){
        this.buttonData = undefined;
        this.props.renderCurrentReading();
    }

    componentDidUpdate(){
        this.buttonData = undefined;
    }
    
    componentWillMount(){
        setInterval(this.updateReading,10000);
    }

    componentDidMount() {
        
        const pi = Math.PI;
        const perUnitAngle = 180/(this.props.max-this.props.min);
        const colors = [palette.accentBlue,palette.accentGreen,palette.accentYellow,palette.accentRed];
        const rangeData = Array.isArray(this.props.rangeData)?this.props.rangeData:this.props.rangeData.toArray();
        const data = rangeData.map((range,i)=>{
            return {
                value : range.max - range.min,
                color : colors[i]
            }
        });

        const svg = d3.select("#gauge-widget svg");
        const vis=svg.data([data])
            .attr("width", gaugeStyle.width)
            .attr("height", gaugeStyle.height)
            .append("svg:g")
            .attr("transform", "translate(" + gaugeStyle.radius + "," + gaugeStyle.radius + ")")

        const arc = d3.arc()
            .outerRadius(gaugeStyle.radius)
            .innerRadius(gaugeStyle.innerRadius);

        const pie = d3.pie()
            .value(function(d) { return d.value; })
            .startAngle(-90 * (pi / 180))
            .endAngle(90 * (pi / 180))
            .sort(null);

        const arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice");

        arcs.append("svg:path")
            .attr("fill", function(d, i) { return d.data.color; })
            .attr("d", arc)
            .attr("class", "range")
            .attr("id",function(d,i){return `range-${i}`});

        const needle = vis.append('g')
            .attr('class','pointer')
            .append("path")
            .attr("id","needle")
            .attr("d", "M0 0 L-240 0")
            .attr("stroke-width",2)
            .attr("stroke",palette.textColor);

        needle.on('mouseover',this.showValue);
        needle.on('mouseout',this.hideValue);     

        vis.append("circle")
        	.attr('cx',0)
        	.attr('cy',0)   
        	.attr('r',3) 
        	.attr("stroke-width",3)
            .attr("stroke",palette.textColor);


        const labelData = [];

        rangeData.forEach((range,i)=>{
            if(i)
                labelData.push(range.max);
            else
                labelData.push(...[range.min,range.max]);
                
        });

        const labelsContainer = d3.select("#gauge-widget svg")
        .append("g")
        .attr("transform", "translate(" + gaugeStyle.radius + "," + gaugeStyle.radius + ")");

        labelsContainer.selectAll('text.label')
        .data(labelData)
        .enter()
        .append("text")
        .attr('transform',function(d){
            const labelAngle = -90+d*perUnitAngle;
            const labelDistance = -1*(gaugeStyle.radius+10);
            return `rotate(${labelAngle}) translate(0,${labelDistance})`;
        })
        .text(function(d) { return d; })
        .attr("stroke",palette.textColor);
    }


    render() {
        return ( 
        	<div id="gauge-widget" style={divStyle}>
                <Paper circle={true} style={pageStyle} zDepth={5}>
            		<svg style={svgStyle}/>
                    {this.buttonData && 
                        <RaisedButton 
                        primary={true}
                        style={{position:'absolute',top:this.buttonData.y,left:this.buttonData.x}}
                        label={this.buttonData.label}/>}
                </Paper>        
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GaugeWidget);
