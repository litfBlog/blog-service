/*
 * @Author: litfa
 * @Date: 2022-04-19 15:31:35
 * @LastEditTime: 2022-04-23 16:46:29
 * @LastEditors: litfa
 * @Description: 文章验证规则
 * @FilePath: /blog-service/src/config/rules/articles.ts
 * 
 */
import Joi from 'joi'
// title, id, content, desc, cover
const schema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().min(2).max(40).required(),
  content: Joi.string().min(10).max(100000).required(),
  cover: Joi.string().max(200).empty(''),
  desc: Joi.string().min(2).max(60).required()
})

export default schema