## Pagination 分页

当数据量过多时，使用分页分解数据。

### 基础用法

:::demo 

```js
constructor(props) {
  super(props)
  this.state = {
    total: 700
  }
}

changeTotal() {
  console.log(this.state.total)
  this.setState({
    total: 7
  })
}

render() {
  return (
    <div className="first">
      <Button onClick={this.changeTotal.bind(this)}>change Total</Button>
      <div className="block">
        <p className="demonstration">7页及更少时的效果</p>
        <Pagination current={5} total={this.state.total}/>
      </div>
      <div className="block">
        <p className="demonstration"> 8 页时的效果</p>
        <Pagination total={80}/>
      </div>
      <div className="block">
        <p className="demonstration">很多很多时的效果</p>
        <Pagination total={1000}/>
      </div>
    </div>
  )
}
```

:::

### 基础用法

:::demo 

```js
render() {
  return (
    <div className="block">
      <p className="demonstration">很多很多时的效果</p>
      <Pagination showSizeChanger showQuickJumper showTotal total={1000}/>
      <p className="demonstration">small</p>
      <Pagination size="small" showSizeChanger showQuickJumper showTotal total={1000}/>
    </div>
  )
}
```

:::

### Attributes

| 参数            | 说明                         | 类型     | 可选值                                                    | 默认值                                 |
| --------------- | ---------------------------- | -------- | --------------------------------------------------------- | -------------------------------------- |
| small（预留）   | 是否使用小型分页样式         | Boolean  | —                                                         | false                                  |
| pageSize        | 每页显示条目个数             | Number   | —                                                         | 10                                     |
| total           | 总条目数                     | Number   | —                                                         | -                                      |
| current         | 当前页数                     | Number   | —                                                         | 1                                      |
| layout（预留）  | 组件布局，子组件名用逗号分隔 | String   | `sizes`, `prev`, `pager`, `next`, `jumper`, `->`, `total` | 'prev, pager, next, jumper, ->, total' |
| pageSizeOptions | 每页显示个数选择器的选项设置 | String[] | —                                                         | [10, 20, 30, 40]                       |

### Events

| 事件名称     | 说明                  | 回调参数        |
| ------------ | --------------------- | --------------- |
| onSizeChange | pageSize 改变时会触发 | 每页条数`size`  |
| onChange     | current 改变时会触发  | 当前页`current` |
