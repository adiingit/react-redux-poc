import React,{PropTypes} from 'react'
import Paper from 'material-ui/Paper'
import SICKComponent from '../SICKComponent'

export default class Machine extends SICKComponent {

  static propTypes = {
    image : PropTypes.string,
    sensors : PropTypes.arrayOf(PropTypes.node).isRequired
  };

  static defaultProps ={
    sensors : []
  }

  render () {
    const paperStyle = Object.assign({},{
      backgroundImage:`url(${this.props.image})`,
      backgroundRepeat : 'no-repeat',
      backgroundPosition : 'center',
      backgroundSize : 'contain'
    },this.props.style); 
    return (
      <Paper style={paperStyle} zDepth={5} >
        {this.props.sensors}
      </Paper>
    )
  }
}




