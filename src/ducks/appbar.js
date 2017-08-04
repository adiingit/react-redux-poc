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

const updateSystem = (systemName) => ({ type: UPDATE_SYSTEM, systemName })

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

export const switchSystem = (systemName) => {
  return (dispatch) => {
    dispatch(updateSystem(systemName))
  }
}
// ------------------------------------
// Action Handlers
// ------------------------------------
const System = Record({
  systemName: '',
  systemLabel: 'Default System',
  disabled: false,
  systemImage: 'https://encrypted-tbn0.gstatic.com/images?' +
  'q=tbn:ANd9GcTQehDUC9hh3QRSmuMdZuTpi7Q3s0TPNsXCKK7tJwSUiAKhNBI54A',
  systemSensorLocation: [{"x": 10,"y" :20, state: 0},{"x": 15,"y": 30, state: 0}],
  systemSensorCount: 0


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
  [UPDATE_SYSTEM]: (state, { systemName }) => {
    let nextState = state

    const systemLabel = nextState.get('systems').get(systemName)
    ? nextState.get('systems').get(systemName).systemLabel : ''

    const systemImage = nextState.get('systems').get(systemName)
      ? nextState.get('systems').get(systemName).systemImage : ''

    const systemSensorLocation = nextState.get('systems').get(systemName)
      ? nextState.get('systems').get(systemName).systemSensorLocation : ''

    const systemSensorCount = nextState.get('systems').get(systemName)
      ? nextState.get('systems').get(systemName).systemSensorCount : ''

    nextState = nextState.setIn(['selectedSystem', 'systemName'], systemName)
    nextState = nextState.setIn(['selectedSystem', 'systemLabel'], systemLabel)
    nextState = nextState.setIn(['selectedSystem', 'systemImage'], systemImage)
    nextState = nextState.setIn(['selectedSystem', 'systemSensorLocation'], systemSensorLocation)
    nextState = nextState.setIn(['selectedSystem', 'systemSensorCount'], systemSensorCount)
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
