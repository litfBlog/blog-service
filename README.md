# 博客后端 litfBlog  
本项目的其他仓库:
[前端](https://github.com/litfBlog/blog)
[小程序](https://github.com/litfBlog/blog-miniprogram)
[后台](https://github.com/litfBlog/admin)

# 特性
- 使用`mysql`数据库
- 完善的api文档[点击查看](https://console-docs.apipost.cn/preview/30d1279e811bef63/63ef8f71eaea6784)
- 使用`TypeScript`
- 使用`JWT`身份验证
- 使用微信登录

# 使用
推荐使用 [yarn](https://www.yarnpkg.cn/) 替代 `npm`

### 克隆仓库
```bash
$ git clone https://github.com/litfBlog/blog-service.git
```
### 安装模块
```bash
$ yarn
```
### 运行
```bash
$ yarn start
```
### 构建
```bash
$ yarn build
```

# 代码规范
### 头部注释
推荐使用 vscode `korofileheader` 插件添加

### 代码规则
遵守 eslint 配置即可

### 变量名
使用驼峰命名法

### git提交
Commit Summary：
一般写：

`type(范围): 注释`  
feat ：新功能  
fix ：修复  
docs ：文档  
style ：格式（如格式化代码，调整了代码顺序，简化变量之类的操作）  
refactor ：重构（即不是新增功能，也不是修改bug的代码变动）  
chore ：构建过程或辅助工具的变动  
perf ：性能优化  
<!-- test ：增加测试  
test ：单元测试   -->
`git push -u`  

# 状态码
## http status
- 0: 未验证
- 1: 正常
- 2: 权限不足
- 3: 账号状态异常
- 4: 无效参数
- 5: 未知异常
- 6: 资源未找到

# saved_articles 状态码
- 0 已初始化完成 保存了草稿
- 1 已完成
- 2 修改内容
- 3 修改内容待审核

# articles 状态码
- 0 未审核
- 1 正常
- 2 私密
- 3 修改内容待审核
- 4 审核不通过
- 5 删除

## 文章队列
- 1 编辑中
- 2 待审核
- 3 已完成
- 4 违规


## login query
- 0 已申请 待扫码
- 1 已扫码 待确认
- 2 登录成功
- 3 取消登录
- 4 过期
- 5 未知错误
- 6 无效code

# users
## status
- 0 已注册未审核
- 1 正常
- 2 临时封禁
- 3 永久封禁
- 
## permissions
- 0
- 1 普通用户
- 2-9 权限等级
- 10 管理员
- 15 有后台的管理员
- 20 最高权限

## 友链
- 0 未审核
- 1 正常
- 2 被删除


## 举报类型
- 0 其他
- 1 色情低俗
- 2 违法犯罪
- 3 造谣传谣
- 4 垃圾广告
- 5 非原创内容
- 6 骚扰
- 7 人身攻击
- 8 引战
- 9 诈骗

### 状态码
- 0 未审核
- 1 审核完成 举报内容有违规
- 2 审核完成 举报内容无违规
