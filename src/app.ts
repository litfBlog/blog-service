/*
 * @Author: litfa
 * @Date: 2022-02-16 02:08:57
 * @LastEditTime: 2022-04-27 17:55:15
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
import JWTUnless from './config/JWTUnless'
import { logger } from './utils/log'

logger.info('litfPress service 启动中')

// 中间件记录日志
app.use('*', (req: any, res, next) => {
  // 用于记录特定时间的日志输出

  try {
    req.userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  } catch (e) {
    console.log(e)
  }
  next()
  logger.info(`ip:${req.userIp}  请求:${req.path}  user-agent:${req.headers['user-agent']}`)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: JWTUnless }))

// 错误中间件
app.use((err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 省略其它代码...

  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.send({ status: 3, msg: '认证失败，请重新登录' })

  // 未知错误...
})

import router from './router/index'
app.use(config.baseUrl, router)
import adminRouter from './router/admin/index'
app.use(config.adminBaseUrl, adminRouter)

import staticRouter from './router/static/index'
app.use(config.viewRouter, staticRouter)

app.get('/', (req, res) => {
  res.send('blog service: Status: OK.')
})

logger.info(`监听端口 ${config.port}`)
app.listen(config.port, () => {
  logger.info('启动成功')
  logger.info(`http://localhost:${config.port}`)
})
