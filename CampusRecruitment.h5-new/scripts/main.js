"use strict";

var movieResource = [];
var movieObj = {};
var loadingIndex = 0;
var currentVideo = null;
var initManVideo = null;
var initFamaleVideo = null;
var selectOrder = 0;
var startVideoTime = 0;
var stopVideoTime = 0;
var nextPart = 0;

var ua = navigator.userAgent;
var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端


function initCanvasPlayer(gender, selector) {

    var options = {
        videoSelector: "." + selector,
        autoplay: false,
        width: 400,
        height: 300,
        canvasSelector: "." + selector.replace("video", "canvas"),
        loop: false
    };

    if (gender == "male") {
        initManVideo = new CanvasVideoPlayer(options);
    } else {
        initFamaleVideo = new CanvasVideoPlayer(options);
    }
}

// 初始化图片数组
function initMovieResource() {
    for (var i = 1; i < 65; i++) {
        movieResource.push('frames/' + i + '.png');
    }
}

function movieLoader(imgs) {
    var length = imgs.length;
    for (var index = 0; index < length; index++) {
        movieObj[index] = new Image();
        movieObj[index].src = movieResource[index];
        movieObj[index].onload = function () {
            loadingIndex++;
        };

    }
}

function loadingFinish(callback) {
    $("#loader").fadeOut(500);
    setTimeout(function () {
        $("#choose").fadeIn(500);
        callback();
    }, 100);
}

function drawMovie() {
    var canvas = $(".js-canvas-0")[0];
    var ctx = canvas.getContext("2d");
    var currentIndex = 0;

    // fix retina pic
    var scale = 3;
    $(".js-canvas-0").attr("style", "width:" + $(window).width() + "px;height:" + $(window).height() + "px");
    canvas.width = canvas.width * scale;
    canvas.height = canvas.height * scale;

    setInterval(function () {
        var img = movieObj[currentIndex];
        if (currentIndex == movieResource.length) {
            currentIndex = 0;
        } else {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        }
        currentIndex++;
    }, 70);
}

function playVideo() {
    drawMovie();
}

function initTypeit($selector) {
    $selector.typeIt({
        speed: 160,
        cursor: false,
        cursorSpeed: 300,
        breakDelay: 200,
        startDelay: 250,
        startDelete: false
    });
}

function showSecondOption(gender) {

    var $options = $(".option-" + gender);
    var $option_list = $options.find(".option-list li");
    var $answer = $options.find(".opt_answers");

    $options.fadeIn(500);
    $options.find(".option-wrap").fadeIn(500);

    $option_list.off("click");
    $option_list.on("click", function () {

        var beginTime = $(this).data("begin");
        var stopTime = $(this).data("end");
        var index = $(this).index();
        var $current_word_box = $answer.find(".word-box").eq(index);

        selectOrder = $(this).data("order");

        $options.find(".option-list").fadeOut();
        $answer.fadeIn(500);
        $answer.find(".word-box").hide();
        $current_word_box.show();
        $current_word_box.attr("style", "");
        initTypeit($current_word_box);

        nextPart = "third";

        controlVideo(beginTime, stopTime);

    })
}

function showThirdOption(gender) {
    setTimeout(function () {
        $(".option-" + gender).fadeOut();
        $(".welcome-box").fadeIn(500);
    }, 1000);

    setTimeout(function () {
        $(".welcome-box").fadeOut();
        setTimeout(function () {
            var ctr = 25;
            if (gender == "female") {
                ctr = 21;
            }
            currentVideo.jumpTo(ctr / currentVideo.video.duration);
            currentVideo.play();
            nextPart = 'end';
            stopVideoTime = currentVideo.video.duration.toFixed(1) - 0.5;
        }, 1000);
    }, 2000);

}

function progressLoading() {
    var loadingProgress = 0;
    var timer = setInterval(function () {
        if (loadingProgress <= Math.ceil(loadingIndex / movieResource.length * 100)) {
            loadingProgress++;
        }
        $(".loader .percents").html(loadingProgress + "%");
        if (loadingProgress == 100) {
            clearInterval(timer);
            loadingFinish(playVideo);
        }
    }, 20);
}

function chooesToggle() {
    setInterval(function () {
        $(".choose-btn a,.choose-mask").toggleClass("active");
    }, 7000);
}

function controlVideo(startTime, stopTime) {

    startVideoTime = startTime;
    stopVideoTime = stopTime;

    console.log(startVideoTime);
    console.log(stopVideoTime);
    if (startTime) {
        currentVideo.jumpTo(startTime / currentVideo.video.duration);
        // currentVideo.video.currentTime = startTime;
    }
    currentVideo.playPause();
}

function beginCanvasPlay(gender, video, stopTime) {

    var $videoWrap = $(".videos .video-wrap");
    $(".videos").css("visibility", "visible");
    $videoWrap.css("visibility", "hidden");
    $(".choose-box").fadeOut();

    if (gender == "male") {
        $videoWrap.eq(0).css("visibility", "visible");
        currentVideo = initManVideo;
    } else {
        $videoWrap.eq(1).css("visibility", "visible");
        currentVideo = initFamaleVideo;
    }

    $(".intro-box").fadeIn(500);

    initTypeit($(".intro-box .word-box"));


    nextPart = "second";

    controlVideo(0, stopTime);

    currentVideo.video.ontimeupdate = function () {

        var currentTime = currentVideo.video.currentTime.toFixed(1);

        //console.log(currentTime, stopVideoTime, currentVideo.video.duration);

        if (currentTime == stopVideoTime) {

            //            console.log(nextPart);

            currentVideo.pause();

            if (nextPart == "second") {
                $(".intro-box").fadeOut();
                showSecondOption(gender);
            }

            if (nextPart == "third") {
                showThirdOption(gender);
            }

            if (nextPart == "end") {
                var $jobs_list = $(".jobs-box ul");
                var $li = $("li[data-order=" + selectOrder + "]").clone();
                $li.find("a").addClass("active");
                $("li[data-order=" + selectOrder + "]").remove();
                $jobs_list.prepend($li);
                $(".jobs-box").fadeIn(500);

            }
        }

        // if(currentTime >= currentVideo.video.duration.toFixed(1)){
        //     currentVideo.pause();
        //     $(".jobs-box").fadeIn(500);
        // }

    };
}


$(".choose-btn a").on("click", function () {

    var video = $(this).data("video");
    var stopTime = $(this).data("stop");
    var gender = $(this).data("gender");

    if (isiOS) {
        beginCanvasPlay(gender, video, stopTime);
    } else {

    }

});

$(".jobs-box").on("click", ".opt-btn", function () {
    $(".jobs-box").fadeOut(500);
    $(".result-box").fadeIn(500);
    return false;
});

// 初始化资源
initMovieResource();
// 加载开始影片
movieLoader(movieResource);
// 加载进度
progressLoading();
// 选择进入
chooesToggle();


if (isiOS) {
    // 初始化正片
    initCanvasPlayer("male", "js-video-02");
    initCanvasPlayer("famale", "js-video-03");
}



// loadingFinish(playVideo);