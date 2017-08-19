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
*@const {object}
*/
const sensorStyle = {
  width : 50,
  height : 50,
  borderRadius : '50%',
  margin:'none',
  transition:'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
};

/**
*@const {object}
*/
const machineStyle = {
  width : 600,
  height : 400,
  margin :'50 auto'
}

/**
  *<h3>Description:-</h3>
  *<p>Machine Schematic is a presentation of sensors placed on a machine. </p>
  *<p>Each sensor has their own position over a blueprint (image) of machine.</p>
  *<p>Machine Schematic widget is integrated with a Template and retrieves configuration of machines from a REST API.After mounting the Machine Schematic configurations,
  * the sensors are loaded from a REST API with information about each sensor (i.e their location coordinates and initial state)  and placed over the machine.</p>
  *<p>The functionality of sensor is to change their state (color: gray, red, green) over a period of time through polling depending on the information fetched from REST API for each of the sensor independently.</p>
  *<p>The information about machines, sensor location and their state is configurable and retrieved from REST API.</p>
  *
  * <h3>Setup:-</h3>
  * Fetch basic configuration for numbers of MachineSchematic, information about each schematics and their sensors loaction from REST API for MachineWidget.
  *
  * <h3> Precondition:-</h3>
  * <p>After successful response from REST API, initial requirement is to set required propTypes. </p>
  * <p> Prop 1: url, type: string, isRequired</p>
  * <p> Prop 2: onMachineChange, type: function</p>
  *
  * <h3>Integration:-</h3>
  * <p> This is a container component that composes 2 presentational components (Machine and Sensor).</p>
  * <p> To use the presentational component (Machine) either use Widget(container component) with required props and stateMappings(stateToProps and DispatchToProps) 
  * or create your own container component that fills all the props for Machine</p>
*/

export class MachineWidget extends SICKComponent {

  /** Precondition (Static propTypes)
  * @returns { propTypes url string isRequired ,  propTypes function onMachineChange}
  */
  static propTypes() {
    return{
      url : PropTypes.string.isRequired,
      onMachineChange : PropTypes.func
    }
  }

  /**
   * creates an instance of MachineWidget.
   * @param {object} props 
   */
  constructor(props){
    super(props);
    this.createSensor = this.createSensor.bind(this);
  }

  /**
   * configuration of sensor.
   * @param {object} sensor
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
              style={sensorStyle}/>):null
          );
  }

  /*
   * React lifecycle method :
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
   * React lifecycle method :
   * setting initial values
   */
  componentWillMount(){
    this.props.fetchMachineConfig(this.props.url);
  }

  /**
   *React lifecycle method :
   * check if update should be done.
  */
  componentWillReceiveProps(nextProps){
    this.machineUpdate=(this.props.url!==nextProps.url);
    this.sensorUpdate = !this.props.machineConfig || (this.props.machineConfig.get('sensors').length !== nextProps.machineConfig.get('sensors').length)
  }

  /**
   *React lifecycle method :
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

/**
* @export - container component (MachineWidget)
*/
export default connect(mapStateToProps,dispatchToProps)(MachineWidget);




