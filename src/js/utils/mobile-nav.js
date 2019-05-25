$(function () {
  var mobileBtn = $('#mobile-btn'); // 头部按钮
  var mobileNav = $('#mobile-nav'); // 导航
  var mobileMask = $('#mobile-mask'); // 遮罩层

  var navWidth = mobileNav.css('width'); // 导航的宽度
  var windowH = $(window).height(); // 窗口高度

  if (!windowH) {
    console.log('获取高度错失败');
  }

  mobileNav.css('height', windowH + 'px');
  mobileMask.css('height', windowH + 'px');

  mobileNav.on('touchmove', function (e) { // 禁止滚动
                                           // console.log('touchmove事件');
    e.preventDefault()
  });
  mobileBtn.on('touchstart', function () { // 点击按钮出现导航
    mobileNav.css('left', '0px');
    mobileMask.css('display', 'block')
  });
  mobileMask.on('touchstart', function () { // 点击蒙层导航消失
    mobileNav.css('left', '-' + navWidth);
    mobileMask.css('display', 'none')
  });
})
