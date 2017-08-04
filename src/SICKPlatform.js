import { combineReducers, compose, createStore, applyMiddleware } from 'redux'
import { connect as reactReduxConnect } from 'react-redux'
import thunk from 'redux-thunk'
import ducks from './ducks'

// ------------------------------------
// Reducers
// ------------------------------------

// TODO: inject reducer on demand
export const reducers = Object.keys(ducks).reduce((obj, duck) => {
  obj[duck] = ducks[duck].default
  return obj
}, {})

// ------------------------------------
// Set up store
// ------------------------------------

const initialState = {
  userSettings: ducks.userSettings.initialUserSettings()
}

/** @private */
const middleware = [thunk]

const enhancers = []

if (process.env.NODE_ENV === 'development' && window.devToolsExtension) {
  enhancers.push(window.devToolsExtension())
}

/** @private */
export const store = createStore(
  combineReducers(reducers),
  initialState,
  compose(
    applyMiddleware(...middleware),
    ...enhancers
  )
)

/**
 * Wraps react-redux's connect component to automatically provide our connected components
 * with our global store.
 * @private
 */
export function connect () {
  const args = arguments
  return (component) => {
    const connectedComponent = reactReduxConnect.apply(this, args)(component)
    connectedComponent.defaultProps = {
      ...connectedComponent.defaultProps,
      store
    }

    /**
     * React-Redux's `connect()` function wraps components in a `Connected` component.
     * In doing so, it will hoist statics. It cannot see super statics though, so we must
     * redefine the static here if it's not overridden by the component.
     */
    if (!connectedComponent.init) {
      connectedComponent.init = connectedComponent.WrappedComponent.init
    }
    return connectedComponent
  }
}

/**
 * This function can be used to configure application level parameters
 * like websocket connection
 *
 * @example
 * SICKPlatform.configure({
 *  websocket: {
 *    url: 'http://localhost:8080/websocket/sockjs',
 *    reconnect: true,
 *    reconnectInterval: 5,
 *    maxRetries: 5
 *  }
 * })
 * @param {Object} config The configuration
 */
export function configure (config) {
  store.dispatch(ducks.config.updateConfig(config))
}

/**
 * Called once on app start when tap events need to be registered by the platform
 *
 * This is a constraint with the current React version. This may be deprecated in
 * future platform versions.
 */
export function registerTapEvents () {
  require('react-tap-event-plugin')()
}

/**
 * Update user settings by specifying a settings key and the settings to be updated.
 * @param {String} settingsKey The settings key to be updated. Typically a group ID.
 * @param {Object} settings New user settings to be merged into the current user
 * settings under the specified settings key.
 * @private
 */
export function updateUserSettings (settingsKey, settings) {
  store.dispatch(ducks.userSettings.updateUserSettings(settingsKey, settings))
}
