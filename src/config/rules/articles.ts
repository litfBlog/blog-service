/*
 * @Author: litfa
 * @Date: 2022-04-19 15:31:35
 * @LastEditTime: 2022-04-19 16:35:11
 * @LastEditors: litfa
 * @Description: 文章验证规则
 * @FilePath: /blog-service/src/config/rules/articles.ts
 * 
 */
import Joi from 'joi'

const schema = Joi.object({
  type: Joi.string(),
  uuid: Joi.string().required(),
  author: Joi.number().required(),
  title: Joi.string().min(2).max(40).required(),
  content: Joi.string().min(10).max(100000).required(),
  cover: Joi.string().required(),
  status: Joi.number().required(),
  createDate: Joi.number().required(),
  desc: Joi.string().min(5).max(60).required()
})

export default schema