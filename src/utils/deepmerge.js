import merge from 'lodash.mergewith'

function customizer (destValue, srcValue, key, destParent) {
  if (srcValue === undefined) {
    delete destParent[key]
  } else if (destValue instanceof Array && srcValue instanceof Array) {
    if (destValue.length !== srcValue.length) {
      return srcValue
    }
  }
}

/** @ignore */
export default function deepmerge (original, next) {
  return merge({}, original, next, customizer)
}
