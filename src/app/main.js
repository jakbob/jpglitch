import Vue from 'vue';
import './main.css';

(function() {
	'use strict';

	Vue.config.debug = true;

	function parseQuantizationTables(arrayBuffer) {
		var data = new DataView(arrayBuffer);
		var dqts = [];

		var i = 0;
		while(i < data.byteLength) {
			var marker = data.getUint16(i);
			i += 2;
			switch(marker) {
				case 0xffd8:
					console.log('start of image');
					break;
				case 0xffe0:
				case 0xffe1:
				case 0xffed:
				case 0xffc0:
				case 0xffc4:
					console.log('found marker', marker.toString(16));
					var length = data.getUint16(i);
					i += length;
					break;
				case 0xffdB:
					var dqtLength = data.getUint16(i);
					var dqtId = data.getUint8(i+2);
					var dqt = Array.prototype.slice.call(new Uint8Array(arrayBuffer.slice(i+3, i+dqtLength)));

					console.log('found DQT!!!!! Position:', i, 'id:', dqtId, 'Length:', dqt.length, dqt);
					dqts.push({
						id: dqtId,
						position: i+3,
						data: dqt
					});

					i += data.getUint16(i);
					break;
				case 0xffda:
					console.log('Found Start of Scan. All DQTs are probably found, aborting...');
					return dqts;
				default:
					console.log('Unknown maker:', marker.toString(16));
					return dqts;
			}
		}
	}

	function loadFile(file) {
		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function() {
			return function(e) {
				var raw = e.target.result;

				app.$data.dqts = parseQuantizationTables(raw);
				app.$data.rawImage = new Uint8Array(raw);
			};
		})();

		// Read in the image file as a data URL.
		reader.readAsArrayBuffer(file);
		app.fileLoaded = true;
  }

  function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

	Vue.filter('base64Jpeg', function(rawImage) {
    if(!rawImage) { return ''; }
    var base64image =  _arrayBufferToBase64(rawImage);
		return 'data:image/png;base64,'+base64image;
	});

	Vue.directive('jpgdrop', {
		bind: function() {
			var self = this;

			this.el.addEventListener('dragenter', function(e) {
				console.log(e);
				e.target.classList.add('dropover');
			});
			this.el.addEventListener('dragleave', function(e) {
				e.target.classList.remove('dropover');
			});

			this.el.addEventListener('dragover', function(e) {
				e.preventDefault();
				e.dataTransfer.dropEffect = 'copy';
			});
			this.el.addEventListener('drop', function(e) {
				e.preventDefault();
				self.dropCallback(e.dataTransfer.files[0]);
				e.target.classList.remove('dropover');
			});
		},
		update: function(callback) {
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
				if(e.target.files.length > 0) {
					loadFile(e.target.files[0]);
				}
			},
			loadFile: loadFile
		},
		components: {
			dqt: {
				props: ['dqt'],
				data: function() { return { boost: 0, previousBoost: 0 }; },
				methods: {
					byteChanged: function(index, value) {
						if (value > 255) { value = 255; }
						if (value < 0) { value = 0; }

						var raw = app.rawImage.subarray(0);
						raw[this.dqt.position + index] = value;
						app.rawImage = raw;
					},
					boostChanged: function(boost) {
						var boostDiff = boost - this.previousBoost;
						this.previousBoost = boost;
						var dqtPosition = this.dqt.position;
						var dqtData = this.dqt.data;
						var raw = app.rawImage.subarray(0);

						Array.prototype.forEach.call(dqtData, function(value, index) {
							value = value + boostDiff;
							dqtData.$set(index, value);

							if (value > 255) { value = 255; }
							if (value < 0) { value = 0; }

							raw[dqtPosition + index] = value;
						});

						app.rawImage = raw;
					}
				}
			}
		}
	});
})();
