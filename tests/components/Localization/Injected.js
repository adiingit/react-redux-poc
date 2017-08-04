import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { setIntl } from './localization'

class Injected extends React.Component {
  /** @ignore */
  static propTypes = {
    intl: PropTypes.object,
    children: PropTypes.array
  }

  componentWillMount = () => {
    setIntl(this.props.intl)
  }

  render = () => {
    return (this.props.children)
  }
}
export default injectIntl(Injected)
