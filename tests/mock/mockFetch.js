import fetchMock from 'fetch-mock'
import { systemList } from './data/systemList.json'

const restBaseUrl = window.location.origin

fetchMock.get(restBaseUrl + '/system/systemList', (url) => {
  console.log('fetch mock data')
  return systemList
})


fetchMock.spy()