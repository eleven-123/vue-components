import config from './config'
import axios from 'axios'

const httpCode = { // 这里我简单列出一些常见的http状态码信息，可以自己去调整配置
    // 401: '无访问权限或未授权',
    // 405: '非法访问',
    // 204: '未登录或登录已过期',
    // 4031: '请求过于频繁或重复提交',
    // 403: '业务错误，拒绝执行',
    500: '服务器发生错误',
    1000: '不合法'
}

// 自定义的一些默认配置
const defaultConfig = {
    showLoading: true, //显示loading
    dialogError: true,  //弹出错误提示
    qsData: true, //是否qs请求参数
    trimData: true, //请求参数是否去空格
    isCacheResData: false, //是否缓存请求数据
}

const instance = getinstance(config.url, resolveResponse)

function getinstance(publicIp, resolveResponse){
    const instance = axios.create({ // 创建axios实例，在这里可以设置请求的默认配置
        timeout: 1000 * 60 * 10, // 设置超时时间10分钟
        withCredentials: true, // 设置当跨域请求时发送cookie
        baseURL: publicIp // 根据自己配置的反向代理去设置不同环境的baeUrl
    })
    /** 添加响应拦截器  **/
    instance.interceptors.response.use(response => {
        return resolveResponse({ response })
    }, error => {
        return resolveResponse({ error })
    })
    return instance
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
    config = Object.assign({
      method: 'get',
      url,
      data,
    }, defaultConfig, config)
    return instance(config)
}

// 响应拦截
function resolveResponse({
    error,
    response
}) {
    const config = (response || error).config
    let result = {
        message: '',
        data: null
    }
    if (error) {
        // 根据请求失败的http状态码去给用户相应的提示
        if (error.response) {
            result.message = error.response.code in httpCode ? httpCode[error.response.code] : (error.response.data.message || '')
        }
    } else {
        result.data = response.data
        result.code = response.data.status || response.data.code
        result.message = response.data.message || response.data.msg || ''
    }
    return Promise.resolve(result.data)
}