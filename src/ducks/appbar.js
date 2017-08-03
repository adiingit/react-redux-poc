import { Map, OrderedMap, Record } from 'immutable'
import { get } from '../utils/httpRequest'

// ------------------------------------
// Constants
// ------------------------------------
export const SYSTEM_LIST_RECEIVED = 'SYSTEM_LIST_RECEIVED'
export const UPDATE_SYSTEM = 'UPDATE_SYSTEM'

// ------------------------------------
// Actions
// ------------------------------------
const systemsReceived = (payload) => ({ type: SYSTEM_LIST_RECEIVED, payload })

const updateSystem = (systemName,prvSystemName) => ({ type: UPDATE_SYSTEM, systemName ,prvSystemName})

export const getSystems = (url) => {
  return (dispatch) => {
    return get(url)
      .then((payload) => {
        dispatch(systemsReceived(payload))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export const switchSystem = (systemName,prvSystemName) => {
  return (dispatch) => {
    dispatch(updateSystem(systemName,prvSystemName))
  }
}
// ------------------------------------
// Action Handlers
// ------------------------------------
const System = Record({
  systemName: '',
  systemLabel: 'Default System',
  disabled: false
})

const ACTION_HANDLERS = {
  [SYSTEM_LIST_RECEIVED]: (state, { payload }) => {
    let nextState = state

    let systemMap = OrderedMap()

    payload.map((value) => {
      const system = new System(value)
      systemMap = systemMap.set(value.systemName, system)
    })

    nextState = nextState.setIn(['systems'], systemMap)

    const selSystem = new System(payload[0])
    nextState = nextState.setIn(['selectedSystem'], selSystem)

    return nextState
  },
  [UPDATE_SYSTEM]: (state, { systemName ,prvSystemName}) => {
    let nextState = state

    const systemLabel = nextState.get('systems').get(systemName)
    ? nextState.get('systems').get(systemName).systemLabel : ''

    const prvSystemLabel = nextState.get('systems').get(prvSystemName)
    ? nextState.get('systems').get(prvSystemName).systemLabel : ''

    nextState = nextState.setIn(['selectedSystem', 'systemName'], systemName)
    nextState = nextState.setIn(['selectedSystem', 'systemLabel'], systemLabel)
    nextState = nextState.setIn(['prvSelectedSystem', 'systemName'], prvSystemName)
    nextState = nextState.setIn(['prvSelectedSystem', 'systemLabel'], prvSystemLabel)

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
