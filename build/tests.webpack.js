import chai from 'chai'
import sinon from 'sinon'
import promise from 'es6-promise'
global.chai = chai
global.expect = chai.expect
global.should = chai.should()
global.sinon = sinon

const context = require.context('../tests', true, /.spec\.js$/)
context.keys().forEach(context)
