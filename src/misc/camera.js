import { imageDataFromVideo } from './image-data.js';

export default (constraints, videoEl) => {
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    throw new Error('WebRTC API not supported in this browser');
  }

  return navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => new Promise((resolve, reject) => {
      videoEl.addEventListener('error', reject, { once: true });
      videoEl.addEventListener(
        'loadeddata',
        () => resolve({
          captureFrame: () => imageDataFromVideo(videoEl),
          stop: () => stream.getTracks().forEach(track => track.stop())
        }),
        { once: true }
      );

      if (videoEl.srcObject !== undefined) {
        videoEl.srcObject = stream;
      } else if (videoEl.mozSrcObject !== undefined) {
        videoEl.mozSrcObject = stream;
      } else if (window.URL.createObjectURL) {
        videoEl.src = window.URL.createObjectURL(stream);
      } else if (window.webkitURL) {
        videoEl.src = window.webkitURL.createObjectURL(stream);
      } else {
        videoEl.src = stream;
      }

      videoEl.playsInline = true;
      videoEl.play();
    }));
};
