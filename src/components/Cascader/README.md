## Cascader 级联选择器

当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。

### 基础用法

通过点击的方式触发子菜单的选项

:::demo 只需为 Cascader 的`options`属性指定选项数组即可渲染出一个级联选择器。本例还展示了`onChange`事件，它的参数为 Cascader 的绑定值：一个由各级菜单的值所组成的数组。设置value或者defaultValue的时候请尽量保证数组里面值的正确性，否则组件里面会做处理可能导致显示的值不完整。
```js
constructor(props) {
  super(props);

  this.state = {
    options: [{
      id: '111111222',
      text: '指南',
      children: [{
        id: '1111112221',
        text: 'g',
        children: [{
          id: '1221',
          text: '一致'
        }, {
          id: '12132',
          text: '反馈'
        }, {
          id: '123456',
          text: '效率'
        }, {
          id: '0987',
          text: '可控'
        }]
      }, {
        id: '23344',
        text: '导航',
        children: [{
          id: '24242',
          text: '侧向导航'
        }, {
          id: '2422',
          text: '顶部导航'
        }]
      }]
    },{
      id:222222323,
      text:'gwegwg',
      children:[{
        id:2434,
        text:'gegwe'
      }]
    }],
    cascaderKey:Date.now(),
    selectedOptions: ['111111222','23344']
  }
}

//
dealData(){
  this.setStat4e({cascaderKey:Date.now()})
}
componentDidMount(){
  setTimeout(()=>{
    this.setState({
      options:[{
        id:111,
        text:'gewg',
        children:[{
          id:32,
          text:'gewgss'
        }]
      }]
    })
  },1000)
}
handleChange(key, value) {
  console.log(value)
  this.setState({ [key]: value });
}

render() {
  return (
    <div>
      <div className="block">
        <span className="demonstration">基础用法</span>
        <Cascader
          style={{width:200}}
          options={this.state.options}
          valueName="id"
          searchAble={true}
          labelName="text"
          childrenName="children"
          clearAble={true}
          className="cascader-m-l-10"
          defaultValue={this.state.selectedOptions}
          onChange={this.handleChange.bind(this, 'selectedOptions')} />
      </div>
    </div>
  )
}
```
:::

### 指定valueName、labelName、childrenName

:::demo 在默认的数据源里面显示的是label字段并且以value字段作为唯一值来区分不同的li，但是针对后端返回的数据可能存在用id作为唯一值的你可以指定valueName,labelName,childrenName
```js
constructor(props) {
  super(props);

  this.state = {
    testOption:[{
      id:'value1',
      name:'name1',
      childrens:[{
        id:'value2',
        name:'name2'
      },{
        id:'value3',
        name:'name3',
        childrens:[{
          id:'value4',
          name:'name4'
        }]
      },{
        id:'value5',
        name:'name5'
      }]
    },{
      id:'value6',
      name:'name6'
    },{
      id:'value7',
      name:'name7'
    },{
      id:'value8',
      name:'name8'
    },{
      id:'value9',
      name:'name9'
    },{
      id:'value16',
      name:'name16'
    },{
      id:'value17',
      name:'name17'
    },{
      id:'value18',
      name:'name18'
    },{
      id:'value19',
      name:'name19'
    },{
      id:'value116',
      name:'name116'
    },{
      id:'value117',
      name:'name117'
    },{
      id:'value118',
      name:'name118'
    },{
      id:'value119',
      name:'name119'
    }],
    searchOptions:[],
    defaultSelectedOption: ['value1'],
  }
}

handleChange(key, value) {
  console.log(value)
  this.setState({ [key]: value });
}

render() {
  return (
    <div>
      <div className="block">
        <span className="demonstration">自己知道labelName、valueName</span>
        <Cascader
          style={{width:200}}
          options={this.state.testOption}
          valueName="id"
          labelName="name"
          childrenName="childrens"
          clearAble={true}
          className="cascader-m-l-10"
          onChange={this.handleChange.bind(this, 'selectedOptions')} />
      </div>
    </div>
  )
}
```
:::


### 开启搜索的模式

:::demo 默认的级联组件是不支持搜索的，如果需要请将clearAble设置为true
```js
constructor(props) {
  super(props);

  this.state = {
    testOption:[{
      id:'value1 / value11',
      name:'签证 / 测试',
      childrens:[{
        id:'value2/value22',
        name:'签证/测试1'
      },{
        id:'value3 / value33',
        name:'签证 / name33',
        childrens:[{
          id:'value4/value44',
          name:'name4 / name44'
        }]
      },{
        id:'value5',
        name:'name5/name55'
      }]
    }],
    defaultSelectedOption: ['value1/value11'],
    searchOptions:[{
        id:'1',
        name:'test1'
      },{
        id:'2',
        name:'test2'
      },{
        id:'3',
        name:'test3'
      },{
        id:'4',
        name:'test4'
      },{
        id:'5',
        name:'test5'
      },{
        id:'6',
        name:'test6'
      },{
        id:'7',
        name:'test7'
      },{
        id:'8',
        name:'test8'
      },{
        id:'9',
        name:'test9'
      },{
        id:'10',
        name:'test10'
      },{
        id:'11',
        name:'test11'
      },{
        id:'12',
        name:'test12'
      }]
  }
  this.count = 0
}

handleChange(key, value) {
  this.setState({ value: value });
}
onSearch(value){
  let _this = this;
  let promsie = new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve()
    },100)
  })
  promsie.then(()=>{
    if(this.count % 2 === 1){
      _this.setState({searchOptions:[]})
      this.count += 1
    }else{
      _this.setState({searchOptions:[{
        id:'1',
        name:'test1'
      },{
        id:'2',
        name:'test2'
      },{
        id:'3',
        name:'test3'
      },{
        id:'4',
        name:'test4'
      },{
        id:'5',
        name:'test5'
      },{
        id:'6',
        name:'test6'
      },{
        id:'7',
        name:'test7'
      },{
        id:'8',
        name:'test8'
      },{
        id:'9',
        name:'test9'
      },{
        id:'10',
        name:'test10'
      },{
        id:'11',
        name:'test112'
      },{
        id:'12',
        name:'test12'
      }]})
      this.count += 1
    }
  })
}
render() {
  return (
    <div>
      <div className="block">
        <span className="demonstration">搜索模式</span>
        <Cascader
          style={{width:200}}
          options={this.state.testOption}
          valueName="id"
          labelName="name"
          childrenName="childrens"
          clearAble={true}
          value={this.state.value || ['2']}
          searchAble={true}
          size="large"
          placeholder="默认的placeholder"
          className="cascader-m-l-10"
          changeHide={false}
          hideScrollBar={true}
          onSearch={this.onSearch.bind(this)}
          searchOptions = {this.state.searchOptions || []}
          searchLabelName="name"
          searchValueName="id"
          onChange={this.handleChange.bind(this, 'selectedOptions')} />
      </div>
    </div>
  )
}
```
:::

### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| options | 可选项数据源 | array | — | — |
| defaultValue | 指定选中项属性值一般选用对象的标识值   | string [] | — | — |
| value | 指定选中的值   | string [] | — | — |
| placeholder | 输入框占位文本 | string | — | 请选择 |
| disabled | 是否禁用 | boolean | — | false |
| clearAble | 是否支持清空选项 | boolean | — | false |
| searchAble | 是否支持搜索显示值 | boolean | — | false |
| notFoundContent | 下拉列表为空的时候显示值 | boolean | — | '暂无数据' |
| className | 自定义类名 | string | — | — |
| valueName    | 指定选项的键值为选项对象的某个属性值,一般指定唯一值 | string | — |'value' |
| labelName    | 指定选项的显示值为选项对象的某个属性值 | string | — |'label' |
| childrenName | 指定选项的子选项为选项对象的某个属性值 | string | — | 'children' |
| listenEveryChange | 一般来说只要点击最后一级的时候才会触发onChange事件，如果需要每次点击都触发onChange则需要把这个值设置为true | string | — | false |
| changeHide | 默认情况下只有点击最后一级叶子元素的时候弹层才会关闭，当此值设置为true的时候会在每次点击的时候就会关闭Popover | string | — | false |
| showClear | 默认情况下输入框里面如果有内容的话，需要hover到输入框上面才会显示删除的图标，如果指定这个参数为true那么删除的图标会一直显示 | string | — | false |
| onSearch | 级联选择搜索时候的回调 | string | — | (value) => void; |
| searchOptions | 级联选择搜索时候的数据源(注意一旦在使用此值组件便不会在本地数据里面筛选) | string [](对象数组) | — | [] |
| searchLabelName    | 需要指定显示值为选项对象的某个属性值 | string | — |'label' |
| searchValueName    | 指定选项的键值为选项对象的某个属性值,一般指定唯一值 | string | — |'value' |
| size         | input 大小           | string             | default / [small, default, large] |
| hideScrollBar    | 下拉列表超出的时候是否需要隐藏滚动条 | string | — | false |
| forbidScroll    | 展示所有的数据,不显示滚动条 | string | — | false |





### Events
| 事件名称      | 说明    | 类型      |
|---------- |-------- |---------- |
| onChange | 选择完成后触发(叶子节点) | (value) => void|

