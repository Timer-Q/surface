import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/list.scss'

export default class List extends Component {
  static propTypes = {
    children: PropTypes.node,
    dataSource: PropTypes.array,
    header: PropTypes.node,
    footer: PropTypes.node,
    locale: PropTypes.string,
    size: PropTypes.string,
    bordered: PropTypes.bool,
    isTableStyle: PropTypes.bool,
  }

  static defaultProps = {
    dataSource: [],
    header: '',
    footer: '',
    locale: '暂无数据',
    size: 'middle',
    bordered: true,
    isTableStyle: false,
  }

  render() {
    const { header, footer, dataSource, bordered, isTableStyle, size, locale, children } = this.props
    return (
      <div
        className={classNames('list', {
          'bordered': bordered,
          'small': size === 'small',
          'large': size === 'large',
        })}>
        {header && <header>{header}</header>}
        {(!dataSource.length && !children)&& <div className='item'>{locale}</div>}
        {dataSource.map((data, index) => {
          return (
            data.render && typeof data.render === 'function'
              ? <div className="list-custom" key={index}>{data.render(data, index)}</div>
              : <List.Item
                key={index}
                title={data.title}
                description={data.description}
                avatar={data.avatar}
                isBold={data.isBold}
                isTableStyle={isTableStyle}
                isTableArray={data}
                link={data.link}>
              </List.Item>
          )
        })}
        {children}
        {footer && <footer>{footer}</footer>}
      </div>
    )
  }
}
