# anchor

## 实现

1.  属性
    > Anchor

| 属性 / 方法    | 说明                        | 类型          | 默认值 / 可选值 |
| :------------- | :-------------------------- | :------------ | :-------------- |
| defaultActive  | 默认激活 href/id            | string        | -               |
| getContainer   | 获取要相对定位的容器        | ant           | window/DOM      |
| onActiveChange | activeId 切换的时候出发事件 | func          | -               |
| affix          | 是否悬浮                    | bool          | true            |
| offsetTop      | 出发激活时候的偏移量        | string/number | -               |
| bounds         | 悬浮时候的偏移量            | object        | -               |
| style          | 自定义 style                | object        | -               |
| className      | 自定义 class                | string        | -               |

> AnchorLink

| 属性 / 方法 | 说明     | 类型   | 默认值 / 可选值 |
| :---------- | :------- | :----- | :-------------- |
| href        | 锚点     | string | -               |
| onClick     | 点击事件 | func   | -               |

2.  组件分析
    Anchor  
    -监听滚动事件  
    -判断当前哪个 AnchorLink 需要激活  
    -将激活的 id 传入 AnchorLink 中

    AnchorLink  
    -根据激活的 id 更改自身状态

3. 具体实现

> 通过 registerLink 获取到所有的 links -> 监听 scroll 事件 -> 计算当前激活的link -> 修改激活状态

> registerLink

```jsx
registerLink = link => {
    if (this.hrefs.indexOf(link.link) < 0) {
      this.hrefs.push(link.link);
      this.links.push(link);
    }
}
// AnchorLink
componentDidMount() {
    const { registerLink } = this.props
    registerLink && registerLink({
        link: this.props.href,
        instance: this
    })
}
```

> 监听sroll
```jsx
scrollListener = () => {
    const { getContainer, index } = this.props;
    let parentContainer;
    if (getContainer) {
      parentContainer =
        getContainer() === window
          ? document.getElementById(index) // 如果没有指定 container
          : getContainer();
    }
    if (!parentContainer) return;
    const parentRect = parentContainer.getBoundingClientRect();

    // 判断是否在可视区域内 修改 fix 状态
    if (parentRect.top < 10 && parentRect.bottom > 30) {
      if (!this.state.isFixed) {
        this.setState({
          isFixed: true
        });
      }
    } else {
      if (this.state.isFixed) {
        this.setState({
          isFixed: false
        });
      }
    }

    // 滚动状态下不设置进行状态切换
    if (this.animating) {
      return;
    }

    // fix状态下的 anchor 才需要切换激活状态 应对同一页面多个anchor的情况
    if (this.state.isFixed) {
      const { offsetTop, bounds, onActiveChange } = this.props;
      const activeId = this.getCurrentAnchor(offsetTop, bounds);
      if (activeId) {
        if (activeId !== this.state.activeId) {
          this.setState({
            activeId: activeId
          });
        }
        onActiveChange(activeId, this, this.anchorLinkInstance);
      } else if (this.hrefs.indexOf(activeId) < 0 || !activeId) {
        this.setState({
          activeId: undefined
        });
      }
    }
}

getCurrentAnchor(offsetTop = 85, bounds = 5) {
    let activeId = "";
    if (typeof document === "undefined") {
      return activeId;
    }

    const linkSections = [];
    const { getContainer } = this.props;
    const container = getContainer();
    this.links.forEach(item => {
      const target = document.getElementById(item.link);
      if (target) {
        const top = getOffsetTop(target, container);
        // 当 anchor 位于屏幕顶部 offsetTop + bounds 以上的位置 记录 anchor
        if (top < offsetTop + bounds) {
          linkSections.push({
            link: item.link,
            top,
            instance: item.instance
          });
        }
      }
    });
    // 筛选 top 最的符合条件的 anchor
    if (linkSections.length) {
      const maxSection = linkSections.reduce(
        (prev, curr) => (curr.top > prev.top ? curr : prev)
      );
      this.anchorLinkInstance = maxSection.instance;
      return maxSection.link;
    }
    return "";
}

handleClick = href => {
    const { offsetTop, getContainer } = this.props;
    this.animating = true;
    // scroll 事件封装
    scrollTo(href, offsetTop, getContainer, () => {
      this.animating = false;
    });
};
```

4. 使用

```jsx
<Anchor
    onActiveChange={this.handleAnchorChange.bind(this)}
    index={`${key}`}
    affix={true}>
    {items.map(item => {
        return (
            <Anchor.Link key={item.index} href={item.index}>
                {item.children}
            </Anchor.Link>
        )
    })}
</Anchor>
```

5. 遇到问题

> 项目中的需求为 anchor 是某一个模块的 anchor，而平常更常见的是 anchor 是全局的，这对处理 什么时候 fix 有影响,
需要想一个两全的方法
