'use strict';

function parseJpeg(arrayBuffer) {
	var data = new DataView(arrayBuffer);
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
				i += data.getUint16(i);
				break;
			case 0xffda:
				console.log('Found Start of Scan. The rest is entropy encoded data, aborting...');
				return;
			default:
				console.log('Unknown maker:', marker.toString(16));
				return;
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
				parseJpeg(raw);

				var rawBytes = new Uint8Array(raw);

				var stringView = new StringView(rawBytes);

				var img = document.getElementById('image');
				img.src = 'data:image/png;base64,'+stringView.toBase64();

				document.getElementById('editor').innerHTML = stringView.toBase64();
			};
		})();

		// Read in the image file as a data URL.
		reader.readAsArrayBuffer(files[0]);
	}
}
document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
