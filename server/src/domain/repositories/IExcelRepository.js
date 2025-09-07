/**
 * Interfaz del repositorio de archivos Excel
 */
export default class IExcelRepository {
  async saveFile(file) {
    throw new Error('Method not implemented');
  }

  async getFileById(id) {
    throw new Error('Method not implemented');
  }

  async getAllFiles() {
    throw new Error('Method not implemented');
  }

  async deleteFile(id) {
    throw new Error('Method not implemented');
  }

  async saveProcessedData(data) {
    throw new Error('Method not implemented');
  }

  async getProcessedDataByFileId(fileId) {
    throw new Error('Method not implemented');
  }
}