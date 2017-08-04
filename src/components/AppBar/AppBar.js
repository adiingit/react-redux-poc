import React, { PropTypes } from 'react'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import { white, lightBlack, darkBlack } from 'material-ui/styles/colors'
import { connect } from '../../SICKPlatform'
import SICKComponent from '../SICKComponent'
import { getSystems, switchSystem } from '../../ducks/appbar'
import RectangularPaper from '../MachineWidget/RectangularPaper'

const mapStateToProps = (state) => ({
  appbar: state.appbar
})

const styles = {
  appbar: {
    backgroundColor: white,
    height: 45,
    fontSize: 12,
    color: lightBlack
  },
  dropdown: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 180,
    color: darkBlack
  },
  systemLabel: {
    marginLeft: -20,
    marginTop: 5
  },
  shiftLabel: {
    marginLeft: 30,
    marginTop: 5
  },
  button: {
    height: 32
  },
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
    borderRadius: '50%'
  }
}

/**
 * Component for rendering secondary header in the template
 */
export class AppBar extends SICKComponent {

  /** @ignore */
  static propTypes = {
    appbar: PropTypes.object.isRequired,
    url: PropTypes.string
  }

  /** @ignore */
  static defaultProps = {
    appbar: {}
  }

  /** @ignore */
  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)
    this.state = {currentCount: 5}
  }

  componentWillMount () {
    this.props.url && this.props.getSystems(this.props.url)
    clearInterval(this.intervalId)
  }

  handleChange = ( event, index, value) => {
    this.props.switchSystem(value)
    clearInterval(this.intervalId);
    this.setState({
      currentCount: 5
    })
    this.intervalId = setInterval(this.timer.bind(this), 500)
  }

  timer () {

    this.setState({
      currentCount: this.state.currentCount - 1
    })
    if(this.state.currentCount < 1) {
      clearInterval(this.intervalId)
      this.setState({
        currentCount: 10
      })
      this.intervalId = setInterval(this.timer.bind(this), 500)
    }
  }
  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 500)
  }

  render () {
    const appbar = this.props.appbar
    const systems = appbar.get('systems') ? appbar.get('systems').keySeq().toArray() : []
    const fullSystemDetails = appbar.get('systems')
    let selSystemName = ''
    let selSystemLabel = 'Default System'
    let selSystemImage = ''
    let selSystemSensorLocation = []
    let selSystemSensorCount = 0
    let color = (this.state.currentCount === 0 ? '#9e9e9e' : (this.state.currentCount > 5 && this.state.currentCount < 10 ? '#d50000' : '#00c853'))

    if (appbar.get('selectedSystem')) {
      selSystemName = appbar.get('selectedSystem').get('systemName')
      selSystemLabel = appbar.get('selectedSystem').get('systemLabel')
      selSystemImage = appbar.get('selectedSystem').get('systemImage')
      selSystemSensorLocation = appbar.get('selectedSystem').get('systemSensorLocation')
      selSystemSensorCount = appbar.get('selectedSystem').get('systemSensorCount')
    } else if (systems.length > 0) {
      selSystemName = systems[0]
      selSystemLabel = fullSystemDetails.get(selSystemName)
      selSystemImage = fullSystemDetails.get(selSystemImage)
      selSystemSensorLocation = fullSystemDetails.get(selSystemSensorLocation)
      selSystemSensorCount = fullSystemDetails.get(selSystemSensorCount)
    }

    return (
      <div>
        <Toolbar style={styles.appbar}>
          <ToolbarGroup>
            <DropDownMenu id='il-appbar-system-selection' value={selSystemName} maxHeight={4500}
              onChange={this.handleChange} style={styles.dropdown}>
              {systems.map((name) =>
                <MenuItem key={name} value={name} primaryText={name} disabled={fullSystemDetails.get(name).disabled} />
              )}
            </DropDownMenu>
            <span id='il-appbar-system-label' style={styles.systemLabel}>Sensors to be located in <strong>{selSystemName}</strong></span>
            <span id='il-appbar-sensor-count' style={styles.shiftLabel}>
              Number of <strong>Sensors -  {selSystemSensorCount}</strong>
            </span>
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            <RaisedButton id='il-appbar-reset-button'
              label='Reset'
              primary
              buttonStyle={styles.button} />
          </ToolbarGroup>
        </Toolbar>
        <
          RectangularPaper color={color} image={selSystemImage} locationArray={selSystemSensorLocation}
        />
      </div>
    )
  }
}


export default connect(mapStateToProps, { getSystems, switchSystem })(AppBar)



