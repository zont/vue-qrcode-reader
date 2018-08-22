import 'webrtc-adapter';
import QrCode from 'qrcode-reader';

const qr = new QrCode();

export function scan(imageData) {
  return new Promise(resolve => {
    qr.callback = (err, value) => resolve({ content: err ? null : value.result });
    qr.decode(imageData);
  });
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
