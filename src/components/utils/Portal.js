import { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

function getContainer() {
  return document.body
}

export default class Portal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    getContainer: PropTypes.func,
    didUpdate: PropTypes.func,
  }

  static defaultProps = {
    getContainer: getContainer,
  }

  componentDidMount() {
    this.getMountNode()
  }

  componentDidUpdate() {
    const { didUpdate } = this.props
    if (didUpdate) {
      didUpdate()
    }
  }

  componentWillUnmount() {
    this.removeMountNode()
  }

  getMountNode() {
    this.mountNode = this.props.getContainer()
    this.forceUpdate()
  }

  removeMountNode() {
    if (typeof this.mountNode !== 'boolean') {
      if (this.mountNode && this.mountNode !== document.body) {
        ReactDOM.unmountComponentAtNode(this.mountNode)
      }
    }
  }

  render() {
    if (typeof this.mountNode === 'boolean' && this.mountNode) {
      return this.props.children
    }
    if (this.mountNode) {
      return ReactDOM.createPortal(this.props.children, this.mountNode)
    }
    return null
  }
}
