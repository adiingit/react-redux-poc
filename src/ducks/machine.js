import { Map, OrderedMap, Record ,List} from 'immutable'
import { get } from '../utils/httpRequest'

// ------------------------------------
// Constants
// ------------------------------------
/**
 * Constant SENSOR_STATUS_RECEIVED
 * @const {string}
 */
export const SENSOR_STATUS_RECEIVED = 'SENSOR_STATUS_RECEIVED'
/**
 * Constant CURRENT_SYSTEM_LOADED
 * @const {string}
 */
export const CURRENT_SYSTEM_LOADED = 'CURRENT_SYSTEM_LOADED'
/**
 * Constant MACHINE_LOADED
 * @const {string}
 */
export const MACHINE_LOADED = 'MACHINE_LOADED'
export const DISPLAY_SENSOR_VALUE = 'DISPLAY_SENSOR_VALUE'

// ------------------------------------
// Actions
// ------------------------------------
const fetchSensor = (sensorStatus) => ({ type: SENSOR_STATUS_RECEIVED,sensorStatus })

/**
 * @func
 * @param {string} url
 * This function is used to fetch sensor status.
 */
export const fetchSensorStatus = (url) => {
  return (dispatch) => {
    return get(url)
      .then((sensorStatus) => {
        dispatch(fetchSensor(sensorStatus))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

/**
 * @func
 * @param {string} url
 * This function is used to fetch current loaded machine.
 */
export const fetchCurrentSystem = () => {
  return (dispatch) => {
    dispatch({ type: CURRENT_SYSTEM_LOADED })
  }
}  

const fetchMachine = (machine) => ({ type: MACHINE_LOADED,machine })

/**
 * @func
 * @param {string} url
 * This function is used to fetch machine configurations.
 */
export const fetchMachineConfig = (url) => {
  return (dispatch) => {
    return get(url)
      .then((machine) => {
        dispatch(fetchMachine(machine))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

/**
 * @func
 * @param {string} id
 * This function is used to display current sensor value.
 */
export const displaySensorValue = (id) => {
  return (dispatch) => {
    dispatch({ type: DISPLAY_SENSOR_VALUE,id })
  }
}


// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [CURRENT_SYSTEM_LOADED]: (state,system) => {
    let nextState = state;
    nextState = nextState.setIn(['machineLoading'],!nextState.get('machineLoading'));
    return nextState;
  },
  [MACHINE_LOADED] : (state,data) => {
    let nextState = state;
    if(data && data.machine){
      nextState = nextState.setIn(['machineName'],data.machine.name);
      nextState = nextState.setIn(['image'],data.machine.image);
      nextState = nextState.setIn(['sensors'],data.machine.sensors)
    }
    nextState = nextState.setIn(['sensorData'],null);
    return nextState;
  },
  [SENSOR_STATUS_RECEIVED]: (state, data) => {
    let nextState = state

    if(data && data.sensorStatus){
      const nextData=Object.assign({},nextState.get('sensorData'),{[data.sensorStatus.id]:data.sensorStatus})
      nextState = nextState.setIn(['sensorData'],nextData);
    }
    return nextState
  },
  [DISPLAY_SENSOR_VALUE]:(state,data) => {
    let nextState = state
    const visible = !(nextState.get('sensorDisplay') && nextState.get('sensorDisplay')[data.id]);
    nextState = nextState.setIn(['sensorDisplay'],{[data.id]:visible});
    return nextState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = new Map()

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
