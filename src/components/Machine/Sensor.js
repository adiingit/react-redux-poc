import React,{PropTypes} from 'react'
import SICKComponent from '../SICKComponent'
import RaisedButton from 'material-ui/RaisedButton'


var interval;

export default class Sensor extends SICKComponent {

  static propTypes = {
    color : PropTypes.string,
    location : PropTypes.shape({
      x:PropTypes.number.isRequired,
      y:PropTypes.number.isRequired
    }).isRequired,
    width : PropTypes.number.isRequired,
    height : PropTypes.number.isRequired,
    onTouch : PropTypes.func,
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
    onTouch : function(){}
  }

  constructor(props){
    super(props);
    this.updateSensor = this.updateSensor.bind(this);
  }

  updateSensor(){
    this.props.update(this.props.updateUrl);
  }

  componentDidMount () {
    interval=setInterval(this.updateSensor,this.props.updateFreq*1000);
  }

  componentWillUnmount(){
    clearInterval(interval);
  }

  render () {
    const buttonStyle = Object.assign({
      width:this.props.width,
      height:this.props.height
    },this.props.style);

    const sensorStyle = Object.assign({
      position : 'relative',
      left : this.props.location.x - (this.props.width/2),
      top : this.props.location.y - (this.props.height/2),
      minWidth:0,
    },buttonStyle);

    const color=this.props.color || (this.props.status?'#0f0':'#f00')
    return (
      this.props.idle?
          <RaisedButton 
          label={this.props.label} 
          disabled={this.props.idle} 
          style={sensorStyle}
          onTouchTap = {this.props.onTouch}
          buttonStyle = {buttonStyle}
          /> :
          <RaisedButton 
          label={this.props.label} 
          buttonStyle={buttonStyle}
          style={sensorStyle}
          backgroundColor={color} 
          onTouchTap = {this.props.onTouch}
          />
      
    )
  }
}

