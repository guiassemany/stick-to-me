/*!
 * Stick to Me plugin
 *
 * @author: Guilherme Assemany
 * @version: 2.0
 * @requires No dependencies
 *
 */
const stickToMe = function (configs) {
    const defaults = {
        layer: "",
        fadespeed: 400,
        trigger: ['top'],
        maxtime: 0,
        mintime: 0,
        delay: 0,
        interval: 0,
        maxamount: 0,
        cookie: false,
        bgclickclose: true,
        escclose: true,
        onleave: function (e) {},
        disableleftscroll: true,	// chrome disable
        debug: false
    };

    const settings = Object.assign({}, defaults, configs);

    const layerElement = document.querySelector(settings.layer);
    if (layerElement) layerElement.style.display = 'none';

    const startuptime = new Date().getTime();
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    let offsetbind = false;
    let howmanytimes = 0;
    let lasttime = 0;
    let chromealert = true;
    let lastx = 0, lasty = 0;

    if (/Chrome/.test(navigator.userAgent)) {
        const chrome = true;
        if (document.documentElement.scrollWidth > windowWidth && settings.disableleftscroll) {
            chromealert = false;
        }
    }

    const conth = parseFloat(getComputedStyle(layerElement).height);
    const contw = parseFloat(getComputedStyle(layerElement).width);
    const reqsettings = {
        backgroundcss: {'z-index':'1000','display':'none'},
        boxcss: {'z-index':'1000','position':'fixed','left':'50%','top':'50%','height': conth + 'px','width': contw + 'px', 'margin-left': (-contw/2)+'px', 'margin-top': (-conth/2) + 'px'}
    };

    Object.assign(settings, reqsettings);

    function debugLog(message) {
        if (settings.debug) {
            console.log(`[Stick to Me Debug] ${message}`);
        }
    }

    document.addEventListener('mousemove', function(e) {
        lastx = e.pageX;
        lasty = e.pageY;
        debugLog(`Mouse moved to (${lastx}, ${lasty})`);
    });

    document.addEventListener('mouseleave', function(e) {
        debugLog('Mouse left the document');
        setTimeout(function() { ontheleave(e); }, settings.delay);
    });

    if (chrome) {
        document.removeEventListener("mouseleave", ontheleave);
        chromefix();
    }

    function chromefix() {
        offsetbind = false;
        document.addEventListener('mousemove', function bindOffset(e) {
            if (offsetbind) {
                document.addEventListener('mouseleave', function(e) {
                    debugLog('Chrome-specific mouseleave event triggered');
                    setTimeout(function() { ontheleave(e); }, settings.delay);
                });
                document.removeEventListener("mousemove", bindOffset);
            }
            offsetbind = true;
        });
    }

    window.addEventListener('resize', function() {
        windowHeight = window.innerHeight;
        windowWidth = window.innerWidth;
        debugLog(`Window resized to ${windowWidth}x${windowHeight}`);
    });

    function ontheleave(e) {
        const scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollleft = document.documentElement.scrollLeft || document.body.scrollLeft;

        let clienty, clientx;
        if ((Math.round(e.pageX) == -1 || Math.round(e.pageY) == -1) || (e.pageX == -3 || e.pageY == -3)) {
            clienty = -lasty + scrolltop;
            clientx = lastx - scrollleft;
        } else {
            clienty = -e.pageY + scrolltop;
            clientx = e.pageX - scrollleft;
        }

        const ey1 = (-windowHeight / windowWidth) * clientx;
        const ey2 = ((windowHeight / windowWidth) * clientx) - windowHeight;

        let leaveside;
        if (clienty >= ey1) {
            leaveside = clienty >= ey2 ? "top" : "right";
        } else {
            leaveside = clienty >= ey2 ? "left" : "bottom";
        }

        debugLog(`Detected leave intent: ${leaveside}`);

        if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            if (clienty < 0 && clienty > -windowHeight && clientx > 0 && clientx < windowWidth) {
                debugLog('Firefox-specific condition met, returning');
                return;
            }
        }

        if (settings.trigger.includes(leaveside) || settings.trigger.includes('all')) {
            const recenttime = new Date().getTime();
            if ((recenttime - startuptime) >= settings.mintime) {
                if ((recenttime - startuptime) <= settings.maxtime || settings.maxtime == 0) {
                    if (howmanytimes < settings.maxamount || settings.maxamount == 0) {
                        if ((recenttime - lasttime) >= settings.interval || settings.interval == 0) {
                            if (chromealert) {
                                const cookiehowm = getamount("ck_stick_visit");
                                if (!settings.cookie || (settings.cookie && (cookiehowm < settings.maxamount || settings.maxamount == 0))) {
                                    debugLog('Conditions met, firing onleave event');
                                    settings.onleave.call(this, leaveside);

                                    if (settings.layer != "") {
                                        showbox();
                                    }
                                    howmanytimes++;
                                    if (settings.cookie) {
                                        cookiehowm++;
                                        if (settings.cookieExpiration > 0) {
                                            const expiresAt = new Date(Date.now() + (settings.cookieExpiration * 1000)).toGMTString();
                                            document.cookie = `ck_stick_visit=${cookiehowm}; expires=${expiresAt}; path=/; SameSite=lax`;
                                        } else {
                                            document.cookie = `ck_stick_visit=${cookiehowm}; path=/; SameSite=lax`;
                                        }
                                        debugLog(`Cookie set: ck_stick_visit=${cookiehowm}`);
                                    }
                                    lasttime = new Date().getTime();
                                }
                            }
                        }
                    }
                }
            }
        }

        if (chrome) {
            document.removeEventListener("mouseleave", ontheleave);
            chromefix();
        }
    }

    const stickVarMap = new WeakMap();

    function showbox() {
        debugLog('Showing popup box');
        if (!stickVarMap.get(document.body)) {
            stickVarMap.set(document.body, 1);
            const blockLayer = document.createElement('div');
            blockLayer.className = 'stick_block_layer';
            Object.assign(blockLayer.style, settings.backgroundcss);
            document.body.appendChild(blockLayer);
            fadeIn(blockLayer, settings.fadespeed);

            const container = document.createElement('div');
            container.className = 'stick_container';
            document.body.appendChild(container);

            const clonedLayer = layerElement.cloneNode(true);
            clonedLayer.style.display = 'block';
            Object.assign(clonedLayer.style, settings.boxcss);
            container.appendChild(clonedLayer);

            if (settings.bgclickclose) {
                blockLayer.addEventListener('click', stick_close);
            }

            if (settings.escclose) {
                document.body.addEventListener('keyup', function(e) {
                    if (e.key === 'Escape') {
                        debugLog('Escape key pressed, closing popup');
                        stick_close();
                    }
                });
            }
        }
    }

    function getamount(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return 0;
    }

    function stick_close() {
        debugLog('Closing popup');
        const container = document.querySelector('.stick_container');
        const blockLayer = document.querySelector('.stick_block_layer');
        if (container) fadeOut(container, settings.fadespeed, () => container.remove());
        if (blockLayer) fadeOut(blockLayer, settings.fadespeed, () => blockLayer.remove());
        stickVarMap.delete(document.body);
    }

    function fadeIn(element, duration, callback) {
        element.style.opacity = 0;
        element.style.display = 'block';
        let start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }
        window.requestAnimationFrame(step);
    }

    function fadeOut(element, duration, callback) {
        let start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.max(1 - progress / duration, 0);
            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                element.style.display = 'none';
                if (callback) callback();
            }
        }
        window.requestAnimationFrame(step);
    }

    return {
        close: stick_close
    };
};
