### glue-redux更新日志 | [en](https://github.com/ZhouYK/glue-redux/blob/master/en/log.md)
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

2.0.3
- model的方法不再返回action对象，而返回传入方法的数据

2.0.4
> gluePair and createGlue 将在3.x中彻底删除
- 为gluer方法返回的函数添加属性actionType

3.0.0
- 在destruct返回中新增referToState方法：根据模型对象，索引出其在store中的数据；
- 去除gluePair和createGlue

3.1.0
- 顶层节点可以使节点维护函数；
- 可根据整个model的索引，获取整个state

3.2.0
- 新增hasModel方法
- 当传入未知引用时，referToState将返回undefined

3.2.1
- 修复嵌套对象丢失的问题

3.4.0
- 支持异步节点，添加异步节点生成函数gas
- 优化代码

3.4.1
- gas的异步函数可以是普通函数，也可以是async函数

3.4.2
- gas第一个参数如果不是函数，则抛出错误
- ts中gas异步函数入参返回可以是any
