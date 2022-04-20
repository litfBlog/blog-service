/*
 * @Author: litfa
 * @Date: 2022-04-19 18:36:50
 * @LastEditTime: 2022-04-20 17:58:46
 * @LastEditors: litfa
 * @Description: 上传文件（cos）
 * @FilePath: /blog-service/src/router/articles/upload.ts
 * 
 */
import putObject from '../../utils/putObject'
import { Router } from 'express'
import query from '../../db/query'
import { v4 as uuidV4 } from 'uuid'
import dayjs from 'dayjs'
import config from '../../config'
import multer from 'multer'
const router = Router()

const upload = multer({
  // dest: 'uploads/',
  fileFilter(req, file, cb) {
    if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.mimetype) == -1) {
      // 文件类型有误
      return cb(new Error('fileType'))
    }
    cb(null, true)

  },
  limits: {
    // http://calc.gongjuji.net/byte/
    fileSize: 10485760
  }

}).single('file')

// 中间件 用于验证uuid
router.post('/', async (req, res, next) => {
  const uuid = req.query.uuid as string
  const user = req.user as any

  if (!uuid) return res.send({ status: 4 })

  const [err, results] = await query('select * from articlesqueue where ? and ? and ?', [{ uuid }, { author: user.id }, { status: 1 }])
  if (err || results.length < 1) {
    return res.send({ status: 4 })
  }
  next()
})

router.post('/', async (req, res) => {
  const user = req.user as any
  const uuid = req.query.uuid as string
  const isCover = req.query.isCover

  upload(req, res, async () => {
    console.log(req.file)
    if (req.file?.buffer == undefined) return res.send({ status: 5 })
    const fileNameData = `user${user.id}/${dayjs().format('YYYYMMDDHHmmss')}`
    const fileNameText = `${req.file?.originalname.replace(/\.(jpg|jpeg|png|gif)$/g, '')}`
    const fileType = req.file?.mimetype.split('/')[1]
    const fileName = `${fileNameData}-${fileNameText}.${fileType}`
    const data: any = await putObject(fileName, req.file?.buffer)
    if (data.statusCode != 200) {
      return res.send({ status: 5 })
    }

    if (isCover == 'true') {
      const [err, results] = await query('update articlesqueue set ? where ? and ?', [{ cover: fileName }, { uuid }, { author: user.id }])
      if (err) return res.send({ status: 1, fileStatus: 5, fileName, path: data.Location })
    }
    res.send({ status: 1, fileName, Location: data.Location })
  })
})

export default router
