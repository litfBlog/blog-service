/*
 * @Author: litfa
 * @Date: 2022-03-17 20:37:42
 * @LastEditTime: 2022-03-21 18:28:45
 * @LastEditors: litfa
 * @Description: 文件上传
 * @FilePath: /blog-service/src/router/articles/upload.ts
 * 
 */
import { Router } from 'express'
import query from './../../db/query'
import multer from 'multer'
import config from './../../config'
import { join } from 'path'

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
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uuid = req.query.uuid as string

      if (!uuid) return

      cb(null, join(config.tempFileDir, uuid))
    },
    filename: function (req, file, cb) {
      // 文件后缀
      const type = file.mimetype.split('/')[1]
      const fileName = Date.now().toString() + '-' + Math.floor(Math.random() * 100000).toString() + '.' + type
      console.log(fileName)

      cb(null, fileName)
    }
  }),
  limits: {
    // http://calc.gongjuji.net/byte/
    fileSize: 10485760
  }

}).single('file')

// 中间件 用于验证uuid
router.post('/', async (req, res, next) => {
  const uuid = req.query.uuid as string
  const user = req.user as any
  console.log(uuid)

  if (!uuid) return res.send({ status: 4 })
  const [err, results] = await query('select * from articlesqueue where ? and ? and ?', [{ uuid }, { author: user.id }, { status: 1 }])
  if (err || results.length < 1) {
    return res.send({ status: 4 })
  }
  next()
})

router.post('/', async (req, res) => {
  const uuid = req.query.uuid as string
  const isCover = req.query.isCover
  const user = req.user as any

  upload(req, res, async (err) => {
    console.log(err)

    if (err instanceof multer.MulterError) {
      // 文件过大
      if (err.code && err.code == 'LIMIT_FILE_SIZE') return res.send({ status: 1, fileStatus: 2 })
      // 其他错误
      return res.send({ status: 1, fileStatus: 5 })
    } else if (err) {
      // 其他错误
      return res.send({ status: 1, fileStatus: 5 })
    }

    const fileName = req.file?.filename as string
    const path = `${config.viewRouter}/${uuid}/${fileName}`

    // 封面
    console.log(isCover)

    if (isCover == 'true') {
      const [err, results] = await query('update articlesqueue set ? where ? and ?', [{ cover: path }, { uuid }, { author: user.id }])
      if (err) return res.send({ status: 1, fileStatus: 5, fileName, path })
    }

    res.send({ status: 1, fileStatus: 1, fileName, path })
  })
})

export default router