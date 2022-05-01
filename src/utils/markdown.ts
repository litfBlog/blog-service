/*
 * @Author: litfa
 * @Date: 2022-04-23 19:21:26
 * @LastEditTime: 2022-04-24 17:58:34
 * @LastEditors: litfa
 * @Description: 解析markdown
 * @FilePath: /blog-service/src/utils/markdown.ts
 * 
 */
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str, true).value
      } catch (__) { }
    }
    return '' // 使用额外的默认转义
  }
})

const markdown = (markdown: string): string => {
  return md.render(markdown)
}

export default markdown