$(function(){
	//懒加载图片
	$("img.lazy").lazyload({
	    effect : 'show',
	    effectArgs: 'slow',
	});
	$('.lazy').trigger('appear');
})
