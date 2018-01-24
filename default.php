<!doctype html>
<?php
include_once('const.php');
$debug = !empty($_GET['test']);
$scriptName = basename($_SERVER['SCRIPT_FILENAME']);
$pos = strpos($_SERVER['PHP_SELF'], '/' . $scriptName);
$baseUrl = 'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['SCRIPT_NAME'], 0, $pos) . '/';
$apiUrl = '//api.cloud.m0.hk/csairjjh/';
if (!empty($debug)) {
        $apiUrl = 'http://zhou-api.cloud.m0.hk/csairjjh/';
}
?>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="renderer" content="webkit">
    <meta name="format-detection" content="telephone=no"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
    <meta id="viewport" name="viewport" content="width=640px, user-scalable=no"/>
    <link rel="shortcut icon" type="image/x-icon"
          href="https://res.wx.qq.com/payactres/zh_CN/htmledition/images/favicon1d7e6c.ico"/>

    <?php if ($debug): ?>
        <script>
            window.debug = 1;
        </script>
        <script type="text/javascript" src="./public/lib/underscore-min.js"></script>
        <script type="text/javascript" src="./public/lib/imgloader.js"></script>
        <script type="text/javascript" src="./public/lib/adaptUILayout.js"></script>
        <script type="text/javascript" src="./public/lib/zepto.min.js"></script>
        <script type="text/javascript" src="./public/lib/touch.js"></script>
        <script type="text/javascript" src="./public/lib/music.js"></script>
        <script type="text/javascript" src="./public/js/main.js"></script>
        <link rel="stylesheet" type="text/css" href="./public/css/style.css"/>
    <?php else: ?>
        <script type="text/javascript" src="./public/build/main.<?php echo MAIN_VERSION; ?>.js"></script>
        <link rel="stylesheet" type="text/css" href="./public/build/style.<?php echo MAIN_VERSION; ?>.css"/>
    <?php endif; ?>
    <script type="text/javascript">
        adaptUILayout.load(640);
        window.apiUrl = '<?php echo $apiUrl; ?>';
    </script>
    <title>test</title>
</head>
<body>
<div class="loading">
    <div class="loading-cloud1"></div>
    <div class="loading-cloud2"></div>
    <div class="loading-font"></div>
    <div class="loading-head"></div>
    <div class="text">0%</div>
</div>
<div class="site-home site-common unload">
    <div class="container">
        <div class="audio"></div>
        <div class="page-box">
            <div class="main">
                <section class="page-0" data-pageid="home">
                    <div class="screen screen-top">
                        <div class="top">
                            <textarea name="" id="" cols="30" rows="10" maxlength="30"></textarea>
                            <button>提交</button>
                        </div>
                        <canvas width="480px" height="480px" id="canvas"></canvas>
                    </div>
                </section>
            </div>

        </div>

    </div>
</div>

<div class="share-f" data-sharef="">
    <div class="share-icon">
    </div>
</div>
<div class="modal">
    <div class="game-result">
        <div class="font"></div>
        <div class="result"></div>
        <div class="next"></div>
    </div>
</div>
</body>
</html>