export class JPGHelper {
  /**
   *
   * @param {ArrayBuffer} jpgData
   */
  static parseQuantizationTables(jpgData) {
    const dataView = new DataView(jpgData);
    let positions = this._getDQTMarkerPositions(dataView);
    return positions.map(position => {
      const dqtLength = dataView.getUint16(position);
      const dqtId = dataView.getUint8(position + 2);
      const dqtPosition = position + 3;
      const dqt = Array.prototype.slice.call(
        new Uint8Array(jpgData.slice(dqtPosition, position + dqtLength))
      );

      return {
        id: dqtId,
        position: dqtPosition,
        data: dqt
      };
    });
  }

  /**
   *
   * @param {DataView} dataView
   * @returns {number[]} DQT positions
   */
  static _getDQTMarkerPositions(dataView) {
    let i = 0;
    let dqtPositions = [];
    let marker;
    while (i < dataView.byteLength) {
      marker = dataView.getUint16(i);
      i += 2;
      switch (marker) {
        case 0xffd8:
          console.info('Start of image');
          break;
        case 0xffdB:
          console.info('Found DQT! Position:', i);
          dqtPositions.push(i);
          i += dataView.getUint16(i);
          break;
        case 0xffda:
          console.info('Found Start of Scan. All DQTs are probably found, aborting...');
          return dqtPositions;
        default:
          console.info('Found marker', marker.toString(16));
          i += dataView.getUint16(i);
      }
    }
    return dqtPositions;
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
