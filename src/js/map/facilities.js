var KaiCommon = function(){
	this.mapDefW = 3060;
	this.mapIconData = [
		{id:"tsugaru",x:2083,y:1077},
		{id:"nikko",x:1740,y:1805},
		{id:"kinugawa",x:1800,y:1790},
		{id:"kawaji",x:1795,y:1760},
		{id:"anjin",x:1600,y:2160},
		{id:"ito",x:1590,y:2169},
		{id:"atami",x:1610,y:2110},
		{id:"hakone",x:1610,y:2085},
		{id:"sengokuhara",x:1580,y:2085},
		{id:"enshu",x:1371,y:2154},
		{id:"alps",x:1475,y:1799},
		{id:"matsumoto",x:1493,y:1857},
		{id:"kaga",x:1237,y:1783},
		{id:"izumo",x:671,y:1849},
		{id:"aso",x:258,y:2235}
	];
}
var kaiCommon = new KaiCommon();

var KaiSogoFacilities = function(){
	this.sw;
	this.sh;
	this.scw = 0;
	this.mw = 1280;
	this.cw = 960;
	this.isPC = true;
	this.pinZindexCnt = 10000;
	this.winScale = 1;
	this.mapScale = 1;
	this.isZoom = false;
	this.isBalloon = false;
	this.zoomPointY = 0;
	this.zoomPointX = 0;
}

KaiSogoFacilities.prototype = {
	init:function(){
		var scope = this;
		
		$(document).on('click','#facilities #overview .pc.sc ul li',function(){
			var index = $('#facilities #overview .pc.sc ul li').index(this);
			//alert($(this).html());
			scope.setBalloon(index,'list');
		});
		
		$(document).on('click','#facilities #overview .sp.sc ul li',function(){
			var index = $('#facilities #overview .sp.sc ul li').index(this);
			scope.setBalloon(index,'list');
		});
		
		$(document).on('mouseenter','#facilities #overview .map ul li',function(){
			scope.pinLoopAnime($(this).find('.pin img'));
			if(!scope.isBalloon){
				$(this).css({
					zIndex: scope.pinZindexCnt
				});
				scope.pinZindexCnt++;
			}
		});
		
		$(document).on('mouseleave','#facilities #overview .map ul li',function(){
			TweenMax.killTweensOf( $(this).find('.pin img') );
			TweenMax.to( $(this).find('.pin img') , 0.25, {
				marginTop: 0,
				ease: Expo.easeIn,
				delay: 0
			});
		});
		
		$(document).on('click','#facilities #overview .map ul li',function(){
			var index = $('#facilities #overview .map ul li').index(this);
			scope.setBalloon(index,'pin');
		});
		
		var isMapDown = false;
		var isMapDrag = false;
		var isMapDragComplete = false;
		var startDragX = 0;//map left
		var startDragY = 0;//map left
		var startMapX = 0;//map left
		var startMapY = 0;//map top
		$('#facilities #overview .map').mousedown(function(e){
			e.preventDefault();
			if(scope.isZoom){
				isMapDown = true;
				startDragX = e.clientX;
				startDragY = e.clientY;
				startMapX = Number($(this).css('left').replace('px',''));
				startMapY = Number($(this).css('top').replace('px',''));
			}
		});
		$('#facilities #overview .map').mouseup(function(e){
			e.preventDefault();
			isMapDown = false;
			isMapDrag = false;
			if(Math.abs(startDragX-e.clientX) > 10 || Math.abs(startDragY-e.clientY) > 10){
				isMapDragComplete = true;
			}else{
				isMapDragComplete = false;
			}
			startDragX = 0;
			startDragY = 0;
			startMapX = 0;
			startMapY = 0;
			$(this).css({cursor:'auto'});
		});
		$('#facilities #overview .map').mouseout(function(e){
			e.preventDefault();
			isMapDown = false;
			isMapDrag = false;
			startDragX = 0;
			startDragY = 0;
			startMapX = 0;
			startMapY = 0;
			$(this).css({cursor:'auto'});
		});
		$('#facilities #overview .map').mousemove(function(e){
			e.preventDefault();
			if(isMapDown && !isMapDrag){
				isMapDrag = true;
				$(this).css({cursor:'move'});
			}
			if(isMapDrag){
				scope.zoomPointY = startMapY+(e.clientY-startDragY);
				scope.zoomPointX = startMapX+(e.clientX-startDragX);
				$(this).css({
					top: scope.zoomPointY+'px',
					left: scope.zoomPointX+'px'
				});
			}
		});
		$('#facilities #overview .map-wrapper .overlay').click(function(){
			if(!isMapDragComplete){
				$('#facilities #overview .pc.sc ul li').removeClass('current');
				$('#facilities #overview .sp.sc ul li').removeClass('current');
				TweenMax.killTweensOf( $('#facilities #overview .map ul li .balloon') );
				TweenMax.to( $('#facilities #overview .map ul li .balloon') , 0.5, {
					scale: 0,
					transformOrigin: '47.75% 92%',
					display: 'none',
					ease: Expo.easeOut,
					delay: 0
				});
				TweenMax.killTweensOf( $('#facilities #overview .map ul li .pin') );
				TweenMax.to( $('#facilities #overview .map ul li .pin') , 0.5, {
					scale: 1,
					//transformOrigin: '47.75% 92%',
					display: 'block',
					ease: Expo.easeOut,
					delay: 0,
				});
			}
			scope.isBalloon = false;
		});
		
		$('#facilities .btn-back').click(function(){
			scope.resetBalloon();
		});
		
		this.windowResize();
		$(window).resize(function(){scope.windowResize();});
		if('ontouchstart' in window) {
			$(window).bind('touchmove', function(){scope.windowScroll();} );
		}else{
			//$(window).scroll(function(){scope.windowScroll();});
		}
		$(window).scroll(function(){scope.windowScroll();});
		
		this.getModalJson();
	},
	getModalJson:function(){
		var scope = this;
		scope.windowResize();
		scope.setIntro();
		/*$.ajax({
			type: 'GET',
			url: '/assets/custom_files/json/common/modal.json',
			dataType: 'json',
			success: function(json){
				for(key in json){
					var iLen = kaiCommon.mapIconData.length;
					for(var i=0;i<iLen;i++){
						if(key == kaiCommon.mapIconData[i].id) break;
					}
					var liHtml = '';
					liHtml += '<li id="pin-'+key+'">';
					liHtml += '<i class="pin"><img src="../assets/custom_files/img/facilities/pin_'+key+'.png" alt="'+json[key].name+'"></i>';
					liHtml += '<div class="balloon">';
					liHtml += '<div class="banner">';
					liHtml += '<div class="image" style="background-image:url(\''+json[key].box_img+'\')"></div>';
					liHtml += '<img src="../assets/custom_files/img/facilities/logo_'+key+'.png" alt="'+json[key].name+'" class="logo">';
					liHtml += '<p class="place">'+json[key].place+'</p>';
					liHtml += '<img src="../assets/custom_files/img/common/link_arrow_l_w.png" alt="" class="arrow">';
					liHtml += '<a href="/'+key+'/"></a>';
					liHtml += '</div>';
					liHtml += '<p class="body">'+json[key].caption+'</p>';
					liHtml += '</div>';
					liHtml += '</li>';
					var $liHtml = $(liHtml);
					$liHtml.css({
						zIndex: kaiCommon.mapIconData[i].y
					});
					$('#facilities #overview .map ul').append($liHtml);
					
					liHtml = '';
					liHtml += '<li id="list-'+key+'-pc" class="cf">';
					liHtml += '<div class="image" style="background-image:url(\''+json[key].icon_img+'\')"></div>';
					liHtml += '<p class="name">'+json[key].name+'</p>';
					liHtml += '<p class="place">'+json[key].place+'</p>';
					liHtml += '</li>';
					$liHtml = $(liHtml);
					$('#facilities #overview .pc.sc ul').append($liHtml);
					
					liHtml = '';
					liHtml += '<li id="list-'+key+'-sp" class="cf">';
					liHtml += '<div class="image" style="background-image:url(\''+json[key].icon_img+'\')"></div>';
					liHtml += '<p class="name">'+json[key].name+'</p>';
					liHtml += '</li>';
					$liHtml = $(liHtml);
					$('#facilities #overview .sp.sc ul').append($liHtml);
				}
				
				$('#facilities #overview .sp.sc ul').css({width: Object.keys(json).length*93+15+28+'px'});
				scope.windowResize();
				scope.setIntro();
			}
		});*/
	},
	setIntro:function(){
		 var scope = this;
		 
		 TweenMax.to( $('#facilities .map') , 1, {
			opacity: 1.0,
			display: 'block',
			ease: Linear.easeNone,
			delay: 0.0
		});
		$('#facilities .map li').each(function(i){
			TweenMax.to( $(this) , 0.5, {
				marginTop: 0,
				opacity: 1.0,
				display: 'block',
				ease: Quad.easeOut,
				delay: 0.5+0.1*i
			});
		});
		
		$('#facilities #overview .pc.sc').mCustomScrollbar({
			autoHideScrollbar: true,
			theme: 'dark-2',
			advanced:{
				updateOnContentResize: true
			}
		});
		
		$('#facilities #overview .sp.sc').mCustomScrollbar({
			autoHideScrollbar: true,
			horizontalScroll:true,
			theme: 'dark-2',
			advanced:{
				updateOnContentResize: true
			}
		});
		
		$('#facilities #overview .pc.sc ul').css({
			opacity: 0
		});
		
		$('#facilities #overview .sp.sc ul').css({
			opacity: 0
		});
		
		TweenMax.to( $('#facilities #overview .pc.sc ul') , 0.25, {
			opacity: 1,
			ease: Linear.easeNone,
			delay: 0.0
		});
		
		TweenMax.to( $('#facilities #overview .sp.sc ul') , 0.25, {
			opacity: 1,
			ease: Linear.easeNone,
			delay: 0.0
		});
		
		//定时x秒后随机弹出一个景点
		TweenMax.to( $('#facilities #overview') , 0.25, {
			ease: Linear.easeNone,
			delay: 0.0,
			onComplete: function(){				
				$('#facilities #overview .map, #facilities #overview .pc.sc,#facilities #overview .sp.sc').css({
					'pointer-events': 'auto'
				});
				var index = Math.floor(Math.random()*$('#facilities #overview .pc.sc ul li').length);
				scope.setBalloon(index,'map');
			}
		});

	},
	setBalloon:function(index,type){
		var scope =this;
		var i = index;
		
		$('#facilities .breadcrumb-list').hide();
		$('#facilities .btn-back').show();
		
		$('#facilities #overview .pc.sc ul li').removeClass('current');
		$('#facilities #overview .pc.sc ul li').eq(i).addClass('current');
		$('#facilities #overview .sp.sc ul li').removeClass('current');
		$('#facilities #overview .sp.sc ul li').eq(i).addClass('current');
		
		$('#facilities #overview .sp.sc ul li').each(function(){
			$(this).find('.image').css('background-image', $(this).find('.image').css('background-image').replace('thumb_circle_2_on.png','thumb_circle_2.png'));
		});
		$('#facilities #overview .sp.sc ul li').eq(i).find('.image').css('background-image',$('#facilities #overview .sp.sc ul li').eq(i).find('.image').css('background-image').replace('thumb_circle_2.png','thumb_circle_2_on.png'));
		
		TweenMax.killTweensOf( $('#facilities #overview .map ul li .balloon') );
		
		TweenMax.to( $('#facilities #overview .map ul li .balloon') , 0.5, {
			scale: 0,
			transformOrigin: '47.75% 92%',
			display: 'none',
			ease: Expo.easeOut,
			delay: 0
		});
		
		TweenMax.killTweensOf( $('#facilities #overview .map ul li .pin') );
		TweenMax.to( $('#facilities #overview .map ul li .pin') , 0.5, {
			scale: 1,
			//transformOrigin: '47.75% 92%',
			display: 'block',
			ease: Expo.easeOut,
			delay: 0
		});
		
		TweenMax.killTweensOf( $('#facilities #overview .map ul li').eq(i).find('.balloon') );
		TweenMax.to( $('#facilities #overview .map ul li').eq(i).find('.balloon') , 0, {
			scale: 2,
			transformOrigin: '47.75% 92%',
			display: 'block',
			ease: Linear.easeNone,
			delay: 0
		});
		
		TweenMax.to( $('#facilities #overview .map ul li').eq(i).find('.balloon') , 0.5, {
			scale: 1,
			transformOrigin: '47.75% 92%',
			display: 'block',
			ease: Expo.easeOut,
			delay: 0
		});
		
		TweenMax.killTweensOf( $('#facilities #overview .map ul li').eq(i).find('.pin') );
		TweenMax.to( $('#facilities #overview .map ul li').eq(i).find('.pin') , 0.5, {
			scale: 0,//放大倍数
			//transformOrigin: '47.75% 92%',
			display: 'none',
			ease: Expo.easeOut,
			delay: 0
		});
		
		$('#facilities #overview .map ul li').eq(i).css({
			zIndex: this.pinZindexCnt
		});
		
		if(this.isPC){
			this.mapScale = this.winScale*1523/kaiCommon.mapDefW;
			this.zoomPointY = Math.ceil(this.winScale*1308*0.5-kaiCommon.mapIconData[i].y*this.mapScale+125);
			this.zoomPointX = Math.ceil(this.winScale*1523*0.5-kaiCommon.mapIconData[i].x*this.mapScale);
			TweenMax.killTweensOf( $('#facilities #overview .map') );
			TweenMax.to( $('#facilities #overview .map') , 1, {
				width: Math.ceil(this.winScale*1523)+'px',
				height: Math.ceil(this.winScale*1308)+'px',
				margin: Math.ceil(this.winScale*-654)+'px 0 0 '+Math.ceil(this.winScale*-761)+'px',
				top: this.zoomPointY,
				left: this.zoomPointX,
				ease: Expo.easeOut,
				delay: 0
			});
		}else{
			this.mapScale = 762/kaiCommon.mapDefW;
			this.zoomPointY = Math.ceil(654*0.5-kaiCommon.mapIconData[i].y*this.mapScale+125);
			this.zoomPointX = Math.ceil(762*0.5-kaiCommon.mapIconData[i].x*this.mapScale);
			TweenMax.killTweensOf( $('#facilities #overview .map') );
			TweenMax.to( $('#facilities #overview .map') , 1, {
				width: '762px',
				height: '654px',
				margin: '-327px 0 0 -381px',
				top: this.zoomPointY,
				left: this.zoomPointX,
				ease: Expo.easeOut,
				delay: 0
			});
		}
		
		var temp=this.winScale;
		$('#facilities #overview .map ul li').each(function(i){
			var key = $(this).attr('id').replace('pin-','');
			var jLen = kaiCommon.mapIconData.length;
			for(var j=0;j<jLen;j++){
				//console.log(key);
				if(key == kaiCommon.mapIconData[j].id) break;
			}
			console.log(key+":"+temp+"======");
			//console.log($(this).html());
			TweenMax.to( $(this) , 1, {
				top: Math.ceil(kaiCommon.mapIconData[j].y*scope.mapScale)+'px',
				left: Math.ceil(kaiCommon.mapIconData[j].x*scope.mapScale)+'px',
				ease: Expo.easeOut,
				delay: 0
			});
			
			
		});
		
		//将拼pin1图片等比例放缩
		TweenMax.to( $('#facilities #overview .map ul li .pin1') , 0.5, {
			scale: temp*0.8,
			//transformOrigin: '47.75% 92%',
			display: 'block',
			ease: Expo.easeOut,
			delay: 0
		});
		
		if(type != 'list') {
			var scdy = 80*i+80-$('#facilities #overview .inner').height()*0.5;
			if(scdy < 0) scdy = 0;
			$('#facilities #overview .pc.sc').mCustomScrollbar('scrollTo', scdy, {scrollInertia: 750,scrollEasing:'easeOut'});
			
			var scdx = 93*i+28+40-$('#facilities #overview .inner').width()*0.5;
			if(scdx < 0) scdx = 0;
			$('#facilities #overview .sp.sc').mCustomScrollbar('scrollTo', scdx, {scrollInertia: 750,scrollEasing:'easeOut'});
			
		}
		
		this.pinZindexCnt++;
		this.isZoom = true;
		this.isBalloon = true;
	},
	resetBalloon:function(){
		var scope =this;
		
		$('#facilities .breadcrumb-list').show();
		$('#facilities .btn-back').hide();
		
		$('#facilities #overview .pc.sc ul li').removeClass('current');
		$('#facilities #overview .sp.sc ul li').removeClass('current');
		
		TweenMax.killTweensOf( $('#facilities #overview .map ul li .balloon') );
		TweenMax.to( $('#facilities #overview .map ul li .balloon') , 0.5, {
			scale: 0,
			transformOrigin: '47.75% 92%',
			display: 'none',
			ease: Expo.easeOut,
			delay: 0
		});
		
		TweenMax.killTweensOf( $('#facilities #overview .map ul li .pin') );
		TweenMax.to( $('#facilities #overview .map ul li .pin') , 0.5, {
			scale: 1,
			//transformOrigin: '47.75% 92%',
			display: 'block',
			ease: Expo.easeOut,
			delay: 0
		});
		
		this.zoomPointY = 0;
		this.zoomPointX = 0;
		
		if(this.isPC){
			this.mapScale = this.winScale*652/kaiCommon.mapDefW;
			TweenMax.killTweensOf( $('#facilities #overview .map') );
			TweenMax.to( $('#facilities #overview .map') , 1, {
				width: Math.ceil(this.winScale*652)+'px',
				height: Math.ceil(this.winScale*560)+'px',
				margin: Math.ceil(this.winScale*-280)+'px 0 0 '+Math.ceil(this.winScale*-326)+'px',
				top: 0,
				left: 0,
				ease: Expo.easeOut,
				delay: 0
			});
		}else{
			this.mapScale = 325/kaiCommon.mapDefW;
			TweenMax.killTweensOf( $('#facilities #overview .map') );
			TweenMax.to( $('#facilities #overview .map') , 1, {
				width: '325px',
				height: '280px',
				margin: '-140px 0 0 -162px',
				top: 0,
				left: 0,
				ease: Expo.easeOut,
				delay: 0
			});
		}
		
		$('#facilities #overview .map ul li').each(function(i){
			var key = $(this).attr('id').replace('pin-','');
			var jLen = kaiCommon.mapIconData.length;
			for(var j=0;j<jLen;j++){
				if(key == kaiCommon.mapIconData[j].id) break;
			}
			TweenMax.to( $(this) , 1, {
				top: Math.ceil(kaiCommon.mapIconData[j].y*scope.mapScale)+'px',
				left: Math.ceil(kaiCommon.mapIconData[j].x*scope.mapScale)+'px',
				ease: Expo.easeOut,
				delay: 0
			});
		});
		
		this.isZoom = false;
		this.isBalloon = false;
	},
	pinLoopAnime:function($pinIMG){
		var scope = this;
		TweenMax.to( $pinIMG , 0.5, {
			marginTop: '-10px',
			ease: Expo.easeOut,
			delay: 0
		});
		TweenMax.to( $pinIMG , 0.5, {
			marginTop: 0,
			ease: Expo.easeIn,
			delay: 0.25,
			onComplete:function(){
				scope.pinLoopAnime($pinIMG);
			}
		});
	},
	windowResize:function(){
		var scope = this;
		
		//this.sw = document.documentElement.clientWidth;
		//this.sh = document.documentElement.clientHeight;
		this.sw = window.innerWidth;
		this.sh = window.innerHeight;
		if(this.sw == undefined || this.sh == undefined){
			this.sw = $(window).width();
			this.sh = $(window).height();
		}
		
		if(window.innerWidth){
			this.scw = window.innerWidth - this.sw;
		}
		console.log(this.sw);
		console.log(this.scw);
		console.log(this.mw);
		this.winScale = this.sw/this.mw;
		if(this.sw+this.scw >= this.cw){
			$('#facilities #overview').css({
				height: Math.floor(this.sw/16*9)+'px'
			});

			if(!this.isZoom) {
				$('#facilities #overview .map').css({
					width: Math.ceil(this.winScale*652)+'px',
					height: Math.ceil(this.winScale*560)+'px',
					margin: Math.ceil(this.winScale*-280)+'px 0 0 '+Math.ceil(this.winScale*-326)+'px',
					top: 0,
					left: 0
				}); 
				
				this.mapScale = this.winScale*652/kaiCommon.mapDefW;
			}else{
				$('#facilities #overview .map').css({
					width: Math.ceil(this.winScale*1523)+'px',
					height: Math.ceil(this.winScale*1308)+'px',
					margin: Math.ceil(this.winScale*-654)+'px 0 0 '+Math.ceil(this.winScale*-761)+'px',
					top: this.zoomPointY,
					left: this.zoomPointX
				});
				this.mapScale = this.winScale*1523/kaiCommon.mapDefW;
				
				console.log("this.winScale:"+this.winScale);
				//将拼pin1图片等比例放缩
				TweenMax.to( $('#facilities #overview .map ul li .pin1') , 0.5, {
					scale: this.winScale,
					//transformOrigin: '47.75% 92%',
					display: 'block',
					ease: Expo.easeOut,
					delay: 0
				});
			}
				
			if(!this.isPC) {
				
				this.isPC = true;
			}
		}else{
			$('#facilities #overview').css({
				height: '667px'
			});
			if(!this.isZoom) {
				$('#facilities #overview .map').css({
					width: '325px',
					height: '280px',
					margin: '-140px 0 0 -162px',
					top: 0,
					left: 0
				});
				this.mapScale = 325/kaiCommon.mapDefW;
			}else{
				$('#facilities #overview .map').css({
					width: '762px',
					height: '654px',
					margin: '-327px 0 0 -381px',
					top: this.zoomPointY,
					left: this.zoomPointX
				});
				this.mapScale = 762/kaiCommon.mapDefW;
			}
			if(this.isPC) {
				
				this.isPC = false;
			}
		}
		
		$('#facilities #overview .map ul li').each(function(i){
			var key = $(this).attr('id').replace('pin-','');
			var jLen = kaiCommon.mapIconData.length;
			for(var j=0;j<jLen;j++){
				if(key == kaiCommon.mapIconData[j].id) break;
			}
			$(this).css({
				top: Math.ceil(kaiCommon.mapIconData[j].y*scope.mapScale)+'px',
				left: Math.ceil(kaiCommon.mapIconData[j].x*scope.mapScale)+'px'
			});
		});
		
		this.windowScroll();
	},
	windowScroll:function(){
		var scope = this;
		this.scx= $(window).scrollLeft();
		this.scy = $(window).scrollTop();
		
		if( this.scy > 0 ){
			
		}
	}
}

var kaiSogoFacilities = new KaiSogoFacilities();

$(function(){
	kaiSogoFacilities.init();
});

//window.onload = function(){
	//kaiSogoFacilities.init();
//}