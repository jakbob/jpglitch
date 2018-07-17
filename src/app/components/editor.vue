<template>
  <div>
    <div
      class="image-area"
    >
      <img :src="rawImage | base64Jpeg" />
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
import Dqt from './dqt.vue';
import { JPGHelper } from 'app/jpg-helper';

export default {
  components: {
    'dqt': Dqt,
  },
  props: {
    imageFile: {
      type: ArrayBuffer,
      default: null
    }
  },
  data: () => ({
    dqts: null,
    rawImage: null
  }),
  watch: {
    imageFile(value) {
      this.dqts = JPGHelper.parseQuantizationTables(value);
      this.rawImage = new Uint8Array(value);
    }
  },
  methods: {
    dqtUpdated(dqt) {
      var raw = this.rawImage.subarray(0);
      raw.set(dqt.data, dqt.position);
      this.rawImage = raw;
    }
  }
};
</script>

<style scoped>
.image-area {
  height: 60vh;
  margin-bottom: 1rem;
}

img {
  width: auto;
  height: 100%;
  object-fit: contain;
}

.editor-area {
  word-break: break-all;
}
</style>
