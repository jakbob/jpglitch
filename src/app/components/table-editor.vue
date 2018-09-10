<template>
  <div>
    <div
      class="table-editor"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <table-cell
        v-for="(tableByte, index) in table.data"
        :key="index"
        :byte="tableByte"
        :active="index == activeIndex"
        @change="byteChanged(index, $event)"
        @activate="activeIndex = index"
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
    table: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    activeIndex: 0,
    lastInputs: []
  }),
  methods: {
    byteChanged(index, value) {
      if (value > 255) {
        value = 255;
      }
      if (value < 0) {
        value = 0;
      }

      Vue.set(this.table.data, index, value);
      this.$emit('change', this.table);
    },
    handleKeydown(e) {
      e.preventDefault();
      if (e.shiftKey) {
        this.stepChangeValue(e.code);
        this.lastInputs = [];
      } else if (e.code.startsWith('Arrow')) {
        this.moveIndicator(e.code);
        this.lastInputs = [];
      } else if (e.code.startsWith('Digit'))  {
        this.handleNumberInput(e.code);
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
      this.activeIndex %= this.table.data.length;
      if (this.activeIndex < 0) {
        this.activeIndex += this.table.data.length;
      }
    },
    stepChangeValue(key) {
      const currentValue = this.table.data[this.activeIndex];
      if (key == 'ArrowUp') {
        this.byteChanged(this.activeIndex, currentValue + 1);
      }
      if (key == 'ArrowDown') {
        this.byteChanged(this.activeIndex, currentValue - 1);
      }
    },
    handleNumberInput(keyCode) {
      const key = keyCode.replace('Digit', '');
      const keyValue = parseInt(key, 10);
      if (isNaN(keyValue)) {
        return;
      }

      this.lastInputs.push(keyValue);
      const newValue = this.lastInputs.reduce((value, nextDigit) => value * 10 + nextDigit, 0);
      this.byteChanged(this.activeIndex, newValue);

      if (this.lastInputs.length > 2) { this.lastInputs = []; }
    }
  }
};
</script>

<style scoped>
  .table-editor {
    max-width: 50rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }
</style>
