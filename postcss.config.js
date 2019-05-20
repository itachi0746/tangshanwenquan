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
    }
  }
}