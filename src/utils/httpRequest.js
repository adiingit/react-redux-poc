import moment from 'moment'

let restBaseURL

export const getRestBaseURL = () => {
  return restBaseURL
}

export const setRestBaseURL = (baseURL) => {
  restBaseURL = baseURL
}

function serialize (params = {}) {
  const URIencode = (k, v) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`

  return Object.keys(params).map(
      (k) => {
        let temp = params[k]
        // convert array to array notation.
        if (temp.constructor === Array && temp.length) {
          return encodeURIComponent(k) + '=' + temp.map((i) => encodeURIComponent(i)).join(',') + ''
        } else if (temp.constructor === Date) {
          // convert date to iso format
          temp = moment(temp).format('YYYY-MM-DDTHH:mm:ss.SSS')
        }

        return URIencode(k, temp)
      }
  ).join('&')
}

function checkResponseStatus (response) {
  let json = response.json()
  if (response.status >= 200 && response.status < 300) {
    return json
  } else {
    console.error(response)
    return json.then(Promise.reject.bind(Promise))
  }
}

export function request (method, url, params) {
  const options = {
    method: method,
    headers: {
      'Accept': 'application/json'
    }
  }

  const paramsRequests = ['delete', 'update', 'post', 'put']

  if (restBaseURL && url.indexOf('http') === -1) {
    url = restBaseURL + url
  }

  if (paramsRequests.includes(method.toLowerCase())) {
    options.headers['Content-Type'] = 'application/json'
    options.body = (typeof params === 'object') ? JSON.stringify(params) : params
  } else if (params) {
    url = `${url}?${serialize(params)}`
  }

  return fetch(url, options)
    .then(checkResponseStatus)
}

export const encodeParams = (params) => serialize(params)

export const del = (url, params) => request('delete', url, params)

export const put = (url, params) => request('put', url, params)

export const post = (url, params) => request('post', url, params)

export const get = (url, params) => request('get', url, params)
