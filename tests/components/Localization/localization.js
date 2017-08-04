import { get } from '../../../src/utils/httpRequest'
import util from 'util'

const operationsDelimeter = '|'
const promises = {}
const endpoint = '/getLocalizedMessages/%s'
const messages = {}
const sets = []
let locale
let intl

/**
 * Function to request messages over http call
 */
export const loadMessageSet = (set) => {
  let promise

  console.log('loadMessageSet', set)

  if (isMessageSetAvailable(set)) { // already retrieved
    promise = new Promise((resolve, reject) => {
      resolve(false)
    })
  } else if (promises[set]) { // currently pending request
    promise = promises[set]
  } else { // need to retrieve
    promise = get(util.format(endpoint, set))
      // .then(response => (response.json()))
      .then((response) => {
        locale = response.locale
        addMessages(set, response.messages)
        delete promises[set]
        return true
      })
      .catch(err => {
        console.log(err)
        delete promises[set]
        return false
      })
    promises[set] = promise
  }
  return promise
}

export const getMessage = (id) => {
  return {
    id: id,
    defaultMessage: messages[id]
      ? messages[id]
      : util.format('!!!%s!!!', id)
  }
}

export const isMessageSetAvailable = (set) => {
  const setsToCheck = Array.isArray(set) ? set : [set]
  let allAvailable = true
  setsToCheck.forEach((_set) => {
    if (!sets.includes(_set)) {
      allAvailable = false
    }
  })
  return allAvailable
}

export const setIntl = (_intl) => {
  intl = _intl
}

export const getIntl = () => {
  return intl
}

export const formatMessage = (id, values) => {
  return intl && intl.formatMessage(getMessage(id), values)
}

export const formatHTMLMessage = (id, values) => {
  return intl && intl.formatHTMLMessage(getMessage(id), values)
}

export const formatOperations = (id, values) => {
  return intl && intl.formatMessage(getMessage(id), values).split(operationsDelimeter)
}

export const formatNumber = (number, options) => {
  return intl.formatNumber(number, options)
}

export const formatDate = (date, options) => {
  return intl.formatDate(date, options)
}

const addMessages = (setName, messageSet) => {
  sets.push(setName)
  Object.keys(messageSet).forEach((id) => {
    messages[setName + ':' + id] = messageSet[id]
  })
}

export const localization = {
  locale,
  messages,
  loadMessageSet,
  isMessageSetAvailable,
  getMessage,
  setIntl,
  getIntl,
  formatMessage,
  formatHTMLMessage,
  formatNumber,
  formatDate,
  formatOperations
}
