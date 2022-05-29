import { Router } from 'express'
import query from '../../db/query'

const router = Router()

/**
 * 获取头像挂件
 * 端午临时功能
 * 暂不支持领取多个挂件
 * 功能可能会继续完善 也可能会在端午过后下架
*/
router.post('/', async (req, res) => {
  const user = req.user as any
  // 挂件id先写死
  const [err, request] = await query('update users set avatar_pendant=? where id=?', [1, user.id])
  if (err) return res.send({ status: 500 })
  res.send({ status: 200 })
})

export default router