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
        console.info('Start of image');
        break;
      case 0xffdB:
        var dqtLength = data.getUint16(i);
        var dqtId = data.getUint8(i + 2);
        var dqt = Array.prototype.slice.call(new Uint8Array(arrayBuffer.slice(i + 3, i + dqtLength)));

        console.info('Found DQT! Position:', i, 'Id:', dqtId, 'Length:', dqt.length);
        dqts.push({
          id: dqtId,
          position: i + 3,
          data: dqt
        });

        i += data.getUint16(i);
        break;
      case 0xffda:
        console.info('Found Start of Scan. All DQTs are probably found, aborting...');
        return dqts;
      default:
        console.info('Found marker', marker.toString(16));
        var length = data.getUint16(i);
        i += length;
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
