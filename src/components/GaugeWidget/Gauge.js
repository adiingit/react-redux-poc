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

/*
* @Function Mapping component state to props of presentaional components 
* @param {Object} state
* @returns {Object} containing props
*/
const mapStateToProps = (state) => {
    return {
        gauge : state.gauge
    }
}

/*
* @Object redux actionCreators for GaugeWidget 
*/
const mapDispatchToProps = {renderReading,fetchCurrentReading,getGaugeConfig};

/**
 * style for container div#gauge-widget
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
 * input for prop values of GaugeSvg Component
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
 * input for prop values of Needle Component
 */
const needleProps = {
    pivotPoint:{x:0,y:0},
    needleLength:240,
    color:'#000'
}


/**
 * <h3>Description:-</h3>
 *<p>The work of Gauge Widget is to show the reading between minimum and maximum values (including minimum and maximum). The reading can lie within any range specified in configuration.</p>
 *<p>The structure is in a way to have Widgets working independently. The components (needle and Gauge SVG) are configurable to fetch properties from REST API and are placed over the Template.</p>
 * <p>The Gauge Widget is configurable with properties like range colors, width, height, minValue, maxValue, radius, innerRadius, startAngle, endAngle, rangeData etc. retrieved from REST API.
 *  One can have Paper, Card or any Material UI widget and draw a Gauge Widget over a Template as all the properties are configurable.</p>
 * <p> The Needle Component placed over GaugeWidget Component is also configurable and fetch properties like pivotPoint, needleLength, color, value, startAngle, unitAngleRotation etc. from REST API. On Mouseover, it displays the exact current value in a tooltip.</p>
 * <p>The Gauge Widget has an online and offline feature controlled by a prop 'polling'.</p>
 * <p>If polling is set true , the widget retrieves current value from REST API call , setting polling to false will fetch current gauge value from AppBar Widget(or any input).</p>
 *
 * <h3>Setup:-</h3>
 * Fetch basic configuration viz. configUrl from REST API for GaugeWidget.
 * Add required props , value , readingUrl and polling.   
 *
 * <h3> Precondition:-</h3>
 * <p> Prop 1: value, type: number, isRequired</p>
 * <p> Prop 2: polling, type: boolean, isRequired</p>
 * <p> Prop 3: readingUrl, type: string, isRequired</p>
 * <p> Prop 4: configUrl, type: string, isRequired</p>
 *
 * <h3>Integration:-</h3>
 * <p> This is a container component that composes 2 presentational components (GaugeSvg and Needle).</p>
 * <p> To use the presentational component (GaugeSvg) either use GaugeWidget(container component) with required props and stateMappings(stateToProps and DispatchToProps) 
 * or create your own container component that fills all the props for GaugeSvg</p>
 */
export class GaugeWidget extends SICKComponent {

    /** 
    *Validation for props (Static propTypes)
    * @static
    * @type {object} validators
            {
                PropTypes value number isRequired ,
                PropTypes polling boolean isRequired ,
                PropTypes readingUrl string isRequired,
                PropTypes configUrl string isRequired
            }
    */
	static propTypes = {
            value : PropTypes.number.isRequired,
            polling : PropTypes.bool.isRequired,
            readingUrl : PropTypes.string.isRequired,
            configUrl : PropTypes.string.isRequired
	}

    /**
    * creates a instance of GaugeWidget.
    * @param {Object} props
    */
    constructor(props) {
        super(props);
        this.updateReading = this.updateReading.bind(this); 
    }

    /**
     * reading current value for Gauge from REST API call.
     */
    updateReading(){
        this.props.fetchCurrentReading(this.props.readingUrl);
    }

    /**
    * React lifecycle method :
    * setting color, value, polling and other configurations.
    */
    componentWillMount(){
        this.props.getGaugeConfig(this.props.configUrl);
    }

    /**
    * React lifecycle method :
    * setting interval and fetching reading for GaugeWidget if polling feature is enabled.
    */
    componentDidMount() {
        if(this.props.polling)
            setInterval(this.updateReading,10000);
    }

    /**
    * React lifecycle method :
    * Renders this component
    * @returns {ReactElement} - wrapped in material UI Paper Component
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
            })
            labelData=labelData.map(range=>String(range));
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

/**
* @export - container component (GaugeWidget)
*/
export default connect(mapStateToProps,mapDispatchToProps)(GaugeWidget);
