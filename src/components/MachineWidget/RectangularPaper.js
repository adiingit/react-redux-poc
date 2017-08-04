import React from 'react'
import Paper from 'material-ui/Paper'
import LocationSensor from './LocationSensor'
import SICKComponent from '../SICKComponent'

export class RectangularPaper extends SICKComponent {

  render () {
    const backgroundImage = this.props.image
    const data = this.props.locationArray
    const color = this.props.color

    return (
      <div id="machine-widget">
        <Paper style={{
          backgroundImage: "url(" +backgroundImage+")",
          backgroundColor: '#cccccc',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          width: '600px',
          height: '400px',
          marginTop: '150px',
          marginLeft: '330px'}} >

          <LocationSensor data={data} color={color}/>
        </Paper>
      </div>
    )
  }
}

export default RectangularPaper



