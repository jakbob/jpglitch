'use strict';

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	if(files.length > 0) {
		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function() {
			return function(e) {
				var raw = e.target.result;
				// https://developer.mozilla.org/en/JavaScript_typed_arrays
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
