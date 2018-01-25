$(function () {
    var app = {
        $loading: $('.loading'),
        winHeight: 1000,
        currPage: -1,
        friendView: 0,
        isSmall: false,
        countPage: 0,
        nextPage: false,
        prevPage: false,
        $root: null,
        playAction: [],
        jump: function (page) {
            app.targetY = (-(page) * this.winHeight);
            app.$root.find(".main").css({
                "transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transition-duration": "0ms",
                "transition-duration": "0ms"
            });
        },
        scroll: function (page) {
            app.targetY = (-(page) * this.winHeight);
            app.$root.find(".main").css({
                "transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transition-duration": "500ms",
                "transition-duration": "500ms"
            });
        },
        getPage: function (i) {
            return $page = app.$root.find('[data-pageid="' + i + '"]');
        },
        dialog: {
            /**
             * 警告
             * @param msg 提示内容
             * @param callback 回调函数
             */
            alert: function (msg, callback) {
                var $modal = app.$root.find(".alert-modal");
                if ($modal.length == 0) {
                    $modal = $('<div class="alert-modal"><div class="alert"><div class="text">帐号不能为空</div><div class="btn">确定</div> </div></div>');
                    app.$root.append($modal);
                }
                $modal.show().find(".text").html(msg);
                $modal.find(".btn").off("tap").on("tap", function () {
                    $modal.hide();
                    typeof callback == 'function' && callback();
                });
            }
        },
        audio: {
            inited: false,
            handler: null,//播放器
            init: function (src, autoplay, loop, preload) {
                var audioPlayer = {
                    inited: false,
                    init: function (src, autoplay, loop, preload) {
                        if (src == undefined) {
                            return;
                        }
                        this.handler = new Audio();
                        this.handler.autoplay = !!autoplay;
                        this.handler.loop = !!loop;
                        this.handler.preload = !!preload;
                        this.handler.src = src;
                        this.inited = true;
                        var _this = this;
                        if (this.handler.autoplay && this.handler.loop) {
                            var playListener = function () {
                                _this.handler.play();
                                document.body.removeEventListener('touchstart', playListener, false);
                            };
                            document.body.addEventListener('touchstart', playListener, false);
                            _this.handler.addEventListener('canplay', function () {
                                if (!_this.handler.paused) {
                                    document.body.removeEventListener('touchstart', playListener, false);
                                }
                            }, false);
                            //给audio类添加样式
                            this.handler.addEventListener('play', function () {
                                app.$root.find(".audio").addClass("active");
                            }, false);
                            this.handler.addEventListener('pause', function () {
                                app.$root.find(".audio").removeClass("active");
                            }, false);
                        }
                    },
                    toggle: function () {
                        if (!this.inited) {
                            return;
                        }
                        this.handler.paused ? this.handler.play() : this.handler.pause();
                    },
                    pause: function () {
                        if (!this.inited) {
                            return;
                        }
                        try {
                            this.handler.pause();
                        }
                        catch (e) {
                        }
                    },
                    play: function () {
                        if (!this.inited) {
                            return;
                        }
                        try {
                            this.handler.play();
                        }
                        catch (e) {
                        }
                    },
                    stop: function () {
                        if (!this.inited) {
                            return;
                        }
                        this.handler.pause();
                        try {
                            this.handler.currentTime = 0;
                        }
                        catch (e) {
                        }
                    }
                };
                audioPlayer.init(src, autoplay, loop, preload);
                return audioPlayer;
            }
        },
        play: function (pageId, jump) {
            if (!jump) {
                jump = false;
            }
            //$('.modal').hide();
            var $page = app.getPage(pageId);
            var pageI = $page.index();
            //console.log(pageId);
            if (pageId == this.currPage) {
                app.scroll(pageI);
                return;
            }
            if (!this.playAction[pageId]) {
                return;
            }
            this.cleanAction();
            this.currPage = pageId;
            //window.location.hash = pageId;
            this.playAction[pageId]();
            // window.localStorage.setItem('c', pageId);
            if (jump) {
                app.jump(pageI);
            }
            else {
                app.scroll(pageI);
            }
        }
    };
    app.hideWxMenu = function () {
        app.wxMenu = false;
        app.setWxMenu();
    };
    app.showWxMenu = function () {
        app.wxMenu = true;
        app.setWxMenu();
    };
    app.wxMenu = false;
    app.setWxMenu = function () {
        if (!window.wxReadyed) {
            setTimeout(app.setWxMenu, 200);
            return;
        }
        try {
            if (app.wxMenu) {
                wx.showOptionMenu();
            }
            else {
                wx.hideOptionMenu();
            }
        }
        catch (e) {
        }
    };
    app.mouseEvent = function () {
        var swipeRate = 200;
        //鼠标动作
        var lastTouchY = 0;
        var startTouchY = 0;
        app.targetY = 0;
        var touchStartTime = 0;
        $("[data-action='share']").on("tap", function () {
            Weixin.share();
        });
        $(".share-f ").on("tap", function () {
            $(".share-f ").hide();
        });
        app.$root.find('.main').on('touchstart', function (e) {
            // e.preventDefault();
        });
        $('input, textarea').on('touchstart touchmove touchend', function (e) {
            e.stopPropagation();
        });
    };
    app.modalShow = function (name, hide) {
        $('.modal').show();
        $('.modal > div').hide();
        if (hide) {
            $('.modal .' + name).show();
            $('.' + name).find('.' + hide).hide();
            return;
        }
        $('.modal .' + name).show();
    };
    app.modalHide = function () {
        $('.modal').hide();
    };
    app.resize = function () {
        var winHeight = $(window).height();
        if (winHeight < 700) {
            return;
        }
        app.countPage = app.$root.find('section').length;
        if (winHeight < 900) {
            app.isSmall = true;
            app.winHeight = 900;
        }
        else {
            app.isSmall = false;
            app.winHeight = $(window).height();
        }
        app.$root.find('section').height(app.winHeight);
        app.$root.find('.page-box').height($(window).height());
        app.$root.find('.scroll').height($(window).height());
        app.$root.find('.main').height(app.winHeight * app.countPage);
    };

    app.loadSuccess = function () {
        var p = 'home';
        if (window.loadedImg && window.loadedUser) {
            $('.unload').removeClass('unload');
            this.$loading.hide();
            var p = 'home';
            // if (window.awardType) {
            //     if (window.form && window.form.phone) {
            //         app.play('p8', true);
            //     } else {
            //         app.play('p7', true);
            //     }
            //
            //     return;
            // }
            //默认隐藏
            //app.hideWxMenu();
            // p="p1";
            app.play(p, true);
        }
    };
    app.loadProgress = function (num, total) {
        this.$loading.find('.text').html(parseInt(num / total * 99) + "%");
    };
    app.cleanAction = function () {
        var $page = app.getPage(this.currPage);
        $page.find('.screen > div').each(function () {
            if ($(this).css('display') != 'none' && $(this).hasClass('animated')) {
                $(this).addAni('fadeOut');
            }
        });
        $page.find('.full > div').each(function () {
            if ($(this).css('display') != 'none' && $(this).hasClass('animated')) {
                $(this).addAni('fadeOut');
            }
        });
        $page.find('.scroll .animated').each(function () {
            if ($(this).css('display') != 'none' && $(this).hasClass('animated')) {
                $(this).addAni('fadeOut');
            }
        });
        for (var i in app.pageTimeout) {
            clearTimeout(app.pageTimeout[i]);
        }
    };
    app.pageTimeout = [];
    app.scrollAble = true;
    app.init = function () {
        app.$root = $('.site-home');
        app.resize();
        var images = [
            './public/img/up.png'
        ];
        loadImg(images, function () {
            if (app.currPage == -1) {
                window.loadedImg = true;
                app.resize();
                app.loadSuccess();
            }
        }, function (num, total) {
            app.loadProgress(num, total);
            $('.small').width(505 * num / total);
            $('.load-plane').css({
                'margin-left': (485 * num / total) + 'px'
            });
        });

        app.mouseEvent();
    };
    window.loadedImg = false;
    window.loadedUser = false;

    app.loadUser = function () {
        window.loadedUser = true;
        app.init();
        app.loadSuccess();
        return;
        var ajaxTimeout = $.ajax({
            type: 'GET',
            url: window.apiUrl + "default/user",
            timeout : 8000,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {},
            dataType: 'json',
            success: function (res) {
                if (res.error_code == 0) {
                    window.loadedUser = true;
                    // window.
                    window.subscribe = res.info?res.info.subscribe:false;
                    window.nickname = res.info?(res.info.user?res.info.user.nickname:'南航粉丝'):'南航粉丝';
                    app.init();
                    app.loadSuccess();
                    return;
                } else {
                    if (res.url) {
                        window.location.href = res.url;
                        // setInterval(function () {
                        //     window.location.href = res.url;
                        // }, 2000);
                        return;
                    } else {
                        alert(res.info);
                    }
                    window.loadedUser = false;
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeout.abort();
                    window.loadedUser = true;
                    app.init();
                    app.loadSuccess();
                }
            },
            error:function(){
                ajaxTimeout.abort();
                window.loadedUser = true;
                app.init();
                app.loadSuccess();
            }
        });

    };
    app.loadUser();
    window.app = app;
    /**---------您的代码--------**/
    window.click = true;
    var game = {
        init:function(){
            $('.page-0').find('button').off('touchstart').on('touchstart',function(){
                var img = $('img')[0];
                var text = $('textarea').val().toLocaleUpperCase();
                var c = document.getElementById('canvas')
                var ctx = c.getContext('2d')
                ctx.clearRect(0, 0, 480, 480)
                ctx.font = "24px Arial";
                ctx.fillStyle="#f00";
                // ctx.fillText('1223',50,50);
                var nextX = 30;
                var nextY = 50;
                for(var i=0;i<text.length;i++){
                    try {
                        thisStr = text[i];
                        if(text[i].charCodeAt()<1000){
                            //假设为标点符号，或者其他符号类型，统一转成是空格
                            var thisStr = '';
                            if( (text[i].charCodeAt()>=97&&text[i].charCodeAt()<=122) ||//小写字母
                                (text[i].charCodeAt()>=65&&text[i].charCodeAt()<=90) ||//大写字母
                                (text[i].charCodeAt()>=48&&text[i].charCodeAt()<=57)){//数字
                                thisStr = text[i];
                            }else{
                                thisStr = ' ';
                            }
                        }
                        ctx.fillText(thisStr,nextX,nextY);
                        if(Math.random()*10>4){
                            ctx.drawImage(img,nextX-5,nextY-25,40,40);
                        }

                        nextX += 40;
                        if(nextX>=430){
                            nextX = 30;
                            nextY += 50;
                        }
                    }catch (e){//捕获到错误，那么text[i]就是' '
                        text[i] = ''
                    }
                }

                // var n = Math.random()*10;
                // ctx.fillRect(n*32-6,25,20,32);
            });
            window.click = true;
        }
    };
    window.game = game;

    app.playAction['home'] = function () {
        app.scrollAble = true;
        app.nextPage = false;
        app.prevPage = false;
        var $page = $('.page-0');
        $(".up-btn").hide();
        $page.find('*').show();
        if (!window.page0) {
            window.page0 = true;
            game.init();
            $page.find('.p0-hand').on('tap',function(){
                app.play('p1',true);
                app.log('首页','点击打开按钮');
            })
        }
    };
    /**---------百度统计--------**/
    app.log = function (page, action) {
        console.info([page, action]);
        if(window._hmt){
            window._hmt.push(['_trackEvent', page, action]);
        }
    };
    /**---------您的代码--------**/
    app.bgMuisc = app.audio.init(window.bgm, true, true, true);
    document.addEventListener("WeixinJSBridgeReady", function () {
        console.log('WeixinJSBridgeReady');
        app.bgMuisc.play();
    }, false);
    $(".audio").on("touchstart", function (e) {
        e.preventDefault();
        app.bgMuisc.toggle();
    });
});
$.fn.addAni = function (className, delay, duration, callback) {
    if ($(this).length > 1) {
        $(this).each(function () {
            $(this).addAni(className, delay, duration, callback);
        });
        return;
    }
    delay = delay || 0;
    duration = duration ? duration : 0;
    var _this = $(this);
    var currAni = _this.data('curr-ani');
    if (currAni) {
        _this.removeClass(currAni);
    }
    _this.attr('style', '');
    if (delay) {
        _this.css({
            'animation-delay': delay + 's!important',
            '-webkit-animation-delay': delay + 's!important'
        });
    }
    if (duration) {
        className += " ani-duration-" + duration + "s";
    }
    _this.addClass('animated ' + className).show();
    _this.data('curr-ani', 'animated ' + className);
    setTimeout(function () {
        callback && callback();
    }, 1000 * (duration + delay));
};
var Weixin = {};
Weixin.config = {
    template: function (src) {
        return '<img style="position:absolute; right:60px; padding-top: 30px;vertical-align: bottom;" src="' + this.popupImg + '" />';
    },
    popupImg: './public/img/share-modal1.png'
};
Weixin.share = function (callback, keep) {
    if (!document.getElementById('weixinShare')) {
        //分享浮层
        var markelem = document.createElement('div');
        markelem.id = 'weixinShare';
        var styles = {
            position: 'fixed',
            zIndex: 999999,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
        };
        for (var name in styles) {
            if (styles.hasOwnProperty(name)) {
                markelem.style[name] = styles[name];
            }
        }
        markelem.innerHTML = Weixin.config.template();
        document.body.appendChild(markelem);
        $('#weixinShare').on('tap', function (e) {
            $(this).remove();
        });
    }
};
if (typeof define == 'function') {
    define('weixin', Weixin);
}
else if (typeof module != 'undefined' && module.exports) {
    module.exports = Weixin;
}
else {
    window.Weixin = Weixin;
}