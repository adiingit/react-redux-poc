import deepmerge from '../utils/deepmerge'
import SICKMuiTheme from '../SICKMuiTheme'

// ------------------------------------
// Constants
// ------------------------------------

const UPDATE = 'SICKPlatform/config/UPDATE'

/**
 * Constant GAUGE_RANGE_CONFIG_RECEIVED
 * @type {string}
 */
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



// ------------------------------------
// Reducer
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
  [UPDATE]: (state, { config }) => deepmerge(state, config)
}

/** @private */
export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
