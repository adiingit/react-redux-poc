import React from 'react'
import SICKComponent from '../SICKComponent'
import {GridList, GridTile} from 'material-ui/GridList'
import Sensor from './Sensor'

export class Grid extends SICKComponent {
  render () {
    const backgroundImage = this.props.image
    const locationArray = this.props.locationArray

    return (
      <div style={{
        backgroundImage: "url(" +backgroundImage+")",
        backgroundColor: '#cccccc',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        width: '50%',
        marginTop: '150px',
        marginLeft: '330px'
      }} >

        <GridList
          cols={10}
          cellHeight={30}
        >
          {Array(100).fill(1).map((el, i) => (
            <GridTile
              key={i}
            >
              {
                locationArray.map(function (listValue) {
                  return (listValue === i ? <Sensor /> : '')
                })
              }
            </GridTile>
          ))}
        </GridList>
      </div>
    )
  }
}

export default Grid