import { Component, PropTypes } from 'react'
import uuid from 'node-uuid'
import SICKComponentWrapper from '../SICKComponentWrapper'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import SICKMuiTheme from '../SICKMuiTheme'

/**
 * A base React component which is shared by all SICK platform React components
 * @private
 * @abstract
 */
export default class SICKComponent extends Component {

  static propTypes = {
    config: PropTypes.object,
    group: PropTypes.string
  }

  static defaultProps = {
    // Default state key will be random. However, for widgets that require user settings to persist,
    // developers will need to specify the group ID for the widget.
    // Without a pre-defined and deterministic group ID, the widget will not know where to get its saved settings.
    group: uuid.v4()
  }

  /**
   * Initializes a component returning the DOM instance it was rendered into.
   * @protected
   * @param {Element} node The {@link Element} to initialize (render) the component into.
   * @param {Object} properties The properties to be applied to the component.
   * @throws {Error} Throws Error when `init()` is called on the component directly.
   * @return {SICKComponentWrapper} The component wrapper.
   */
  static init (node, properties) {
    if (this.prototype.constructor === SICKComponent) {
      throw new Error('You cannot initialize the base SICK component.')
    }

    return new SICKComponentWrapper(this.prototype.constructor, node, properties)
  }

  /** @ignore */
  static childContextTypes = {
    muiTheme: PropTypes.object.isRequired
  }

  static contextTypes = {
    muiTheme: PropTypes.object
  }

  /** @private */
  get muiTheme () {
    return this.context.muiTheme || getMuiTheme(this.props.config ? this.props.config.theme : SICKMuiTheme)
  }

  /** @ignore */
  getChildContext () {
    return {
      muiTheme: this.muiTheme
    }
  }
}
