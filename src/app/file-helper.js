export class FileHelper {
  /**
   *
   * @param {File} file
   * @returns {Promise<ArrayBuffer>}
   */
  static loadFile(file) {
    const reader = new FileReader();
    const promise = new Promise(resolve => {
      reader.onload = (e) => {
        var fileContents = e.target.result;
        resolve(fileContents);
      };
    });

    reader.readAsArrayBuffer(file);
    return promise;
  }
}
