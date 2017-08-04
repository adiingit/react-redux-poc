import { Map } from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_GAUGE_READING = 'SHOW_GAUGE_READING'
export const HIDE_GAUGE_READING = 'HIDE_GAUGE_READING'
// ------------------------------------
// Actions
// ------------------------------------

export const renderCurrentReading = (buttonData) => {
    return { type: SHOW_GAUGE_READING, buttonData };
}

export const removeCurrentReading = () => {
    return { type: HIDE_GAUGE_READING };
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SHOW_GAUGE_READING]: (state, data) => {
    let nextState = state
    if(data){
      nextState = nextState.setIn(['raisedButton'], data.buttonData);
    }
    return nextState
  },
  [HIDE_GAUGE_READING]: (state, data) => {
    let nextState = state
    nextState = nextState.setIn(['raisedButton'], undefined);
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
