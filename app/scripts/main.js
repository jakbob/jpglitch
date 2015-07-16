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
					var dqt = new Uint8Array(arrayBuffer.slice(i+3, i+dqtLength));

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

	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object

		if(files.length > 0) {
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
			reader.readAsArrayBuffer(files[0]);
		}
	}



	Vue.filter('base64Jpeg', function(rawImage) {
		if(!rawImage) { return ''; }
		return 'data:image/png;base64,'+StringView.bytesToBase64(rawImage);
	});

	var app = new Vue({
		el: '#app',
		data: {
			dqts: null,
			rawImage: null
		},
		methods: {
			handleFileSelect: handleFileSelect
		},
		components: {
			dqt: {
				props: ['dqt'],
				methods: {
					byteChanged: function(index, value) {
						value = parseInt(value);
						if (value > 255) { value = 255; }
						if (value < 0) { value = 0; }
						
						//this.$parent.rawImage[this.position + index] = value;

						var raw = app.rawImage.subarray(0);
						//console.log(raw[this.position + index], value, this.position + index);
						console.log(raw[this.dqt.position + index], app.rawImage[this.dqt.position + index]);
						raw[this.dqt.position + index] = value;
						app.rawImage = raw;
					}
				}
			}
		}
	});
})();