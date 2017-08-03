import deepmerge from '../utils/deepmerge'
import { Map ,List} from 'immutable'
import { get } from '../utils/httpRequest'
import SICKMuiTheme from '../SICKMuiTheme'

// ------------------------------------
// Constants
// ------------------------------------

const UPDATE = 'SICKPlatform/config/UPDATE'
const GAUGE_RANGE_CONFIG_RECEIVED = 'GAUGE_RANGE_CONFIG_RECEIVED'

// ------------------------------------
// Functions: Action creators / Helpers / etc.
// ------------------------------------
/** @private */
export function updateConfig (config) {
  return {
    type: UPDATE,
    config
  }
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

const initialState = {
  theme: SICKMuiTheme,
  webSocket: {
    reconnect: true,
    reconnectInterval: 5,
    maxRetries: 5
  }
}

const actionHandlers = {
  [UPDATE]: (state, { config }) => deepmerge(state, config),
  [GAUGE_RANGE_CONFIG_RECEIVED]: (state, { ranges }) => {
    let nextState = state
    if(ranges && ranges.length){
      nextState.gauge = new Map();
      nextState.gauge=nextState.gauge.setIn(['range'], List(ranges));
    }
    return nextState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

/** @private */
export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
