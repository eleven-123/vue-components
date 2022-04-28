import Vue from 'vue'
import { formatMoney, showPrice, deepClone } from './utils'
import { post } from '@/axios'

Vue.prototype.p_post = post
Vue.prototype.p_formatMoney = formatMoney
Vue.prototype.p_showPrice = showPrice
Vue.prototype.p_deepClone = deepClone