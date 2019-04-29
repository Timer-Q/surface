## Breadcrumb 面包屑组件

面包屑组件

### 基本用法

:::demo 面包屑组件,主要用于网站的路径导航。

```js


constructor(props) {
  super(props)
  this.state = {
  }
  this.routeContent = [
    {
      name: '主页',
      url: 'www.mafengwo.com'
    },
    {
      name: '旅行商城',
      url: 'www.mafengwo.com'
    },
    {
      name: '订单详情页',
      url: 'www.mafengwo.com'
    }
  ]
}

handleClick(data, index) {
    console.log('我被点击了:', data, '路径层级:', index)
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <Breadcrumb
            routeContent={this.routeContent}
            onClick={this.handleClick}/>
      </div>
    </div>
  )
}
```

:::

### Breadcrumb

| 参数       | 说明               | 类型            | 可选值 | 默认值     |
| ---------- | ------------------ | --------------- | ------ | ---------- |
| routeContent| 路径数据           | array           | 必选    | -          |
| routeContent.name| 底部描述文案   | string          | 必选    |            |
| routeContent.url| 单个路径的跳转url| string          | 必选    |            |
| onClick|点击回调函数，控制台可以看到具体返回数据|function|  -      |           |