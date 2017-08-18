import React,{PropTypes} from 'react'
import SICKComponent from '../SICKComponent'
import RaisedButton from 'material-ui/RaisedButton'


var interval;

/**
 * <p>Description:-</p>
 * Sensor Component is used to place each sensor independently on MachineSchematic.
 */
export default class Sensor extends SICKComponent {

  /** Precondition (Static propTypes)
   * @returns { propTypes.color color,  propTypes.location location object with value of x and y isRequired, propTypes.width width isRequired, propTypes.height height isRequired, propTypes.onTouch onTouch, propTypes.update update isRequired, propTypes.updateFreq updateFreq isRequired, propTypes.updateUrl updateUrl isRequired, propTypes.label label isRequired, propTypes.idle idle isRequired, propTypes.status status, propTypes.style style}
   */
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

  /**
   * Default Props
   * @returns {{idle: boolean, onTouch: Sensor.defaultProps.onTouch}}
   */
  static defaultProps = {
    idle : true,
    onTouch : function(){}
  }

  /**
   * creates an instance of Sensor.
   * @param {object} props
   * @param {function} updateSensor binding current object with updateSensor
   */
  constructor(props){
    super(props);
    this.updateSensor = this.updateSensor.bind(this);
  }

  /**
   * updating sensor Url.
   */
  updateSensor(){
    this.props.update(this.props.updateUrl);
  }

  /**
   * setting frequency
   */
  componentDidMount () {
    interval=setInterval(this.updateSensor,this.props.updateFreq*1000);
  }

  /**
   * clear setInterval
   */
  componentWillUnmount(){
    clearInterval(interval);
  }

  /**
   * Renders the component.
   * import RaisedButton from 'material-ui/RaisedButton'
   */
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

