import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../Icon'
import Button from '../Button'
import defaultRequest from './request.js'
import getUid from './uid.js'
import { fileToObject, getFileItem, removeFileItem } from './utils.js'
import UploadList from './UploadList'
import './style/upload.scss'

export default class Upload extends Component {
  static propTypes = {
    beforeUpload: PropTypes.func,
    action: PropTypes.any,
    data: PropTypes.object,
    name: PropTypes.string,
    headers: PropTypes.object,
    withCredentials: PropTypes.bool,
    onChange: PropTypes.func,
    onProgress: PropTypes.func,
    onSuccess: PropTypes.func,
    onRemove: PropTypes.func,
    onError: PropTypes.func,
    onTypeError: PropTypes.func,
    onClick: PropTypes.func,
    fileList: PropTypes.array,
    defaultFileList: PropTypes.array,
    uploadText: PropTypes.string,
    maxFiles: PropTypes.number,
    size: PropTypes.string,
    className: PropTypes.string,
    accept: PropTypes.string,
    title: PropTypes.any,
    children: PropTypes.array,
    showProgress: PropTypes.bool,
    multiple: PropTypes.bool,
    previewVisible: PropTypes.bool,
    listType: PropTypes.oneOf(['text', 'picture', 'pictureCard']),
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    size: 'default',
    showProgress: true,
    listType: 'pictureCard',
  }

  constructor(props) {
    super(props)
    this.state = {
      fileList: props.fileList || props.defaultFileList,
      text: '',
    }
    this.reqs = {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let fileList = []
    if ('fileList' in nextProps) {
      fileList = nextProps.fileList
    } else if (!prevState.fileList) {
      fileList = nextProps.defaultFileList
    } else {
      fileList =
        prevState.fileList.length > 0
          ? prevState.fileList
          : nextProps.defaultFileList
    }
    if (!fileList) {
      fileList = []
    }
    return {
      fileList,
    }
  }

  componentWillUnmount() {
    this.abort()
  }

  /**
   * 触发 props 中的 onChange
   * data: {
   *  file,
   *  fileList
   * }
   */
  onFileChange = data => {
    if (!('fileList' in this.props)) {
      this.setState({ fileList: data.fileList })
    }
    // 触发 props 中的 onChange 事件
    const { onChange } = this.props
    onChange && onChange(data)
  }

  /**
   * input change 触发的事件
   * input[type=file] *onChange* -> upload -> request -> onStart -> onFileChange -> setState
   */
  onChange = e => {
    if (!e) return
    this.uploadFiles(e.target.files)
  }

  /**
   * 处理 文件多选的情况
   * @param {*} files
   */
  uploadFiles(files) {
    const postFiles = Array.prototype.slice.call(files)
    postFiles.forEach(file => {
      file.uid = getUid()
      this.upload(file, postFiles)
    })
  }

  /**
   * 请求之前的处理
   * 触发 beforeUpload hook
   * beforeUpload oneOf [boolean, Promise]
   * @param {*} file
   */
  upload(file, fileList) {
    // 上传之前 hook
    if (!this.props.beforeUpload) {
      // 等待 promise 执行完
      return setTimeout(() => {
        this.post(file)
      }, 0)
    }

    const beforeResult = this.props.beforeUpload(file, fileList)
    if (beforeResult.then) {
      beforeResult
        .then(processedFile => {
          const processedFileType = Object.prototype.toString.call(
            processedFile
          )
          if (
            processedFileType === '[object File]' ||
            processedFileType === '[object Blob]'
          ) {
            return this.post(processedFile)
          }
          return this.post(file)
        })
        .catch(error => console.error(error))
    } else if (beforeResult !== false) {
      setTimeout(() => this.post(file), 0)
    }
  }

  post = file => {
    const { props } = this
    new Promise(resolve => {
      const { action } = props
      if (typeof action === 'function') {
        resolve(action(file))
      } else {
        resolve(action)
      }
    }).then(action => {
      const request = props.customRequest || defaultRequest
      const { data, name, headers, withCredentials } = props
      const { uid } = file
      this.reqs[uid] = request({
        action,
        filename: name || file.name,
        file,
        data,
        headers,
        withCredentials,
        onProgress: e => {
          props.showProgress && this.onProgress(e, file)
        },
        onSuccess: (ret, xhr) => {
          this.onSuccess(ret, file, xhr)
        },
        onError: (err, ret) => {
          this.onError(err, ret, file)
        },
      })
      this.onStart(file)
    })
  }

  /**
   * 上传图片请求发出后 触发
   * 1. 给 state.fileList 增加一条
   * @param {*} file
   */
  onStart = file => {
    const currentFile = fileToObject(file)
    currentFile.status = 'uploading'
    const nextFileList = this.state.fileList.concat([])
    if (!getFileItem(file, this.state.fileList)) {
      nextFileList.push(currentFile)
    }
    this.onFileChange({
      file: currentFile,
      fileList: nextFileList,
    })
  }

  onProgress(e, file) {
    const fileList = this.state.fileList
    let targetItem = getFileItem(file, fileList)
    // removed
    if (!targetItem) {
      return
    }
    targetItem.percent = e.percent
    this.onFileChange({
      event: e,
      file: { ...targetItem },
      fileList: this.state.fileList,
    })
    const { onProgress } = this.props
    onProgress && onProgress(e, file)
  }

  onSuccess(response, file, xhr) {
    const { fileList } = this.state
    const currentFile = getFileItem(file, fileList)
    if (!currentFile) {
      return
    }
    currentFile.status = 'done'
    currentFile.response = response
    this.onFileChange({
      file: { ...currentFile },
      fileList,
    })
    this.fileInput.value = ''
    const { onSuccess } = this.props
    onSuccess && onSuccess(response, file, xhr)
  }

  checkFileType(file) {
    const fileName = file.name
    const fileType = file.type // e.g video/mp4
    const { onTypeError, accept } = this.props
    // 如果 accept 未传入，不进行类型校验
    if (!accept) {
      return true
    }
    const acceptFormat = (accept || '').replace(/\s/g, '').toLowerCase()
    const acceptTypes = acceptFormat.split(',')

    if (acceptTypes.length > 0) {
      let fileTypeFound = false
      for (const index in acceptTypes) {
        // Allowing for both [extension, .extension, mime/type, mime/*]
        const extension =
          (acceptTypes[index].match(/^[^.][^/]+$/) ? '.' : '') +
          acceptTypes[index]

        if (
          fileName.substr(-1 * extension.length).toLowerCase() === extension ||
          //If MIME type, check for wildcard or if extension matches the files tiletype
          (extension.indexOf('/') !== -1 &&
            ((extension.indexOf('*') !== -1 &&
              fileType.substr(0, extension.indexOf('*')) ===
                extension.substr(0, extension.indexOf('*'))) ||
              fileType === extension))
        ) {
          fileTypeFound = true
          break
        }
      }
      if (!fileTypeFound) {
        if (onTypeError) {
          onTypeError(file)
        }
        return false
      } else {
        return true
      }
    }
  }

  onError(error, response, file) {
    const { fileList } = this.state
    const targetItem = getFileItem(file, fileList)
    if (!targetItem) return
    targetItem.error = error
    targetItem.response = response
    targetItem.status = 'error'
    this.onFileChange({
      file: { ...targetItem },
      fileList,
    })
    this.fileInput.value = ''
    const { onError } = this.props
    onError && onError(error, response, file)
  }

  abort(file) {
    const { reqs } = this
    if (file) {
      if (file.uid) {
        const uid = file.uid
        reqs[uid] && reqs[uid].abort()
        delete reqs[uid]
      }
    } else {
      Object.keys(reqs).forEach(uid => {
        if (reqs[uid]) {
          reqs[uid].abort()
          delete reqs[uid]
        }
      })
    }
  }

  handleRemove = (file, index, isReupload, fileList = this.state.fileList) => {
    const restFileList = removeFileItem(file, fileList)
    const { onRemove } = this.props
    restFileList &&
      this.onFileChange({
        file,
        fileList: restFileList,
      })
    if (!('fileList' in this.props)) {
      this.setState({
        fileList: restFileList,
      })
    }
    isReupload && this.post(file)
    onRemove && onRemove(file, index)
    this.abort(file)
  }

  handleUploadClick = () => {
    const { onClick } = this.props
    onClick && onClick()
    this.fileInput.click()
  }

  renderList = () => {
    const { size, children, previewVisible, ...rest } = this.props
    const { fileList } = this.state

    const properties = {
      ...rest,
      post: this.post.bind(this),
      onRemove: this.handleRemove,
      size,
      previewVisible,
    }
    let newChildren
    if (children) {
      newChildren = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type.isUploadList) {
          return React.cloneElement(child, { ...properties })
        }
        return child
      })
    } else {
      newChildren = fileList.map((item, index) => {
        return (
          <UploadList key={index} index={index} file={item} {...properties} />
        )
      })
    }
    return <div className="upload-list">{newChildren}</div>
  }

  renderChildren = () => {
    const { fileList } = this.state
    const { uploadText, maxFiles, size, listType } = this.props

    const isMax =
      fileList.length === 0 || (maxFiles ? fileList.length < maxFiles : true)

    const selectCls = classNames('upload-select', {
      [`upload-select-${size}`]: size,
    })

    let uploadButton

    if (listType === 'pictureCard') {
      uploadButton = (
        <React.Fragment>
          {this.renderList()}
          {isMax && (
            <div className={selectCls} onClick={this.handleUploadClick}>
              <span className="upload-select-text">
                <Icon type="plus" /> {uploadText || '上传图片'}
              </span>
            </div>
          )}
        </React.Fragment>
      )
    } else {
      uploadButton = (
        <React.Fragment>
          {isMax && (
            <Button
              size={size}
              onClick={this.handleUploadClick}
              type="default"
              icon="upload">
              {uploadText || '上传文件'}
            </Button>
          )}
          {this.renderList()}
        </React.Fragment>
      )
    }

    return uploadButton
  }

  render() {
    const { className, title, accept, multiple, disabled } = this.props

    const cls = classNames('upload', {
      [className]: !!className,
      'is-disabled': disabled,
    })

    return (
      <div className={cls}>
        {title && <div className="upload-title">{title}</div>}
        <input
          style={{ display: 'none' }}
          type="file"
          ref={node => (this.fileInput = node)}
          onChange={this.onChange}
          accept={accept}
          multiple={multiple}
        />
        {this.renderChildren()}
      </div>
    )
  }
}
