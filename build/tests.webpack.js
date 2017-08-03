import chai from 'chai'
import * as enzyme from 'enzyme'
global.chai = chai
global.expect = chai.expect
global.should = chai.should()
global.mount = enzyme.mount;
global.render = enzyme.render;
global.shallow = enzyme.shallow;

const context = require.context('../src', true, /.spec\.js$/)
context.keys().forEach(context)
