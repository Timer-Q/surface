## Upload 上传

通过点击上传文件

文件上传

::: demo 点击上传图片，进行图片上传，uid 不可重复

```js
constructor(props) {
    super(props)
    this.state = {
        fileList: [
                "https://dev-q.mafengwo.net/s/M00/2A/16/rBIIHltrqgiAIWpPAAB31Qs4Mew29.jpeg",
                "https://dev-q.mafengwo.net/s/M00/0C/D1/rBIIH1sZIpCAbtUOABPZkhqnYDE646.png",
                "https://dev-q.mafengwo.net/s/M00/0D/A2/rBIIH1s8aW6AT7lNAABl9Vw7C9M73.jpeg",
                "https://dev-q.mafengwo.net/s/M00/26/D1/rBIIHls8aX6AR6QjAABmvaPNwTk07.jpeg"
            ]
    }
}

handleBeforeUpload (file) {
    console.log(file)
    return true
}

handleFileChange(fileData) {
    console.log(fileData, 'fileData')
    const { fileList } = fileData
    this.setState({ fileList })
}

handleRemove(file, index) {
    console.log(file, index)
    const { fileList } = this.state
    const newFileList = fileList.filter(item => item !== file.uid)
    this.setState({
        fileList: newFileList
    })
}

handleSuccess(file) {
    console.log(file)
}

render() {
    const { fileList } = this.state
    return (
        <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            beforeUpload={this.handleBeforeUpload.bind(this)}
            // onProgress={(e, file) => console.log(e, file, "onProgress")}
            defaultFileList={fileList}
            // onChange={this.handleFileChange.bind(this)}
            onSuccess={this.handleSuccess.bind(this)}
            maxFiles={5}
            listType="text"
            onRemove={this.handleRemove.bind(this)}>
        </Upload>
    )
}

handlePreview(file) {
  console.log('preview');
}
```

:::

### 图片上传

::: demo 点击上传图片，进行图片上传，uid 不可重复

```js
constructor(props) {
    super(props)
    this.state = {
        fileList: [
            {
                uid: -1,
                name: "xxx.png",
                status: "done",
                url:
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                thumbUrl:
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                image_top: true,
            },
            {
                uid: -2,
                name: "yyy.png",
                status: "done",
                url:
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                thumbUrl:
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            },
        ]
    }
}

handleBeforeUpload (file) {
    console.log(file)
    return true
}

handleFileChange(fileData) {
    console.log(fileData)
    const { fileList } = fileData
    this.setState({ fileList })
}

handleRemove(file) {
    console.log(file)
}

render() {
    const { fileList } = this.state
    return (
        <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            beforeUpload={this.handleBeforeUpload.bind(this)}
            // onProgress={(e, file) => console.log(e, file, "onProgress")}
            // fileList={fileList}
            onChange={this.handleFileChange.bind(this)}
            maxFiles={5}
            onRemove={this.handleRemove.bind(this)}>
        </Upload>
    )
}

handlePreview(file) {
  console.log('preview');
}
```

:::

### 添加编辑按钮

::: demo 可以手动渲染 uploadlist，此时可以自定义 card 样式。

```js
constructor(props) {
    super(props)
    this.state = {
        sourceFileList: [
            {
                uid: -1,
                name: "xxx.png",
                status: "done",
                url:
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                thumbUrl:
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                image_top: true,
            },
            {
                uid: -2,
                name: "yyy.png",
                status: "done",
                url:
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                thumbUrl:
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            }
        ],
        fileList: []
    }
}

handleFileChange(fileData) {
    console.log('fileData: ', fileData)
    const { fileList } = fileData
    this.setState({ fileList })
}

handleRemove(index) {
    console.log(index)
    const { fileList } = this.state
    fileList.splice(index, 1)
    this.setState({
        fileList
    })
}

handleSuccess(a, b, c) {
    console.log('a, b: ', a, b, c);
}

render() {
    const { fileList, sourceFileList } = this.state
    return (
        <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            // onProgress={(e, file) => console.log(e, file, "onProgress")}
            // fileList={fileList}
            onChange={this.handleFileChange.bind(this)}
            onSuccess={this.handleSuccess.bind(this)}
            maxFiles={5}
            multiple>
            {sourceFileList.map((file, index) => {
              return (
                <Upload.List
                  key={file.uid}
                  file={file}
                  actions={[
                    <Icon key="1" type="delete" onClick={this.handleRemove.bind(this, index)}/>,
                    <Icon key="2">
                      设为封面
                    </Icon>
                  ]}
                />
              )
            })}
            {fileList.map((file, index) => {
              return (
                <Upload.List
                  key={file.uid}
                  file={file}
                  actions={[
                    <Icon key="1" type="delete" onClick={this.handleRemove.bind(this, index)}/>,
                    <Icon key="2">
                      设为封面
                    </Icon>
                  ]}
                />
              )
            })}
        </Upload>
    )
}
```

:::

### Upload Attribute

| 参数            | 说明                                                                                                                                                                    | 类型                               | 可选值            | 默认值      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------- | ----------- |
| action          | 必选参数, 上传的地址                                                                                                                                                    | string                             | —                 | —           |
| multiple        | 可选参数, 是否支持多选文件                                                                                                                                              | boolean                            | —                 | —           |
| accept          | 可选参数, 接受上传的（thumbnailMode 模式下此参数无效）                                                                                                                  | string                             | —                 | —           |
| onRemove        | 可选参数, 文件列表移除文件时的钩子                                                                                                                                      | function(file, fileList)           | —                 | —           |
| onSuccess       | 可选参数, 文件上传成功时的钩子                                                                                                                                          | function(response, file, fileList) | —                 | —           |
| onError         | 可选参数, 文件上传失败时的钩子                                                                                                                                          | function(err, file, fileList)      | —                 | —           |
| onProgress      | 可选参数, 文件上传时的钩子                                                                                                                                              | function(event, file, fileList)    | —                 | —           |
| onChange        | 可选参数, 文件状态改变时的钩子，上传成功或者失败时都会被调用                                                                                                            | function(file, fileList)           | —                 | —           |
| beforeUpload    | 可选参数, 上传文件之前的钩子，参数为上传的文件，若返回 false, 支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传。注意：IE9 不支持该方法。 | function(file)                     | —                 | —           |
| fileList        | 上传的文件列表                                                                                                                                                          | array                              | —                 | []          |
| listType        | 可选参数，显示的样式                                                                                                                                                    | string                             | text/ pictureCard | pictureCard |
| withCredentials | 上传是否携带 cookie                                                                                                                                                     | boolean                            | -                 | -           |
| disabled        | 是否禁用上传组件，若为 true，不可上传、不可删除；fileList 中也可传入 disabled 属性，可以覆盖全局设置的 disabled                                                         | boolean                            | -                 | false       |

##

[文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)

TODO:

1. headers 设置上传的请求头
2. data 上传所需参数 或返回上传的参数
3. disabled 是否禁用
4. onPreview 预览

## upload 流程

<pre>
onChange(input[type=file]) => upload => beforeUpload => post => request => onStart => setState/update props => UploadList
                                                                        => onProgress => onSuccess/onError 
                                                                        (上传过程中的 hook 都会 setState/update props)
                                                                        onProgress (status: uploading, percent)
                                                                        onSuccess (status: done)
                                                                        onError (status: error, error: error)
</pre>

> onStart 的时候已经将 File 对象上传了，这个时候将 File 对象转换成易操作的对象(fileToObject)，（onStart 之前转换也行，不过这样更合理）  
> upload 之前，获取一个 uid 给 File 对象，可以方便后面 remove abort 等操作。
