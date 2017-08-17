import { Map,List } from 'immutable'
import { get } from '../utils/httpRequest'

// ------------------------------------
// Constants
// ------------------------------------
/**
 * Constant ERROR
 * @type {string}
 */
export const ERROR = 'ERROR'
/**
 * Constant FETCH_GAUGE_READING
 * @type {string}
 */
export const FETCH_GAUGE_READING = 'FETCH_GAUGE_READING'
/**
 * Constant TOGGLE_GAUGE_READING
 * @type {string}
 */
export const TOGGLE_GAUGE_READING = 'TOGGLE_GAUGE_READING'
const GAUGE_RANGE_CONFIG_RECEIVED = 'GAUGE_RANGE_CONFIG_RECEIVED'
// ------------------------------------
// Actions
// ------------------------------------
/**
 * This function is used to fetch gauge current reading from REST API.
 */
export const fetchCurrentReading = url => {
    return dispatch => {
      return get(url).then(
        reading=>{dispatch({ type: FETCH_GAUGE_READING, reading })}
        )
    }  
}

/**
 * This function is used to show gauge reading on button.
 */
export const renderCurrentReading = () => {
    return { type: TOGGLE_GAUGE_READING };
}

const rangesReceived = (ranges) => ({ type: GAUGE_RANGE_CONFIG_RECEIVED,ranges })

export const getGaugeConfig = (url) => {
  return (dispatch) => {
    return get(url)
      .then((ranges) => {
        dispatch(rangesReceived(ranges))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [GAUGE_RANGE_CONFIG_RECEIVED]: (state, { ranges }) => {
    let nextState = state
    if(ranges && ranges.length){
      nextState=nextState.setIn(['range'], List(ranges));
    }
    return nextState
  },
  [TOGGLE_GAUGE_READING]: (state, data) => {
    let nextState = state
    nextState = nextState.setIn(['raisedButton'], !nextState.get('raisedButton'));
    return nextState
  },
  [FETCH_GAUGE_READING]: (state,data) => {
    let nextState = state
    nextState = nextState.setIn(['currentValue'], data.reading);
    //nextState = nextState.setIn(['raisedButton'], undefined);
    return nextState;
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
