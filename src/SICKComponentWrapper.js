import { createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

/**
 * Wraps SICKComponent instances to provide high level API interfaces for non-React appliances.
 * @private
 */
export default class SICKComponentWrapper {
  /**
   * Initializes a React component and returns a wrapper which provides access to the DOM Element
   * and additional APIs for manipulating that DOM Element
   * @param {Element} node The DOM Element to initialize (render) the component into.
   * @param {Object} properties The properties to be applied to the component.
   * @throws {Error} Throws Error when `init()` is called on the component directly.
   * @return {SICKComponentWrapper} The component wrapper.
   */
  constructor (component, node, properties) {
    /** @type {SICKComponent} */
    this.component = component
    /** @type {Element} */
    this.node = node

    // Create ReactComponent instance from the extending React class. Children not implemented yet.
    this._instance = render(createElement(component, properties), node)
  }

  /**
   * Tear down the React component and remove it from the DOM Element
   */
  destroy () {
    // Unmount the React component
    unmountComponentAtNode(this.node)
    this.component = null
    this._instance = null
    this.node = null
  }

  /**
   * Update the component with new properties. Will cause the affected node trees to be re-rendered React style.
   * @param {Object} properties Component properties to update
   */
  update (properties) {
    const nextProperties = {
      ...this._instance.props,
      ...properties
    }
    // Re-render the node with the new properties merged into the old properties. preUpdateNode === postUpdateNode
    render(createElement(this.component, nextProperties), this.node)
  }
}
