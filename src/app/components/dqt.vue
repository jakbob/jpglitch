<template>
  <div>
    <div class="dqt-editor">
      <span
        v-for="(dqtByte, index) in dqt.data"
        :key="index"
        class="dqt-cell"
      >
        <input
          :value="dqtByte"
          class="dqt-input"
          type="number"
          number
          @change="byteChanged(index, $event.target.value)"
        />
      </span>
    </div>
    <input
      v-model="boost"
      type="range"
      min="0"
      max="255"
      value="0"
      class="dqt-boost"
      number
      @change="boostChanged(boost)"
    />
  </div>
</template>

<script>
export default {
  props: {
    dqt: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    boost: 0,
    previousBoost: 0
  }),
  methods: {
    byteChanged(index, value) {
      if (value > 255) {
        value = 255;
      }
      if (value < 0) {
        value = 0;
      }

      this.dqt.data[index] = value;
      this.$emit('change', this.dqt);
    },
    boostChanged: function (boost) {
      const boostDiff = boost - this.previousBoost;
      this.previousBoost = boost;
      const dqtData = this.dqt.data;

      Array.prototype.forEach.call(dqtData, (value, index) => {
        value = value + boostDiff;

        if (value > 255) {
          value = 255;
        }
        if (value < 0) {
          value = 0;
        }
        dqtData.$set(index, value);
      });

      this.$emit('change', this.dqt);
    }
  }
};
</script>

<style>

</style>
