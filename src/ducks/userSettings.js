import deepmerge from '../utils/deepmerge'
import { store } from '../SICKPlatform'

// ------------------------------------
// Constants
// ------------------------------------

const STORAGE_KEY = 'SICKPlatform/userSettings'
const UPDATE = 'SICKPlatform/userSettings/UPDATE'

// ------------------------------------
// Functions: Action creators / Helpers / etc.
// ------------------------------------

const update = (settings) => ({ type: UPDATE, settings })

function save (settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

/** @private */
export function updateUserSettings (settingsKey, settings) {
  const nextSettings = deepmerge(store.getState().userSettings, {
    [settingsKey]: settings
  })

  save(nextSettings)

  return update(nextSettings)
}

/** @private */
export function initialUserSettings () {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {}

const actionHandlers = {
  [UPDATE]: (state, { settings }) => {
    return deepmerge(state, settings)
  }
}

/** @private */
export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
