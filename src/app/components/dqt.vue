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
    <input
      v-model="boost"
      type="range"
      min="-255"
      max="255"
      value="0"
      class="dqt-boost"
      number
      @change="boostChanged(boost)"
    />
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
    boost: 0,
    previousBoost: 0,
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
    boostChanged: function (boost) {
      const boostDiff = boost - this.previousBoost;
      this.previousBoost = boost;
      const dqtData = {...this.dqt.data};

      Array.prototype.forEach.call(dqtData, (value, index) => {
        value = value + boostDiff;

        if (value > 255) {
          value = 255;
        }
        if (value < 0) {
          value = 0;
        }
        dqtData[index] = value;
      });

      this.$emit('change', {
        ...this.dqt,
        data: dqtData
      });
    },
    handleKeydown(e) {
      e.preventDefault();
      switch(e.key) {
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
