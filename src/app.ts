/*
 * @Author: litfa
 * @Date: 2022-02-16 02:08:57
 * @LastEditTime: 2022-03-02 17:48:24
 * @LastEditors: litfa
 * @Description: app
 * @FilePath: /blog-service/src/app.ts
 * 
 */
import config from './config'

import express from 'express'
const app = express()
import bodyParser from 'body-parser'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

import router from './router/index'
app.use('/api', router)

app.get('/', (req, res) => {
  res.send('blog service: Status: OK.')

})

app.listen(config.port, () =>
  console.log(`http://localhost:${config.port}`)
)
