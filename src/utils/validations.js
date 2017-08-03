/* eslint max-len: ["error", 180] */

/**
 * Validates a SICK password
 * Length min of 8, 1 uppercase or lowercase char and one number.
 */
export function validatePassword (input = '') {
  var regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
  return regex.test(input)
}

/**
 * Validates a SICK username.
 */
export function validateUsername (input = '') {
  // Check if validation is against email.
  if (input.indexOf('@') !== -1) {
    var regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return regex.test(input)
  }
  // Otherwise just check the input length for username.
  return (input.length >= 3)
}
