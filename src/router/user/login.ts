import config from './../../config'
/*
 * @Author: litfa
 * @Date: 2022-03-01 10:52:48
 * @LastEditTime: 2022-03-04 10:09:43
 * @LastEditors: litfa
 * @Description: 登录相关api
 * @FilePath: /blog-service/src/router/user/login.ts
 * 
 */
import express from 'express'
import getUnlimited from './../../utils/wx/getUnlimited'
import db from './../../db/index'
const router = express.Router()

/**
 * @description: 获取code
 */
router.post('/getCode', async (req, res) => {
  // 获取随机code
  const code = Date.now().toString() + Math.floor(Math.random() * 5000000000).toString()
  // 插入code
  await db.query('insert into loginQueue set ?', { code, status: 0, date: Date.now() }, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.send({ status: 5, message: err.message })
    res.send({ status: 1, code })
  })
})

/**
 * @description: 获取小程序码
 */
router.post('/getQRCode', async (req, res) => {
  const { code } = req.body

  if (!code) return res.send({ status: 4 })

  await db.query('select * from loginQueue where code=?', code, async (err, results) => {
    console.log(err, results)
    if (results.length != 1) return res.send({ status: 6 })
    const img = await getUnlimited(code)

    res.type('image/jpeg')
    res.send(img)
  })
})

/**
 * @description: 获取登录状态
 */
router.post('/queryLoginStatus', (req, res) => {
  const { code } = req.body
  if (!code) return res.send({ status: 4 })
  db.query('select * from loginQueue where code=?', code, async (err, results) => {
    res.send({ status: 1, loginStatus: results[0].status })
  })
})

import WXBizDataCrypt from '../../utils/wx/WXBizDataCrypt'
import code2Session from './../../utils/wx/code2Session'

/**
 * @description: 登录
 */
router.post('/login', async (req, res) => {

  const { code, encryptedData, signature, iv, scene } = req.body

  // 部分场景值下还可以获取来源应用、公众号或小程序的appId。
  // https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html
  if (scene.length == 4) {
    // 非网页登录
  }

  // 解析用户信息
  const { session_key: sessionKey, openid, unionid } = await code2Session(code)
  const pc = new WXBizDataCrypt(config.wx.appid, sessionKey)
  const data = pc.decryptData(encryptedData, iv)
})

export default router