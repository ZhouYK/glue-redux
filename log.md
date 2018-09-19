### update logs | [中文](https://github.com/ZhouYK/glue-redux/blob/master/zh-cn/log.md)
1.1.8
- createGlue is deprecated

1.1.9
- Normal functions are no longer treated as asynchronous actions, but remain as they are. Since both data and data requests can be integrated into the glue object,
  There is no need to go through the action processing flow at the bottom of redux to handle asynchronous action;

2.0.1
> this major version aim to reduce the exposion of redux concept
- gluer overload
