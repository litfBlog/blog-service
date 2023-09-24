import { Router } from 'express'
import query from '../../db/query'
const router = Router()

const sql = `
update users set ? where ?
`
router.post('/', async (req, res) => {
  const { username, avatar } = req.body
  const user = req.user as any

  if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{2,12}$/.test(username)) {
    return res.send({
      status: 5,
      msg: '用户名不符合要求，要求为字母汉字或数字，长度为2-12个字符'
    })
  }
  if (avatar.indexOf('//static-1259453062.cos.ap-shanghai.myqcloud.com/') != 0) {
    return res.send({
      status: 5,
      msg: '头像不符合要求，请稍后重试'
    })
  }

  const [err, request] = await query(sql, [
    {
      username,
      avatar
    },
    {
      id: user.id
    }
  ])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1 })
})

export default router
