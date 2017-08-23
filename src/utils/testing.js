import { shallow, mount, render } from 'enzyme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import SICKMuiTheme from '../SICKMuiTheme'

const options = {context: {muiTheme: getMuiTheme(SICKMuiTheme)}}

export const mountWithContext = (component,moreOptions) => mount(component, Object.assign({},options,moreOptions));

export const shallowWithContext = (component,moreOptions) => shallow(component, Object.assign({},options,moreOptions))

export const renderWithContext = (component,moreOptions) => render(component, Object.assign({},options,moreOptions))
