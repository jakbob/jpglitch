<template>
  <span 
    :class="{active}"
    @click="activate"
  >{{ byte }}</span>
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
  },
  methods: {
    activate() {
      this.$emit('activate');
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


