$(function () {
    $("body").on("YouTubeIFrameReady", function (event, picture) {
        picture.hide();
        picture.closest(".youtube-video-container").find("iframe").show();
    });

    if ($(".play-video").length) {
        $(".play-video").on("click touchstart", function (ev) {
            Arlanet.YoutubeVideo.load($(this).prev(".video"), $(this));

            ev.preventDefault();
        });
    }
});