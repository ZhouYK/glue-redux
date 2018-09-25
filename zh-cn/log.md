### glue-redux更新日志 | [en](https://github.com/ZhouYK/glue-redux/blob/master/log.md)
1.1.8
- createGlue方法被废弃；

1.1.9
- 普通函数不再被当成异步action处理，会保持原样。因为数据和数据请求都可以整合到glue对象中，
没有必要再穿透到底部redux的action处理流中去处理异步action;

2.0.1
> 这个主要版本旨在减少redux概念的暴露
- gluer重载

2.0.2
- 如果节点数据未发生变化，则不更新state
