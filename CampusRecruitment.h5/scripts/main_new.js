"use strict";

var videoResource = [];
var videoFrameObj = {};

var selectGender = null;
var selectOrder = 0;
var loadingIndex = 0;

var fps = 40; // 1*3600/400 = 10   1s is 15 frames
var canvasScale = 4;
var timer = null;

var $canvas = $("#tujia_canvas");
var canvas = $canvas[0];
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var beginLength = 65;
var maleLength = 446;
var femaleLength = 375;

// init Typeit
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

function initVideoResource() {
    var n;
    // begin video
    for (var i = 1; i < beginLength + 1; i++) {
        n = i;
        if (i % 3 == 0) n = i - 1;
        videoResource.push({
            name: 'begin',
            src: 'frames/' + n + '.jpg'
        });

    }
    // male video
    for (var j = 1; j < maleLength + 1; j++) {
        n = j;
        if (j % 3 == 0) n = j - 1;
        videoResource.push({
            name: 'begin',
            src: 'frames/v01_' + n + '.jpg'
        });
    }
    // female video
    for (var k = 1; k < femaleLength + 1; k++) {
        n = k;
        if (k % 3 == 0) n = k - 1;
        videoResource.push({
            name: 'begin',
            src: 'frames/v02_' + n + '.jpg'
        });
    }
}

function loadVideoResource() {
    var length = videoResource.length;
    for (var index = 0; index < length; index++) {
        videoFrameObj[index] = new Image();
        videoFrameObj[index].src = videoResource[index].src;
        videoFrameObj[index].onload = function () {
            loadingIndex++;
            //            console.log(loadingIndex);
        };

    }
}

function drawFrames(start, stop, loop, callback) {


    var ctx = canvas.getContext("2d");
    var currentFrames = start || 0;
    var stopFrames = stop || 0;
    var loop = loop || false;
    var ms = 3600 / fps;
    var callback = callback || function () {};

    if (timer) {
        clearInterval(timer);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // fix retina pic
    $canvas.attr("style", "width:" + $(window).width() + "px;height:" + $(window).height() + "px");
    canvas.width = canvasWidth * canvasScale;
    canvas.height = canvasHeight * canvasScale;

    timer = setInterval(function () {
        var img = videoFrameObj[currentFrames];
        if (currentFrames !== stopFrames) {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            currentFrames++;
        } else {
            if (loop) {
                currentFrames = start;
            } else {
                clearInterval(timer);
                callback();
            }
        }

    }, ms);
}

function progressLoading() {

    var loadingProgress = 0;
    var total = videoResource.length;
    var timer = setInterval(function () {
        if (loadingProgress <= Math.ceil(loadingIndex / total * 100)) {
            loadingProgress++;
        }
        $(".loader .percents").html(loadingProgress + "%");
        if (loadingProgress == 100) {
            clearInterval(timer);
            setTimeout(function () {
                showFirstChooes();
                musicPlay();
            }, 2000);

        }
    }, 20);
}

function showFirstChooes() {

    setInterval(function () {
        $(".choose-btn a,.choose-mask").toggleClass("active");
    }, 4900);

    $("#loader").fadeOut();
    $("#choose").fadeIn();
    drawFrames(0, 64, true);

    $(".choose-btn a").on("click", function () {

        var beginFrame = $(this).data("begin");
        var stopFrame = $(this).data("stop");
        selectGender = $(this).data("gender");

        $(this).addClass("active").siblings("a").removeClass("active");
        setTimeout(function () {
            beginSecondPlay(beginFrame, stopFrame);
        }, 1000);


    });
}

function beginSecondPlay(beginFrame, stopFrame) {

    $("#choose").fadeOut();

    var $videos = $(".videos");
    var $videoWrap = $videos.find(".video-wrap");

    $videos.show();
    $videoWrap.hide();

    if (selectGender == "male") {
        $videoWrap.eq(0).fadeIn();
    } else {
        $videoWrap.eq(1).fadeIn();
    }

    //    $(".intro-box").fadeIn(500);
    //    initTypeit($(".intro-box .word-box"));
    $(".intro-box").fadeIn();
    drawFrames(beginFrame, stopFrame, false, function () {
        $(".intro-box").fadeOut();
        setTimeout(function () {
            showSecondOption();
        }, 500);
    });
}

function showSecondOption() {

    var $options = $(".option-" + selectGender);
    var $option_list = $options.find(".option-list li a");
    var $answer = $options.find(".opt_answers");

    $options.show();
    $options.find(".option-wrap").show();

    $option_list.on("click", function () {

        var beginFrame = $(this).data("begin");
        var stopFrame = $(this).data("end");
        var index = $(this).index(".option-" + selectGender + " .option-list li a");
        var $current_word_box = $answer.find(".word-box").eq(index);

        selectOrder = $(this).data("order");


        //        initTypeit($current_word_box);
        $(this).addClass("active").parents("li").siblings().find("a").removeClass("active");
        setTimeout(function () {
            $options.find(".option-list").hide();
            $answer.show();
            $answer.find(".word-box").hide();
            $current_word_box.fadeIn();
            drawFrames(beginFrame, stopFrame, false, function () {
                showThirdOption();
            });
        }, 1500);
    });
}

function showThirdOption() {

    var currentFrame = 448;
    var endFrame = 500;
    // var endFrame = videoResource.length;

    if (selectGender == "female") {
        currentFrame = 810;
        endFrame = 870;
    }
    setTimeout(function () {
        $(".option-" + selectGender).fadeOut();
        $(".welcome-box").fadeIn(500);
    }, 1600);

    setTimeout(function () {
        $(".welcome-box").fadeOut();
        setTimeout(function () {
            drawFrames(currentFrame, endFrame, false, function () {
                $(".result-box").fadeIn(500);
            });
        }, 1000);
    }, 4000);
}

//function showJobOption() {
//
//    var $jobs_list = $(".jobs-box ul");
//    var $li = $("li[data-order=" + selectOrder + "]").clone();
//
//    $li.find("a").addClass("active");
//    $("li[data-order=" + selectOrder + "]").remove();
//    $jobs_list.prepend($li);
//    $(".jobs-box").fadeIn(500);
//
//    $(".jobs-box").on("click", ".opt-btn", function () {
//        $(".jobs-box").fadeOut(500);
//        $(".result-box").fadeIn(500);
//        return false;
//    });
//}

function musicPlay() {
    var musicPlayer = document.getElementById("musicPlayer");
    musicPlayer.play();

    $('.music-btn').bind("click", function () {
        if (!musicPlayer.paused) {
            musicPlayer.pause();
            $('.music-btn').removeClass('wrotateSlide');
        } else {
            musicPlayer.play();
            $('.music-btn').addClass('wrotateSlide');
        }
    })
}
initVideoResource();
loadVideoResource();
progressLoading();