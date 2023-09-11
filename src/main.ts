/*
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2023-09-11 09:19:06
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2023-09-11 10:01:52
 * @FilePath: \irelia-frontend\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
