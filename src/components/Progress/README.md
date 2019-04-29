## Progress 进度条

用于展示操作进度，告知用户当前状态和预期。

### 线形进度条 — 百分比外显

:::demo Progress 组件设置`percent`属性即可，表示进度条对应的百分比，**必填**，必须在 0-100。 `strokeWidth` 设置高度。

```js
constructor(props) {
  super(props)
  this.state = {
    percent: 0
  }
}
handleChangePercent(oprt) {
  let { percent } = this.state
  percent += oprt * 10
  if (percent > 100 || percent < 0) {
    return null
  }
  this.setState({
    percent
  })
}
render() {
  const { percent } = this.state
  return (
    <React.Fragment>
      <Grid.Row>
        <Grid.Col>
          <Button.Group>
            <Button onClick={this.handleChangePercent.bind(this, -1)}>-</Button>
            <Button onClick={this.handleChangePercent.bind(this, 1)}>+</Button>
          </Button.Group>
        </Grid.Col>
      </Grid.Row>
      <div>
        <Progress percent={percent} />
        <Progress strokeWidth={2} percent={70} />
        <Progress percent={50} status="exception" />
        <Progress strokeWidth={4} percent={100} status="success" />
        <Progress strokeWidth={8} percent={100} status="warning" />
        <Progress strokeWidth={18} percent={100} status="active" />
      </div>
    </React.Fragment>
  )
}
```

:::

### 环形进度条

:::demo Progress 组件可通过 `type` 属性来指定使用环形进度条，在环形进度条中，还可以通过 `width` 属性来设置其大小。

```js
constructor(props) {
  super(props)
  this.state = {
    percent: 0
  }
}
handleChangePercent(oprt) {
  let { percent } = this.state
  percent += oprt * 10
  if (percent > 100 || percent < 0) {
    return null
  }
  this.setState({
    percent
  })
}
render() {
  const { percent } = this.state

  return (
    <React.Fragment>
    <Grid.Row>
      <Grid.Col>
        <Button.Group>
          <Button onClick={this.handleChangePercent.bind(this, -1)}>-</Button>
          <Button onClick={this.handleChangePercent.bind(this, 1)}>+</Button>
        </Button.Group>
      </Grid.Col>
    </Grid.Row>
    <div>
      <Progress style={{marginRight: '10px'}} type="circle" percent={percent} />
      <Progress style={{marginRight: '10px'}} type="circle" percent={25} />
      <Progress style={{marginRight: '10px'}} type="circle" percent={100} status="warning" />
      <Progress style={{marginRight: '10px'}} type="circle" percent={100} status="success" />
      <Progress type="circle" percent={50} status="exception" strokeWidth={8} />
    </div>
    </React.Fragment>
  )
}
```

:::

### 多段进度

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    percent: 0
  }
}
render() {
  const { percent } = this.state

  return (
    <div>
      <Progress successPercent={30} percent={70} />
      <Progress successPercent={30} percent={70} />
      <Progress successPercent={30} percent={100} status="warning" />
      <Progress successPercent={30} percent={100} status="success" />
      <Progress successPercent={30} percent={50} status="exception" strokeWidth={8} />
    </div>
  )
}
```

:::

### Attributes

| 参数           | 说明                                                  | 类型    | 可选值            | 默认值 |
| -------------- | ----------------------------------------------------- | ------- | ----------------- | ------ |
| **percent**    | **百分比（必填）**                                    | number  | 0-100             | 0      |
| type           | 进度条类型                                            | string  | line/circle       | line   |
| strokeWidth    | 进度条的宽度，单位 px                                 | number  | —                 | 6      |
| textInside     | 进度条显示文字内置在进度条内（只在 type=line 时可用） | Boolean | —                 | false  |
| status         | 进度条当前状态                                        | string  | success/exception | —      |
| width          | 环形进度条画布宽度（只在 type=circle 时可用）         | number  | -                 | 126    |
| showInfo       | 是否显示进度条文字内容                                | boolean | —                 | true   |
| successPercent | 第二段进度                                            | number  | 0-100             | -      |
