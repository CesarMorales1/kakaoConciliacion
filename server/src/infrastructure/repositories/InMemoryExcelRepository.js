import IExcelRepository from '../../domain/repositories/IExcelRepository.js';

/**
 * Repositorio en memoria para archivos Excel
 */
export default class InMemoryExcelRepository extends IExcelRepository {
  constructor() {
    super();
    this.files = new Map();
    this.processedData = new Map();
  }

  async saveFile(file) {
    this.files.set(file.id, file);
    return file;
  }

  async getFileById(id) {
    return this.files.get(id) || null;
  }

  async getAllFiles() {
    return Array.from(this.files.values());
  }

  async deleteFile(id) {
    return this.files.delete(id);
  }

  async saveProcessedData(data) {
    this.processedData.set(data.file.id, data);
    return data;
  }

  async getProcessedDataByFileId(fileId) {
    return this.processedData.get(fileId) || null;
  }
}