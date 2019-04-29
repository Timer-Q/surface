import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/item.scss'
import Cell from './Cell'

export default class Item extends Component {
  static propTypes = {
    children: PropTypes.node,
    avatar: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    link: PropTypes.string,
    isTableStyle: PropTypes.bool,
    isTableArray: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    isBold: PropTypes.bool,
  }

  static defaultProps = {
    avatar: '',
    title: '',
    description: '',
    link: '',
    bordered: true,
    isTableStyle: false,
    isTableArray: [],
    isBold: false,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      avatar,
      title,
      description,
      link,
      isTableStyle,
      isTableArray,
      isBold,
    } = this.props

    return (
      <div
        className={classNames('item', {
          isTableStyle: isTableStyle,
        })}
      >
        {isTableArray.length &&
          isTableArray.map((data, index) => {
            return (
              <Cell
                key={index}
                title={data.title}
                description={data.description}
                link={data.link}
                isBold={data.isBold}
              />
            )
          })}

        {isTableStyle && !isTableArray.length && (
          <Cell
            title={title}
            description={description}
            link={link}
            isBold={isBold}
          />
        )}

        {!isTableStyle && (
          <a href={link || 'javascript:void(0)'}>
            {avatar && <img src={avatar} />}
            <div className="content">
              {title && <div className="title">{title}</div>}
              {description && <div className="desc">{description}</div>}
            </div>
          </a>
        )}
      </div>
    )
  }
}
