## Switch 开关

开关选择器。

### 基础用法

:::demo 最基本的用法

```js
render() {
  return (
    <div>
      <Switch defaultChecked></Switch>
    </div>
  )
}
```

:::

### 禁用状态

:::demo 设置`disabled`属性来定义一个，接受一个`Boolean`，设置为`true`即可。

```js
constructor(props) {
  super(props)
  this.state = { checked: false }
  setTimeout(()=>{
    this.setState({checked: true})
  },1000)
  setTimeout(()=>{
    this.setState({checked: false})
  },2000)
}
render() {

  return (
    <div>
      <Switch checked disabled></Switch>
      &nbsp;&nbsp;
      <Switch disabled></Switch>
      &nbsp;&nbsp;
      <Switch checked={this.state.checked} disabled></Switch>
    </div>
  )
}
```

:::

### 有子元素的状态

:::demo 设置`checkedChildren`属性来定义`checked`时候显示的子元素，接受一个`any`，设置`unCheckedChildren`属性来定义`unchecked`时候显示的子元素，接受一个`any`。

```js

render() {
  return (
    <div>
      <Switch defaultChecked checkedChildren="开" unCheckedChildren="关"  onClick={ function(e){
        console.log(e);
    }} ></Switch>
    </div>
  )
}
```

:::

### size

:::demo 设置`checkedChildren`属性来定义`checked`时候显示的子元素，接受一个`any`，设置`unCheckedChildren`属性来定义`unchecked`时候显示的子元素，接受一个`any`。

```js

render() {
  return (
    <div>
      <Switch
        defaultChecked
        checkedChildren="开"
        unCheckedChildren="关"
        size="large"
        onClick={ function(e){console.log(e);}}>
      </Switch>
      &nbsp;
      <Switch
        defaultChecked
        checkedChildren="开"
        unCheckedChildren="关"
        size="default"
        onClick={ function(e){console.log(e);}}>
      </Switch>
      &nbsp;
      <Switch
        defaultChecked
        size="small"
        onClick={ function(e){console.log(e);}}>
      </Switch>
    </div>
  )
}
```

:::

### Attributes

| 参数              | 说明               | 类型    | 可选值                      | 默认值    |
| ----------------- | ------------------ | ------- | --------------------------- | --------- |
| size              | 尺寸               | string  | 'small', 'default', 'large' | 'default' |
| disabled          | 是否禁用           | boolean | —                           | false     |
| disabled          | 是否禁用           | boolean | —                           | false     |
| checked           | 是否选中(受控状态) | boolean | —                           | false     |
| defaultChecked    | 是否默认选中       | boolean | —                           | false     |
| checkedChildren   | 选中时显示的元素   | any     | —                           | -         |
| unCheckedChildren | 未选中时显示的元素 | any     | —                           | -         |
| className         | 附加的 class 名    | string  | —                           | -         |
| onChange          | 状态改变时候的回调 | func    | —                           | -         |
| onMouseUp         | mouseup 的事件     | func    | —                           | -         |
| onClick           | click 的事件       | func    | —                           | -         |
