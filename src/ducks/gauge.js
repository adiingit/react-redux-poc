import { Map, OrderedMap, Record ,List} from 'immutable'
import { get } from '../utils/httpRequest'

// ------------------------------------
// Constants
// ------------------------------------
export const GAUGE_RANGES_RECEIVED = 'GAUGE_RANGES_RECEIVED'
// ------------------------------------
// Actions
// ------------------------------------
const rangesReceived = (ranges) => ({ type: GAUGE_RANGES_RECEIVED,ranges })

export const getRanges = (url) => {
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
/*const range = Record({
  "id":0,"min": 0 ,"max":0
})*/

const ACTION_HANDLERS = {
  [GAUGE_RANGES_RECEIVED]: (state, { ranges }) => {
    let nextState = state
    if(ranges && ranges.length){
      //const rangeList = List(ranges.map(value=>new range(value)));
      nextState = nextState.setIn(['range'], List(ranges));
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
