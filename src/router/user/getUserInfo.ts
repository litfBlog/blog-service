/*
 * @Author: litfa
 * @Date: 2022-03-08 10:08:50
 * @LastEditTime: 2022-04-25 18:39:02
 * @LastEditors: litfa
 * @Description: 获取用户信息
 * @FilePath: /blog-service/src/router/user/getUserInfo.ts
 * 
 */
import { Router } from 'express'
import query from '../../db/query'
const router = Router()

const sql = `
select
    users.id,
    users.username,
    users.avatar,
    users.registerDate,
    users.permissions,
    users.status,
    users.avatar_pendant as avatar_pendant_id,
    avatar_pendant.name as avatar_pendant_name,
    avatar_pendant.url as avatar_pendant_url
from users
left join avatar_pendant on avatar_pendant.id = users.avatar_pendant
where users.id = ?
`
router.post('/', async (req, res) => {
  const user = req.user as any
  // 为了确保用户信息实时性 需要从数据库查询
  const [err, request] = await query(sql, [user.id])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, userInfo: request[0] })
})

export default router