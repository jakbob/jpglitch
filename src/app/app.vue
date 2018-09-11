<template>
  <div>
    <file-select
      v-jpgdrop="loadFile"
      v-show="!imageFile"
      @fileSelected="loadFile"
    >
    </file-select>
    <div v-show="imageFile">
      <button
        class="back-button"
        @click="imageFile = null"
      >Tillbaka</button>

      <editor :image-file="imageFile"></editor>
    </div>
  </div>
</template>

<script>
import { FileHelper } from 'app/helpers/file-helper';
import FileSelect from './components/file-select.vue';
import Editor from './components/editor.vue';

export default {
  components: {
    'editor': Editor,
    'file-select': FileSelect,
  },
  data: () => ({
    imageFile: null
  }),
  methods: {
    loadFile(file) {
      FileHelper.loadFile(file).then(raw => {
        this.imageFile = raw;
      });
    }
  }
};
</script>

<style scoped>
  .back-button {
    margin-bottom: 1rem;
  }
</style>
