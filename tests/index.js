import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import * as SICKPlatform from '../src'
import * as WidgetConfig from '../src/WidgetsConfig'
import AppBar from '../src/components/AppBar'
import GaugeWidget from '../src/components/GaugeWidget/Gauge'
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
    <AppBar url = { 'http://10.0.30.161:3000/system/systemList' } />
    <GaugeWidget/>
    </div>
)

WidgetConfig.configureGaugeWidget('http://10.0.30.161:3000/gauge/ranges').then(function(s){
  ReactDOM.render(
    <App />,
    document.getElementById('container')
)  
})





// Vanilla javascript method to create AppBar component
// window.appBar = AppBar.init(document.getElementById('app-bar'), {
//   url: 'http://localhost:3000/system/systemList'
// })
