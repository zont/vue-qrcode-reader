import 'webrtc-adapter';
import jsQR from 'jsqr';

export function scan(imageData) {
  const result = jsQR(imageData.data, imageData.width, imageData.height);

  return { content: result === null ? null : result.data };
}

export function keepScanning(camera, options) {
  const { detectHandler, shouldContinue } = options;

  let contentBefore = null;

  const processFrame = () => {
    if (shouldContinue()) {
      window.requestAnimationFrame(processFrame);

      const result = scan(camera.captureFrame());

      if (result.content !== contentBefore && result.content !== null) {
        detectHandler(result);
      }

      contentBefore = result.content || contentBefore;
    }
  };

  processFrame();
}
