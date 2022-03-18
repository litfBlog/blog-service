/*
* @Author: litfa
* @Date: 2022-03-18 17:05:10
 * @LastEditTime: 2022-03-18 18:20:01
 * @LastEditors: litfa
 * @Description: 静态资源访问
 * @FilePath: /blog-service/src/router/static/index.ts
 * 
 */

import { Router, static as expressStatic } from 'express'
import config from './../../config'
import query from './../../db/query'
import { join } from 'path'

const app = Router()

// 中间件，可用于拦截违规图片
app.use('/:uuid/:filename', async (req, res, next) => {
  const { uuid, filename } = req.params
  const [err, results] = await query('select * from articles where uuid=?', uuid)
  const user = req.user as any
  next()
})

app.use('/', expressStatic(join(process.cwd(), config.tempFileDir)))
app.use('/', expressStatic(join(process.cwd(), config.uploadsDir)))

export default app