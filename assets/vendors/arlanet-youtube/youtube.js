var Arlanet = Arlanet || {};

Arlanet.YoutubeVideo = (function () {
    function load($video, $picture) {
        $.getScript("//www.youtube.com/iframe_api", function () {
            window.onYouTubeIframeAPIReady = function () {
                var player = new YT.Player($video.get(0), {
                    width: "100%",
                    height: "100%",
                    videoId: $video.data("id"),
                    events: {
                        onReady: function (event) {
                            event.target.playVideo();

                            parent.$("body").trigger("YouTubeIFrameReady", [$picture]);
                        }
                    }
                });
            };
        });
    };

    return {
        load: load
    };
})();