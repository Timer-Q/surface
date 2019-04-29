## Form 表单

由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据

### 基础款表单

包括各种表单项，比如输入框、选择器、开关、单选框、多选框等。

::: demo 在 Form 组件中，每一个表单域由一个 Form-Item 组件构成，表单域中可以放置各种类型的表单控件，包括 Input、Select、Checkbox、Radio、Switch、DatePicker、TimePicker

```js
constructor(props) {
  super(props)
  this.state = {
    form: {
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: '',
      type: [],
      resource: '',
      desc: ''
    },
    layout: 'vertical',
    size: 'default'
  }
}

onChange(type, value) {
  const { form } = this.state
  this.setState({
    form: Object.assign({}, form, {[type]: value})
  }, () => {
    console.log(this.state.form)
  })
}

render() {
  return (
    <Form
      layout={this.state.layout}
      labelPosition="right"
      size={this.state.size}
      model={this.state.form}
      labelWidth={100}
      wrapperWidth={200}>
      <div style={{marginBottom: '10px'}}>
        <Radio.Group
          size="small"
          value={this.state.layout}
          onChange={(value) => this.setState({layout: value})}>
          <Radio.Button value="vertical" >vertical</Radio.Button>
          <Radio.Button value="horizontal" >horizontal</Radio.Button>
        </Radio.Group>
        <Radio.Group
          size="small"
          value={this.state.size}
          onChange={(value) => this.setState({size: value})}>
          <Radio.Button value="large" >large</Radio.Button>
          <Radio.Button value="default" >default</Radio.Button>
          <Radio.Button value="small" >small</Radio.Button>
        </Radio.Group>
      </div>
      <Form.Item label="活动名称">
        <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
      </Form.Item>
      <Form.Item label="活动区域">
        <Select value={this.state.form.region} onChange={this.onChange.bind(this, 'region')} placeholder="请选择活动区域">
          <Select.Option value="shanghai">区域一</Select.Option>
          <Select.Option value="beijing">区域二</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="活动时间" prop="date1">
        <DatePicker
          value={this.state.form.date1}
          placeholder="选择日期"
          onChange={this.onChange.bind(this, 'date1')}
        />
      </Form.Item>
      <Form.Item label="活动形式">
        <Input.Textarea type="textarea" value={this.state.form.desc} onChange={this.onChange.bind(this, 'desc')}></Input.Textarea>
      </Form.Item>
      <p>
        <Button type="primary" htmlType="submit">立即创建</Button>
        <Button type='default'>取消</Button>
      </p>
    </Form>
  )
}
```

:::

### 行内表单

当垂直方向空间受限且表单较简单时，可以在一行内放置表单。

::: demo Form 组件的 `layout` 属性可以控制表单的类型，当设为 `horizontal` 时可以让表单域变为行内的表单域

```js
// state
constructor(props) {
  super(props)
  this.state = {
    form: {
      name: '',
      password: '',
    }
  }
}

onChange(type, value) {
  const { form } = this.state
  this.setState({
    form: Object.assign({}, form, {[type]: value})
  }, () => {
    console.log(this.state.form)
  })
}

render() {
  const { name, password, disabled } = this.state.form
  return (
    <Form layout="horizontal" model={this.state.form}>
      <Form.Item>
        <Input value={name} placeholder="name" onChange={this.onChange.bind(this, 'name')}></Input>
      </Form.Item>
      <Form.Item>
        <Input
          value={password}
          type="password"
          placeholder="password"
          onChange={this.onChange.bind(this, 'password')}>
        </Input>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">log in</Button>
      </Form.Item>
    </Form>
  )
}
```

:::

### 对齐方式

根据具体目标和制约因素，选择最佳的标签对齐方式。

::: demo 通过设置 `labelPosition` 属性可以改变表单域标签的位置，可选值为 `top`、`left`、`right`，当设为 `top` 时标签会置于表单域的顶部

```js
// state
constructor(props) {
  super(props)
  this.state = {
    form: {
      name: '',
      password: '',
      position: 'right'
    }
  }
}

onChange(type, value) {
  const { form } = this.state
  this.setState({
    form: Object.assign({}, form, {[type]: value})
  }, () => {
    console.log(this.state.form)
  })
}

render() {
  const { name, password, disabled, position } = this.state.form
  return (
    <React.Fragment>
      <Radio.Group value={position} onChange={this.onChange.bind(this, 'position')} size="small">
        <Radio.Button value="left">
          左对齐
        </Radio.Button>
        <Radio.Button value="right">
          右对齐
        </Radio.Button>
        <Radio.Button value="top">
          顶部对齐
        </Radio.Button>
      </Radio.Group>
      <Form labelPosition={position} model={this.state.form}>
        <Form.Item label="姓名">
          <Input value={name} placeholder="name" onChange={this.onChange.bind(this, 'name')}></Input>
        </Form.Item>
        <Form.Item label="密码">
          <Input value={password} type="password" placeholder="password" onChange={this.onChange.bind(this, 'password')}></Input>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">log in</Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  )
}
```

:::

### 表单验证

在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。

::: demo Form 组件提供了表单验证的功能，只需要通过 `rule` 属性传入约定的验证规则，并 Form-Item 的 `prop` 属相设置为需校验的字段名即可。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)

```js
constructor(props) {
  super(props)
  this.state = {
    form: {
      name: '',
      region: '',
      date1: '',
      delivery: '',
      type: [],
      resource: '',
      desc: ''
    },
    singleRule: [
      {
        type: 'string',
        required: true,
        message: 'bulabula'
      }
    ]
  }
  this.rules = {
      name: [
        { required: true, message: '请选择活动名称' },
        {validator(rule, value, callback, source, options) {
          var errors = [];
          if(!/^[a-z0-9]+$/.test(value)) {
            errors.push("请输入小写英文字母和数字");
          }
          callback(errors);
        }}
      ],
      region: [
        { required: true, message: '请选择活动区域' }
      ],
      date1: [
        { type: 'object', required: true, message: '请选择日期' }
      ],
      type: [
        { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
      ],
      resource: [
        { required: true, message: '请选择活动资源', trigger: 'change' }
      ],
      desc: [
        { required: true, message: '请填写活动形式', trigger: 'blur' }
      ]
    }

  this.formCols = {
    labelCol:{span: 4},
    wrapperCol:{span: 20}
  }
}

onChange(type, value) {
  const { form } = this.state
  console.log(this.itemRef.validate)
  this.itemRef.validate('change')
  this.setState({
    form: Object.assign({}, form, {[type]: value})
  }, () => {
    console.log(this.state.form)
  })
}

handleSubmit() {
  this.formRef.validate(valid => {
    if (valid) {
      console.log('success')
    } else {
      console.log('error')
    }
  })
}

changeSingleRule() {
  this.setState({
    singleRule: []
  })
}

render() {
  return (
    <React.Fragment>
      <Button onClick={this.changeSingleRule.bind(this)}>change single rule</Button>
      <Form
        ref={node => this.formRef = node}
        onSubmit={this.handleSubmit.bind(this)}
        rules={this.rules}
        model={this.state.form}
        labelCol={{span: 4}}
        wrapperCol={{span: 4}}>
        <Form.Item {...this.formCols} ref={node => this.itemRef = node} prop="name" label="活动名称">
          <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
        </Form.Item>
        <Form.Item {...this.formCols} prop="region" label="活动区域">
          <Select value={this.state.form.region} onChange={this.onChange.bind(this, 'region')} placeholder="请选择活动区域">
            <Select.Option value="shanghai">上海</Select.Option>
            <Select.Option value="beijing">北京</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...this.formCols} prop="date1" label="活动时间">
          <DatePicker
            value={this.state.form.date1}
            placeholder="选择日期"
            onChange={this.onChange.bind(this, 'date1')}
          />
        </Form.Item>
        <Form.Item {...this.formCols} prop="type" label="活动性质">
          <Checkbox.Group value={this.state.form.type} onChange={this.onChange.bind(this, 'type')}>
            <Checkbox label="美食/餐厅线上活动" name="type">美食/餐厅线上活动</Checkbox>
            <Checkbox label="地推活动" name="type">地推活动</Checkbox>
            <Checkbox label="线下主题活动" name="type">线下主题活动</Checkbox>
            <Checkbox label="单纯品牌曝光" name="type">单纯品牌曝光</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item {...this.formCols} prop="resource" label="特殊资源">
          <Radio.Group value={this.state.form.resource} onChange={this.onChange.bind(this, 'resource')}>
            <Radio value="线上品牌商赞助">线上品牌商赞助</Radio>
            <Radio value="线下场地免费">线下场地免费</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...this.formCols} prop="desc" label="活动形式">
          <Input.Textarea type="textarea" value={this.state.form.desc} onChange={this.onChange.bind(this, 'desc')}></Input.Textarea>
        </Form.Item>
        <Form.Item
          {...this.formCols}
          prop="singleValigateTest"
          rules={this.state.singleRule}
          label="活动形式">
          <Input.Textarea type="textarea" value={this.state.form.desc} onChange={this.onChange.bind(this, 'desc')}></Input.Textarea>
        </Form.Item>
        <Form.Item {...this.formCols}>
          <Button type="primary" htmlType="submit">立即创建</Button>
          <Button type='default'>取消</Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  )
}
```

:::

### Form Attributes

Form

| 属性 / 方法   | 说明                         | 类型               | 默认值 / 可选值    |
| :------------ | :--------------------------- | :----------------- | :----------------- |
| model         | Form 数据对象                | any                | -                  |
| rules         | Form 校验规则                | object             | -                  |
| labelPosition | label 位置                   | string             | [top, left, right] |
| header        | form header                  | string             | -                  |
| subHeader     | form subHeader               | string             | -                  |
| onSubmit      | form onSubmit 事件           | function           | -                  |
| validate      | 对整个表单进行校验的方法     | function           | -                  |
| labelWidth    | 所有 item label 宽度         | number             | -                  |
| wrapperWidth  | 所有 item 内容宽度           | number             | -                  |
| labelCol      | 所有 item label 宽度栅格占比 | object: {span: 4}  | -                  |
| wrapperCol    | 所有 item 内容 宽度栅格占比  | object: {span: 20} | -                  |

FormItem

| 属性 / 方法  | 说明               | 类型               | 默认值 / 可选值           |
| :----------- | :----------------- | :----------------- | :------------------------ |
| prop         | form model 字段    | string             | Form model 中的某一项 key |
| label        | 标签文本           | string             | -                         |
| labelWidth   | label 宽度         | number             | -                         |
| wrapperWidth | 内容宽度           | number             | -                         |
| labelCol     | label 宽度栅格占比 | object: {span: 4}  | -                         |
| wrapperCol   | 宽度栅格占比       | object: {span: 20} | -                         |

### 组件分析

FormItem：

- 显示 label；
- 对 Input 的  value 进行校验，并显示错误信息。

Form 组件：

- label 显示位置
- 批量校验

### 具体实现

FormItem 中的校验：校验使用的 [async-validator](https://github.com/yiminghe/async-validator)，校验规则按照 async-validator 要求 传入。

校验流程：

**onChange/onBlur => validate ==> getFilterRules => descriptor => model => validator.validate => setState**

- onChange/onBlur: React 事件
- validate：
  - getFilterRules: getRules => trigger => `rules` 从 rules 中筛选出 prop 对应的 rules（trigger 也要匹配）
  - descriptor： ({ _[prop]_ : rules}) => new AsyncValidator(descriptor) => `validator`
  - model: getFieldValue => value => `{ _[prop]_ : value}`
  - validator.validate: validator.validate(model, errors => setState)

Form 中的校验：

- Form 会在 FormItem `componentDidMount` 的时候，获取到一个  放着 FormItem 引用的数组 `formItems`
- 调用 Form 的 `validate` 方法会对 `formItems` 中的每一项执行 validate

note:

- From 是如何获取 FormItem 的引用的：
  1'. 使用的 context：在 Form 中定义 `getChildContext` 生成 `context`，然后在子组件用通过 `this.context` 使用
  2'. 使用 createContext (v16.3+)
- 再插一嘴双向绑定：（无时无刻不在想 vue 中 v-model）
  - ant-design 自动实现了双向绑定， 其使用  [rc-form](https://github.com/react-component/form) 实现的 Form 组件，[rc-form](https://github.com/react-component/form) 是一个高阶组件，将现有组件传入后， 它会将双向绑定的方法作为 props 传给现有组件。

### 遇到问题

- 在 FormItem 中通过 `onChange` | `onBlur` 触发校验，校验用到的数据(model) 是 Input 通过 `onChange` 修改 state 得到的。然后会出现一种情况，在 Input `onChange` 完成后，setState 并没有立即更新 state 的值，导致 FormItem 校验用的 model 不是最新的。

```jsx
handleChange() {
  setTimeout(() => {
    this.validate("change")
  })
}
```
