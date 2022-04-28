let url

if (process.env.NODE_ENV == "development") { 
    // 开发环境中
    url = "http://localhost:8080" 
} else {
    // 生产环境中
    url = "http://127.0.0.1:8080"
}

export default {
    url
}