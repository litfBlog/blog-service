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