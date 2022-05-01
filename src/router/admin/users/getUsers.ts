/*
 * @Author: litfa
 * @Date: 2022-04-11 15:19:58
 * @LastEditTime: 2022-04-28 19:39:01
 * @LastEditors: litfa
 * @Description: 获取用户列表
 * @FilePath: /blog-service/src/router/admin/users/getUsers.ts
 * 
 */
import query from './../../../db/query'
import { Router } from 'express'
const router = Router()

router.post('/all', async (req, res) => {
  const [err, results] = await query('SELECT * FROM users')
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, list: results })
})

router.post('/getOne', async (req, res) => {
  const { id } = req.body
  const [err, results] = await query('SELECT * FROM users WHERE ?', { id })
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results[0] })
})

router.post('/set', async (req, res) => {
  const { data, id } = req.body
  if (id == undefined) {
    return res.send({ status: 4 })
  }
  const setData: any = {}
  for (const i in data) {
    if (data[i] !== undefined || data[i] !== null || data[i] == '') {
      setData[i] = data[i]
    }
  }
  const [err, results] = await query('update users set ? where ?', [setData, { id }])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1 })
})

export default router