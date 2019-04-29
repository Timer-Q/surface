## Steps 步骤条

步骤条组件

### 基本用法

:::demo 步骤条组件,主要用于进程/进度展现。

```js


constructor(props) {
  super(props)
  this.state = {
  }
  this.stepsContent = [
    {
      title: '1',
      name: '填写内容'
    },
    {
      title: '2',
      name: '申请资格',
      link: 'http://www.mafengwo.cn',
    },
    {
      title: '3',
      name: '注册成功'
    }
  ]
  this.isArrow = true;
  this.current = 2;
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <Steps
            stepsContent={this.stepsContent}
            isArrow={this.isArrow}
            current={this.current}/>
      </div>
    </div>
  )
}
```

:::

### 垂直展现样式


:::demo 步骤条组件,垂直样式。

```js


constructor(props) {
  super(props)
  this.state = {
  }
  this.stepsContent = [
    {
      title: '2018-09-13 15:31:30',
      name: '已提交,上午通过后台系统已提交订单数据'
    },
    {
      title: '2018-09-13 15:35:26',
      name: '已联系'
    },
    {
      title: '2018-09-13 16:12:08',
      name: '待提供方案'
    },
    {
      title: '2018-09-13 16:56:22',
      name: '待确认方案'
    },
    {
      title: '2018-09-14 09:01:09',
      name: '待提供合同'
    },
    {
      title: '2018-09-14 14:47:38',
      name: '待签署合同'
    },
    {
      title: '2018-09-16 18:01:38',
      name: '待出行'
    },
    {
      title: '2018-09-18 10:47:59',
      name: '待确认服务完成',
      isHtml: true,
      color: '#ffe24c',
    },
    {
      title: '2018-09-20 17:29:16',
      name: '服务已完成',
      isDone: true,
    }
  ]
  this.mode = 2;
  this.isArrow = true;
  this.current = 4;
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <Steps
          stepsContent={this.stepsContent}
          isArrow={this.isArrow}
          mode={this.mode}
          current={this.current}>
          <div>自定义内容<span style={{color: '#1890ff'}}>个性标题</span></div>
        </Steps>
      </div>
    </div>
  )
}
```

:::

### Steps

| 参数       | 说明               | 类型            | 可选值 | 默认值     |
| ---------- | ------------------ | --------------- | ------ | ---------- |
| stepsContent| 步骤条数据          | array          | 必选    | -          |
| stepsContent.name       | 底部描述文案         | string          | 必选    |            |
| stepsContent.title      | 文案                | string        | 必选    | mode为1时，是圆圈内的文案，mode为2时，是右侧的灰色描述文案|
| stepsContent.isHtml    | 是否是自定义内容，仅支持一个自定义HTML       | boolean         | 可选    | false      |
| stepsContent.isDone    | 单个进度是否完成       | boolean         | 可选    | false      |
| stepsContent.color    | 自定义颜色       | string         | 可选    | #1890ff      |
| stepsContent.link    | 是否是链接      | string         | 可选    | ''(传递url即可)      |
| mode       | 展现形式            | number          | 可选   | 1 (1为默认样式，2为垂直样式)|
| current    | 当前所在节点         | number          | 可选    | 1(第一个步骤)  |
| isArrow    | 是否带有箭头         | boolean         | 可选    | false      |
| onClick    | 点击回调函数         | function        | TODO   |            |