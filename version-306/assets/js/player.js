(function () {
  var shell = document.querySelector('[data-player]');
  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var cover = shell.querySelector('[data-play-cover]');
  var stream = shell.getAttribute('data-stream');
  var hlsInstance = null;
  var loaded = false;

  function bind() {
    if (loaded || !video || !stream) {
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else {
      video.src = stream;
    }
    loaded = true;
  }

  function play() {
    bind();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  }

  function toggle() {
    if (!loaded || video.paused) {
      play();
    } else {
      video.pause();
      if (cover) {
        cover.classList.remove('is-hidden');
      }
    }
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!loaded) {
        play();
      }
    });
    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (video.currentTime > 0 && !video.ended && cover) {
        cover.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
})();
