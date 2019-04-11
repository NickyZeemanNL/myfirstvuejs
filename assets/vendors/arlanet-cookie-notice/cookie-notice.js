var cookieNotice = cookieNotice || {};

cookieNotice.CookieCount = 0;

cookieNotice.Initialize = function() {
    var config = {
        necessaryCookieName: "cookie-necessary-" + cookieNotice.CookieCount,
        statisticsCookieName: "cookie-statistics-" + cookieNotice.CookieCount,
        marketingCookieName: "cookie-marketing-" + cookieNotice.CookieCount
    };

    init();

    function init() {
        cleanupOldCookies();
        initializeCookieNotice();
        initializeDisabledIframes();
    }

    function cleanupOldCookies() {
        var cookies = getCookiesStartsWith("cookie-");

        var skipCookies = [config.necessaryCookieName, config.statisticsCookieName, config.marketingCookieName];

        for (var i = 0; i < cookies.length; i++) {
            if (skipCookies.indexOf(cookies[i]) < 0) {
                deleteCookie(cookies[i]);
            }
        }
    }

    function initializeCookieNotice() {
        var d = document.getElementById("cd");

        if (!d) {
            return;
        }

        var element = document.getElementById("disabled");

        if (element) {
            element.onclick = function() {
                var text = d.getAttribute("data-alert-text");

                alert(text);
            }
        }

        var checkNecessary = getCookie(config.necessaryCookieName);
        var checkStatistics = getCookie(config.statisticsCookieName);
        var checkMarketing = getCookie(config.marketingCookieName);

        //NOTE: Always show the cookie notice if it has been rendered into the page
        d.classList.add("show");
        document.getElementById("cookieStatistics").checked = !checkNecessary || checkStatistics === "true";
        document.getElementById("cookieMarketing").checked = !checkNecessary || checkMarketing === "true";

        var elemCookies = document.getElementById("accept-cookies");

        if (elemCookies) {
            elemCookies.addEventListener("click",
                function() {
                    setCookie(config.necessaryCookieName, true, "365");

                    var statisticsChecked = document.getElementById("cookieStatistics").checked;
                    
                    if (statisticsChecked) {
                        setCookie(config.statisticsCookieName, true, "365");
                    } else {
                        deleteCookie(config.statisticsCookieName);
                    }

                    var marketingChecked = document.getElementById("cookieMarketing").checked;

                    if (marketingChecked) {
                        setCookie(config.marketingCookieName, true, "365");
                    } else {
                        deleteCookie(config.marketingCookieName);
                    }

                    d.classList.remove("show");
                });
        }

        //TODO: Should we get rid of this feature?
        var el = document.querySelector(".cookie-settings");
        if (typeof (el) != "undefined" && el != null) {
            el.addEventListener("click",
                function() {
                    d.classList.add("show");
                });
        }
    }

    function initializeDisabledIframes() {
        var disabledIframes = document.getElementsByClassName("no-iframe-allowed");

        if (disabledIframes.length) {
            for (var i = 0; i < disabledIframes.length; i++) {
                var enableButton = disabledIframes[i].querySelectorAll("a.accept-marketing")[0];

                enableButton.addEventListener("click",
                    function(e) {
                        e.preventDefault();
                        setCookie(config.marketingCookieName, true, "365");

                        var container = findAncestor(this, "no-iframe-allowed");
                        var iframeContainer = container.querySelectorAll("div.cookie-accepted")[0];
                        var body = container.querySelectorAll("div.nib")[0];

                        var iframe = iframeContainer.getAttribute("data-iframe");
                        iframeContainer.insertAdjacentHTML("afterbegin", iframe);
                        iframeContainer.classList.add("fadeIn");
                        body.classList.add("fadeOut");
                        container.classList.add("activated");
                    });
            }
        }
    }

    function getCookie(name) {
        var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
        return v ? v[2] : null;
    }

    function getCookiesStartsWith(name) {
        var regex = new RegExp("(^|;) ?(" + name + ".*?)=", "g");

        var results = [];

        while (true) {
            var result = regex.exec(document.cookie);

            if (!result) {
                break;
            }

            results.push(result[2]);
        }
        
        return results;
    }

    function setCookie(name, value, days) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    }

    function deleteCookie(name) {
        setCookie(name, "", -1);
    }

    function findAncestor(element, cssClass) {
        while ((element = element.parentElement) && !element.classList.contains(cssClass));

        return element;
    }
};

//NOTE: Initialize the cookienotice once the page is done loading
document.addEventListener("DOMContentLoaded", cookieNotice.Initialize);