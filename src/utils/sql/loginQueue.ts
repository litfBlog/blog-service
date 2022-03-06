/*
 * @Author: litfa
 * @Date: 2022-03-04 16:11:34
 * @LastEditTime: 2022-03-06 20:28:39
 * @LastEditors: litfa
 * @Description: 修改登录队列
 * @FilePath: /blog-service/src/utils/sql/loginQueue.ts
 * 
 */
import query from '././../../db/query'
// query('select * from loginQueue where code=?')

/**
 * @description: 查询登录状态 未找到返回-1 找到返回状态
 * @param {string} code
 * @return {number}
 */
export const queryStatus = async (code: string) => {
  // return 
  const { results } = await query('select * from loginQueue where code=?', code)
  console.log(results)

  if (results.length != 1) {
    return -1
  }
  return results[0].status
}
export const setStatus = async (code: string, status: number, userId: number | string) => {
  const { err, results } = await query('update loginQueue set ? where code=?', [{ status, userId }, code])
  if (err) {
    return -1
  }
  return results
}
