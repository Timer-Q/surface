import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { previewFile, isImageUrl } from './utils.js'
import Progress from '../Progress'
import Icon from '../Icon'

export default class UploadList extends Component {
  static propTypes = {
    file: PropTypes.any,
    onRemove: PropTypes.func,
    onSetMain: PropTypes.func,
    post: PropTypes.func,
    size: PropTypes.string,
    actions: PropTypes.array,
    showProgress: PropTypes.bool,
    previewVisible: PropTypes.bool,
    listType: PropTypes.oneOf(['text', 'picture', 'pictureCard']),
    disabled: PropTypes.bool,
    index: PropTypes.number,
  };
  static defaultProps = {
    size: 'normal',
    disabled: false,
  };

  static isUploadList = true;

  constructor(props) {
    super(props)
    this.isComponentMounted = true
  }

  componentDidMount() {
    this.isComponentMounted = true
  }

  componentDidUpdate() {
    const { file } = this.props
    if (!file) return
    const fileObject = this.formatFile(file)
    if (fileObject.thumbUrl !== undefined) return
    file.thumbUrl = ''
    const fileData = file.originFileObj || file
    if (fileData instanceof Blob || fileData instanceof File) {
      previewFile(fileData, previewDataUrl => {
        if (!this.isComponentMounted) return
        // thumbUrl 的获取实在 forEach 中，render 会在 循环完之后执行，如果不 forceUpdate ，img 的 src 是空的
        file.thumbUrl = previewDataUrl
        this.forceUpdate()
      })
    }
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  formatFile = file => {
    let fileObject = {}
    if (typeof file === 'string') {
      fileObject = {
        thumbUrl: file,
        url: file,
        uid: file,
        status: 'done',
      }
    } else {
      fileObject = file
    }
    return fileObject
  };

  /**
   * 删除
   */
  handleRemove = file => {
    const { onRemove, index } = this.props
    onRemove && onRemove(file, index)
  };

  /**
   * 重新上传
   */
  handleReupload = (file, event) => {
    const { post } = this.props
    event.stopPropagation()
    this.handleRemove(file, event)
    post(file)
  };

  renderProgress = file => {
    const { percent, status } = file
    const { showProgress } = this.props
    const cls = classNames('upload-progress', {
      'upload-progress-loading': !showProgress,
    })
    return status === 'uploading' ? (
      <div className={cls} style={{ transform: `translateY(-${percent}%)` }}>
        {!showProgress && <Icon size="large" spin type="loading" />}
      </div>
    ) : null
  };

  renderError = file => {
    const { status } = file
    if (status !== 'error') return
    return (
      <div className="upload-error" onClick={e => this.handleReupload(file, e)}>
        <span>
          <p className="upload-error-text">icon</p>
          <p className="upload-error-text">上传失败，请重新上传</p>
        </span>
      </div>
    )
  };

  renderButton(file) {
    let { actions } = this.props
    if (!(actions && actions.length)) {
      actions = [
        <Icon
          key="1"
          type="delete"
          onClick={this.handleRemove.bind(this, file)}
        />,
      ]
    }
    return actions.map(action => {
      let { onClick, actionActiveKey } = action.props
      const isActived = !!file[actionActiveKey]
      const cls = classNames('upload-list-actions-item')
      if (onClick) {
        onClick = onClick.bind(null, file, isActived)
      }
      if (React.isValidElement(action)) {
        return React.cloneElement(action, {
          onClick,
          className: cls,
        })
      }
      return action
    })
  }

  renderLoading = () => {
    return <Icon type="loading" />
  };

  renderChildren = () => {
    const { listType, file, size, disabled } = this.props
    if (!file) {
      return <Icon type="loading" />
    }

    const fileObject = this.formatFile(file)

    const isDisable = fileObject.disabled || disabled

    const cls = classNames('upload-list-item', {
      [`upload-list-item-${size}`]: size,
      'is-disabled': isDisable,
    })

    if (listType === 'pictureCard') {
      const fileNode = isImageUrl(fileObject.thumbUrl || fileObject.url) ? (
        <div className={cls} key={fileObject.uid}>
          <img
            src={fileObject.thumbUrl || fileObject.url}
            alt={fileObject.name}
          />
          <div className="upload-list-actions">
            {this.renderButton(fileObject)}
          </div>
          {this.renderProgress(fileObject)}
          {this.renderError(fileObject)}
        </div>
      ) : (
        <div className={cls} key={fileObject.uid}>
          <video controls src={fileObject.thumbUrl} />
          <div className="upload-list-actions">
            {this.renderButton(fileObject)}
          </div>
          {this.renderProgress(fileObject)}
          {this.renderError(fileObject)}
        </div>
      )
      return fileNode
    }

    const { status } = fileObject
    const uploading = status === 'uploading'
    if (fileObject.percent === undefined || fileObject.percent === null) {
      fileObject.percent = 0
    }
    const progress = uploading
      ? parseFloat(fileObject.percent.toFixed(2))
      : 100
    const infoCls = classNames('upload-list-text-item-info', {
      [`upload-${status}`]: status,
    })

    return (
      <div className="upload-list-text-item">
        <span className={infoCls}>
          <span>
            <Icon type="file-text" />
            {fileObject.url ? (
              <a
                className="upload-list-text-item-content"
                href={fileObject.url}
                target="_blank">
                {fileObject.name || fileObject.url}
              </a>
            ) : (
              <span className="upload-list-text-item-content">
                {fileObject.name || fileObject.url}
              </span>
            )}
          </span>
          <span className="action">
            {status === 'error' && (
              <Icon
                type="reload"
                onClick={this.handleReupload.bind(this, fileObject)}
              />
            )}
            <Icon
              type="close"
              onClick={this.handleRemove.bind(this, fileObject)}
            />
          </span>
        </span>
        <div className="upload-list-text-item-progress">
          {uploading && (
            <Progress strokeWidth={2} showInfo={false} percent={progress} />
          )}
        </div>
      </div>
    )
  };

  render() {
    return this.renderChildren()
  }
}
