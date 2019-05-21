module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: [
        '> 1%',
        'last 3 versions',
        'last 3 Explorer versions',
        'Firefox >= 20',
        'iOS >= 7',
        'Android > 4.4'
      ],
      cascade: true
    },
    'postcss-pxtorem': {
      'rootValue': 50,  // 根元素大小px
      'propList': ['*']  // *表示通用,所有属性都转为rem
    }
  }
}