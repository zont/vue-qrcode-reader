const canvas = document.createElement('canvas');
const canvasCtx = canvas.getContext('2d');

const getImageData = (image, width, height) => {
  canvas.width = width;
  canvas.height = height;

  canvasCtx.drawImage(image, 0, 0, width, height);

  return canvasCtx.getImageData(0, 0, width, height);
};

export function imageDataFromVideo(videoElement) {
  return getImageData(videoElement, videoElement.videoWidth, videoElement.videoHeight);
}

export function imageDataFromFile(file) {
  if (/image.*/.test(file.type)) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    })
      .then(url => {
        if (url.startsWith('http') && url.includes(location.host) === false) {
          throw new Error('Can\'t process cross-origin image');
        }

        return new Promise(resolve => {
          const image = new Image();
          image.onload = () => {
            const d = Math.max(1, (image.width < image.height ? image.width : image.height) / 512);
            resolve(getImageData(image, Math.round(image.width / d), Math.round(image.height / d)));
          };
          image.src = url;
        });
      });
  } else {
    throw new Error('File is not of type image and can\'t be decoded');
  }
}
