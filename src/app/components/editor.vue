<template>
  <div>
    <div
      class="image-area"
    >
      <img :src="rawImage | base64Jpeg" />
    </div>
    <div class="edit-area">
      <div
        v-for="(dqt, index) in dqts"
        :key="dqt.id"
        class="dqt-area"
      >
        <table-editor
          :table="dqt"
          @change="dqtUpdated(dqt, index)"
        ></table-editor>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { JPGHelper } from 'app/jpg-helper';
import tableEditorVue from './table-editor.vue';

export default {
  components: {
    'table-editor': tableEditorVue,
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
      if (!value) { return; }
      const dqts = JPGHelper.parseQuantizationTables(value);
      this.dqts = dqts.map(dqt => ({
        ...dqt,
        data: this.zigzagDqt(dqt.data)
      }));
      this.rawImage = new Uint8Array(value);
    }
  },
  methods: {
    dqtUpdated(dqt, index) {
      Vue.set(this.dqts, index, dqt);


      var raw = this.rawImage.subarray(0);
      raw.set(dqt.data, dqt.position);
      this.rawImage = raw;
    },
    zigzagDqt(dqt) {
      const reordered = new Array(dqt.length);
      let reorderedX = 0, reorderedY = 0;
      let direction = 'up';

      for (let dqtIndex = 0; dqtIndex < dqt.length; dqtIndex++) {
        reordered[reorderedX + reorderedY * 8] = dqt[dqtIndex];

        if (direction === 'up') {
          if (reorderedY === 0) {
            reorderedX += 1;
            direction = 'down';
          } else if (reorderedX === 7) {
            reorderedY += 1;
            direction = 'down';
          } else {
            reorderedX += 1;
            reorderedY -= 1;
          }
        } else {
          if (reorderedY === 7) {
            reorderedX += 1;
            direction = 'up';
          } else if (reorderedX === 0) {
            reorderedY += 1;
            direction = 'up';
          } else {
            reorderedX -= 1;
            reorderedY += 1;
          }
        }
      }

      console.log(reordered);

      return reordered;
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

.dqt-area {
  margin-bottom: 1rem;
}
</style>
