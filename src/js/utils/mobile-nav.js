// $.fn.scrollUnique = function() {
//   return $(this).each(function() {
//     var eventType = 'mousewheel';
//     // 火狐是DOMMouseScroll事件
//     // if (document.mozHidden !== undefined) {
//     //   eventType = 'DOMMouseScroll';
//     // }
//     $(this).on(eventType, function(event) {
//       // 一些数据
//       var scrollTop = this.scrollTop,
//         scrollHeight = this.scrollHeight,
//         height = this.clientHeight;
//
//       var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);
//
//       if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
//         // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
//         this.scrollTop = delta > 0? 0: scrollHeight;
//         // 向上滚 || 向下滚
//         event.preventDefault();
//       }
//     });
//   });
// };

$(function () {
  var mobileBtn = $('#mobile-btn'); // 头部按钮
  var mobileNav = $('#mobile-nav'); // 导航
  var mobileRightNav = $('#mobile-right-nav'); // 导航
  var mobileMask = $('#mobile-mask'); // 遮罩层
  var mobileRightNavBtn = $('#mobile-right-nav-btn'); // 移动端右侧导航按钮

  var navWidth = mobileNav.width(); // 导航的宽度
  var rightNavWidth = mobileRightNav.width(); // 导航的宽度
  var windowH = $(window).height(); // 窗口高度

  if (!windowH) {
    console.log('获取高度错失败');
  }

  mobileNav.css('height', windowH + 'px');
  mobileRightNav.css('height', windowH + 'px');
  mobileMask.css('height', windowH + 'px');
  mobileRightNavBtn.css('top', windowH / 2 + 'px');

  mobileNav.on('touchmove', function (e) { // 禁止滚动
                                           // console.log('touchmove事件');
    e.preventDefault()
  });

  var bodyEl = document.body
  var top = 0

  function stopBodyScroll (isFixed) {
    if (isFixed) {
      top = window.scrollY
      bodyEl.style.top = -top + 'px'
      bodyEl.style.position = 'fixed'
    } else {
      bodyEl.style.position = ''
      bodyEl.style.top = ''

      window.scrollTo(0, top) // 回到原先的top
    }
  }
  mobileRightNav.on('touchmove', function (e) { // 禁止滚动

  });
  // mobileRightNav.scrollUnique();

  mobileBtn.on('click', function () { // 点击按钮出现导航
    mobileNav.css('left', '0px');
    mobileMask.css('display', 'block')
  });
  mobileMask.on('click', function () { // 点击蒙层导航消失
    mobileNav.css('left', '-' + navWidth + 'px');
    mobileRightNav.css('right', '-' + rightNavWidth + 'px');
    mobileMask.css('display', 'none')
  });

  mobileRightNavBtn.on('click', function () { // 点击按钮出现导航
    mobileRightNav.css('right', '0px');
    mobileMask.css('display', 'block')
  });
  // mobileMask.on('touchstart', function () { // 点击蒙层导航消失
  //   mobileRightNav.css('right', '-' + rightNavWidth);
  //   mobileMask.css('display', 'none')
  // });
  function mobileLiBindClick() {
    var liArr = $('#mobile-right-nav .orange');
    for (let i = 0; i < liArr.length; i++) {
      let theLi = liArr[i];
      $(theLi).on('click', function () {
        mobileRightNav.css('right', '-' + rightNavWidth + 'px');
        mobileMask.css('display', 'none')
      })
    }
  }
  mobileLiBindClick()
})
