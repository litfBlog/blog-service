/*
 * @Author: litfa
 * @Date: 2022-02-16 02:08:57
 * @LastEditTime: 2022-03-14 09:01:57
 * @LastEditors: litfa
 * @Description: app
 * @FilePath: /blog-service/src/app.ts
 * 
 */
import config from './config'

import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import expressJWT from 'express-jwt'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [new RegExp(`^${config.baseUrl}/login/`)] }))

// 错误中间件
app.use((err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 省略其它代码...

  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.send({ status: 3, msg: '认证失败，请重新登录' })

  // 未知错误...
})

import router from './router/index'
app.use(config.baseUrl, router)

app.get('/', (req, res) => {
  res.send('blog service: Status: OK.')

})

app.listen(config.port, () =>
  console.log(`http://localhost:${config.port}`)
)
