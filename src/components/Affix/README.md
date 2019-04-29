## Affix 固钉

将页面元素钉在可视范围。

### 用法一
#### 滚动到指定偏移量后固定位置，还原位置
:::demo 当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。

```js


constructor(props) {
  super(props)
  this.state = {
    fixed: false
  }
  this.offsetBottom = 10
  this.offsetTop = 10
}

render() {
  return (
    <div className="intro-block">
      <div className="block" style={{height: '40px'}}>
        <Affix
          offsetTop={this.offsetTop}
          isAlways={this.isAlways}>
          <Button>还原位置</Button>
        </Affix>
      </div>
    </div>
  )
}
```
:::


### 用法二
#### 滚动到指定偏移量后固定位置，不还原位置
:::demo 当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。

```js


constructor(props) {
  super(props)
  this.state = {
  }
  this.offsetBottom = 10
  this.offsetTop = 60
  this.isAlways = true
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <Affix offsetTop={this.offsetTop} isAlways={this.isAlways}>
          <Button>不还原位置</Button>
        </Affix>
      </div>
    </div>
  )
}
```
:::

### 用法三
#### 直接固定在某一个指定位置
:::demo 当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。

```js


constructor(props) {
  super(props)
  this.state = {
  }
  this.offsetBottom = 10
  this.offsetTop = 160
  this.right = 10
  this.isImmediate = true
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <Affix offsetTop={this.offsetTop} isImmediate={this.isImmediate} right={this.right}>
          <Button>直接固定在某一个指定位置</Button>
        </Affix>
      </div>
    </div>
  )
}
```
:::


### 用法四
#### 固定在某个容器(container)内
:::demo 将元素固定在某个容器内

```js

constructor(props) {
  super(props)
  this.state = {
  }
  this.offsetBottom = 0
  this.offsetTop = 0
  this.isContainer = true
  this.right = 0
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <div className="scroll-container" style={{position: 'relative', height: '100px', backgroundColor: '#0096ff', color: '#fff'}}>
          <div className="container-inner">
            容器container
            <Affix
              offsetTop={this.offsetTop}
              isContainer={this.isContainer}
              right={this.right}>
              <Button type="danger">固定在某个容器内</Button>
            </Affix>
          </div>
        </div>
      </div>
    </div>
  )
}
```
:::

### Affix

| 参数       | 说明               | 类型            | 可选值 | 默认值     |
| ---------- | ------------------ | --------------- | ------ | ---------- |
| offsetBottom| 距离窗口底部达到指定偏移量后触发 | number | 必选    | -         |
| offsetTop  | 距离窗口顶部达到指定偏移量后触发  | number | 必选    |           |
| right  | 距离窗口右侧偏移量  | number | 可选 | 10px   |
| isAlways  | 永远固定位置，不还原  | boolean | 可选    |    false            |
| isImmediate  | 直接固定在某个位置  | boolean | 可选   |    false            |
| isContainer  | 固定在某个容器内  | boolean | 可选     |    false           |

