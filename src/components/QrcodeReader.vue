<template>
  <div class="qrcode-reader">
    <video ref="video"></video>
    <slot />
  </div>
</template>

<script>
  import * as Scanner from '../misc/scanner.js';
  import Camera from '../misc/camera.js';
  import { imageDataFromFile } from '../misc/image-data.js';

  export default {
    props: {
      paused: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return { camera: null, readyAfterPause: true };
    },

    computed: {
      shouldScan() {
        return this.paused === false && this.camera !== null && this.readyAfterPause;
      },

      constraints() {
        return {
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { min: 360, ideal: 640, max: 1920 },
            height: { min: 240, ideal: 480, max: 1080 }
          }
        };
      }
    },

    watch: {
      shouldScan(shouldScan) {
        if (shouldScan) {
          this.startScanning();
        }
      },

      paused(paused) {
        const video = this.$refs.video;

        if (paused) {
          video.pause();
          this.readyAfterPause = false;
        } else {
          video.play();
          video.addEventListener('timeupdate', () => this.readyAfterPause = true, { once: true });
        }
      }
    },

    mounted() {
      if (this.camera !== null) {
        this.camera.stop();
      }

      this.$emit('init', Camera(this.constraints, this.$refs.video).then(camera => this.camera = camera));
    },

    beforeDestroy() {
      if (this.camera !== null) {
        this.camera.stop();
        this.camera = null;
      }
    },

    methods: {
      startScanning() {
        Scanner.keepScanning(this.camera, {
          detectHandler: scanResult => this.$emit('detect', Promise.resolve(scanResult)),
          shouldContinue: () => this.shouldScan
        });
      },

      scanFile(file) {
        this.$emit('detect', imageDataFromFile(file).then(imageData => Scanner.scan(imageData)));
      }
    }
  };
</script>

<style>
  .qrcode-reader {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .qrcode-reader video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
</style>
