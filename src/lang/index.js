import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import elementTwLocale from 'element-ui/lib/locale/lang/zh-TW'
import locale from 'element-ui/lib/locale'
import enLocale from './en'
import zhLocale from './zh'
import twLocale from './tw'

Vue.use(VueI18n)

// 引入本地包
const messages = {
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  tw: {
    ...twLocale,
    ...elementTwLocale
  }
}

// 创建国际化实例
const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'zh',
  messages
})

locale.i18n((key, value) => i18n.t(key, value))

export default i18n
