import deepmerge from '../utils/deepmerge'
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
// Reducer
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


export const getMachineSchematicConfig= (url) => {
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
