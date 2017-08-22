import React,{PropTypes} from 'react'
import Paper from 'material-ui/Paper'
import SICKComponent from '../SICKComponent'

/**
* <h3>Description:-</h3>
* This is a presentational component that represents Machine Schematic with sensors deployed on it.
*/
export default class Machine extends SICKComponent {

  /** Precondition (Static propTypes)
   * @static @type { propTypes.image string isRequired ,  propTypes.sensors array isRequired}
   */
  static propTypes = {
        image : PropTypes.string.isRequired,
        sensors : PropTypes.arrayOf(PropTypes.node).isRequired
  };

  /**
   * React lifecycle method :
   * Renders the component.
   * Paper from 'material-ui/Paper'
   */
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




