<template>
  <div class="upload-area">
    <p>Släpp en JPG här</p>
    <p>eller</p>
    <input
      id="fileInput"
      name="file"
      type="file"
      @change="handleFileSelect"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleFileSelect(e) {
      if (e.target.files.length > 0) {
        this.$emit('fileSelected', e.target.files[0]);
      }
    }
  }
}
</script>

<style scoped>
  .upload-area {
    padding: 2rem 0;
  }
</style>
