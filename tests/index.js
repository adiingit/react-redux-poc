import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import * as SICKPlatform from '../src'
import AppBar from '../src/components/AppBar'
import theme from './theme'
import SICKIntlProvider from './components/Localization'

import mockData from './mock/mockFetch'

SICKPlatform.registerTapEvents()

SICKPlatform.configure({
  webSocket: {
    url: 'http://localhost:8080/websocket/sockjs',
    reconnect: true,
    reconnectInterval: 5,
    maxRetries: 5
  },
  authentication: {
    url: 'http://localhost:8080'
  },
  systemConfiguration: {
    url: 'http://localhost:8080/device'
  },
  theme: theme
})


// React method to create AppBar component
const App = () => (
    <div>
    <AppBar url = { 'http://10.0.8.165:3000/system/systemList' } ></AppBar>
  </div>
)

ReactDOM.render(
    <App />,
    document.getElementById('container')
)


// Vanilla javascript method to create AppBar component
// window.appBar = AppBar.init(document.getElementById('app-bar'), {
//   url: 'http://localhost:3000/system/systemList'
// })
