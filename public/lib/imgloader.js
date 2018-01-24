function loadImg (imgUrl,loadComplete, loadProgress){
	var len = imgUrl.length;
	var num = 0;
	var timeout = 0;
	var complete = false;
	var checkLoad = function(){
		clearTimeout(timeout);
		if(complete) return;
		timeout = setTimeout(function(){
			complete = true;
			loadComplete();
		}, 10 * 1000);
		num++;
		loadProgress(num, len);
		if( num == len ){
			if(complete) return;
			loadComplete();
		}
	};
	var checkImg = function(url){
		var val= url;
		var img=new Image();
		if(img.readyState){
			img.onreadystatechange = function(){
				if(img.readyState=="complete"||img.readyState=="loaded"){
					checkLoad();
				}
			}
		}else{
			img.onload=function(){
				if(img.complete==true){
					checkLoad();
				}
			}
		}
		img.src=val;
	};
	for( var i = 0; i < len; i++ ){
		checkImg(imgUrl[i]);
	}
	complete = false;
}