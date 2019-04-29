import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/anchor.scss'

export default class AnchorLink extends Component {
  static propTypes = {
    href: PropTypes.string,
    children: PropTypes.any,
    activeId: PropTypes.string,
    onClick: PropTypes.func,
    registerLink: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      pageYOffset: null,
    }
  }

  componentDidMount() {
    const { registerLink } = this.props
    registerLink &&
      registerLink({
        link: this.props.href,
        instance: this,
      })
  }

  handleClick(href, event) {
    const { onClick } = this.props
    if (onClick) {
      onClick(href, event)
    }
  }

  render() {
    const { href, children, activeId } = this.props

    const cls = classNames('anchor-item', {
      'is-active': href === activeId,
    })
    return (
      <span
        ref={node => (this.anchorLinkRef = node)}
        // href={formatedHref}
        className={cls}
        onClick={this.handleClick.bind(this, href)}>
        {children}
      </span>
    )
  }
}
