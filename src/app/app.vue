<template>
  <div>
    <div
      v-jpgdrop="loadFile"
      v-show="!fileLoaded"
      class="dropzone"
    >
      <p>Släpp en JPG här</p>
      <p>eller</p>
      <input
        id="fileInput"
        name="file"
        type="file"
        @change="handleFileSelect"
      />
    </div>
    <div
      v-jpgdrop="loadFile"
      class="image-area"
    >
      <img
        id="image"
        :src="rawImage | base64Jpeg"
      />
      <button
        class="back-button"
        @click="fileLoaded=false"
      >Tillbaka</button>
    </div>
    <div class="edit-area">
      <div
        v-for="dqt in dqts"
        :key="dqt.id"
        class="dqt-area"
      >
        <dqt
          :dqt="dqt"
          @change="dqtUpdated(dqt)"
        ></dqt>
      </div>
    </div>
  </div>
</template>

<script>
import { FileHelper } from './file-helper';
import { JPGHelper } from './jpg-helper';
import Dqt from './components/dqt.vue';

export default {
  components: {
    dqt: Dqt
  },
  data: () => ({
    dqts: null,
    rawImage: null,
    fileLoaded: false
  }),
  methods: {
    handleFileSelect(e) {
      if (e.target.files.length > 0) {
        this.loadFile(e.target.files[0]);
      }
    },
    loadFile(file) {
      FileHelper.loadFile(file).then(raw => {
        this.$data.dqts = JPGHelper.parseQuantizationTables(raw);
        this.$data.rawImage = new Uint8Array(raw);
      });

      this.fileLoaded = true;
    },
    dqtUpdated(dqt) {
      var raw = this.rawImage.subarray(0);
      raw.set(dqt.data, dqt.position);
      this.rawImage = raw;
    }
  }
};
</script>
