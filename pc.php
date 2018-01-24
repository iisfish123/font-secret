<!doctype html>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
    <title></title>
</head>
<style type="text/css">
	html{
		width: 100%;
		height: 100%;
		text-align: center;
	}
	body{
		width: 100%;
		height: 100%;
		min-height: 700px;
	}
	.tips{
		width: 759px;
		height: 100%;
		margin: 0 auto;
	}
    .qrcode{
        position: absolute;
        width: 800px;
        height: 400px;
        left: 50%;
        top: 50%;
        margin-top: -200px;
        margin-left: -400px;
        text-align: center;

    }
    .qrcode img{
        width: 240px;

    }
</style>
<body>
<div class="qrcode">
    <img src="http://s.jiathis.com/qrcode.php?url=<?php echo urlencode('http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']); ?>" alt=""/>
    <p>马上扫一扫 瞬间呈现精彩</p>
</div>
<div class="tips"></div>
<script>
    var _hmt = _hmt || [];
    (function () {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?82f759f92702ef576a004ad8be7132df";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
</script>
</body>
</html>