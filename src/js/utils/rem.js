(function (doc, win) { // 立即执行,所以引入多次会执行多次
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      // 屏幕宽/设计图宽
      docEl.style.fontSize = 50 * (clientWidth / 1903) + 'px'
    }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
