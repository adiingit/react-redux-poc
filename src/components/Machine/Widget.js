import React,{PropTypes} from 'react'
import Paper from 'material-ui/Paper'
import Sensor from './Sensor'
import Machine from './Machine'
import SICKComponent from '../SICKComponent'
import { connect } from '../../SICKPlatform'
import {fetchCurrentSystem,fetchMachineConfig,fetchSensorStatus,displaySensorValue} from '../../ducks/machine'

/**
* @func Mapping component state to props of presentaional components 
* @param {Object} state
* @returns {Object} containing props
*/
const mapStateToProps = (state)=>{
  return {
    machineConfig : state.machine.size?state.machine:null
  }
}

/**
* @const {object} - redux actionCreators
*/
const dispatchToProps = {
    fetchCurrentSystem,
    fetchMachineConfig,
    fetchSensorStatus,
    displaySensorValue
}

/**
*@const
*@type {object}
*/
const sensorStyle = {
  width : 50,
  height : 50,
  borderRadius : '50%'
};

/**
*@const
*@type {object}
*/
const machineStyle = {
  width : 600,
  height : 400,
  margin :'50 auto'
}

/**
  *@class
  *Description:-
  *<p>Machine Schematic is a presentation of sensors placed on a machine. </p>
  *<p>Each sensor has their own position over a blueprint (image) of machine.</p>
  *<p>Machine Schematic widget is integrated with a Template and retrieves configuration of machines from a REST API.After mounting the Machine Schematic configurations, the sensors are loaded from a REST API with information about each sensor (i.e their location coordinates and initial state)  and placed over the machine.</p>
  *<p>The functionality of sensor is to change their state (color: gray, red, green) over a period of time through polling depending on the information fetched from REST API for each of the sensor independently.</p>
  *<p>The information about machines, sensor location and their state is configurable and retrieved from REST API.</p>
  *
  * <p>Setup:-</p>
  * Fetch basic configuration for numbers of MachineSchematic, information about each schematics and their sensors loaction from REST API for MachineWidget.
  *
  * <p> Precondition:-</p>
  * <p>After successful response from REST API, initial requirement is to set required propTypes. </p>
  * <p> Prop 1: url, type: string, isRequired</p>
  * <p> Prop 2: onMachineChange, type: function</p>
  * <p>Integration:-</p>
  * <p>To integrate the widget one need to get widget config from REST API and set required propTypes. Post that one is ready to use the widget.
*/

export class MachineWidget extends SICKComponent {

  /** Precondition (Static propTypes)
   * @returns { propTypes.url url isRequired ,  propTypes.onMachineChange onMachineChange}
   */
  static propTypes() {
    return{
      url : PropTypes.string.isRequired,
      onMachineChange : PropTypes.func
    }
  }

  /**
   * * creates an instance of MachineWidget.
   * @param {function} createSensor binding current object with createSensor
   */
  constructor(props){
    super(props);
    this.createSensor = this.createSensor.bind(this);
  }

  /**
   * configuration of sensor.
   * @param sensor
   */
  createSensor(sensor){
    const sensorData = this.props.machineConfig.get('sensorData');
    const sensorDisplayData = this.props.machineConfig.get('sensorDisplay');
    return (this.props.machineConfig? (<Sensor 
              key={sensor.id}
              id={String(sensor.id)}
              width={sensorStyle.width}
              height={sensorStyle.height}
              updateUrl={sensor.url}
              color={sensorData?(sensorData[sensor.id] && sensorData[sensor.id].color):''} 
              location={{x:sensor.x,y:sensor.y}}
              label={sensor.label}
              update={this.props.fetchSensorStatus}
              updateFreq={sensor.updateFreq} 
              onTouchStart={this.props.displaySensorValue}
              onTouchEnd={this.props.displaySensorValue}
              sensorDisplay={sensorDisplayData && sensorDisplayData[sensor.id]}
              idle={sensorData?(sensorData[sensor.id] && sensorData[sensor.id].idle):true} 
              status={sensorData?(sensorData[sensor.id] && sensorData[sensor.id].status):false} 
              style={{borderRadius:sensorStyle.borderRadius}}/>):null
          );
  }

  /*
   *  getting and setting machine configurations
   */
  componentDidUpdate(){
    if(this.sensorUpdate)
      this.props.onMachineChange(this.props.machineConfig.get('sensors').length);
    if(this.machineUpdate){
      this.props.fetchMachineConfig(this.props.url);
    }
  }

  /**
   * setting initial values
   */
  componentWillMount(){
    this.props.fetchMachineConfig(this.props.url);
  }

  /**
   *props value
   */
  componentWillReceiveProps(nextProps){
    this.machineUpdate=(this.props.url!==nextProps.url);
    this.sensorUpdate = !this.props.machineConfig || (this.props.machineConfig.get('sensors').length !== nextProps.machineConfig.get('sensors').length)
  }

  /**
   *Renders the component.
   *Machine from './Machine'
   */
  render () {
    
    return (
      this.props.machineConfig? 
      (<Machine 
      style={machineStyle}
      image={this.props.machineConfig.get('image')}
      sensors={this.props.machineConfig.get('sensors').map(this.createSensor)}/>):null
    )
  }
}

export default connect(mapStateToProps,dispatchToProps)(MachineWidget);




