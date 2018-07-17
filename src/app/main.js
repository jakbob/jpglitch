import Vue from 'vue';
import { FileHelper } from './file-helper';
import { JPGHelper } from './jpg-helper';
import './main.css';

(function () {
  'use strict';

  Vue.config.debug = true;

  function loadFile(file) {
    FileHelper.loadFile(file).then(raw => {
      app.$data.dqts = JPGHelper.parseQuantizationTables(raw);
      app.$data.rawImage = new Uint8Array(raw);
    });

    app.fileLoaded = true;
  }

  Vue.filter('base64Jpeg', function (rawImage) {
    if (!rawImage) {
      return '';
    }
    var base64image = JPGHelper.toBase64(rawImage);
    return 'data:image/png;base64,' + base64image;
  });

  Vue.directive('jpgdrop', {
    bind: function () {
      var self = this;

      this.el.addEventListener('dragenter', function (e) {
        console.log(e);
        e.target.classList.add('dropover');
      });
      this.el.addEventListener('dragleave', function (e) {
        e.target.classList.remove('dropover');
      });

      this.el.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      });
      this.el.addEventListener('drop', function (e) {
        e.preventDefault();
        self.dropCallback(e.dataTransfer.files[0]);
        e.target.classList.remove('dropover');
      });
    },
    update: function (callback) {
      this.dropCallback = callback;
    }
  });

  var app = new Vue({
    el: '#app',
    data: {
      dqts: null,
      rawImage: null,
      fileLoaded: false
    },
    methods: {
      handleFileSelect: function handleFileSelect(e) {
        if (e.target.files.length > 0) {
          loadFile(e.target.files[0]);
        }
      },
      loadFile: loadFile
    },
    components: {
      dqt: {
        props: ['dqt'],
        data: function () {
          return {
            boost: 0,
            previousBoost: 0
          };
        },
        methods: {
          byteChanged: function (index, value) {
            if (value > 255) {
              value = 255;
            }
            if (value < 0) {
              value = 0;
            }

            var raw = app.rawImage.subarray(0);
            raw[this.dqt.position + index] = value;
            app.rawImage = raw;
          },
          boostChanged: function (boost) {
            var boostDiff = boost - this.previousBoost;
            this.previousBoost = boost;
            var dqtPosition = this.dqt.position;
            var dqtData = this.dqt.data;
            var raw = app.rawImage.subarray(0);

            Array.prototype.forEach.call(dqtData, function (value, index) {
              value = value + boostDiff;
              dqtData.$set(index, value);

              if (value > 255) {
                value = 255;
              }
              if (value < 0) {
                value = 0;
              }

              raw[dqtPosition + index] = value;
            });

            app.rawImage = raw;
          }
        }
      }
    }
  });
})();
