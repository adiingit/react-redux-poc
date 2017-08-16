import React,{PropTypes} from 'react'
import Paper from 'material-ui/Paper'
import Sensor from './Sensor'
import Machine from './Machine'
import SICKComponent from '../SICKComponent'
import { connect } from '../../SICKPlatform'
import {fetchCurrentSystem,fetchMachineConfig,fetchSensorStatus} from '../../ducks/machine'

const mapStateToProps = (state)=>{
  return {
    machineConfig : state.machine.size?state.machine:null
  }
}

const dispatchToProps = {
    fetchCurrentSystem,
    fetchMachineConfig,
    fetchSensorStatus
}

const sensorStyle = {
  width : 50,
  height : 50,
  borderRadius : '50%'
};

const machineStyle = {
  width : '50%',
  height : '50%',
  left:'25%',
  marginTop:30,
  position:'absolute'
}

export class MachineWidget extends SICKComponent {

  static propTypes = {
    url : PropTypes.string.isRequired,
    onMachineChange : PropTypes.func
  }

  constructor(props){
    super(props);
    this.createSensor = this.createSensor.bind(this);
  }

  createSensor(sensor){
    const sensorData = this.props.machineConfig.get('sensorData');
    return (this.props.machineConfig? (<Sensor 
              key={sensor.id}
              updateUrl={sensor.url}
              color={sensorData?(sensorData[sensor.id] && sensorData[sensor.id].color):''} 
              location={{x:sensor.x,y:sensor.y}}
              width={sensorStyle.width}
              height={sensorStyle.height}
              label={sensor.label}
              update={this.props.fetchSensorStatus}
              updateFreq={sensor.updateFreq} 
              idle={sensorData?(sensorData[sensor.id] && sensorData[sensor.id].idle):true} 
              status={sensorData?(sensorData[sensor.id] && sensorData[sensor.id].status):false} 
              style={{borderRadius:sensorStyle.borderRadius}}/>):null
          );
  }


  componentDidUpdate(){
    if(this.sensorUpdate)
      this.props.onMachineChange(this.props.machineConfig.get('sensors').length);
    if(this.machineUpdate){
      this.props.fetchMachineConfig(this.props.url);
    }
  }

  componentWillMount(){
    this.props.fetchMachineConfig(this.props.url);
  }

  componentWillReceiveProps(nextProps){
    this.machineUpdate=(this.props.url!==nextProps.url);
    this.sensorUpdate = !this.props.machineConfig || (this.props.machineConfig.get('sensors').length !== nextProps.machineConfig.get('sensors').length)
  }

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




