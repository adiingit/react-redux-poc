import { Map, OrderedMap, Record ,List} from 'immutable'
import { get } from '../utils/httpRequest'

// ------------------------------------
// Constants
// ------------------------------------
/**
 * Constant SENSOR_STATUS_RECEIVED
 * @type {string}
 */
export const SENSOR_STATUS_RECEIVED = 'SENSOR_STATUS_RECEIVED'
/**
 * Constant CURRENT_SYSTEM_LOADED
 * @type {string}
 */
export const CURRENT_SYSTEM_LOADED = 'CURRENT_SYSTEM_LOADED'
/**
 * Constant MACHINE_LOADED
 * @type {string}
 */
export const MACHINE_LOADED = 'MACHINE_LOADED'
// ------------------------------------
// Actions
// ------------------------------------
const fetchSensor = (sensorStatus) => ({ type: SENSOR_STATUS_RECEIVED,sensorStatus })

/**
 * This function is used to fetch sensor status from REST API.
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

export const fetchCurrentSystem = () => {
  return (dispatch) => {
    dispatch({ type: CURRENT_SYSTEM_LOADED })
  }
}  

const fetchMachine = (machine) => ({ type: MACHINE_LOADED,machine })

/**
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
// ------------------------------------
// Action Handlers
// ------------------------------------
/*const range = Record({
 "id":0,"min": 0 ,"max":0
 })*/

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
    return nextState;
  },
  [SENSOR_STATUS_RECEIVED]: (state, data) => {
    let nextState = state
    if(data && data.sensorStatus){
        nextState = nextState.setIn(['sensorData'],{[data.sensorStatus.id]:data.sensorStatus});
    }
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
