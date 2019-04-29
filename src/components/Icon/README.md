## Icon 图标

提供了一套常用的图标集合。

### 使用方法

icon 默认为 iconfont 的使用方式

:::demo 可以通过改变 color 用来改变 icon 的颜色

```js
render() {
  return (
    <div>
        <p>单独使用，可以通过改变 color 用来改变 icon 的颜色, 暂不支持双色 icon </p>
        <Icon style={{color: "#999"}} type="edit" />
        <Icon style={{color: "#d60016", marginLeft: "10px"}} type="edit" />
        <p>与 button 结合使用</p>
        <Button type="primary" icon="search">搜索</Button>
    </div>
  )
}
```

:::

### 图标集合

:::demo

```js
constructor(props) {
    super(props)
    this.iconsArr = [
        "link",
        "suit",
        "check-circle-o",
        "calendar-o",
        "calendar",
        "delete",
        "file-text",
        "hotel",
        "minus-circle-o",
        "minus-circle",
        "plus-circle-o",
        "plus-circle",
        "environment",
        "environment-o",
        "file-text-o",
        "logo",
        "theme",
        "loading",
        "utensils",
        "light-bulb",
        "flag",
        "logo-basic",
        "star-active",
        "star",
        "bulb",
        "new",
        "like",
        "dislike",
        "bottom-left-angle",
        "lock",
        "close",
        "double-left",
        "double-right",
        "arrow-down",
        "arrow-up",
        "caret-down",
        "caret-left",
        "caret-up",
        "caret-right",
        "plus",
        "minus",
        "qrcode",
        "upload",
        "clock-circle-o",
        "sort",
        "search",
        "up",
        "down",
        "left",
        "right",
        "reload",
        "calendar",
        "exclamation-circle-o",
        "exclamation-circle",
        "left-circle-o",
        "right-circle-o",
        "left-circle",
        "right-circle",
        "question-circle-o",
        "question-circle",
        "close-circle",
        "close-circle-o",
        "check-circle-o",
        "check-circle",
        "info-circle",
        "info-circle-o",
        "clock-circle",
        "edit",
        "custom",
        "home",
        "data",
        "Openplatform",
        "Recent",
        "Operation",
        "product",
        "sell",
        "store",
        "service",
        "study",
        "trade"
    ]
    this.grid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        textAlign: 'center',
        alignItems: 'center'
    }
}

render() {
  return (
    <div style={this.grid}>
        {this.iconsArr.map((icon, index) => {
            return (
                <div style={{ padding: '20px 15px' }} key={index}>
                    <Icon style={{ fontSize: '18px' }} type={icon} />
                    <div>{`${icon}`}</div>
                </div>
            )
        })}
    </div>
  )
}
```

:::
