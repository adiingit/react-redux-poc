import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from '../../SICKPlatform'
import SICKComponent from '../SICKComponent'
import {renderCurrentReading,fetchCurrentReading,getGaugeConfig} from '../../ducks/gauge'
import {getPointOnCircle} from '../../utils/shape'
import GaugeSvg from './GaugeSvg'
import Needle from './Needle'

const mapStateToProps = (state) => {
    return {
        max: state.gauge.size?Math.max(...state.gauge.get('range').map((r)=>r.max)):100,
        min : state.gauge.size?Math.min(...state.gauge.get('range').map((r)=>r.min)):0,
        rangeData : state.gauge.size?state.gauge.get('range'):[],
        raisedButton : state.gauge.get('raisedButton'),
        currentValue : state.gauge.get('currentValue')
    }
}

const mapDispatchToProps = {renderCurrentReading,fetchCurrentReading,getGaugeConfig};

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
    startAngle:-30,
    endAngle:70
};

const needleProps = {
    pivotPoint:{x:0,y:0},
    needleLength:240,
    color:'#000'
}

const validator = (...types) => (...args) => {
  const errors = types.map((type) => type(...args)).filter(Boolean);
  if (errors.length === 0) return;
  const message = errors.map((e) => e.message).join('\n');
  return new Error(message);
};

export class GaugeWidget extends SICKComponent {

	static propTypes = {
        value : validator(PropTypes.number.isRequired,function(props, propName, componentName){
            if (!props.hasOwnProperty(propName) && !props.hasOwnProperty('readingUrl')){
                if(!props.polling){
                    return new Error(`set prop ${propName}`);
                }else{
                    return new Error(`set prop readingUrl`);
                }
            }

            if(props.hasOwnProperty(propName) && props.polling){
                return new Error(`${propName} is not an online feature,set Prop polling false`);
            }
        }),
        polling : PropTypes.bool.isRequired,
        readingUrl : validator(PropTypes.string.isRequired,function(props, propName, componentName){
            if (!props.hasOwnProperty(propName) && !props.hasOwnProperty('value')){
                if(props.polling){
                    return new Error(`set prop ${propName}`);
                }else{
                    return new Error(`set prop value`);
                }
            }
            if(props.hasOwnProperty(propName) && !props.polling){
                return new Error(`${propName} is an online feature,set Prop polling true`);
            }
        }),
        configUrl : PropTypes.string.isRequired
	}

    constructor(props) {
        super(props);
        this.showValue = this.showValue.bind(this);
        this.hideValue = this.hideValue.bind(this);
        this.updateReading = this.updateReading.bind(this); 
    }

    updateReading(){
        this.props.fetchCurrentReading(this.props.readingUrl);
    }

    showValue(e){
        this.buttonData={x:e.pageX,y:e.pageY,label:(this.props.currentValue||(!this.props.polling && this.props.value)||this.props.min)};
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
        this.props.getGaugeConfig(this.props.configUrl);
    }

    componentDidMount() {
        if(this.props.polling)
            setInterval(this.updateReading,10000);
    }


    render() {
        let rangeData=undefined,labelData=undefined;
        if(this.props.rangeData.size){
            const data = Array.isArray(this.props.rangeData)?this.props.rangeData:this.props.rangeData.toArray();
            rangeData = data.map((range)=>{
                return {
                    value : range.max - range.min,
                    color : range.color
                }
            });

            labelData = [this.props.min];
            rangeData.forEach(range=>{            
                    labelData.push(labelData[labelData.length-1]+range.value);
            });
        }
        const currentValue = this.props.currentValue || (!this.props.polling && this.props.value);

        return ( 
        	<div id="gauge-widget" style={divStyle}>
                <Paper circle={true} style={pageStyle} zDepth={5}>
            		{
                        rangeData && <GaugeSvg 
                        style={svgStyle} 
                        width={gaugeProps.width}
                        height={gaugeProps.height}
                        min={this.props.min}
                        max={this.props.max}
                        radius={gaugeProps.radius}
                        innerRadius={gaugeProps.innerRadius}
                        startAngle={gaugeProps.startAngle}
                        endAngle={gaugeProps.endAngle}
                        rangeData={rangeData}
                        labels={labelData}
                        needle={
                                <Needle 
                                pivotPoint={needleProps.pivotPoint}
                                needleLength={needleProps.needleLength}
                                color={needleProps.color}
                                value={currentValue || this.props.min}
                                startAngle={gaugeProps.startAngle}
                                unitAngleRotation = {(gaugeProps.endAngle-gaugeProps.startAngle)/(this.props.max-this.props.min)}
                                mouseover={this.showValue}
                                mouseout={this.hideValue}/>
                            }
                        />
                    }

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
