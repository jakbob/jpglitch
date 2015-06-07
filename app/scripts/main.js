(function() {
	'use strict';

	var imageData;

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
						position: i,
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

	function updateImage(rawImage) {
		var img = document.getElementById('image');
		img.src = 'data:image/png;base64,'+StringView.bytesToBase64(rawImage);
	}

	function updateEditor(dqts) {
		dqts.forEach(function(dqt) {
			var tableElement = $('<table class="dqtTable">');
			tableElement.html(Array.prototype.reduce.call(dqt.data, function(text, currentByte, i) {
				if(i%8 === 0) {
					text += '<tr>';
				}
				text += '<td contentEditable>'+currentByte.toString(16) + '</td>';
				if (i%8 === 7) {
					text += '</tr>';
				}
				return text;
			}, ''));
			tableElement.on('keyup', 'td', dqtChange);
			$('#editor').append(tableElement);
		});
	}

	function dqtChange(e) {
		var cell = e.target;
		var cellValue = cell.innerHTML
			.replace(/[^0-9a-f]/ig, '')
			.substring(0,2);
		//var column = e.target.cellIndex;
		//var row = e.target.parentNode.rowIndex;

		cell.innerHTML = cellValue;
	}

	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object

		if(files.length > 0) {
			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function() {
				return function(e) {
					var raw = e.target.result;
					imageData = { 
						raw: new Uint8Array(raw),
						dqts: parseQuantizationTables(raw) 
					};

					updateImage(imageData.raw);
					updateEditor(imageData.dqts);
				};
			})();

			// Read in the image file as a data URL.
			reader.readAsArrayBuffer(files[0]);
		}
	}
	document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
})();