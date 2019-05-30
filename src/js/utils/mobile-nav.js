$(function () {
  var mobileBtn = $('#mobile-btn'); // 头部按钮
  var mobileNav = $('#mobile-nav'); // 导航
  var mobileRightNav = $('#mobile-right-nav'); // 导航
  var mobileMask = $('#mobile-mask'); // 遮罩层
  var mobileRightNavBtn = $('#mobile-right-nav-btn'); // 移动端右侧导航按钮

  var navWidth = mobileNav.width(); // 导航的宽度
  var rightNavWidth = mobileRightNav.width(); // 导航的宽度
  var windowH = $(window).height(); // 窗口高度

  var showRightNav = false; // 右侧导航的显示状态

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

  var bodyEl = document.body;
  var theTop = 0;
  /**
   * 禁止body滚动
   * @param isFixed
   */
  function stopBodyScroll (isFixed) {
    if (isFixed) {
      theTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop; // 滚动高度
      // debugger
      bodyEl.style.top = -theTop + 'px'
      bodyEl.style.position = 'fixed'
    } else {
      bodyEl.style.position = ''
      bodyEl.style.top = ''
      window.scrollTo(0, theTop) // 回到原先的top
    }
  }
  /**
   * 监听手势
   */
  function listenSwipe() {
    // var hammerBody = new Hammer($('body')[0]);
    var hammerCarousel = new Hammer($('#ts03-0')[0]);
    // hammerBody.get('swipe').set({
    //   direction: Hammer.DIRECTION_HORIZONTAL // 水平方向
    // });
    hammerCarousel.get('swipe').set({
      direction: Hammer.DIRECTION_HORIZONTAL // 水平方向
    });
    // hammerBody.on('swiperight', function(ev) { // 关闭右侧导航
    //   // console.log(ev.type);
    //   if (showRightNav) {
    //     stopBodyScroll(false)
    //     showRightNav = false;
    //     mobileRightNav.css('right', '-' + rightNavWidth + 'px');
    //     mobileMask.css('display', 'none')
    //   }
    // });
    hammerCarousel.on('swiperight', function(ev) { // 轮播右滑
      // console.log(ev.type);
      $('.carousel-control-prev').click();
    });
    hammerCarousel.on('swipeleft', function(ev) { // 轮播左滑
      // console.log(ev.type);
      $('.carousel-control-next').click();
    });
  }
  /**
   * 判断是否手机
   * @returns {boolean|Array|{index: number, input: string}}
   */
  function isMobile() {
    var ua = navigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      isAndroid = ua.match(/(Android)\s+([\d.]+)/),
      _isMobile = isIphone || isAndroid;

    return _isMobile
  }
  //判断
  if(isMobile()){
    listenSwipe()
  }else{
  }


  mobileBtn.on('click', function () { // 点击按钮出现导航
    mobileNav.css('left', '0px');
    mobileMask.css('display', 'block')
  });
  mobileMask.on('click', function () { // 点击蒙层导航消失
    if (showRightNav) {
      stopBodyScroll(false)
      showRightNav = false;
      mobileRightNav.css('right', '-' + rightNavWidth + 'px');
    }

    mobileNav.css('left', '-' + navWidth + 'px');
    mobileMask.css('display', 'none')
  });

  mobileRightNavBtn.on('click', function () { // 右侧导航
    stopBodyScroll(true);
    showRightNav = true;
    mobileRightNav.css('right', '0px');
    mobileMask.css('display', 'block')

  });

  /**
   * 右侧导航的点击
   */
  function mobileLiBindClick() {
    var liArr = $('#mobile-right-nav .orange');
    for (let i = 0; i < liArr.length; i++) {
      let theLi = liArr[i];
      $(theLi).on('click', function () {
        mobileRightNav.css('right', '-' + rightNavWidth + 'px');
        mobileMask.css('display', 'none')
        stopBodyScroll(false);
        showRightNav = false

      })
    }
  }
  mobileLiBindClick()
})
