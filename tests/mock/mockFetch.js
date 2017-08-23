import fetchMock from 'fetch-mock'
import { systemList } from './data/systemList.json'

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

fetchMock.spy()