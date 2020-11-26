module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://211.159.159.210:9960',
                //target:'http://127.0.0.1:9960',
                ws: true,
                changeOrigin: true
            }
        }
    }
}
