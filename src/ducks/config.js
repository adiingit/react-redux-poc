import deepmerge from '../utils/deepmerge'
import { Map ,List} from 'immutable'
import { get } from '../utils/httpRequest'
import SICKMuiTheme from '../SICKMuiTheme'

// ------------------------------------
// Constants
// ------------------------------------

const UPDATE = 'SICKPlatform/config/UPDATE'


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
  [UPDATE]: (state, { config }) => deepmerge(state, config)
}

// ------------------------------------
// Reducer
// ------------------------------------

/** @private */
export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
