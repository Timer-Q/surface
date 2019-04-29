## Spin 加载

用于页面和区块的加载中状态。


### 一个简单的 loading 状态。
::: demo 一个简单的 loading 状态。
```js
render() {
  return (
    <Spin />
  )
}
```
:::

### 各种大小
::: demo
```js
render() {
  return (
    <div>
        <Spin spinning={false} size="small" />
        <Spin />
        <Spin size="large" />
    </div>
  )
}
```
:::


### 自定义icon
::: demo
```js
render() {
  const mfwIcon = <Icon style={{ fontSize: '18px' }} type='reload' />
  return (
    <div>
        <Spin indicator={mfwIcon} />
    </div>
  )
}
```
:::

### 切换加载
::: demo
```js
constructor(props) {
    super(props);
    this.state = {
        loading: true,
    }
}

render() {
    const toggleLoading = (flag) => {
        this.setState({ loading: flag });
    }
    const { loading } = this.state;
    return (
    <div>
        <Spin spinning={loading} delay={1000} tip='loading...'>
            <div style={{ border: '1px solid black', height: 100, }}>演示的背景</div>
        </Spin>

        <Switch checked={loading} onChange={toggleLoading}/>
    </div>
  )
}
```
:::

### Spin Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| delay | 延迟加载时间 | number | — | — |
| indicator | 自定义加载图片 | reactElement | — | — |
| size | 尺寸 | string | 'small'/'default'/'large' | 'default' |
| spinning | 是否是加载状态 | boolean | true/false | true |
| tip | 当元素被包裹时，自定义加载文案 | string | — | — |
| wrapperClassName | 包装器的类名 | string | — | — |

