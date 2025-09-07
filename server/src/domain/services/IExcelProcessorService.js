/**
 * Interfaz del servicio de procesamiento de archivos Excel
 */
export default class IExcelProcessorService {
  async processExcelFile(filePath) {
    throw new Error('Method not implemented');
  }

  async validateExcelFile(filePath) {
    throw new Error('Method not implemented');
  }

  async extractSheetData(filePath, sheetName) {
    throw new Error('Method not implemented');
  }
}