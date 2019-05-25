$(window).scroll(function(){
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