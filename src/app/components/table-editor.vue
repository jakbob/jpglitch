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
        @activate="activeIndex = index"
      >
      </table-cell>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import tableCell from './table-cell.vue';
import { InputManager } from '../helpers/input-manager'

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
  mounted() {
    this.inputManager = new InputManager({
      'valueChange': this.onValueChanged,
      'valueSet': this.onValueSet,
      'cursorMove': this.onCursorMove,
    })
  },
  methods: {
    handleKeydown(e) {
      e.preventDefault();
      this.inputManager.handleInput(e);
    },
    onValueChanged(change) {
      const currentValue = this.table.data[this.activeIndex];
      this.setByte(this.activeIndex, currentValue + change);
      this.lastInputs = [];
    },
    onValueSet(change) {
      this.lastInputs.push(change);
      const newValue = this.lastInputs.reduce((value, nextDigit) => value * 10 + nextDigit, 0);
      this.setByte(this.activeIndex, newValue);

      if (this.lastInputs.length > 2) { this.lastInputs = []; }
    },
    onCursorMove(change) {
      this.activeIndex += change
      this.activeIndex %= this.table.data.length;
      if (this.activeIndex < 0) {
        this.activeIndex += this.table.data.length;
      }
      this.lastInputs = [];
    },
    setByte(index, value) {
      if (value > 255) {
        value = 255;
      }
      if (value < 0) {
        value = 0;
      }

      Vue.set(this.table.data, index, value);
      this.$emit('change', this.table);
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
