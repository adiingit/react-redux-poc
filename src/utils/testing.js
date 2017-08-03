import { shallow, mount, render } from 'enzyme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import SICKMuiTheme from '../SICKMuiTheme'

const options = {context: {muiTheme: getMuiTheme(SICKMuiTheme)}}

export const mountWithContext = (component) => mount(component, options)

export const shallowWithContext = (component) => shallow(component, options)

export const renderWithContext = (component) => render(component, options)
