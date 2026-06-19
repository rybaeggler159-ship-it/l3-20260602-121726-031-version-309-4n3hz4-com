(function () {
  var video = document.querySelector("[data-player-video]");
  var button = document.querySelector("[data-player-button]");
  var cover = document.querySelector("[data-player-cover]");

  if (!video || !button) {
    return;
  }

  var source = button.getAttribute("data-video") || "";
  var attached = false;
  var hlsInstance = null;

  function attachSource() {
    if (attached || !source) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function startPlayback() {
    attachSource();

    if (cover) {
      cover.classList.add("is-hidden");
    }

    video.controls = true;
    var attempt = video.play();

    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {});
    }
  }

  button.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    startPlayback();
  });

  if (cover) {
    cover.addEventListener("click", function () {
      startPlayback();
    });
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
