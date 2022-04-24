/*
 * @Author: litfa
 * @Date: 2022-04-23 19:51:19
 * @LastEditTime: 2022-04-24 17:56:47
 * @LastEditors: litfa
 * @Description: 为html添加class
 * @FilePath: /blog-service/src/utils/htmlAddClass.ts
 * 
 */

import { JSDOM } from 'jsdom'
export default (html: string): string => {
  const dom = new JSDOM(html)
  const tags = dom.window.document.body.getElementsByTagName('*')

  for (let i = 0; i < tags.length; i++) {
    tags[i].classList.add('md-' + tags[i].tagName.toLowerCase())
  }

  return dom.window.document.body.innerHTML
}

