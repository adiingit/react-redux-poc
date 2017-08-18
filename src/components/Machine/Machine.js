import React,{PropTypes} from 'react'
import Paper from 'material-ui/Paper'
import SICKComponent from '../SICKComponent'

/**
* <p>Description:-</p>
* To draw a machine schematic on Paper Component with information of image, name, location of sensors that are fetched from Rest API.
*/
export default class Machine extends SICKComponent {

  /** Precondition (Static propTypes)
   * @returns { propTypes.image image string isOptional ,  propTypes.sensors sensors array isRequired}
   */
  static propTypes () {
    return{
        image : PropTypes.string,
        sensors : PropTypes.arrayOf(PropTypes.node).isRequired
    }
  };

  /** Default Props
   * @returns { array of sensors}
   */
  static defaultProps(){
    return{
      sensors : []
    }
  }

  /**
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




