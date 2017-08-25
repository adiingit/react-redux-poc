import fetchMock from 'fetch-mock'
import { systemList } from './data/systemList.json'
const theme = require('material-ui/styles')

const restBaseUrl = window.location.origin

fetchMock.get(restBaseUrl + '/system/systemList', (url) => {
    console.log('fetch mock data')
    return systemList
})

fetchMock.get('/machine/1', (url) => {
    return {
        name: '01',
        image: 'images/Auto_pallet1.png',
        sensors: [{ 'x': 200, 'y': 100 }, { 'x': 335, 'y': 42 }, { 'x': 150, 'y': 190 }],
        id: 120,
        label: 120,
        url: `sensor/1/status`,
        updateFreq: 2
    }
})

fetchMock.get('/gauge/reading', (url) => {
    return 185
})


fetchMock.get('/gauge/ranges', (url) => {
    return [
        {min:0, max:25, color:theme.colors.blueA700},
        {min:25, max:50, color:theme.colors.greenA700},
        {min:50, max:75, color:theme.colors.yellowA700},
        {min:75, max:200, color:theme.colors.redA700}
    ]
})



fetchMock.spy()