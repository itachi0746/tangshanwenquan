$(function () {

  /**
   * 改变右侧导航的定位
   * 绝对定位时的高度 = 滚动上去的高度 + fix定位的高度
   */
  function changeRightNav() {
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop; // 滚动高度
      // carouselH = $('.carousel-item img').height(); // 轮播高度
      carouselImg = $('.carousel-item img'); // 轮播高度

    var st = scrollTop; // 滚动高度
    var ch = carouselImg.height(); // 轮播高度
    var navRight = $('.nav-right');
    var absTop = 11/10 * ch; // 绝对定位时的高度
    var limit = 9/10 * ch; // 滚动上去的高度
    var fixTop = absTop - limit; // fix定位的高度
    // debugger
    if (st > limit) {
      navRight.css({'position': 'fixed', 'top': fixTop + 'px'})
    } else {
      navRight.css({'position': 'absolute', 'top': absTop + 'px'})
    }
    navRight.show()
  }
  var t_img; // 定时器
  /**
   * 检测html的fontsize是否已设置, 如果已设置则进行下一步 ,否则递归
   * @param cb 回调函数
   * @returns {boolean}
   */
  function hasSetRem(cb) {
    var theHTML = document.getElementsByTagName('html')[0];
    var theFS = theHTML.style.fontSize;
    if (theFS) {
      clearTimeout(t_img); // 清除定时器
      cb()
      return false
    } else {
      t_img = setTimeout(function() {
        hasSetRem(cb); // 递归扫描
      },300);
    }
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

  }else{
    hasSetRem(changeRightNav)
  }

  $(window).scroll(function(){
    changeRightNav()
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop; // 滚动高度
    var mainHeaderH = $('#main-header').height(), // 中间头部高度
      carouselH = $('#ts03-0').height(), // 轮播高度
      mainItem = $('#ts03-1'),
      mainItemPT = mainItem.css('padding-top'), // 上内边距
      mainItemPB = mainItem.css('padding-bottom'), // 下内边距
      mainItemMB = mainItem.css('margin-bottom'), // 下外边距
      mainItemPTH = eval(mainItemPT.substr(0, mainItemPT.length - 2)),
      mainItemPBH = eval(mainItemPB.substr(0, mainItemPB.length - 2)),
      mainItemMBH = eval(mainItemMB.substr(0, mainItemMB.length - 2)),
      mainItemH = mainItem.height() + mainItemPTH + mainItemPBH + mainItemMBH, // 每个item的高度+内外边距
      liOrange = $('li.orange'); // 导航按钮组

    var theHeight = mainHeaderH + carouselH; // 上方总高度
    var heightDiff = scrollTop - theHeight; // 高度差
    if(heightDiff < 0) {
      for (var i = 0; i < liOrange.length; i++) { // 去掉颜色
        var theLi = liOrange[i];
        $(theLi).removeClass('scroll-mark')
      }
      return
    }
    for (var i = 0; i < liOrange.length; i++) { // 去掉颜色
      var theLi = liOrange[i];
      $(theLi).removeClass('scroll-mark')
    }
    var result = heightDiff / mainItemH; // 高度差除于每个item的高度
    var theIndex = Math.floor(result);
    $(liOrange[theIndex]).addClass('scroll-mark') // 添加颜色

  });

  // window.scrollTo(0,1)

});

