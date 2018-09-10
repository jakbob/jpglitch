<template>
  <div>
    <div
      class="dqt-editor"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <table-cell
        v-for="(dqtByte, index) in dqt.data"
        :key="index"
        :byte="dqtByte"
        :active="index == activeIndex"
      >
      </table-cell>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import tableCell from './table-cell.vue';

export default {
  components: {
    'table-cell': tableCell
  },
  props: {
    dqt: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    activeIndex: 0
  }),
  methods: {
    byteChanged(index, value) {
      if (value > 255) {
        value = 255;
      }
      if (value < 0) {
        value = 0;
      }

      Vue.set(this.dqt.data, index, value);
      this.$emit('change', this.dqt);
    },
    handleKeydown(e) {
      e.preventDefault();
      if (e.shiftKey) {
        this.stepChangeValue(e.key);
      } else if (e.key.startsWith('Arrow')) {
        this.moveIndicator(e.key);
      }
    },
    moveIndicator(key) {
      switch(key) {
        case 'ArrowRight':
          this.activeIndex += 1;
          break;
        case 'ArrowLeft':
          this.activeIndex -= 1;
          break;
        case 'ArrowUp':
          this.activeIndex -= 8;
          break;
        case 'ArrowDown':
          this.activeIndex += 8;
          break;
      }
      this.activeIndex %= this.dqt.data.length;
      if (this.activeIndex < 0) {
        this.activeIndex += this.dqt.data.length;
      }
    },
    stepChangeValue(key) {
      const currentValue = this.dqt.data[this.activeIndex];
      if (key == 'ArrowUp') {
        this.byteChanged(this.activeIndex, currentValue + 1);
      }
      if (key == 'ArrowDown') {
        this.byteChanged(this.activeIndex, currentValue - 1);
      }
    }
  }
};
</script>

<style scoped>
  input[type="number"] {
    width: 100%;
    display: inline-block;
  }

  .dqt-editor {
    max-width: 50rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

    .dqt-boost {
      float: left;
      transform: rotateZ(-90deg) translateX(-50%);
    }

  .dqt-editor:after, .dqt-area:after {
    visibility: hidden;
    display: block;

    font-size: 0;
    content: " ";

    clear: both;
    height: 0;
  }
</style>
