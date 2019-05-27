$(function () {

  /**
   * 改变右侧导航的定位
   */
  function changeRightNav() {
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop; // 滚动高度
      // carouselH = $('.carousel-item img').height(); // 轮播高度
      carouselImg = $('.carousel-item img'); // 轮播高度

    var st = scrollTop; // 滚动高度
    var ch = carouselImg.height(); // 轮播高度
    var navRight = $('.nav-right');
    var initTop = 11/10 * ch; // 初始高度
    var limit = 9/10 * ch; // 滚动上去的 高度 阈值
    var fixTop = initTop - limit; // 相对窗口的高度
    // debugger
    if (st > limit) {
      navRight.css({'position': 'fixed', 'top': fixTop + 'px'})
    } else {
      navRight.css({'position': 'absolute', 'top': initTop + 'px'})
    }
    navRight.css('display', 'block')
  }
  setTimeout(function () {
    changeRightNav();
  }, 300);
  $('.carousel-item img').load(function () {
    changeRightNav();
  });

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
});

