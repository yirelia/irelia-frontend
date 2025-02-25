/*
 * @Author: rui 17368465776@163.com
 * @Date: 2025-02-23 16:54:16
 * @LastEditors: rui 17368465776@163.com
 * @LastEditTime: 2025-02-23 16:55:31
 * @FilePath: /irelia-frontend/src/views/common/synatx-type.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface ExetendClass  {type_specifier: string,order: number }

export interface SynatxNode {
    annotation: string
    class_prefixes: string[]
    copyAllowed: true,
    description: string,
    order: number // 
    viewSourceAllowed: boolean
    elements: Record<string, any>
    equations: Record<string, any>,
    extends:  ExetendClass[]
    isReadOnly: string
}

// interface Annotation: {

// }