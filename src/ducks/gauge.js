import { Map } from 'immutable'
import { get } from '../utils/httpRequest'

// ------------------------------------
// Constants
// ------------------------------------
export const ERROR = 'ERROR'
export const FETCH_GAUGE_READING = 'FETCH_GAUGE_READING'
export const TOGGLE_GAUGE_READING = 'TOGGLE_GAUGE_READING'
// ------------------------------------
// Actions
// ------------------------------------

export const fetchCurrentReading = url => {
    return dispatch => {
      return get(url).then(
        reading=>{dispatch({ type: FETCH_GAUGE_READING, reading })}
        )
    }  
}

export const renderCurrentReading = () => {
    return { type: TOGGLE_GAUGE_READING };
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [TOGGLE_GAUGE_READING]: (state, data) => {
    let nextState = state
    nextState = nextState.setIn(['raisedButton'], !nextState.get('raisedButton'));
    return nextState
  },
  [FETCH_GAUGE_READING]: (state,data) => {
    let nextState = state
    nextState = nextState.setIn(['currentValue'], data.reading);
    nextState = nextState.setIn(['raisedButton'], undefined);
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
