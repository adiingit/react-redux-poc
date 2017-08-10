import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from '../../SICKPlatform'
import SICKComponent from '../SICKComponent'
import {renderCurrentReading,fetchCurrentReading} from '../../ducks/gauge'
import {getPointOnCircle} from '../../utils/shape'
import GaugeSvg from './GaugeSvg'
import Needle from './Needle'

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

const gaugeProps = {
	height: 250,
    width: 500,
    radius:250,
    innerRadius:100,
    startAngle:-90,
    endAngle:90
};

const needleProps = {
    pivotPoint:{x:0,y:0},
    needleLength:240,
    color:'#000'
}

export class GaugeWidget extends SICKComponent {

	static PropTypes = {
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
        this.props.fetchCurrentReading(`${baseUrl}:3000/gauge/reading`);
    }

    showValue(){
        this.buttonData={x:0,y:0,label:this.props.currentValue||this.props.min};
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
        const data = Array.isArray(this.props.rangeData)?this.props.rangeData:this.props.rangeData.toArray();
        this.rangeData = data.map((range)=>{
            return {
                value : range.max - range.min,
                color : range.color
            }
        });

        this.labelData = [this.props.min];
        this.rangeData.forEach(range=>{            
                this.labelData.push(this.labelData[this.labelData.length-1]+range.value);
        });
    }

    componentDidMount() {
        setInterval(this.updateReading,10000);
    }


    render() {
        return ( 
        	<div id="gauge-widget" style={divStyle}>
                <Paper circle={true} style={pageStyle} zDepth={5}>
            		<GaugeSvg 
                    style={svgStyle} 
                    width={gaugeProps.width}
                    height={gaugeProps.height}
                    min={this.props.min}
                    max={this.props.max}
                    radius={gaugeProps.radius}
                    innerRadius={gaugeProps.innerRadius}
                    startAngle={gaugeProps.startAngle}
                    endAngle={gaugeProps.endAngle}
                    rangeData={this.rangeData}
                    labels={this.labelData}
                    needle={
                            <Needle 
                            pivotPoint={needleProps.pivotPoint}
                            needleLength={needleProps.needleLength}
                            color={needleProps.color}
                            value={this.props.currentValue || this.props.min}
                            startAngle={gaugeProps.startAngle}
                            unitAngleRotation = {(gaugeProps.endAngle-gaugeProps.startAngle)/(this.props.max-this.props.min)}
                            mouseover={this.showValue}
                            mouseout={this.hideValue}/>
                        }
                    />

                    {   
                        this.buttonData && 
                        <RaisedButton 
                        primary={true}
                        style={{position:'absolute',top:this.buttonData.y,left:this.buttonData.x}}
                        label={this.buttonData.label}/>
                    }

                </Paper>        
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GaugeWidget);
