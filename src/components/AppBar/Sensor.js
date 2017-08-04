import React from 'react'
import SICKComponent from '../SICKComponent'

const styles = {
  ledbox: {
    height: '30px',
    width: '25%',
    margin: '10px 0',
    float: 'left'
  },
  ledred: {
    margin: '0 auto',
    width: '15px',
    height: '15px',
    backgroundColor: '#F00',
    borderRadius: '50%'
  },
  ledgreen: {
    margin: '0 auto',
    width: '15px',
    height: '15px',
    backgroundColor: '#ABFF00',
    borderRadius: '50%'
  },
  ledblue: {
    margin: '0 auto',
    width: '15px',
    height: '15px',
    backgroundColor: '#24E0FF',
    borderRadius: '50%',
  }
}
export class Sensor extends SICKComponent {
  render () {
    return (


      <div style={styles.ledbox}>
        <div style={styles.ledred} />
      </div>
    )
  }
}

export default Sensor