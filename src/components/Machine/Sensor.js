import React,{PropTypes} from 'react'
import SICKComponent from '../SICKComponent'
import RaisedButton from 'material-ui/RaisedButton'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';


var interval;

export default class Sensor extends SICKComponent {

  static propTypes = {
    id:PropTypes.string.isRequired,
    color : PropTypes.string,
    location : PropTypes.shape({
      x:PropTypes.number.isRequired,
      y:PropTypes.number.isRequired
    }).isRequired,
    width:PropTypes.number.isRequired,
    height:PropTypes.number.isRequired,
    onTouchStart : PropTypes.func,
    onTouchEnd : PropTypes.func,
    sensorDisplay : PropTypes.bool,
    update : PropTypes.func.isRequired,
    updateFreq : PropTypes.number.isRequired,
    updateUrl : PropTypes.string.isRequired,
    label : PropTypes.number.isRequired,
    idle : PropTypes.bool.isRequired,
    status : PropTypes.bool,
    style : PropTypes.object
  }

  static defaultProps = {
    idle : true,
    onTouchStart : function(){},
    sensorDisplay : false
  }

  constructor(props){
    super(props);
    this.updateSensor = this.updateSensor.bind(this);
    this.mouseover =  this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
  }

  updateSensor(){
    this.props.update(this.props.updateUrl);
  }

  mouseover(e){
    e.preventDefault();
    this.props.onTouchStart(this.props.id);
  }

  mouseout(){
    this.props.onTouchEnd(this.props.id);
  }

  componentDidMount () {
    interval=setInterval(this.updateSensor,this.props.updateFreq*1000);
  }

  componentWillUnmount(){
    clearInterval(interval);
  }

  render () {
    const style = Object.assign({width:this.props.width,height:this.props.height},this.props.style)
    const raisedButtonStyle = Object.assign({minWidth:0},style);

    const sensorStyle = Object.assign({
      position : 'relative',
      left : this.props.location.x - (this.props.width/2),
      top : this.props.location.y - (this.props.height/2)
    },this.props.style);

    return (
      <div style={sensorStyle}>
        <RaisedButton 
        ref = {'sensor'}
        label={this.props.label} 
        buttonStyle={this.props.style}
        style={raisedButtonStyle}
        backgroundColor={this.props.color} 
        onClick = {this.mouseover}
        />
        <Popover
            open={this.props.sensorDisplay}
            anchorEl={this.refs.sensor && this.refs.sensor.refs.overlay}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose = {this.mouseout}
        >
          <article style={{margin:10}}>
            <div>Sensor {this.props.label}</div>
            <div>Status:{this.props.idle?'idle':(this.props.status?'OK':'ERROR')}</div>
          </article>  
        </Popover>
      </div>
    )
  }
}

