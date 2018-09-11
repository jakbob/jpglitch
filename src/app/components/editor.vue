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
import { toZigzag, fromZigzag } from 'app/helpers/sort-helper';
import { JPGHelper } from 'app/helpers/jpg-helper';
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
        data: toZigzag(dqt.data, 8)
      }));
      this.rawImage = new Uint8Array(value);
    }
  },
  methods: {
    dqtUpdated(dqt, index) {
      Vue.set(this.dqts, index, dqt);

      var raw = this.rawImage.subarray(0);
      raw.set(fromZigzag(dqt.data, 8), dqt.position);
      this.rawImage = raw;
    },
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
