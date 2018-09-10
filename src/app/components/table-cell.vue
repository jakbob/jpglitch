<template>
  <span :class="{active}">{{ byte }}</span>
</template>

<script>
export default {
  props: {
    byte: {
      type: Number,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
  :focus .active {
    font-weight: bold;
    background: #ddd;
  }
</style>
