### glue-redux更新日志 | [en](https://github.com/ZhouYK/glue-redux/blob/master/log.md)
1.1.8
- createGlue方法被废弃；
1.1.9
- 普通函数不再被当成异步action处理，会保持原样。因为数据和数据请求都可以整合到glue对象中，
没有必要再穿透到底部redux的action处理流中去处理异步action;
