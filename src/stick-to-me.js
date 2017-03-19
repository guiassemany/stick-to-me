/*!
 * jQuery Stick to Me plugin
 *
 * @author: Guilherme Assemany
 * @version: 1.0
 * @requires jQuery 1.6.1 or later
 *
 */

(function ($) {

    $.stickToMe = function ( configs ) {

        var defaults = {
            layer: "",
            fadespeed: 400,
            trigger: ['top'],
            maxtime : 0,
            mintime : 0,
            delay: 0,
            interval: 0,
            maxamount : 0,
            cookie : false,
            bgclickclose : true,
            escclose : true,
            onleave : function (e) {},
            disableleftscroll : true	// chrome disable
        }


        var configuration = $.extend({}, defaults, configs);

        $(configuration.layer).hide();

        var startuptime = new Date().getTime();
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var offsetbind = false;
        var howmanytimes = 0;
        var lasttime = 0;
        var chromealert = true;
        var lastx, lasty = 0;

        if (/Chrome/.test(navigator.userAgent))
        {
            var chrome = true;
            if ($(document).width() > windowWidth && settings.disableleftscroll == true)
            {
                chromealert = false;
            }
        }

    }

});

