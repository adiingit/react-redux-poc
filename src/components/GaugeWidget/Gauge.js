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

/**
 * style for div#gauge-widget
 */
const divStyle = {
    textAlign: 'center',
    marginTop: 50,
    overflowY:'hidden',
    height:335
};

/**
 * style for Paper Component
 */
const pageStyle = {
    height: 600,
    width: 600,
    textAlign: 'center',
    display: 'inline-block',
    paddingTop : 50,
    marginTop:10
};

/**
 * style for GaugeSvg Component
 */
const svgStyle = {
    overflow:'visible'
}

/**
 * default prop values for GaugeSvg Component
 */
const gaugeProps = {
	height: 250,
    width: 500,
    radius:250,
    innerRadius:100,
    startAngle:-30,
    endAngle:70
};

/**
 * default prop values for Needle Component
 */
const needleProps = {
    pivotPoint:{x:0,y:0},
    needleLength:240,
    color:'#000'
}

/**
 * <p>Description:-</p>
 *<p>The work of Gauge Widget is to show the reading between minimum and maximum values (including minimum and maximum). The reading can lie within any range specified in configuration.</p>
 *<p>The structure is in a way to have Template and Widgets working independently. The components (needle, paper and Gauge SVG) are configurable to fetch properties from REST API and are placed over the Template.</p>
 * <p>The Gauge Widget is configurable with properties like range colors, width, height, minValue, maxValue, radius, innerRadius, startAngle, endAngle, rangeData etc. retrieved from REST API.
 *  One can have Paper, Card or any Material UI widget and draw a Gauge Widget over a Template as all the properties are configurable.</p>
 * <p> The NeedleComponent placed over GaugeWidget Component is also configurable and fetch properties like pivotPoint, needleLength, color, value, startAngle, unitAngleRotation etc. from REST API. On Mouseover, it makes a REST Call to display the exact current value in a tooltip.</p>
 * <p>The Gauge Widget is decoupled from AppBar Widget and retrieves values from REST API call through polling. However, one can couple it with AppBar Widget and listen to the dropdown selected value on change.</p>
 *
 * <p>Setup:-</p>
 * Fetch basic configuration viz. minimum values, maximum values and rangeData(includes ranges with property like colors) from REST API for GaugeWidget.
 *
 * <p> Precondition:-</p>
 * <p>After successful response from REST API, initial requirement is to set required propTypes. </p>
 * <p> Prop 1: min, type: number, isRequired</p>
 * <p> Prop 2: max, type: number, isRequired</p>
 * <p> Prop 3: rangeData, type: array, isRequired</p>
 * <p>Integration:-</p>
 * <p>To integrate the widget one need to get widget config from REST API and set required propTypes. Post that one is ready to use the widget.
 */
export class GaugeWidget extends SICKComponent {

    /** Precondition (Static propTypes)
     * @returns { propTypes.min minimum value isRequired ,  propTypes.max maximum value isRequired , propTypes.rangeData Range of values isRequired}
     */
	static PropTypes() {
	    return{
            min:PropTypes.number.isRequired,
            max:PropTypes.number.isRequired,
            rangeData:PropTypes.array.isRequired
        }
	}

    /**
     * creates a instance of GaugeWidget.
     * @param {object} props
     * @param {number} currentValue assigning currentValue
     * @param {function} showValue binding current object with showValue
     * @param {function} hideValue binding current object with hideValue
     * @param {function} updateReading binding current object with updateReading
     */
    constructor(props) {
        super(props);
        const currentValue = this.props.min;
        this.showValue = this.showValue.bind(this);
        this.hideValue = this.hideValue.bind(this);
        this.updateReading = this.updateReading.bind(this); 
    }

    /**
     * loading reading from REST API call.
     */
    updateReading(){
        this.props.fetchCurrentReading(`${baseUrl}:3000/gauge/reading`);
    }

    /**
     * showing current reading on mouseover
     */
    showValue(e){
        this.buttonData={x:e.pageX,y:e.pageY,label:this.props.currentValue||this.props.min};
        this.props.renderCurrentReading();
    }

    /**
     * hiding reading on mouseout
     */
    hideValue(){
        this.buttonData = undefined;
        this.props.renderCurrentReading();
    }

    /**
     * updating buttonData
     */
    componentDidUpdate(){
        this.buttonData = undefined;
    }

    /**
     * setting color, value and other configurations.
     */
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

    /**
    * setting interval and fetching reading for GaugeWidget.
    */
    componentDidMount() {
        setInterval(this.updateReading,10000);
    }

    /**
     * render
     * @return {ReactElement} svg within PaperComponent to show GaugeWidget.
     */

    /**
     * Renders the component.
     *
     * Paper from 'material-ui/Paper'
     * GaugeSvg from './GaugeSvg'
     * RaisedButton from 'material-ui/RaisedButton'
     * Needle from './Needle'
     * @return {string} - HTML markup for the component
     */
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
