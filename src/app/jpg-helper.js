export class JPGHelper {
  /**
   *
   * @param {ArrayBuffer} arrayBuffer
   */
  static parseQuantizationTables(arrayBuffer) {
    var data = new DataView(arrayBuffer);
    var dqts = [];

    var i = 0;
    while (i < data.byteLength) {
      var marker = data.getUint16(i);
      i += 2;
      switch (marker) {
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
          var dqtId = data.getUint8(i + 2);
          var dqt = Array.prototype.slice.call(new Uint8Array(arrayBuffer.slice(i + 3, i + dqtLength)));

          console.log('found DQT!!!!! Position:', i, 'id:', dqtId, 'Length:', dqt.length, dqt);
          dqts.push({
            id: dqtId,
            position: i + 3,
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

  /**
   *
   * @param {Uint8Array} bytes
   */
  static toBase64(bytes) {
    var binary = '';
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
