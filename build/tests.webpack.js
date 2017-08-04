import chai from 'chai'
global.chai = chai
global.expect = chai.expect
global.should = chai.should()

const context = require.context('../src', true, /.spec\.js$/)
context.keys().forEach(context)
