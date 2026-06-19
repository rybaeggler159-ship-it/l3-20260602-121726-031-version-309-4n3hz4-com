(function () {
  function attachSource(video, source) {
    if (!video || !source) {
      return Promise.resolve();
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (video.src !== source) {
        video.src = source;
      }
      return Promise.resolve();
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (!video.hlsInstance) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.hlsInstance = hls;
      }
      return Promise.resolve();
    }
    video.src = source;
    return Promise.resolve();
  }

  window.bindMoviePlayer = function (videoId, buttonId, source) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button) {
      return;
    }
    var start = function () {
      button.classList.add("is-hidden");
      attachSource(video, source).then(function () {
        var playAction = video.play();
        if (playAction && typeof playAction.catch === "function") {
          playAction.catch(function () {
            button.classList.remove("is-hidden");
          });
        }
      });
    };
    button.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
  };
})();
