/*
 * @Author: rui 17368465776@163.com
 * @Date: 2025-02-23 16:43:17
 * @LastEditors: rui 17368465776@163.com
 * @LastEditTime: 2025-02-23 16:53:11
 * @FilePath: /irelia-frontend/src/views/common/synatx.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */

export interface EquationsSyntax {
    equation: string,
    annotation: {
        Line: {
            class_modification: {
                points: {
                    binding: string
                }
            }
        }
    },
    left: string
    right: string
}