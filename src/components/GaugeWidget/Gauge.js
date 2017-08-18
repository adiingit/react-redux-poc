import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from '../../SICKPlatform'
import SICKComponent from '../SICKComponent'
import {renderReading,fetchCurrentReading,getGaugeConfig} from '../../ducks/gauge'
import {getPointOnCircle} from '../../utils/shape'
import GaugeSvg from './GaugeSvg'
import Needle from './Needle'

const mapStateToProps = (state) => {
    return {
        gauge : state.gauge
    }
}

const mapDispatchToProps = {renderReading,fetchCurrentReading,getGaugeConfig};

/**
 * style for div#gauge-widget
 */
const divStyle = {
    textAlign: 'center',
    marginTop: 50,
    marginBottom:50,
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
     * @returns { propTypes.value minimum value isRequired ,  propTypes.polling maximum value isRequired , propTypes.readingUrl Range of values isRequired}
     */
	static propTypes = {
        value : PropTypes.number.isRequired,
        polling : PropTypes.bool.isRequired,
        readingUrl : PropTypes.string.isRequired,
        configUrl : PropTypes.string.isRequired
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
        this.updateReading = this.updateReading.bind(this); 
    }

    /**
     * loading reading from REST API call.
     */
    updateReading(){
        this.props.fetchCurrentReading(this.props.readingUrl);
    }

    /**
     * setting color, value and other configurations.
     */
    componentWillMount(){
        this.props.getGaugeConfig(this.props.configUrl);
    }

    /**
    * setting interval and fetching reading for GaugeWidget.
    */
    componentDidMount() {
        if(this.props.polling)
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
        let max,min,rangeData,labelData;
        if (this.props.gauge.get('range')) {
            max = Math.max(...this.props.gauge.get('range').map((r) => r.max))
            min = Math.min(...this.props.gauge.get('range').map((r) => r.min))
            rangeData = this.props.gauge.get('range')
            const data = Array.isArray(rangeData) ? rangeData : rangeData.toArray();
            rangeData = data.map((range) => {
                return {
                    value: range.max - range.min,
                    color: range.color
                }
            });

            labelData = [min];
            rangeData.forEach(range => {
                labelData.push(labelData[labelData.length - 1] + range.value);
            });
        }
        const currentValue = this.props.gauge.get('currentValue') || (!this.props.polling && this.props.value) || min;
        const buttonData = this.props.gauge.get('buttonData')
        
        return ( 
        	<div id="gauge-widget" style={divStyle}>
                <Paper circle={true} style={pageStyle} zDepth={5}>
            		{
                        rangeData && <GaugeSvg 
                        style={svgStyle} 
                        width={gaugeProps.width}
                        height={gaugeProps.height}
                        min={min}
                        max={max}
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
                                value={currentValue}
                                startAngle={gaugeProps.startAngle}
                                unitAngleRotation = {(gaugeProps.endAngle-gaugeProps.startAngle)/(max-min)}
                                mouseover={this.props.renderReading}
                                mouseout={this.props.renderReading}/>
                            }
                        />
                    }

                    {   
                        buttonData && 
                        <RaisedButton 
                        primary={true}
                        style={{position:'absolute',top:buttonData.y,left:buttonData.x}}
                        label={String(buttonData.label)}/>
                    }

                </Paper>        
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GaugeWidget);
