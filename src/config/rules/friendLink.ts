/*
 * @Author: litfa
 * @Date: 2022-04-20 19:32:40
 * @LastEditTime: 2022-04-21 17:51:46
 * @LastEditors: litfa
 * @Description: 友链表单规则
 * @FilePath: /blog-service/src/config/rules/friendLink.ts
 * 
 */
import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().required().min(2).max(10),
  url: Joi.string().required().min(4).max(50),
  desc: Joi.string().max(20),
  icon: Joi.string().max(200)
})

export default schema