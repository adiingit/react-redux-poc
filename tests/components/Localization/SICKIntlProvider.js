import React from 'react'
import { IntlProvider, addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import { localization } from './localization'
import Injected from './Injected'

addLocaleData([...en])
addLocaleData([...de])

export default class SICKIntlProvider extends IntlProvider {
  /**
   * @private
   *
   * Request data.
   */
  componentWillMount = () => {
    localization.loadMessageSet('common').then(() => {
      this.setState({
        locale: localization.locale,
        messages: localization.messages
      })
    })
  }

  render = () => {
    return (
      <Injected>
        {this.props.children}
      </Injected>
    )
  }
}
