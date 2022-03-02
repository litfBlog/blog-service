# blog
博客后端  
本项目的前端仓库: [blog-v2](https://github.com/litfa/blog-v2)

# 后端技术
- ts
- express
- mysql
- JWT
- ...

# 开发进度
该项目仍在开发中...

# 搭建开发环境
推荐使用 [yarn](https://www.yarnpkg.cn/) 替代 `npm`

### 克隆仓库
```bash
$ git clone https://github.com/litfa/blog-service.git
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
<!-- test ：增加测试  
chore ：构建过程或辅助工具的变动  
perf ：性能优化  
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

## 文章等
- 0 待审核
- 1 正常
- 2 访问者权限不足
- 3 账号状态异常
- 4 资源未找到
- 5 未知异常

## login query
- 0 已申请 待扫码
- 1 已扫码 待确认
- 2 登录成功
- 3 取消登录
- 4 过期
- 5 未知错误