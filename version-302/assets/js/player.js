import { H as Hls } from './hls-vendor-dru42stk.js';

export function initVideoPlayer(options) {
  const video = document.getElementById(options.videoId);
  const cover = document.getElementById(options.coverId);
  if (!video || !cover || !options.source) {
    return;
  }

  let ready = false;

  const attachSource = () => {
    if (ready) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = options.source;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(options.source);
      hls.attachMedia(video);
    } else {
      video.src = options.source;
    }
  };

  const play = async () => {
    attachSource();
    cover.classList.add('hidden');
    video.controls = true;
    try {
      await video.play();
    } catch (error) {
      cover.classList.remove('hidden');
    }
  };

  cover.addEventListener('click', play);
  video.addEventListener('click', () => {
    if (video.paused) {
      play();
    }
  });
}
